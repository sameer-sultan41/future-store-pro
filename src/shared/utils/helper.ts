import { Currency } from "@/actions/type";



  // Convert price using exchange rate if currency is set and not USD
 export const getConvertedPrice = (currency: Currency | null, price: number) => {
    if (!currency) return price;
    if (currency.code !== "USD" && currency.exchange_rate_to_usd) {
      return price / currency.exchange_rate_to_usd;
    }
    return price;
  };