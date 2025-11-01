"use server";
import { z } from "zod";

import { createSupabaseServer } from "@/shared/lib/supabaseClient";
import { TAddProductFormValues, TPath, TProductPageInfo, TSpecification } from "@/shared/types/product";
import type { ProductFull } from "./type";

// Response type for getProductByUrl - picks only the fields we select
export type ProductByUrlResponse = Pick<
  ProductFull,
  | "id"
  | "url"
  | "sku"
  | "images"
  | "price"
  | "is_available"
  | "product_translations"
  | "product_variants"
  | "flash_deal_products"
>;

const ValidateAddProduct = z.object({
  sku: z.string().min(1),
  url: z.string().min(1),
  name: z.string().min(3),
  description: z.string().optional(),
  shortDescription: z.string().optional(),
  categoryID: z.string().min(6),
  brandID: z.string().min(6),
  price: z.string().min(1),
  costPrice: z.string().optional(),
  isAvailable: z.boolean(),
  isFeatured: z.boolean(),
  stockQuantity: z.string(),
  lowStockThreshold: z.string().optional(),
  weight: z.string().optional(),
  images: z.array(z.string()),
  sortOrder: z.string().optional(),
  specs: z.any(),
});

const convertStringToFloat = (str: string) => {
  str.replace(/,/, ".");
  return str ? parseFloat(str) : 0.0;
};

export const getProductByUrl = async (
  locale: string = "en",
  productUrl: string
): Promise<{ error: string } | { data: ProductByUrlResponse | null }> => {
  if (!locale || !productUrl) return { error: "Invalid parameters" };

  const supabase = createSupabaseServer();

  // LEFT joins by default: keep product even if there are 0 flash deals
  const select = `
    id,
    url,
    sku,
    images,
    price,
    is_available,
    product_translations (
      language_code,
      name,
      description,
      short_description,
      specs,
      special_features
    ),
    product_variants (
      id,
      sku,
      price_adjustment,
      stock_quantity,
      is_available,
      product_variant_options (
        variant_option_id,
        variant_options (
          value,
          display_value,
          color_hex,
          image_url,
          variant_types (name, display_type)
        )
      )
    ),
    flash_deal_products (
      id,
      deal_price,
      stock_limit,
      flash_deal_id,
      product_id,
      flash_deals (
        id,
        name,
        discount_type,
        discount_value,
        start_date,
        end_date,
        is_active,
        max_uses,
        current_uses
      )
    )
  `;

  try {
    const { data, error } = await supabase
      .from("products")
      .select(select)
      .eq("url", productUrl)
      .eq("product_translations.language_code", locale)
      // ⚠️ DO NOT add any filters on flash_deal_products.* or flash_deal_products.flash_deals.*
      .maybeSingle();

    if (error) return { error: error.message };
    if (!data) return { data: null };

    // --- Post-filter deals to "active now" & sort by latest start_date ---
    const now = Date.now();
    const productData = data as unknown as ProductFull;
    const deals = Array.isArray(productData.flash_deal_products)
      ? productData.flash_deal_products
          .filter((fdp) => {
            const d = fdp?.flash_deals;
            if (!d || d.is_active === false) return false;
            const s = d.start_date ? new Date(d.start_date).getTime() : 0;
            const e = d.end_date ? new Date(d.end_date).getTime() : 0;
            return s <= now && now <= e;
          })
          .sort((a, b) => {
            const as = a?.flash_deals?.start_date ? new Date(a.flash_deals.start_date).getTime() : 0;
            const bs = b?.flash_deals?.start_date ? new Date(b.flash_deals.start_date).getTime() : 0;
            return bs - as;
          })
      : [];

    const response: ProductByUrlResponse = {
      ...productData,
      flash_deal_products: deals,
    };
    return { data: response };
  } catch (err: any) {
    return { error: err?.message ?? String(err) };
  }
};
// ...existing code...

