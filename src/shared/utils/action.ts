"use server";
import { createSupabaseServer } from "@/shared/lib/supabaseClient";
import { Language } from "./type";


// Get products by category (parent or child) with brand info and translation
export const getProductsByCategory = async (categoryIdOrUrl: string, languageCode: string) => {
  try {
    const supabase = createSupabaseServer();
    const isUUID = (str: string) => /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(str);

    // Find category by id or url
    let categoryQuery;
    if (isUUID(categoryIdOrUrl)) {
      categoryQuery = supabase
        .from('categories')
        .select('*')
        .eq('id', categoryIdOrUrl)
        .maybeSingle();
    } else {
      categoryQuery = supabase
        .from('categories')
        .select('*')
        .eq('url', categoryIdOrUrl)
        .maybeSingle();
    }
    const { data: category, error: catError } = await categoryQuery;
    if (catError || !category) {
      return { error: catError ? catError.message : 'Category not found' };
    }

    // If parent_id is null, it's a parent category, so get all its subcategories
    let categoryIds = [category.id];
    if (category.parent_id === null) {
      const { data: subcats, error: subcatError } = await supabase
        .from('categories')
        .select('id')
        .eq('parent_id', category.id)
        .eq('is_active', true);
      if (subcatError) return { error: subcatError.message };
      if (subcats && subcats.length > 0) {
        categoryIds = categoryIds.concat(subcats.map((c: any) => c.id));
      }
    }

    // Get products in these categories, join brands
    const { data: products, error: prodError } = await supabase
      .from('products')
      .select('*, brand:brand_id(id, name)')
      .in('category_id', categoryIds)
      .eq('is_available', true);
    if (prodError) return { error: prodError.message };

    // Join with product_translations for the given language
    const productIds = products.map((p: any) => p.id);
    let translations: Record<string, any> = {};
    if (productIds.length > 0) {
      const { data: trans, error: transError } = await supabase
        .from('product_translations')
        .select('*')
        .in('product_id', productIds)
        .eq('language_code', languageCode);
      if (!transError && trans) {
        for (const t of trans) {
          translations[t.product_id] = t;
        }
      }
    }

    // Attach translation and brand to each product, and add salePrice (null for now)
    const result = products.map((p: any) => ({
      ...p,
      translation: translations[p.id] || null,
      brand: p.brand || null,
      salePrice: null, // You can update this if you have sale/discount logic
    }));

    return { res: result };
  } catch (error) {
    return { error: JSON.stringify(error) };
  }
};




export const getAllLanguages = async () => {
  try {
    const supabase = createSupabaseServer();
    const { data, error } = await supabase
      .from('languages')
      .select('*')
      .eq('is_active', true);

    if (error) return { error: error.message };
    return { res: data as Language[] };
  } catch (error) {
    return { error: JSON.stringify(error) };
  }
};

export const getTranslatedCategory = async (categoryId: string, languageCode: string) => {
  try {
    const supabase = createSupabaseServer();
    const { data, error } = await supabase
      .from('category_translations')
      .select('*')
      .eq('category_id', categoryId)
      .eq('language_code', languageCode)
      .single();

    if (error) return { error: error.message };
    return { res: data };
  } catch (error) {
    return { error: JSON.stringify(error) };
  }
};

export const getTranslatedProduct = async (productId: string, languageCode: string) => {
  try {
    const supabase = createSupabaseServer();
    const { data, error } = await supabase
      .from('product_translations')
      .select('*')
      .eq('product_id', productId)
      .eq('language_code', languageCode)
      .single();

    if (error) return { error: error.message };
    return { res: data };
  } catch (error) {
    return { error: JSON.stringify(error) };
  }
};