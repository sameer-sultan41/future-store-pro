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
        discount_value,
        end_date,
        flash_deal_products (
          deal_price,
          product:products (
            id,
            url,
            price,
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
      .eq("is_active", true)
      .gt("end_date", new Date().toISOString())
      .eq("flash_deal_products.product.product_translations.language_code", locale);
    // Only the requested translation is returned
    return { data: data as FlashDeal[] | null, error: error ? error.message ?? String(error) : null };
  } catch (error) {
    return { data: null, error: "Can't fetch today's deals" };
  }
}


// Types for getTodayDeals response

export interface ProductTranslation {
  language_code: string;
  name: string;
  description: string;
}

export interface ProductVariant {
  price_adjustment: number;
}

export interface Product {
  id: string;
  url: string;
  base_price: number;
  images: string[];
  product_translations: ProductTranslation[];
  product_variants: ProductVariant[];
}

export interface FlashDealProduct {
  deal_price: number;
  product: Product;
}

export interface FlashDeal {
  id: string;
  name: string;
  end_date: string;
  discount_value: number;
  flash_deal_products: FlashDealProduct[];
}

export interface GetTodayDealsResponse {
  data: FlashDeal[] | null;
  error: string | null;
}
