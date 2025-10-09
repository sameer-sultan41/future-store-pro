"use server";

import { createSupabaseServer } from "@/shared/lib/supabaseClient";


export const getActiveFlashDeals = async () => {
  try {
    const supabase = createSupabaseServer();
    const now = new Date().toISOString();
    
    const { data, error } = await supabase
      .from('flash_deals')
      .select(`
        *,
        flash_deal_products (
          *,
          product:products (
            *,
            product_translations!inner (
              name,
              short_description
            )
          )
        )
      `)
      .eq('is_active', true)
      .lte('start_date', now)
      .gte('end_date', now);

    if (error) return { error: error.message };
    return { res: data };
  } catch (error) {
    return { error: JSON.stringify(error) };
  }
};

export const createFlashDeal = async (deal: {
  name: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  start_date: string;
  end_date: string;
  product_ids: string[];
}) => {
  try {
    const supabase = createSupabaseServer();
    
    // Create flash deal
    const { data: newDeal, error: dealError } = await supabase
      .from('flash_deals')
      .insert({
        name: deal.name,
        discount_type: deal.discount_type,
        discount_value: deal.discount_value,
        start_date: deal.start_date,
        end_date: deal.end_date,
      })
      .select()
      .single();

    if (dealError) return { error: dealError.message };

    // Add products to deal
    const dealProducts = deal.product_ids.map(productId => ({
      flash_deal_id: newDeal.id,
      product_id: productId,
    }));

    const { error: productsError } = await supabase
      .from('flash_deal_products')
      .insert(dealProducts);

    if (productsError) return { error: productsError.message };

    return { res: newDeal };
  } catch (error) {
    return { error: JSON.stringify(error) };
  }
};