"use server";

import { createSupabaseServer } from "@/shared/lib/supabaseClient";
import { Order } from "@/shared/types/database";

export const createOrder = async (orderData: {
  user_id: string;
  items: { product_id: string; product_variant_id?: string; quantity: number }[];
  shipping_address_id: string;
  payment_method: string;
  currency_code: string;
}) => {
  try {
    const supabase = createSupabaseServer();
    
    // Calculate totals
    let subtotal = 0;
    const orderItems = [];
    
    for (const item of orderData.items) {
      // Get product price
      const { data: product } = await supabase
        .from('products')
        .select('base_price, product_translations!inner(name)')
        .eq('id', item.product_id)
        .single();
      
      let unitPrice = product.base_price;
      
      // Check for variant price adjustment
      if (item.product_variant_id) {
        const { data: variant } = await supabase
          .from('product_variants')
          .select('price_adjustment')
          .eq('id', item.product_variant_id)
          .single();
        
        unitPrice += variant.price_adjustment;
      }
      
      const itemSubtotal = unitPrice * item.quantity;
      subtotal += itemSubtotal;
      
      orderItems.push({
        product_id: item.product_id,
        product_variant_id: item.product_variant_id,
        product_name: product.product_translations[0].name,
        product_sku: product.sku,
        unit_price: unitPrice,
        quantity: item.quantity,
        subtotal: itemSubtotal,
      });
    }
    
    const tax = subtotal * 0.0; // Calculate based on your tax rules
    const shipping_cost = subtotal >= 50 ? 0 : 10; // Free shipping over $50
    const total_amount = subtotal + tax + shipping_cost;
    
    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: orderData.user_id,
        subtotal,
        tax,
        shipping_cost,
        total_amount,
        currency_code: orderData.currency_code,
        shipping_address_id: orderData.shipping_address_id,
        payment_method: orderData.payment_method,
        status: 'pending',
        payment_status: 'pending',
      })
      .select()
      .single();

    if (orderError) return { error: orderError.message };

    // Create order items
    const itemsWithOrderId = orderItems.map(item => ({
      ...item,
      order_id: order.id,
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(itemsWithOrderId);

    if (itemsError) return { error: itemsError.message };

    // Clear cart
    await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', orderData.user_id);

    return { res: order };
  } catch (error) {
    return { error: JSON.stringify(error) };
  }
};

export const getUserOrders = async (userId: string) => {
  try {
    const supabase = createSupabaseServer();
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          product:products (
            id,
            images,
            product_translations!inner (
              name
            )
          )
        ),
        shipping_address:user_addresses!shipping_address_id (
          *
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) return { error: error.message };
    return { res: data };
  } catch (error) {
    return { error: JSON.stringify(error) };
  }
};

export const updateOrderStatus = async (orderId: string, status: Order['status'], notes?: string) => {
  try {
    const supabase = createSupabaseServer();
    
    // Update order status
    const { error: updateError } = await supabase
      .from('orders')
      .update({ 
        status,
        [`${status}_at`]: new Date().toISOString(),
      })
      .eq('id', orderId);

    if (updateError) return { error: updateError.message };

    // Add to status history
    const { error: historyError } = await supabase
      .from('order_status_history')
      .insert({
        order_id: orderId,
        status,
        notes,
      });

    if (historyError) return { error: historyError.message };

    return { success: true };
  } catch (error) {
    return { error: JSON.stringify(error) };
  }
};