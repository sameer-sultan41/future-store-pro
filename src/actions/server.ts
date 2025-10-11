"use server";

import { createSupabaseServer } from "@/shared/lib/supabaseClient";
import { cookies } from "next/headers";


export type Currency = {
  code: string;
  symbol: string;
  exchange_rate_to_usd: number;
  name: string; // Add label if used in your map
  isActive: Boolean;
};


 const supabase = createSupabaseServer();

export async function setCurrency(currency: Currency) {
  cookies().set("currency", JSON.stringify(currency), {
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    sameSite: "lax",
  });
}

// // Function to get currency from cookie
// export function newsSave() {
//   console.log("first")
//   // const currencyCookie = cookies().get("currency")?.value;
//   // if (!currencyCookie) return null;
//   // try {
//   //   return JSON.parse(currencyCookie) as Currency;
//   // } catch {
//   //   return null;
//   // }
// }

// Helper to get currency code from cookies
export async function getCurrency() {

  // 1. Get exchange rate for selected currency
  const { data: currencyData, error: currencyError } = await supabase
    .from("currencies")
    .select("*")

return { currencyData, currencyError };
}


export const getCurrencyFromCookie = () => {
   const currencyCookie = cookies().get("currency")?.value;
  if (!currencyCookie) return null;
  try {
    return JSON.parse(currencyCookie) as Currency;
  } catch {
    return null;
  }
}