export const addProduct = async (data: TAddProductFormValues) => {
  const validation = ValidateAddProduct.safeParse(data);
  if (!validation.success) {
    console.error("Validation error:", validation.error);
    return { error: "Invalid Data!" };
  }

  try {
    const supabase = createSupabaseServer();
    const price = convertStringToFloat(data.price);
    const costPrice = data.costPrice ? convertStringToFloat(data.costPrice) : null;
    const stockQuantity = parseInt(data.stockQuantity) || 0;
    const lowStockThreshold = data.lowStockThreshold ? parseInt(data.lowStockThreshold) : 5;
    const weight = data.weight ? convertStringToFloat(data.weight) : null;
    const sortOrder = data.sortOrder ? parseInt(data.sortOrder) : 0;

    const { data: result, error } = await supabase
      .from("products")
      .insert({
        sku: data.sku,
        url: data.url,
        category_id: data.categoryID,
        brand_id: data.brandID,
        price: price,
        cost_price: costPrice,
        is_available: data.isAvailable,
        is_featured: data.isFeatured,
        stock_quantity: stockQuantity,
        low_stock_threshold: lowStockThreshold,
        weight: weight,
        images: [...data.images],
        sort_order: sortOrder,
        specs: data.specs,
      })
      .select()
      .single();

    if (error) return { error: error.message };
    if (!result) return { error: "Can't Insert Data" };

    // Insert translations for all languages
    const translations = data.translations || {
      en: {
        name: data.name,
        description: data.description || "",
        shortDescription: data.shortDescription || "",
      },
    };

    const translationRecords = Object.entries(translations).map(([langCode, trans]) => ({
      product_id: result.id,
      language_code: langCode,
      name: trans.name,
      description: trans.description || "",
      short_description: trans.shortDescription || "",
      special_features: trans.specialFeatures || null,
      meta_title: trans.metaTitle || null,
      meta_description: trans.metaDescription || null,
    }));

    const { error: translationError } = await supabase.from("product_translations").insert(translationRecords);

    if (translationError) {
      console.error("Translation insert error:", translationError);
      // Don't fail the whole operation if translations fail
    }

    return { res: result };
  } catch (error) {
    return { error: JSON.stringify(error) };
  }
};

export const getAllProducts = async () => {
  try {
    const supabase = createSupabaseServer();
    const { data: result, error } = await supabase
      .from("products")
      .select(
        `
        id,
        sku,
        price,
        is_available,
        product_translations!inner (
          name,
          language_code
        ),
        categories (
          id,
          category_translations!inner (
            name,
            language_code
          )
        ),
        brands (
          id,
          name
        )
      `
      )
      .eq("product_translations.language_code", "en")
      .eq("categories.category_translations.language_code", "en");

    if (error) return { error: error.message };
    if (!result) return { error: "Can't Get Data from Database!" };

    // Transform to match expected format
    const transformedResult = result.map((item) => ({
      id: item.id,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      name: (item.product_translations as any)?.[0]?.name || "Unnamed Product",
      price: item.price || 0,
      salePrice: null,
      isAvailable: item.is_available || false,
      brand: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        id: (item.brands as any)?.id || "",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        name: (item.brands as any)?.name || "-",
      },
      category: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        id: (item.categories as any)?.id || "",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        name: (item.categories as any)?.category_translations?.[0]?.name || "Uncategorized",
      },
    }));

    return { res: transformedResult };
  } catch (error) {
    return { error: JSON.stringify(error) };
  }
};

export const getOneProduct = async (productID: string) => {
  if (!productID || productID === "") return { error: "Invalid Product ID!" };

  try {
    const supabase = createSupabaseServer();
    const { data: result, error } = await supabase
      .from("products")
      .select(
        `
        id,
        name,
        description,
        images,
        price,
        sale_price,
        specs,
        special_features,
        is_available,
        option_sets,
        categories (
          id,
          parent_id
        )
      `
      )
      .eq("id", productID)
      .single();

    if (error) return { error: error.message };
    if (!result) return { error: "Invalid Data!" };

    const specifications = await generateSpecTable(result.specs);
    if (!specifications || specifications.length === 0) return { error: "Invalid Date" };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pathArray: TPath[] | null = await getPathByCategoryID(
      (result.categories as any).id,
      (result.categories as any).parent_id
    );
    if (!pathArray || pathArray.length === 0) return { error: "Invalid Date" };

    // Transform to match expected format
    const mergedResult: TProductPageInfo = {
      id: result.id,
      name: result.name,
      desc: result.description,
      images: result.images,
      price: result.price,
      salePrice: result.sale_price,
      specialFeatures: result.special_features,
      isAvailable: result.is_available,
      optionSets: result.option_sets,
      specifications,
      path: pathArray,
    };

    return { res: mergedResult };
  } catch (error) {
    return { error: JSON.stringify(error) };
  }
};

