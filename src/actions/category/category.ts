"use server";
import { z } from "zod";

import { createSupabaseServer } from "@/shared/lib/supabaseClient";
import { TCategory, TGroupJSON } from "@/shared/types/categories";

//eslint-disable-next-line
const GetAllCategories = z.object({
  id: z.string(),
  parentID: z.string().min(6).nullable(),
  name: z.string().min(3),
  url: z.string().min(3),
  iconSize: z.array(z.number().int()),
  iconUrl: z.string().min(3).nullable(),
});

const AddCategory = z.object({
  parentID: z.string().min(6).nullable(),
  name: z.string().min(3),
  url: z.string().min(3),
  iconSize: z.array(z.number().int()),
  iconUrl: z.string().min(3).nullable(),
});

const UpdateCategory = z.object({
  id: z.string(),
  name: z.string().min(3).optional(),
  url: z.string().min(3).optional(),
  iconSize: z.array(z.number().int()),
  iconUrl: z.string().min(3).optional(),
});

export type TGetAllCategories = z.infer<typeof GetAllCategories>;
export type TAddCategory = z.infer<typeof AddCategory>;
export type TUpdateCategory = z.infer<typeof UpdateCategory>;

const convertToJson = (categoriesTable: TCategory[]): TGroupJSON[] => {
  const generateCategoryGroups = (categoriesTable: TCategory[]): TGroupJSON[] => {
    return categoriesTable.filter((tableRow) => tableRow.parentID === null).map((group) => ({ group, categories: [] }));
  };

  const fillCategoryArray = (groups: TGroupJSON[], categoriesTable: TCategory[]) => {
    groups.forEach((group) => {
      group.categories = getChildren(categoriesTable, group.group.id).map((category) => ({
        category,
        subCategories: [],
      }));
    });
  };

  const fillSubCategoryArray = (groups: TGroupJSON[], categoriesTable: TCategory[]) => {
    groups.forEach((group) => {
      group.categories.forEach((category) => {
        category.subCategories = getChildren(categoriesTable, category.category.id);
      });
    });
  };

  const getChildren = (array: TCategory[], parentID: string | null): TCategory[] => {
    return array.filter((item) => item.parentID === parentID);
  };

  const groups: TGroupJSON[] = generateCategoryGroups(categoriesTable);
  fillCategoryArray(groups, categoriesTable);
  fillSubCategoryArray(groups, categoriesTable);

  return groups;
};

export const getAllCategories = async () => {
  try {
    const supabase = createSupabaseServer();
    const { data: result, error } = await supabase
      .from('categories')
      .select('*');

    if (error) return { error: error.message };
    if (!result) return { error: "Can't read categories" };
    
    // Transform to match expected format
    const transformedResult = result.map(item => ({
      id: item.id,
      parentID: item.parent_id,
      name: item.name,
      url: item.url,
      iconSize: item.icon_size,
      iconUrl: item.icon_url,
    }));
    
    return { res: transformedResult };
  } catch {
    return { error: "Cant read Category Groups" };
  }
};
export const getAllCategoriesJSON = async (languageCode:string) => {
  try {
    const supabase = createSupabaseServer();
    const { data: result, error } = await supabase
      .from('categories')
      .select(`
        id,
        parent_id,
        url,
        icon_url,
        icon_size,
        category_translations!inner(name)
      `)
      .eq('category_translations.language_code', languageCode);

    if (error) return { error: error.message };
    if (!result) return { error: "Can't read categories" };

    // Transform to match expected format
    const transformedResult = result.map(item => ({
      id: item.id,
      parentID: item.parent_id,
      name: item.category_translations[0]?.name || '',
      url: item.url,
      iconSize: item.icon_size,
      iconUrl: item.icon_url,
    }));

    return { res: convertToJson(transformedResult) };
  } catch {
    return { error: "Cant read Category Groups" };
  }
};

export const addCategory = async (data: TAddCategory) => {
  if (!AddCategory.safeParse(data).success) return { error: "Invalid Data!" };

  try {
    const supabase = createSupabaseServer();
    const { data: result, error } = await supabase
      .from('categories')
      .insert({
        parent_id: data.parentID,
        name: data.name,
        url: data.url,
        icon_size: [...data.iconSize],
        icon_url: data.iconUrl,
      })
      .select()
      .single();

    if (error) return { error: error.message };
    if (!result) return { error: "cant add to database" };
    return { res: result };
  } catch (error) {
    return { error: JSON.stringify(error) };
  }
};

export const updateCategory = async (data: TUpdateCategory) => {
  if (!UpdateCategory.safeParse(data).success) return { error: "Data is no valid" };

  const { id, iconSize, ...values } = data;

  try {
    const supabase = createSupabaseServer();
    const { data: result, error } = await supabase
      .from('categories')
      .update({
        icon_size: [...iconSize],
        ...values,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) return { error: error.message };
    if (result) return { res: result };
    return { error: "Can't update it" };
  } catch (error) {
    return {
      error: JSON.stringify(error),
    };
  }
};

export const deleteCategory = async (id: string) => {
  if (!id) return { error: "Can't delete it!" };

  try {
    const supabase = createSupabaseServer();
    const { data: hasParent, error: checkError } = await supabase
      .from('categories')
      .select('id')
      .eq('parent_id', id)
      .limit(1);

    if (checkError) return { error: checkError.message };
    
    if (!hasParent || hasParent.length === 0) {
      const { data: result, error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id)
        .select()
        .single();

      if (error) return { error: error.message };
      if (!result) return { error: "Can't delete it!" };
      return { res: JSON.stringify(result) };
    }
    return { error: "It has child!" };
  } catch {
    return { error: "Can't delete it!" };
  }
};
