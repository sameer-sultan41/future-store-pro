"use server";

import { createSupabaseServer } from "@/shared/lib/supabaseClient";
import { unstable_cache } from "next/cache";
import { cookies } from "next/headers";
import { Currency, Language } from "./type";


const supabase = createSupabaseServer();

export async function setCurrency(currency: Currency) {
  const cookieStore = await cookies();
  cookieStore.set("currency", JSON.stringify(currency), {
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    sameSite: "lax",
  });
}


// Helper to get currency code from cookies
export const getCurrency = unstable_cache(async () => {
  const { data: currencyData, error: currencyError } = await supabase
    .from("currencies")
    .select("*");

  return { currencyData, currencyError };
}, ["currencies"]);

export const getLanguages = unstable_cache(async () => {

let { data: languages, error } = await supabase
  .from('languages')
  .select('*');

  return { languages: languages as Language[], error };
}, ["languages"]);


export const getCurrencyFromCookie = async () => {
  const cookieStore = await cookies();
  const currencyCookie = cookieStore.get("currency")?.value;
  if (!currencyCookie) return null;
  try {
    return JSON.parse(currencyCookie) as Currency;
  } catch {
    return null;
  }
}