export const getCartProducts = async (productIDs: string[]) => {
  if (!productIDs || productIDs.length === 0) return { error: "Invalid Product List" };

  // Filter out undefined values
  const validProductIDs = productIDs.filter((id) => id && id !== "undefined");

  if (validProductIDs.length === 0) return { error: "No valid product IDs" };

  try {
    const supabase = createSupabaseServer();

    // Separate UUIDs and slugs (UUID format: 8-4-4-4-12 characters)
    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const uuids = validProductIDs.filter((id) => uuidPattern.test(id));
    const slugs = validProductIDs.filter((id) => !uuidPattern.test(id));

    const allResults: any[] = [];

    // Fetch by UUID (id column)
    if (uuids.length > 0) {
      const { data: uuidResults, error: uuidError } = await supabase
        .from("products")
        .select(
          `
          id,
          name,
          images,
          price,
          sale_price
        `
        )
        .in("id", uuids);

      if (uuidResults) {
        allResults.push(...uuidResults);
      }
    }

    // Fetch by slug (url column)
    if (slugs.length > 0) {
      const { data: slugResults, error: slugError } = await supabase
        .from("products")
        .select(
          `
          id,
          name,
          images,
          price,
          sale_price,
          url
        `
        )
        .in("url", slugs);

      if (slugResults) {
        allResults.push(...slugResults);
      }
    }

    if (allResults.length === 0) return { error: "No products found" };

    // Transform to match expected format
    const transformedResult = allResults.map((item) => ({
      id: item.id,
      name: item.name,
      images: item.images,
      price: item.price,
      salePrice: item.sale_price,
      url: item.url,
    }));

    return { res: transformedResult };
  } catch (error) {
    return { error: JSON.stringify(error) };
  }
};

export const deleteProduct = async (productID: string) => {
  if (!productID || productID === "") return { error: "Invalid Data!" };
  try {
    const supabase = createSupabaseServer();
    const { data: result, error } = await supabase.from("products").delete().eq("id", productID).select().single();

    if (error) return { error: error.message };
    if (!result) return { error: "Can't Delete!" };
    return { res: result };
  } catch (error) {
    return { error: JSON.stringify(error) };
  }
};

export const getProductById = async (productID: string) => {
  if (!productID || productID === "") return { error: "Invalid Data!" };
  try {
    const supabase = createSupabaseServer();

    // Get product with all translations
    const { data: result, error } = await supabase
      .from("products")
      .select(
        `
        id,
        sku,
        url,
        category_id,
        brand_id,
        price,
        cost_price,
        is_available,
        is_featured,
        stock_quantity,
        low_stock_threshold,
        weight,
        images,
        sort_order,
        specs,
        categories (
          category_translations!inner (
            name,
            language_code
          )
        ),
        brands (
          name
        )
      `
      )
      .eq("id", productID)
      .eq("categories.category_translations.language_code", "en")
      .single();

    if (error) return { error: error.message };
    if (!result) return { error: "Product not found!" };

    // Get all translations separately
    const { data: allTranslations } = await supabase
      .from("product_translations")
      .select("*")
      .eq("product_id", productID);

    // Build translations object
    const translations: Record<string, any> = {};
    if (allTranslations) {
      allTranslations.forEach((trans) => {
        translations[trans.language_code] = {
          name: trans.name,
          description: trans.description || "",
          shortDescription: trans.short_description || "",
          specialFeatures: trans.special_features,
          metaTitle: trans.meta_title,
          metaDescription: trans.meta_description,
        };
      });
    }

    // Get English translation for backwards compatibility
    const enTranslation = translations.en || {
      name: "",
      description: "",
      shortDescription: "",
    };

    // Transform to flat structure
    const transformedResult = {
      id: result.id,
      sku: result.sku,
      url: result.url,
      categoryId: result.category_id,
      brandId: result.brand_id,
      name: enTranslation.name,
      description: enTranslation.description,
      shortDescription: enTranslation.shortDescription,
      translations: translations,
      categoryName: (result.categories as any)?.category_translations?.[0]?.name || "",
      brandName: (result.brands as any)?.name || "",
      price: result.price,
      costPrice: result.cost_price,
      isAvailable: result.is_available,
      isFeatured: result.is_featured,
      stockQuantity: result.stock_quantity,
      lowStockThreshold: result.low_stock_threshold,
      weight: result.weight,
      images: result.images,
      sortOrder: result.sort_order,
      specs: result.specs,
    };

    return { data: transformedResult };
  } catch (error) {
    return { error: JSON.stringify(error) };
  }
};

