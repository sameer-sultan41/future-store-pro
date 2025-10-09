"use server";
// Returns only brands that have products in the given category (and subcategories)
export const getBrandsByCategory = async (categoryUrl: string) => {
  const supabase = createSupabaseServer();

   const categoryUrlOrId = pathToArray(categoryUrl);
  // Helper to check if string is UUID
  const isUUID = (str: string) =>
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(str);

  // Find category by id or url
  let categoryQuery;
  if (isUUID(categoryUrlOrId)) {
    categoryQuery = supabase.from('categories').select('*').eq('id', categoryUrlOrId).maybeSingle();
  } else {
    categoryQuery = supabase.from('categories').select('*').eq('url', categoryUrlOrId).maybeSingle();
  }
  const { data: category, error: catError } = await categoryQuery;
  if (catError || !category) {
    return { error: catError ? catError.message : 'Category not found' };
  }

  // Get all relevant category IDs (including subcategories if parent)
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

  // Get all brands for products in these categories
  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('brand_id')
    .in('category_id', categoryIds)
    .eq('is_available', true);
  if (productsError) return { error: productsError.message };

  // Deduplicate brand IDs
  const brandIds = Array.from(new Set(products.map((p: any) => p.brand_id)));
  if (brandIds.length === 0) return { res: [] };

  // Get brand details for these IDs
  const { data: brands, error: brandsError } = await supabase
    .from('brands')
    .select('id, name')
    .in('id', brandIds)
    .eq('is_active', true);
  if (brandsError) return { error: brandsError.message };

  return { res: brands };
};

import { z } from "zod";

import { TFilters } from "@/domains/shop/productList/types";
import { TListSort } from "@/domains/shop/productList/types";
import { createSupabaseServer } from "@/shared/lib/supabaseClient";
import { TProductPath } from "@/shared/types/product";
import { ca } from "zod/v4/locales";

const ValidateSort = z.object({
  sortName: z.enum(["id", "price", "name"]),
  sortType: z.enum(["asc", "desc"]),
});

const pathToArray = (path: string) => {
  const pathWithoutList = path.split("/list/")[1];
  // const pathArray = pathWithoutList.split("/");
  return pathWithoutList;
};


// sort: { sortName: 'price'|'date'|'name', sortType: 'asc'|'desc' }
// search: string (search by product name)
// stockFilter: 'all' | 'inStock' | 'outStock'
// minPrice and maxPrice are optional for price range filtering
// brands: string[] (array of brand IDs to filter by)
export const getProductsByCategory = async (
  categoryIdOrUrl: string,
  languageCode: string,
  sort?: { sortName: 'price'|'date'|'name', sortType: 'asc'|'desc' },
  search?: string,
  stockFilter: 'all' | 'inStock' | 'outStock' = 'all',
  minPrice?: number,
  maxPrice?: number,
  brands?: string[]
) => {


  try {
    const supabase = createSupabaseServer();

    // Helper to check if string is UUID
    const isUUID = (str: string) => {
      return /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(str);
    };

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
      // Get all subcategories
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


    // Build product query with filters
    let query = supabase
      .from('products')
      .select('*')
      .in('category_id', categoryIds)
      .eq('is_available', true);

    // Brands filter
    if (brands && brands.length > 0) {
      query = query.in('brand_id', brands);
    }

    // Stock filter
    if (stockFilter === 'inStock') {
      query = query.gt('stock_quantity', 0);
    } else if (stockFilter === 'outStock') {
      query = query.eq('stock_quantity', 0);
    }

    // Price range filter
    if (typeof minPrice === 'number') {
      query = query.gte('base_price', minPrice);
    }
    if (typeof maxPrice === 'number') {
      query = query.lte('base_price', maxPrice);
    }

    // Sorting
    if (sort) {
      // Map sortName to actual DB field
      let sortField: string = sort.sortName;
      if (sort.sortName === 'price') sortField = 'base_price';
      else if (sort.sortName === 'date') sortField = 'created_at';
      else if (sort.sortName === 'name') sortField = 'url'; // fallback, but not used directly
      query = query.order(sortField, { ascending: sort.sortType === 'asc' });
    }

    // Search by name (in product_translations)
    let productIds: string[] = [];
    let translations: Record<string, any> = {};
    if (search && search.trim().length > 0) {
      // First, get product_translations matching name
      const { data: trans, error: transError } = await supabase
        .from('product_translations')
        .select('product_id')
        .ilike('name', `%${search}%`)
        .eq('language_code', languageCode);
      if (transError) return { error: transError.message };
      if (!trans || trans.length === 0) return { res: [] };
      productIds = trans.map((t: any) => t.product_id);
      query = query.in('id', productIds);
    }

    // Get products
    const { data: products, error: prodError } = await query;
    if (prodError) return { error: prodError.message };

    // Join with product_translations for the given language
    if (!productIds.length) {
      productIds = products.map((p: any) => p.id);
    }
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

    // Attach translation to each product
    const result = products.map((p: any) => ({
      ...p,
      translation: translations[p.id] || null,
    }));

    return { res: result };
  } catch (error) {
    return { error: JSON.stringify(error) };
  }
};

