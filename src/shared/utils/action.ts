"use server";

import { createSupabaseServer } from "@/shared/lib/supabaseClient";
import { Language } from "@/shared/types/database";

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