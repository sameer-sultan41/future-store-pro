export type Language = {
  code: string;
  name: string;
  native_name: string;
  is_rtl: boolean;
  is_active: boolean;
};



export type ProductVariant = {
  id: string;
  product_id: string;
  sku: string;
  price_adjustment: number;
  stock_quantity: number;
  is_available: boolean;
  variant_options: {
    variant_type: string;
    value: string;
    display_value: string;
    color_hex?: string;
  }[];
};

export type FlashDeal = {
  id: string;
  name: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
};

export type Order = {
  id: string;
  order_number: string;
  user_id: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  subtotal: number;
  tax: number;
  shipping_cost: number;
  discount_amount: number;
  total_amount: number;
  currency_code: string;
  tracking_number?: string;
  created_at: string;
};

export type DashboardStats = {
  total_revenue: number;
  total_orders: number;
  pending_orders: number;
  avg_order_value: number;
  today_revenue: number;
  month_revenue: number;
};