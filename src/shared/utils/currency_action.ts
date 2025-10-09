"use server";

import { createSupabaseServer } from "@/shared/lib/supabaseClient";
import { Currency } from "./type";


export const getAllCurrencies = async () => {
  try {
    const supabase = createSupabaseServer();
    const { data, error } = await supabase
      .from('currencies')
      .select('*')
      .eq('is_active', true);

    if (error) return { error: error.message };
    return { res: data as Currency[] };
  } catch (error) {
    return { error: JSON.stringify(error) };
  }
};

export const convertPrice = (priceInUSD: number, currency: Currency): number => {
  return priceInUSD / currency.exchange_rate_to_usd;
};

export const updateExchangeRates = async () => {
  // Call external API to update rates
  // This should be run as a cron job
  try {
    // Example: fetch from exchangerate-api.com
    const response = await fetch(`https://api.exchangerate-api.com/v4/latest/USD`);
    const data = await response.json();
    
    const supabase = createSupabaseServer();
    
    // Update PKR
    await supabase
      .from('currencies')
      .update({ 
        exchange_rate_to_usd: 1 / data.rates.PKR,
        updated_at: new Date().toISOString()
      })
      .eq('code', 'PKR');
    
    // Update AED
    await supabase
      .from('currencies')
      .update({ 
        exchange_rate_to_usd: 1 / data.rates.AED,
        updated_at: new Date().toISOString()
      })
      .eq('code', 'AED');

    return { success: true };
  } catch (error) {
    return { error: JSON.stringify(error) };
  }
};