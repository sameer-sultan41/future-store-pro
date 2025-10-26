"use server";
import { createSupabaseServer } from "@/supabase/server";

// Get upcoming products with product details
export const getUpcomingProducts = async (locale: string = "en") => {
  try {
    const supabase = await createSupabaseServer();
    
    const { data, error } = await supabase
      .from("upcoming_products")
      .select(`
        id,
        product_id,
        launch_date,
        is_notifiable,
        notification_sent,
        created_at,
        products!upcoming_products_product_id_fkey (
          id,
          sku,
          url,
          images,
          category_id,
          categories:category_id (
            id,
            url
          ),
          product_translations!inner (
            language_code,
            name,
            description,
            short_description
          )
        )
      `)
      .eq("products.product_translations.language_code", locale)
      .gte("launch_date", new Date().toISOString())
      .order("launch_date", { ascending: true });

    if (error) {
      console.error("Error fetching upcoming products:", error);
      return null;
    }


    return data;
  } catch (error) {
    console.error("Error fetching upcoming products:", error);
    return null;
  }
};
