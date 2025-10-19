"use server";
import { z } from "zod";


import { TBrand } from "@/shared/types";
import { createSupabaseServer } from "@/supabase/server";
import { Brands } from "./type";

const ValidateUpdateBrand = z.object({
  id: z.string().min(6),
  name: z.string().min(3),
});

export const addBrand = async (brandName: string) => {
  if (!brandName || brandName === "") return { error: "Invalid Data!" };

  try {
    const supabase = await createSupabaseServer();
    const { data: result, error } = await supabase
      .from('brands')
      .insert({
        name: brandName,
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

export const getAllBrands = async () => {
  try {
    const supabase = await createSupabaseServer();
  
let { data: result, error } = await supabase
  .from('brands')
  .select('*')
          

    if (error) return { error: error.message };
    if (!result) return { error: "Can't Get Data from Database!" };
    return { res: result as Brands[] };
  } catch (error) {
    return { error: JSON.stringify(error) };
  }
};

export const deleteBrand = async (brandID: string) => {
  if (!brandID || brandID === "") return { error: "Invalid Data!" };
  try {
    const supabase = createSupabaseServer();
    const { data: result, error } = await supabase
      .from('brands')
      .delete()
      .eq('id', brandID)
      .select()
      .single();

    if (error) return { error: error.message };
    if (!result) return { error: "Can't Delete!" };
    return { res: result };
  } catch (error) {
    return { error: JSON.stringify(error) };
  }
};

export const updateBrand = async (data: TBrand) => {
  if (!ValidateUpdateBrand.safeParse(data).success) return { error: "Invalid Data!" };

  try {
    const supabase = createSupabaseServer();
    const { data: result, error } = await supabase
      .from('brands')
      .update({
        name: data.name,
      })
      .eq('id', data.id)
      .select()
      .single();

    if (error) return { error: error.message };
    if (!result) return { error: "Can't Update!" };
    return { res: result };
  } catch (error) {
    return { error: JSON.stringify(error) };
  }
};
