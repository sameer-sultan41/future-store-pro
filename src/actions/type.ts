export type Currency = {
  code: string;
  symbol: string;
  exchange_rate_to_usd: number;
  name: string; // Add label if used in your map
  isActive: Boolean;
};

export interface Language {
  code: string;
  name: string;
  native_name: string;
  is_rtl: boolean;
  is_active: boolean;
  created_at: string;
}