export const updateProduct = async (productID: string, data: TAddProductFormValues) => {
  if (!productID || productID === "") return { error: "Invalid Product ID!" };

  const validation = ValidateAddProduct.safeParse(data);
  if (!validation.success) {
    console.error("Validation error:", validation.error);
    return { error: "Invalid Data!" };
  }

  try {
    const supabase = createSupabaseServer();
    const price = convertStringToFloat(data.price);
    const costPrice = data.costPrice ? convertStringToFloat(data.costPrice) : null;
    const stockQuantity = parseInt(data.stockQuantity) || 0;
    const lowStockThreshold = data.lowStockThreshold ? parseInt(data.lowStockThreshold) : 5;
    const weight = data.weight ? convertStringToFloat(data.weight) : null;
    const sortOrder = data.sortOrder ? parseInt(data.sortOrder) : 0;

    // Update product
    const { data: result, error } = await supabase
      .from("products")
      .update({
        sku: data.sku,
        url: data.url,
        category_id: data.categoryID,
        brand_id: data.brandID,
        price: price,
        cost_price: costPrice,
        is_available: data.isAvailable,
        is_featured: data.isFeatured,
        stock_quantity: stockQuantity,
        low_stock_threshold: lowStockThreshold,
        weight: weight,
        images: [...data.images],
        sort_order: sortOrder,
        specs: data.specs,
      })
      .eq("id", productID)
      .select()
      .single();

    if (error) return { error: error.message };
    if (!result) return { error: "Can't Update Product" };

    // Update or insert translations for all languages
    const translations = data.translations || {
      en: {
        name: data.name,
        description: data.description || "",
        shortDescription: data.shortDescription || "",
      },
    };

    // Delete existing translations and insert new ones (easier than updating each)
    await supabase.from("product_translations").delete().eq("product_id", productID);

    const translationRecords = Object.entries(translations)
      .filter(([_, trans]) => trans.name && trans.name.trim() !== "") // Only insert languages with name filled
      .map(([langCode, trans]) => ({
        product_id: productID,
        language_code: langCode,
        name: trans.name,
        description: trans.description || "",
        short_description: trans.shortDescription || "",
        special_features: trans.specialFeatures || null,
        meta_title: trans.metaTitle || null,
        meta_description: trans.metaDescription || null,
      }));

    if (translationRecords.length > 0) {
      const { error: translationError } = await supabase.from("product_translations").insert(translationRecords);

      if (translationError) {
        console.error("Translation insert error:", translationError);
        // Don't fail the whole operation if translations fail
      }
    }

    return { res: result };
  } catch (error) {
    return { error: JSON.stringify(error) };
  }
};

