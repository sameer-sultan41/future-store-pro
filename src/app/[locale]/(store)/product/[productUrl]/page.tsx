"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getProductByUrl, ProductByUrlResponse } from "@/actions/product/product";
import { getShippingRates, ShippingRate, ShippingAddress, ShippingPackage } from "@/actions/shipping/shipping";
import { computeEffectivePrice } from "@/actions/product/type";
import Gallery from "@/domains/product/components/gallery";
import { SK_Box } from "@/shared/components/UI/skeleton";
import ProductBoard from "./_components/ProductBoard";
import SimilarProduct from "./_components/SimilarProduct";

// Type aliases for cleaner code
type ProductVariant = NonNullable<ProductByUrlResponse["product_variants"]>[number];
type VariantOption = NonNullable<ProductVariant["product_variant_options"]>[number];
type VariantOptionDetails = NonNullable<VariantOption["variant_options"]>;

// Helper function to format spec names
const formatSpecName = (key: string): string => {
  return key
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

// Helper to extract unique variant types and their options
const extractVariantTypes = (variants: ProductVariant[]) => {
  const variantTypesMap = new Map<string, Set<string>>();
  const variantOptionsMap = new Map<string, VariantOptionDetails[]>();

  variants.forEach((variant) => {
    const options = variant.product_variant_options;
    if (!options) return;

    options.forEach((option) => {
      const variantOptions = option.variant_options;
      if (!variantOptions?.variant_types) return;

      const typeName = variantOptions.variant_types.name;
      const optionValue = variantOptions.value;

      if (!variantTypesMap.has(typeName)) {
        variantTypesMap.set(typeName, new Set());
        variantOptionsMap.set(typeName, []);
      }

      if (!variantTypesMap.get(typeName)!.has(optionValue)) {
        variantTypesMap.get(typeName)!.add(optionValue);
        variantOptionsMap.get(typeName)!.push(variantOptions);
      }
    });
  });

  return Array.from(variantTypesMap.keys()).map((typeName) => ({
    name: typeName,
    displayType: variantOptionsMap.get(typeName)![0].variant_types?.display_type || "text",
    options: variantOptionsMap.get(typeName)!,
  }));
};

const ProductPage = () => {
  const { locale, productUrl } = useParams<{ locale: string; productUrl: string }>();
  const router = useRouter();
  const { productId } = useParams<{ productId: string[] }>();
  const [productInfo, setProductInfo] = useState<ProductByUrlResponse | null | undefined>(null);
  const [currentLocale, setCurrentLocale] = useState("en");
  const [selectedVariantOptions, setSelectedVariantOptions] = useState<Record<string, string>>({});
  const [selectedShippingMethod, setSelectedShippingMethod] = useState<string>("standard");

  // Shipping state
  const [shippingRates, setShippingRates] = useState<ShippingRate[]>([]);
  const [loadingShipping, setLoadingShipping] = useState(false);
  const [shippingError, setShippingError] = useState<string | null>(null);
  const [shippingDestination, setShippingDestination] = useState<ShippingAddress>({
    city: "Karachi", // Default destination
    postalCode: "75500",
    country: "PK",
  });

  useEffect(() => {
    const getProductFromDB = async () => {
      const response = await getProductByUrl(locale, productUrl);
      if ("data" in response) {
        setProductInfo(response.data as ProductByUrlResponse);
      } else {
        console.error("Error fetching product:", response.error);
        setProductInfo(null);
      }
    };
    getProductFromDB();
  }, [productId, router]);

  // Auto-select first available variant option for each type
  useEffect(() => {
    if (
      productInfo &&
      productInfo.product_variants &&
      productInfo.product_variants.length > 0 &&
      Object.keys(selectedVariantOptions).length === 0
    ) {
      const variantTypesData = extractVariantTypes(productInfo.product_variants);

      const initialSelections: Record<string, string> = {};

      variantTypesData.forEach((type) => {
        if (type.options.length > 0) {
          initialSelections[type.name] = type.options[0].value;
        }
      });

      setSelectedVariantOptions(initialSelections);
    }
  }, [productInfo, selectedVariantOptions]);

  // Fetch shipping rates when product or destination changes
  useEffect(() => {
    const fetchShippingRates = async () => {
      if (!productInfo) return;

      setLoadingShipping(true);
      setShippingError(null);

      try {
        const packageInfo: ShippingPackage = {
          weight: 1, // Default 1kg - weight not in ProductByUrlResponse
          declaredValue: typeof finalPrice === "number" ? finalPrice : parseFloat(String(finalPrice)),
        };

        const response = await getShippingRates(shippingDestination, packageInfo);

        if (response.success && response.rates) {
          setShippingRates(response.rates);
          // Auto-select first shipping option
          if (response.rates.length > 0 && !selectedShippingMethod) {
            setSelectedShippingMethod(response.rates[0].serviceType);
          }
        } else {
          setShippingError(response.error || "Failed to fetch shipping rates");
          setShippingRates(response.rates || []);
        }
      } catch (error) {
        console.error("Error fetching shipping rates:", error);
        setShippingError("Unable to calculate shipping");
        setShippingRates([]);
      } finally {
        setLoadingShipping(false);
      }
    };

    fetchShippingRates();
  }, [productInfo, shippingDestination]);

  if (productInfo === undefined) return "";

  // Get the translation for the current locale
  const currentTranslation =
    productInfo?.product_translations?.find((t) => t.language_code === currentLocale) ||
    productInfo?.product_translations?.[0];

  // Transform specs object into flat list of specifications
  const specifications = currentTranslation?.specs
    ? Object.entries(currentTranslation.specs).map(([key, value]) => ({
        name: formatSpecName(key),
        value: value as string,
      }))
    : [];

  // Extract variant types and options
  const variantTypes = productInfo?.product_variants ? extractVariantTypes(productInfo.product_variants) : [];

  // Find the matching variant based on selected options
  const selectedVariant = productInfo?.product_variants?.find((variant) => {
    const options = variant.product_variant_options;
    if (!options) return false;

    const variantOptions = options.map((opt) => ({
      type: opt.variant_options?.variant_types?.name || "",
      value: opt.variant_options?.value || "",
    }));

    return Object.entries(selectedVariantOptions).every(([type, value]) => {
      return variantOptions.some((opt) => opt.type === type && opt.value === value);
    });
  });

  // Calculate final price with variant adjustment
  const basePrice = productInfo?.price ? parseFloat(String(productInfo.price)) : 0;
  const priceAdjustment = selectedVariant?.price_adjustment ? parseFloat(String(selectedVariant.price_adjustment)) : 0;
  const finalPrice = basePrice + priceAdjustment;

  // Get active deal and apply it with variant adjustment
  const activeDeal = productInfo?.flash_deal_products?.[0] || null;

  // Calculate deal price considering variant adjustment
  let dealPrice: number | null = null;
  if (activeDeal) {
    const flashDeal = activeDeal.flash_deals;

    // If deal has a fixed deal_price, we need to add the variant adjustment
    if (activeDeal.deal_price != null) {
      const baseDealPrice = parseFloat(String(activeDeal.deal_price));
      dealPrice = baseDealPrice + priceAdjustment;
    }
    // If deal uses percentage or fixed discount, apply to adjusted price
    else if (flashDeal) {
      const discountValue = parseFloat(String(flashDeal.discount_value));

      if (flashDeal.discount_type === "percentage") {
        dealPrice = Math.max(0, (finalPrice * (100 - discountValue)) / 100);
      } else {
        // 'fixed' discount
        dealPrice = Math.max(0, finalPrice - discountValue);
      }
    }
  }

  // Get selected shipping rate
  const selectedShipping = shippingRates.find((rate) => rate.serviceType === selectedShippingMethod);

  // Check if product/variant is available
  const stockQuantity = selectedVariant?.stock_quantity ?? 0;
  const isAvailable = selectedVariant
    ? selectedVariant.is_available && stockQuantity > 0
    : productInfo?.is_available ?? false;

  // Handler for variant option selection
  const handleVariantOptionChange = (typeName: string, value: string) => {
    setSelectedVariantOptions((prev) => ({
      ...prev,
      [typeName]: value,
    }));
  };

  return (
    <div className="storeContainer">
      <div className="w-full h-auto mt-[160px] flex flex-col">
        <div className="w-full flex flex-col lg:flex-row gap-12">
          <div className="flex-grow">
            <div className="block text-gray-700 w-full mb-10 text-sm">
              {productInfo ? (
                <>
                  <Link href={"/"} className="hover:font-medium after:mx-1 after:content-['/'] hover:text-gray-800">
                    Home
                  </Link>
                  <span className="text-gray-500">Products</span>
                </>
              ) : (
                <SK_Box width="60%" height="15px" />
              )}
            </div>
            <Gallery images={productInfo?.images ?? undefined} />
          </div>
          <div className="lg:w-[512px] w-full">
            {productInfo ? (
              <div className="w-full relative flex flex-col">
                <ProductBoard
                  boardData={{
                    id: productInfo.id,
                    isAvailable: isAvailable ?? false,
                    defaultQuantity: 1,
                    name: currentTranslation?.name || "Product",
                    price: finalPrice,
                    imgUrl: productInfo.images?.[0] || "",
                    dealPrice: dealPrice ?? undefined,
                    shortDesc: currentTranslation?.short_description || "",
                    specialFeatures: (currentTranslation?.special_features as string[]) || [],
                  }}
                />

                {/* Variant Selection Section - Shopify Style */}
                {variantTypes.length > 0 && (
                  <div className="mt-6 border-t border-gray-200 pt-6">
                    {variantTypes.map((variantType) => (
                      <div key={variantType.name} className="mb-6">
                        <div className="flex items-center justify-between mb-3">
                          <label className="text-sm font-medium text-gray-900 capitalize">{variantType.name}</label>
                          {selectedVariantOptions[variantType.name] && (
                            <span className="text-sm text-gray-600">
                              {
                                variantType.options.find(
                                  (opt) => opt.value === selectedVariantOptions[variantType.name]
                                )?.display_value
                              }
                            </span>
                          )}
                        </div>

                        {/* Color Variant - Shopify Style */}
                        {variantType.displayType === "color" && (
                          <div className="flex flex-wrap gap-2">
                            {variantType.options.map((option) => {
                              const isSelected = selectedVariantOptions[variantType.name] === option.value;

                              return (
                                <button
                                  key={option.value}
                                  onClick={() => handleVariantOptionChange(variantType.name, option.value)}
                                  className={`group relative flex items-center justify-center w-12 h-12 rounded-lg border-2 transition-all ${
                                    isSelected ? "border-gray-900 shadow-sm" : "border-gray-200 hover:border-gray-400"
                                  }`}
                                  title={option.display_value ?? undefined}
                                >
                                  <span
                                    className="w-8 h-8 rounded-md"
                                    style={{ backgroundColor: option.color_hex || "#cccccc" }}
                                  />
                                </button>
                              );
                            })}
                          </div>
                        )}

                        {/* Text-based Variants (Size) - Shopify Style */}
                        {variantType.displayType !== "color" && (
                          <div className="flex flex-wrap gap-2">
                            {variantType.options.map((option) => {
                              const isSelected = selectedVariantOptions[variantType.name] === option.value;

                              return (
                                <button
                                  key={option.value}
                                  onClick={() => handleVariantOptionChange(variantType.name, option.value)}
                                  className={`px-5 py-2.5 text-sm font-medium rounded-lg border-2 transition-all min-w-[60px] ${
                                    isSelected
                                      ? "border-gray-900 bg-gray-900 text-white"
                                      : "border-gray-200 bg-white text-gray-900 hover:border-gray-400"
                                  }`}
                                >
                                  {option.display_value}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    ))}

                    {/* Stock Info - Clean Badge */}
                    {selectedVariant && (
                      <div className="flex items-center gap-3 mt-4 text-sm">
                        {stockQuantity > 0 ? (
                          <>
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full font-medium ${
                                stockQuantity > 10 ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"
                              }`}
                            >
                              {stockQuantity > 10 ? "In Stock" : `Only ${stockQuantity} left`}
                            </span>
                            <span className="text-gray-500">SKU: {selectedVariant.sku}</span>
                          </>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full font-medium bg-red-100 text-red-800">
                            Out of Stock
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Shipping Options Section */}
              </div>
            ) : (
              <div className="flex flex-col">
                <SK_Box width="60%" height="14px" />
                <div className="flex flex-col mt-10 gap-5">
                  <SK_Box width="40%" height="30px" />
                  <SK_Box width="90%" height="16px" />
                </div>
                <div className="flex flex-col gap-4 mt-10">
                  <SK_Box width="40%" height="14px" />
                  <SK_Box width="40%" height="14px" />
                  <SK_Box width="40%" height="14px" />
                </div>
                <div className="flex flex-col gap-4 mt-16">
                  <SK_Box width="30%" height="40px" />
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="w-full h-auto flex gap-12 mt-10">
          <div className="w-full flex flex-col">
            {/* ----------------- SPECIFICATION SECTION ----------------- */}
            {specifications.length > 0 && (
              <div className="w-full mb-[100px]">
                <h2 className="font-light block text-2xl text-gray-900 py-5 border-b border-gray-300">
                  Specifications
                </h2>
                {productInfo ? (
                  <div className="w-full py-5 border-b border-gray-300">
                    {specifications.map((spec, index) => (
                      <div
                        key={index}
                        className="w-full pt-3 flex items-stretch bg-white text-sm rounded-lg hover:bg-gray-100"
                      >
                        <div className="min-w-[200px] flex items-start text-gray-500">
                          <span>{spec.name}</span>
                        </div>
                        <div className="font-medium text-gray-800 flex-1">
                          <span className="block leading-5 min-h-8 h-auto">{spec.value}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            )}

            {/* ----------------- DESCRIPTION SECTION ----------------- */}
            {currentTranslation?.description && (
              <div className="w-full mb-[100px]">
                <h2 className="font-light block text-2xl text-gray-900 py-5 border-b border-gray-300">Description</h2>
                <p className="mt-5 text-gray-700 leading-7">{currentTranslation.description}</p>
              </div>
            )}

            {/* ----------------- USER REVIEWS ----------------- */}
            {/* <UserReview/> */}
          </div>
        </div>

        {/* ----------------- SIMILAR PRODUCTS SECTION ----------------- */}
        <SimilarProduct />
      </div>
    </div>
  );
};

export default ProductPage;
