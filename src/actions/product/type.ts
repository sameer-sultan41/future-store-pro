/** ------------------------------------------------------------------
 *  Primitives & shared enums
 *  ------------------------------------------------------------------ */

export type UUID = string;           // Postgres uuid
export type ISODateString = string;  // timestamptz (e.g., "2025-10-26T12:34:56.000Z")

export type DiscountType = 'percentage' | 'fixed';

/** When using Supabase default fetch behavior, numeric columns come back as strings */
export type PgNumeric = string;

/** ------------------------------------------------------------------
 *  products
 *  ------------------------------------------------------------------ */

export interface ProductRow {
  id: UUID;
  sku: string;
  url: string;
  category_id: UUID;
  brand_id: UUID;
  price: PgNumeric;                 // numeric(10,2) -> string (e.g., "299.99")
  is_available: boolean | null;
  is_featured: boolean | null;
  stock_quantity: number | null;
  low_stock_threshold: number | null;
  weight: PgNumeric | null;         // numeric(10,2)
  images: string[] | null;
  sort_order: number | null;
  view_count: number | null;
  created_at: ISODateString | null;
  updated_at: ISODateString | null;
  cost_price: PgNumeric | null;     // numeric(10,2)
  specs: Record<string, unknown> | null; // jsonb
}

/** ------------------------------------------------------------------
 *  flash_deals
 *  ------------------------------------------------------------------ */

export interface FlashDealRow {
  id: UUID;
  name: string;
  discount_type: DiscountType;
  discount_value: PgNumeric;        // numeric(10,2)
  start_date: ISODateString;
  end_date: ISODateString;
  is_active: boolean | null;
  max_uses: number | null;
  current_uses: number | null;
  created_at: ISODateString | null;
}

/** ------------------------------------------------------------------
 *  flash_deal_products (junction)
 *  ------------------------------------------------------------------ */

export interface FlashDealProductRow {
  id: UUID;
  flash_deal_id: UUID;
  product_id: UUID;
  deal_price: PgNumeric | null;     // explicit deal price overrides discount_type/value
  stock_limit: number | null;
}

/** ------------------------------------------------------------------
 *  Relation-friendly shapes for supabase .select() results
 *  ------------------------------------------------------------------ */

/** flash_deal_products with its FlashDeal embedded */
export interface FlashDealProductWithDeal extends FlashDealProductRow {
  flash_deals?: FlashDealRow | null;   // when you select ... flash_deals(...)
}

/** Product with array of flash_deal_products (each possibly having its flash_deals) */
export interface ProductWithDeals extends ProductRow {
  flash_deal_products?: FlashDealProductWithDeal[] | null;
}

/** If you also include translations/variants in your select, extend this */
export interface ProductFull extends ProductWithDeals {
  product_translations?: Array<{
    language_code: string;
    name: string;
    description: string | null;
    short_description: string | null;
    specs: Record<string, unknown> | null;
    special_features: unknown[] | null;
  }> | null;

  product_variants?: Array<{
    id: UUID;
    sku: string;
    price_adjustment: PgNumeric | null;
    stock_quantity: number | null;
    is_available: boolean | null;
    product_variant_options?: Array<{
      variant_option_id: UUID;
      variant_options?: {
        value: string;
        display_value: string | null;
        color_hex: string | null;
        image_url: string | null;
        variant_types?: {
          name: string;
          display_type: string | null;
        } | null;
      } | null;
    }> | null;
  }> | null;
}

/** ------------------------------------------------------------------
 *  Helpers
 *  ------------------------------------------------------------------ */

/**
 * Pick the best (current) flash deal row for a product.
 * You can pre-filter (is_active + window) in SQL and then just pick the first.
 */
export function pickActiveDeal(p: ProductWithDeals, now = new Date()): FlashDealProductWithDeal | null {
  const deals = p.flash_deal_products ?? [];
  if (!deals.length) return null;

  const nowMs = now.getTime();
  const valid = deals.filter(d => {
    const fd = d.flash_deals;
    if (!fd || fd.is_active === false) return false;
    const start = new Date(fd.start_date).getTime();
    const end = new Date(fd.end_date).getTime();
    return nowMs >= start && nowMs <= end;
  });

  if (!valid.length) return null;

  // Prefer the most recent started deal
  valid.sort((a, b) => {
    const as = a.flash_deals ? new Date(a.flash_deals.start_date).getTime() : 0;
    const bs = b.flash_deals ? new Date(b.flash_deals.start_date).getTime() : 0;
    return bs - as;
  });

  return valid[0];
}

/**
 * Compute effective price at product level given an active deal.
 * Supply numbers (parseFloat) if your numeric columns are strings.
 */
export function computeEffectivePrice(
  basePrice: number,
  deal: FlashDealProductWithDeal | null
): number {
  if (!deal) return basePrice;

  if (deal.deal_price != null) {
    return parseFloat(deal.deal_price as string);
  }

  const fd = deal.flash_deals;
  if (!fd) return basePrice;

  const discountValue = parseFloat(fd.discount_value as string);

  if (fd.discount_type === 'percentage') {
    return Math.max(0, (basePrice * (100 - discountValue)) / 100);
  }
  // 'fixed'
  return Math.max(0, basePrice - discountValue);
}