export const getProductTranslations = async (productID: string) => {
  if (!productID || productID === "") return { error: "Invalid Product ID!" };
  try {
    const supabase = createSupabaseServer();
    const { data: translations, error } = await supabase
      .from("product_translations")
      .select("*")
      .eq("product_id", productID);

    if (error) return { error: error.message };

    // Build translations object
    const translationsObj: Record<string, any> = {};
    if (translations) {
      translations.forEach((trans) => {
        translationsObj[trans.language_code] = {
          name: trans.name,
          description: trans.description || "",
          shortDescription: trans.short_description || "",
          specialFeatures: trans.special_features,
          metaTitle: trans.meta_title,
          metaDescription: trans.meta_description,
        };
      });
    }

    return { res: translationsObj };
  } catch (error) {
    return { error: JSON.stringify(error) };
  }
};

export const updateProductTranslations = async (productID: string, translations: Record<string, any>) => {
  if (!productID || productID === "") return { error: "Invalid Product ID!" };
  try {
    const supabase = createSupabaseServer();

    // Delete existing translations (except English, which comes from main form)
    await supabase.from("product_translations").delete().eq("product_id", productID).neq("language_code", "en");

    // Insert new translations (except English)
    const translationRecords = Object.entries(translations)
      .filter(([langCode, trans]: [string, any]) => langCode !== "en" && trans.name && trans.name.trim() !== "")
      .map(([langCode, trans]: [string, any]) => ({
        product_id: productID,
        language_code: langCode,
        name: trans.name,
        description: trans.description || "",
        short_description: trans.shortDescription || "",
        special_features: trans.specialFeatures || null,
        meta_title: trans.metaTitle || null,
        meta_description: trans.metaDescription || null,
      }));

    if (translationRecords.length > 0) {
      const { error } = await supabase.from("product_translations").insert(translationRecords);

      if (error) return { error: error.message };
    }

    return { res: "Translations updated successfully" };
  } catch (error) {
    return { error: JSON.stringify(error) };
  }
};

const generateSpecTable = async (rawSpec: { specGroupID: string; specValues: string[] }[]) => {
  try {
    const specGroupIDs = rawSpec.map((spec) => spec.specGroupID);

    const supabase = createSupabaseServer();
    const { data: result, error } = await supabase.from("spec_groups").select("*").in("id", specGroupIDs);

    if (error || !result || result.length === 0) return null;

    const specifications: TSpecification[] = [];

    rawSpec.forEach((spec) => {
      const groupSpecIndex = result.findIndex((g) => g.id === spec.specGroupID);
      const tempSpecs: { name: string; value: string }[] = [];
      spec.specValues.forEach((s: string, index: number) => {
        tempSpecs.push({
          name: result[groupSpecIndex].specs[index] || "",
          value: s || "",
        });
      });

      specifications.push({
        groupName: result[groupSpecIndex].title || "",
        specs: tempSpecs,
      });
    });
    if (specifications.length === 0) return null;

    return specifications;
  } catch {
    return null;
  }
};

const getPathByCategoryID = async (categoryID: string, parentID: string | null) => {
  try {
    if (!categoryID || categoryID === "") return null;
    if (!parentID || parentID === "") return null;

    const supabase = createSupabaseServer();
    const { data: result, error } = await supabase
      .from("categories")
      .select(
        `
        id,
        parent_id,
        name,
        url
      `
      )
      .or(`id.eq.${categoryID},id.eq.${parentID},parent_id.is.null`);

    if (error || !result || result.length === 0) return null;

    const path: TPath[] = [];
    let tempCatID: string | null = categoryID;
    let searchCount = 0;

    const generatePath = () => {
      const foundCatIndex = result.findIndex((cat) => cat.id === tempCatID);
      if (foundCatIndex === -1) return;
      path.unshift({
        id: result[foundCatIndex].id,
        parentID: result[foundCatIndex].parent_id,
        name: result[foundCatIndex].name,
        url: result[foundCatIndex].url,
      });
      tempCatID = result[foundCatIndex].parent_id;
      if (!tempCatID) return;
      searchCount++;
      if (searchCount <= 3) generatePath();
      return;
    };
    generatePath();

    if (!path || path.length === 0) return null;
    return path;
  } catch {
    return null;
  }
};
