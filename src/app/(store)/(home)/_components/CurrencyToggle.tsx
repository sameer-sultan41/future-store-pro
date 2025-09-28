import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DollarSign, Check } from 'lucide-react';
import { useState } from 'react';

// Currency Toggle Component
export function CurrencyToggle() {
  const currencies = [
    { code: 'USD', label: 'US Dollar' },
    { code: 'PKR', label: 'Pakistani Rupee' },
    { code: 'AED', label: 'UAE Dirham' },
  ];

  const [currentCurrency, setCurrentCurrency] = useState('USD');

  const handleCurrencyChange = (code: string) => {
    setCurrentCurrency(code);
    console.log(`Currency changed to: ${code}`);
    // Add logic to update the currency preference
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger >
        <Button variant="outline">
          <DollarSign className="h-4 w-4" /> {currentCurrency}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuLabel>Choose Currency</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {currencies.map((currency) => (
          <DropdownMenuItem
            key={currency.code}
            onClick={() => handleCurrencyChange(currency.code)}
            className="flex items-center justify-between"
          >
            {currency.label}
            {currentCurrency === currency.code && <Check className="h-4 w-4 text-green-500" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
