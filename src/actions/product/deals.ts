"use server";

import { createSupabaseServer } from "@/shared/lib/supabaseClient";

export const getTodayDeals = async (locale: string = "en") => {
  const supabase = createSupabaseServer();
  try {
    const { data, error } = await supabase
      .from("flash_deals")
      .select(`
        id,
        name,
        end_date,
        flash_deal_products (
          deal_price,
          product:products (
            id,
            url,
            images,
            product_translations!inner (
              language_code,
              name,
              description
            ),
            product_variants (
              price_adjustment
            )
          )
        )
      `)
    //   .eq("is_active", true)
    //   .gt("end_date", new Date().toISOString())
      .eq("flash_deal_products.product.product_translations.language_code", locale);
    // Only the requested translation is returned
    return { data, error };
  } catch (error) {
    return { data: null, error: "Can't fetch today's deals" };
  }
}