export const getList = async (path: string, sortData: TListSort, filters: TFilters, languageCode = 'en') => {
  if (!ValidateSort.safeParse(sortData).success) return { error: "Invalid Sort" };
  if (!path || path === "") return { error: "Invalid Path" };
  const pathArray = pathToArray(path);
  if (!pathArray || pathArray.length > 3 || pathArray.length === 0) return { error: "Invalid Path" };

  const categoryID = await findCategoryFromPathArray(pathArray);
  if (categoryID === "") return { error: "Invalid category ID & Name" };

  const subCategories: TProductPath[] | null = await getSubCategories(categoryID, languageCode);
  if (!subCategories) return { error: "Invalid Sub Categories" };

  const allRelatedCategories = await findCategoryChildren(categoryID, pathArray.length);
  if (!allRelatedCategories || allRelatedCategories.length === 0) return { error: "Invalid Path Name" };

  const result = await getProductsByCategories(allRelatedCategories, sortData, filters, languageCode);
  if (!result) return { error: "Can't Find Product!" };

  return { products: result, subCategories: subCategories };
};

const getSubCategories = async (catID: string, languageCode = 'en') => {
  try {
    const supabase = createSupabaseServer();
    const { data: result, error } = await supabase
      .from('categories')
      .select(`id, url, category_translations!inner(name)`)
      .eq('parent_id', catID)
      .eq('category_translations.language_code', languageCode);

    if (error || !result) return null;
    const subCategories: TProductPath[] = [];
    result.forEach((cat) => {
      subCategories.push({
        label: cat.category_translations[0]?.name || '',
        url: cat.url,
      });
    });
    return subCategories;
  } catch {
    return null;
  }
};

const findCategoryFromPathArray = async (pathArray: string[]) => {
  try {
    const supabase = createSupabaseServer();
    const { data: result, error } = await supabase
      .from('categories')
      .select('id, parent_id, url');

    if (error || !result) return "";

    let parentID: string | null = null;
    let categoryID = "";
    pathArray.forEach((path) => {
      categoryID = result.filter((cat) => cat.parent_id === parentID && cat.url === path)[0]?.id || "";
      parentID = categoryID;
    });
    return categoryID;
  } catch {
    return "";
  }
};

const findCategoryChildren = async (catID: string, numberOfParents: number) => {
  try {
    if (numberOfParents === 3) return [catID];
    const supabase = createSupabaseServer();
    const { data: result, error } = await supabase
      .from('categories')
      .select('id, parent_id');

    if (error || !result) return null;

    const tempChildren: string[] = [];
    result.forEach((cat) => {
      if (cat.parent_id === catID) {
        tempChildren.push(cat.id);
      }
    });

    if (numberOfParents === 1) {
      const lastChildren: string[] = [];
      result.forEach((cat) => {
        if (cat.parent_id && tempChildren.includes(cat.parent_id)) {
          lastChildren.push(cat.id);
        }
      });
      return tempChildren.concat([catID], lastChildren);
    }

    return tempChildren.concat([catID]);
  } catch {
    return null;
  }
};

const getProductsByCategories = async (categories: string[], sortData: TListSort, filters: TFilters, languageCode = 'en') => {
  const brands: string[] | null = filters.brands.length > 0 ? [] : null;
  if (brands) {
    filters.brands.forEach((brand) => {
      if (brand.isSelected) return brands.push(brand.id);
    });
  }

  let isAvailable: boolean | null = null;
  if (filters.stockStatus === "inStock") isAvailable = true;
  if (filters.stockStatus === "outStock") isAvailable = false;

  const isInitialPrice = filters.priceMinMax[1] === 0;

  try {
    const supabase = createSupabaseServer();
    let query = supabase
      .from('products')
      .select(`
        id,
        images,
        base_price,
        sale_price,
        special_features,
        is_available,
        brand_id,
        brands (
          id,
          name
        ),
        product_translations!inner(name)
      `)
      .in('category_id', categories)
      .eq('product_translations.language_code', languageCode);

    if (isAvailable !== null) {
      query = query.eq('is_available', isAvailable);
    }

    if (brands && brands.length > 0) {
      query = query.in('brand_id', brands);
    }

    if (!isInitialPrice) {
      query = query.gt('base_price', filters.priceMinMax[0]).lte('base_price', filters.priceMinMax[1]);
    }

    // Use base_price for sorting if sortName is 'price'
    const sortField = sortData.sortName === 'price' ? 'base_price' : sortData.sortName;
    query = query.order(sortField, { ascending: sortData.sortType === 'asc' });

    const { data: result, error } = await query;

    if (error || !result) return null;
    
    // Transform to match expected format
    const transformedResult = result.map(item => ({
      id: item.id,
      name: item.product_translations[0]?.name || '',
      images: item.images,
      price: item.base_price,
      salePrice: item.sale_price,
      specialFeatures: item.special_features,
      isAvailable: item.is_available,
      brand: {
        id: (item.brands as any)?.id,
        name: (item.brands as any)?.name,
      },
    }));

    return transformedResult;
  } catch {
    return null;
  }
};


