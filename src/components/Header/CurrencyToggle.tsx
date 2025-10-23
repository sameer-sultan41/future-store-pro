import { getCurrency, getCurrencyFromCookie, setCurrency } from "@/actions/server";
import { Currency } from "@/actions/type";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DollarSign, Check, LoaderCircle } from "lucide-react";
import { useState, useEffect } from "react";

// Currency Toggle Component
export function CurrencyToggle() {
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentCurrency, setCurrentCurrency] = useState("PKR");

  useEffect(() => {
    async function fetchCurrencies() {
      try {
        const response = await getCurrency();
        const currency = await getCurrencyFromCookie();
        setCurrentCurrency(currency?.code || "PKR");

        console.log("data from getCurrency", response);
        if (response && response.currencyData) {
          setCurrencies(response.currencyData);
        } else {
          setCurrencies([]);
        }
      } catch (error) {
        console.error("Failed to fetch currencies:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchCurrencies();
  }, []);

  const handleCurrencyChange = async (currency: Currency) => {
    setCurrentCurrency(currency.code);
    await setCurrency(currency);
    window.location.reload();
    // Add logic to update the currency preference
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant="outline">
          {loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <DollarSign className="h-4 w-4" />}{" "}
          {currentCurrency}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Choose Currency</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {loading ? (
          <DropdownMenuItem disabled>
            <LoaderCircle className="h-4 w-4 animate-spin" /> Loading...
          </DropdownMenuItem>
        ) : (
          currencies.map((currency) => (
            <DropdownMenuItem
              key={currency.code}
              onClick={() => handleCurrencyChange(currency)}
              className="flex items-center justify-between"
            >
              ( {currency.symbol} ) {currency.name}
              {currentCurrency === currency.code && <Check className="h-4 w-4 text-green-500" />}
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
