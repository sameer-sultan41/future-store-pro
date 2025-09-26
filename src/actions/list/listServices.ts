"use server";
import { z } from "zod";

import { TFilters } from "@/domains/store/productList/types";
import { TListSort } from "@/domains/store/productList/types/";
import { createSupabaseServer } from "@/shared/lib/supabaseClient";
import { TProductPath } from "@/shared/types/product";

const ValidateSort = z.object({
  sortName: z.enum(["id", "price", "name"]),
  sortType: z.enum(["asc", "desc"]),
});

export const getList = async (path: string, sortData: TListSort, filters: TFilters) => {
  if (!ValidateSort.safeParse(sortData).success) return { error: "Invalid Path" };
  if (!path || path === "") return { error: "Invalid Path" };
  const pathArray = pathToArray(path);
  if (!pathArray || pathArray.length > 3 || pathArray.length === 0) return { error: "Invalid Path" };

  const categoryID = await findCategoryFromPathArray(pathArray);
  if (categoryID === "") return { error: "Invalid Path Name" };

  const subCategories: TProductPath[] | null = await getSubCategories(categoryID);
  if (!subCategories) return { error: "Invalid Sub Categories" };

  const allRelatedCategories = await findCategoryChildren(categoryID, pathArray.length);
  if (!allRelatedCategories || allRelatedCategories.length === 0) return { error: "Invalid Path Name" };

  const result = await getProductsByCategories(allRelatedCategories, sortData, filters);
  if (!result) return { error: "Can't Find Product!" };

  return { products: result, subCategories: subCategories };
};

const getSubCategories = async (catID: string) => {
  try {
    const supabase = createSupabaseServer();
    const { data: result, error } = await supabase
      .from('categories')
      .select('name, url')
      .eq('parent_id', catID);

    if (error || !result) return null;
    const subCategories: TProductPath[] = [];
    result.forEach((cat) => {
      subCategories.push({
        label: cat.name,
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

const getProductsByCategories = async (categories: string[], sortData: TListSort, filters: TFilters) => {
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
        name,
        images,
        price,
        sale_price,
        special_features,
        is_available,
        brands (
          id,
          name
        )
      `)
      .in('category_id', categories);

    if (isAvailable !== null) {
      query = query.eq('is_available', isAvailable);
    }

    if (brands && brands.length > 0) {
      query = query.in('brand_id', brands);
    }

    if (!isInitialPrice) {
      query = query.gt('price', filters.priceMinMax[0]).lte('price', filters.priceMinMax[1]);
    }

    query = query.order(sortData.sortName, { ascending: sortData.sortType === 'asc' });

    const { data: result, error } = await query;

    if (error || !result) return null;
    
    // Transform to match expected format
    const transformedResult = result.map(item => ({
      id: item.id,
      name: item.name,
      images: item.images,
      price: item.price,
      salePrice: item.sale_price,
      specialFeatures: item.special_features,
      isAvailable: item.is_available,
      brand: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        id: (item.brands as any).id,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        name: (item.brands as any).name,
      },
    }));

    return transformedResult;
  } catch {
    return null;
  }
};

const pathToArray = (path: string) => {
  const pathWithoutList = path.split("/list/")[1];
  const pathArray = pathWithoutList.split("/");
  return pathArray;
};
