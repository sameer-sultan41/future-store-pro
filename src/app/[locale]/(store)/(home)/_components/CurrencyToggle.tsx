import { Currency, getCurrency, getCurrencyFromCookie, setCurrency } from "@/actions/server";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DollarSign, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

// Currency Toggle Component
export function CurrencyToggle({ currency }: { currency: Currency }) {
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentCurrency, setCurrentCurrency] = useState( "PKR");
  const router = useRouter();

  useEffect(() => {
    async function fetchCurrencies() {
      try {
        const response = await getCurrency();

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

  // Fetch currency from cookie
  useEffect(() => {
    const getCurrency = async () => {};
    getCurrency();
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
          <DollarSign className="h-4 w-4" /> {currentCurrency}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Choose Currency</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {loading ? (
          <DropdownMenuItem disabled>Loading...</DropdownMenuItem>
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
