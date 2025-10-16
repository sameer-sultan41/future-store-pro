"use server";
import { z } from "zod";

import { createSupabaseServer } from "@/shared/lib/supabaseClient";
import {
  TAddProductFormValues,
  TPath,
  TProductPageInfo,
  TSpecification,
} from "@/shared/types/product";

const ValidateAddProduct = z.object({
  name: z.string().min(3),
  brandID: z.string().min(6),
  specialFeatures: z.array(z.string()),
  desc: z.string().optional(),
  images: z.array(z.string()),
  categoryID: z.string().min(6),
  price: z.string().min(1),
  salePrice: z.string(),
  specifications: z.array(
    z.object({
      specGroupID: z.string().min(6),
      specValues: z.array(z.string()),
    })
  ),
});

const convertStringToFloat = (str: string) => {
  str.replace(/,/, ".");
  return str ? parseFloat(str) : 0.0;
};

// --- Interfaces for getProductByUrl response ---
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


// --- End interfaces ---

export const getProductByUrl = async (locale: string = "en", productUrl: string) => {
  if (!locale || !productUrl) return { error: "Invalid parameters" };
  const supabase = createSupabaseServer();
  try {
const { data, error } = await supabase
  .from("products")
  .select(`
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
          variant_types (
            name,
            display_type
          )
        )
      )
    )
  `)
    .eq("product_translations.language_code", locale)
 .eq("url", productUrl)
//  .eq("url", "samsung-galaxy-s24-ultra")
//  .eq("url", "nike-mens-tshirt")
  .maybeSingle();
      // .eq("url", "nike-air-max-90")
            // .eq("product_translations.language_code", locale)


      console.log("result ----->", data);
      console.log("error -----> ", error);
      return {data};
  } catch (err) {
    return { error: JSON.stringify(err) };
  }
};
// ...existing code...



export const addProduct = async (data: TAddProductFormValues) => {
  if (!ValidateAddProduct.safeParse(data).success) return { error: "Invalid Data!" };

  try {
    const supabase = createSupabaseServer();
    const price = convertStringToFloat(data.price);
    const salePrice = data.salePrice ? convertStringToFloat(data.salePrice) : null;

    const { data: result, error } = await supabase
      .from('products')
      .insert({
        name: data.name,
        description: data.desc,
        brand_id: data.brandID,
        special_features: data.specialFeatures,
        is_available: data.isAvailable,
        price: price,
        sale_price: salePrice,
        images: [...data.images],
        specs: data.specifications,
        category_id: data.categoryID,
      })
      .select()
      .single();

    if (error) return { error: error.message };
    if (!result) return { error: "Can't Insert Data" };
    return { res: result };
  } catch (error) {
    return { error: JSON.stringify(error) };
  }
};

export const getAllProducts = async () => {
  try {
    const supabase = createSupabaseServer();
    const { data: result, error } = await supabase
      .from('products')
      .select(`
        id,
        name,
        categories (
          id,
          name
        )
      `);

    if (error) return { error: error.message };
    if (!result) return { error: "Can't Get Data from Database!" };
    
    // Transform to match expected format
    const transformedResult = result.map(item => ({
      id: item.id,
      name: item.name,
      category: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        id: (item.categories as any).id,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        name: (item.categories as any).name,
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
      .from('products')
      .select(`
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
      `)
      .eq('id', productID)
      .single();

    if (error) return { error: error.message };
    if (!result) return { error: "Invalid Data!" };

    const specifications = await generateSpecTable(result.specs);
    if (!specifications || specifications.length === 0) return { error: "Invalid Date" };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pathArray: TPath[] | null = await getPathByCategoryID((result.categories as any).id, (result.categories as any).parent_id);
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
  const validProductIDs = productIDs.filter(id => id && id !== 'undefined');
  
  if (validProductIDs.length === 0) return { error: "No valid product IDs" };

  try {
    const supabase = createSupabaseServer();
    
    // Separate UUIDs and slugs (UUID format: 8-4-4-4-12 characters)
    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const uuids = validProductIDs.filter(id => uuidPattern.test(id));
    const slugs = validProductIDs.filter(id => !uuidPattern.test(id));
    
    const allResults: any[] = [];
    
    // Fetch by UUID (id column)
    if (uuids.length > 0) {
      const { data: uuidResults, error: uuidError } = await supabase
        .from('products')
        .select(`
          id,
          name,
          images,
          price,
          sale_price
        `)
        .in('id', uuids);
      
      if (uuidResults) {
        allResults.push(...uuidResults);
      }
    }
    
    // Fetch by slug (url column)
    if (slugs.length > 0) {
      const { data: slugResults, error: slugError } = await supabase
        .from('products')
        .select(`
          id,
          name,
          images,
          price,
          sale_price,
          url
        `)
        .in('url', slugs);
      
      if (slugResults) {
        allResults.push(...slugResults);
      }
    }

    if (allResults.length === 0) return { error: "No products found" };
    
    // Transform to match expected format
    const transformedResult = allResults.map(item => ({
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
    const { data: result, error } = await supabase
      .from('products')
      .delete()
      .eq('id', productID)
      .select()
      .single();

    if (error) return { error: error.message };
    if (!result) return { error: "Can't Delete!" };
    return { res: result };
  } catch (error) {
    return { error: JSON.stringify(error) };
  }
};

const generateSpecTable = async (rawSpec: { specGroupID: string; specValues: string[] }[]) => {
  try {
    const specGroupIDs = rawSpec.map((spec) => spec.specGroupID);

    const supabase = createSupabaseServer();
    const { data: result, error } = await supabase
      .from('spec_groups')
      .select('*')
      .in('id', specGroupIDs);

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
      .from('categories')
      .select(`
        id,
        parent_id,
        name,
        url
      `)
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
