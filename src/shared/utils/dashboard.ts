"use server";

import { createSupabaseServer } from "@/shared/lib/supabaseClient";

export const getDashboardStats = async () => {
  try {
    const supabase = createSupabaseServer();
    const { data, error } = await supabase
      .from('dashboard_overview')
      .select('*')
      .single();

    if (error) return { error: error.message };
    return { res: data };
  } catch (error) {
    return { error: JSON.stringify(error) };
  }
};

export const getTopSellingProducts = async (limit: number = 10) => {
  try {
    const supabase = createSupabaseServer();
    const { data, error } = await supabase
      .from('top_selling_products')
      .select('*')
      .limit(limit);

    if (error) return { error: error.message };
    return { res: data };
  } catch (error) {
    return { error: JSON.stringify(error) };
  }
};

export const getRevenueByDay = async (days: number = 30) => {
  try {
    const supabase = createSupabaseServer();
    const { data, error } = await supabase
      .from('revenue_by_day')
      .select('*')
      .limit(days);

    if (error) return { error: error.message };
    return { res: data };
  } catch (error) {
    return { error: JSON.stringify(error) };
  }
};

export const getLowStockProducts = async () => {
  try {
    const supabase = createSupabaseServer();
    const { data, error } = await supabase
      .from('low_stock_products')
      .select('*');

    if (error) return { error: error.message };
    return { res: data };
  } catch (error) {
    return { error: JSON.stringify(error) };
  }
};