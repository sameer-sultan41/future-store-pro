"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { getOneProduct, getProductByUrl } from "@/actions/product/product";
import Gallery from "@/domains/product/components/gallery";
import ProductBoard from "@/domains/product/components/productBoard";
import ProductCard from "@/app/[locale]/(store)/(home)/_components/TopProductCard";
import { TopProducts } from "@/domains/product/constants";
import { LikeIcon, MinusIcon } from "@/shared/components/icons/svgIcons";
import { SK_Box } from "@/shared/components/UI/skeleton";
import { TProductPageInfo } from "@/shared/types/product";

export interface ProductVariantType {
  name: string;
  display_type: string;
}

export interface ProductVariantOptions {
  value: string;
  color_hex: string | null;
  image_url: string | null;
  display_value: string;
  variant_types: ProductVariantType;
}

export interface ProductVariantOption {
  variant_option_id: string;
  variant_options: ProductVariantOptions;
}

export interface ProductVariant {
  id: string;
  sku: string;
  is_available: boolean;
  stock_quantity: number;
  price_adjustment: number;
  product_variant_options: ProductVariantOption[];
}

export interface ProductTranslation {
  language_code: string;
  name: string;
  description: string;
  short_description: string;
  special_features: string[];
  specs?: Record<string, string>;
}

export interface GetProductByUrlResponse {
  id: string;
  url: string;
  sku: string;
  images: string[];
  price: number;
  is_available: boolean;
  product_translations: ProductTranslation[];
  product_variants: ProductVariant[];
}

// Helper function to format spec names
const formatSpecName = (key: string): string => {
  return key
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const ProductPage = () => {
  const router = useRouter();
  const { productId } = useParams<{ productId: string[] }>();
  const [productInfo, setProductInfo] = useState<GetProductByUrlResponse | null | undefined>(null);
  const [currentLocale, setCurrentLocale] = useState("en");

  useEffect(() => {
    const getProductFromDB = async () => {
      const response = await getProductByUrl("en", "samsung-galaxy-s24-ultra");
      console.log("response", response);
      if ("error" in response) {
        setProductInfo(undefined);
      } else {
        setProductInfo(response.data as unknown as GetProductByUrlResponse);
      }
    };
    getProductFromDB();
  }, [productId, router]);

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
            <Gallery images={productInfo?.images} />
          </div>
          <div className="lg:w-[512px] w-full">
            {productInfo && currentTranslation ? (
              <ProductBoard
                boardData={{
                  id: productInfo.id,
                  isAvailable: productInfo.is_available,
                  defaultQuantity: 1,
                  name: currentTranslation.name,
                  price: productInfo.price,
                  dealPrice: undefined,
                  shortDesc: currentTranslation.short_description || "",
                  specialFeatures: currentTranslation.special_features || [],
                }}
              />
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
            <div className="w-full mb-[100px]">
              <h2 className="font-light block text-2xl text-gray-900 py-5 border-b border-gray-300">Specification</h2>
              {productInfo && specifications.length > 0 ? (
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
              ) : productInfo === null ? (
                <>
                  <div className="flex flex-col mt-4 mb-16 gap-4">
                    <SK_Box width="200px" height="30px" />
                    <div className={"flex gap-5 items-center ml-10"}>
                      <SK_Box width="10%" height="20px" />
                      <SK_Box width="40%" height="16px" />
                    </div>
                    <div className={"flex gap-5 items-center ml-10"}>
                      <SK_Box width="10%" height="20px" />
                      <SK_Box width="40%" height="16px" />
                    </div>
                  </div>
                  <div className="flex flex-col mt-4 mb-16 gap-4">
                    <SK_Box width="200px" height="30px" />
                    <div className={"flex gap-5 items-center ml-10"}>
                      <SK_Box width="10%" height="20px" />
                      <SK_Box width="40%" height="16px" />
                    </div>
                    <div className={"flex gap-5 items-center ml-10"}>
                      <SK_Box width="10%" height="20px" />
                      <SK_Box width="40%" height="16px" />
                    </div>
                  </div>
                </>
              ) : null}
            </div>

            {/* ----------------- DESCRIPTION SECTION ----------------- */}
            {currentTranslation?.description && (
              <div className="w-full mb-[100px]">
                <h2 className="font-light block text-2xl text-gray-900 py-5 border-b border-gray-300">Description</h2>
                <p className="mt-5 text-gray-700 leading-7">{currentTranslation.description}</p>
              </div>
            )}

            {/* ----------------- USER REVIEWS ----------------- */}
            <div className="flex flex-col w-full h-auto">
              <div className="flex justify-between items-center pb-4 border-b border-gray-300">
                <h2 className="font-light block text-2xl text-gray-900">User Reviews</h2>
                <button className="text-sm text-gray-900 px-6 py-1.5 rounded-md bg-gray-100 border border-gray-700 hover:bg-gray-200 active:bg-light-300">
                  New Review
                </button>
              </div>
              <div className="flex flex-col w-full">
                <div className="flex items-center flex-wrap w-full mt-5 text-sm">
                  <div className="flex h-8 items-center text-gray-800 font-medium">
                    <Image
                      src={"/images/images/defaultUser.png"}
                      className="rounded-full overflow-hidden mr-3"
                      alt=""
                      width={32}
                      height={32}
                    />
                    <span>T. Mihai</span>
                  </div>
                  <span className="text-[#f97a1f] ml-8 font-medium">Verified Purchase</span>
                  <div>
                    <div className="inline-block ml-8 pl-6 bg-[url('/icons/dateIcon.svg')] bg-no-repeat bg-[position:left_center]">
                      30 November 2023
                    </div>
                    <div className="ml-10 inline-block">
                      <button className="h-8 mr-3 font-medium px-3 bg-white border border-white rounded-md text-gray-900 hover:border-green-600 hover:bg-green-800 hover:[&>svg]:fill-green-700 active:border-green-500 active:[&>svg]:fill-green-600">
                        <LikeIcon width={16} className="fill-white stroke-gray-1000 mr-2" />0
                      </button>
                      <button className="h-8 mr-3 font-medium px-3 bg-white border border-white rounded-md text-gray-900 hover:border-red-700 hover:bg-[rgba(220,38,38,0.4)] hover:[&>svg]:fill-red-800 active:border-red-500 active:[&>svg]:fill-red-700 [&>svg]:inline-block [&>svg]:[-scale-x-100] [&>svg]:rotate-180 [&>svg]:-translate-y-[3px]">
                        <LikeIcon width={16} className="fill-white stroke-gray-1000 mr-2" /> 0
                      </button>
                    </div>
                  </div>
                </div>
                <div className="my-4 ml-12 text-sm leading-5 text-gary-900">
                  <span>
                    {`Lorem ipsum dolor sit amet consectetur adipisicing elit. 
                    Temporibus suscipit debitis reiciendis repellendus! Repellat rem beatae quo quis 
                    tenetur. Culpa quae ratione delectus id odit in nesciunt saepe pariatur vitae.`}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full my-[100px]">
          <h2 className="font-light block text-2xl text-gray-900">Similar Products</h2>
          <div className="flex justify-between gap-3.5 w-full overflow-x-scroll pb-2">
            {TopProducts.map((product, index) => (
              <ProductCard
                key={index}
                imgUrl={product.imgUrl}
                name={product.name}
                price={product.price}
                specs={product.specs}
                url={product.url}
                dealPrice={product.dealPrice}
                staticWidth
                currency={null}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
