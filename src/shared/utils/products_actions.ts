"use server";

import { createSupabaseServer } from "@/shared/lib/supabaseClient";
import { ProductVariant } from "@/shared/utils/type";

export const getProductVariants = async (productId: string) => {
  try {
    const supabase = createSupabaseServer();
    const { data, error } = await supabase
      .from('product_variants')
      .select(`
        *,
        product_variant_options (
          variant_option:variant_options (
            value,
            display_value,
            color_hex,
            variant_type:variant_types (
              name,
              display_type
            )
          )
        )
      `)
      .eq('product_id', productId)
      .eq('is_available', true);

    if (error) return { error: error.message };
    return { res: data };
  } catch (error) {
    return { error: JSON.stringify(error) };
  }
};

export const addProductVariant = async (variant: {
  product_id: string;
  sku: string;
  price_adjustment: number;
  stock_quantity: number;
  variant_option_ids: string[];
}) => {
  try {
    const supabase = createSupabaseServer();
    
    // Insert variant
    const { data: newVariant, error: variantError } = await supabase
      .from('product_variants')
      .insert({
        product_id: variant.product_id,
        sku: variant.sku,
        price_adjustment: variant.price_adjustment,
        stock_quantity: variant.stock_quantity,
      })
      .select()
      .single();

    if (variantError) return { error: variantError.message };

    // Link variant options
    const variantOptions = variant.variant_option_ids.map(optionId => ({
      product_variant_id: newVariant.id,
      variant_option_id: optionId,
    }));

    const { error: linkError } = await supabase
      .from('product_variant_options')
      .insert(variantOptions);

    if (linkError) return { error: linkError.message };

    return { res: newVariant };
  } catch (error) {
    return { error: JSON.stringify(error) };
  }
};