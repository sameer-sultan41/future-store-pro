-- =====================================================
-- COMPLETE E-COMMERCE SCHEMA WITH ALL FEATURES
-- =====================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For text search

-- =====================================================
-- 1. INTERNATIONALIZATION TABLES
-- =====================================================

-- Languages table
CREATE TABLE languages (
    code VARCHAR(5) PRIMARY KEY, -- 'en', 'ur', 'ar'
    name VARCHAR(50) NOT NULL,
    native_name VARCHAR(50) NOT NULL,
    is_rtl BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default languages
INSERT INTO languages (code, name, native_name, is_rtl, is_active) VALUES
('en', 'English', 'English', false, true),
('ur', 'Urdu', 'اردو', true, true),
('ar', 'Arabic', 'العربية', true, true);

-- Currencies table
CREATE TABLE currencies (
    code VARCHAR(3) PRIMARY KEY, -- 'USD', 'PKR', 'AED'
    name VARCHAR(50) NOT NULL,
    symbol VARCHAR(10) NOT NULL,
    exchange_rate_to_usd DECIMAL(10, 4) NOT NULL DEFAULT 1.0,
    is_active BOOLEAN DEFAULT true,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default currencies
INSERT INTO currencies (code, name, symbol, exchange_rate_to_usd, is_active) VALUES
('USD', 'US Dollar', '$', 1.0000, true),
('PKR', 'Pakistani Rupee', '₨', 0.0036, true), -- Example rate
('AED', 'UAE Dirham', 'د.إ', 0.2722, true); -- Example rate

-- =====================================================
-- 2. CATEGORIES (MULTILINGUAL)
-- =====================================================

CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    url VARCHAR(255) NOT NULL UNIQUE,
    icon_url TEXT,
    icon_size INTEGER[],
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Category translations
CREATE TABLE category_translations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    language_code VARCHAR(5) NOT NULL REFERENCES languages(code),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    meta_title VARCHAR(255),
    meta_description TEXT,
    UNIQUE(category_id, language_code)
);

-- =====================================================
-- 3. BRANDS
-- =====================================================

CREATE TABLE brands (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) UNIQUE NOT NULL,
    logo_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 4. PRODUCTS (MULTILINGUAL WITH VARIANTS)
-- =====================================================

CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sku VARCHAR(100) UNIQUE NOT NULL,
    url VARCHAR(255) NOT NULL UNIQUE,
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
    brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE RESTRICT,
    base_price DECIMAL(10,2) NOT NULL, -- Price in USD
    is_available BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    stock_quantity INTEGER DEFAULT 0,
    low_stock_threshold INTEGER DEFAULT 10,
    weight DECIMAL(10,2), -- in kg
    images TEXT[], -- Array of image URLs
    sort_order INTEGER DEFAULT 0,
    view_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Product translations
CREATE TABLE product_translations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    language_code VARCHAR(5) NOT NULL REFERENCES languages(code),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    short_description TEXT,
    special_features TEXT[],
    meta_title VARCHAR(255),
    meta_description TEXT,
    UNIQUE(product_id, language_code)
);

-- =====================================================
-- 5. PRODUCT VARIANTS (COLOR, SIZE, ETC.)
-- =====================================================

-- Variant types (color, size, material, etc.)
CREATE TABLE variant_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) NOT NULL UNIQUE, -- 'color', 'size', 'material'
    display_type VARCHAR(20) DEFAULT 'text', -- 'text', 'color', 'image'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Variant options (red, blue, S, M, L, etc.)
CREATE TABLE variant_options (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    variant_type_id UUID NOT NULL REFERENCES variant_types(id) ON DELETE CASCADE,
    value VARCHAR(100) NOT NULL, -- 'red', 'blue', 'S', 'M', 'L'
    display_value VARCHAR(100), -- For display (can be translated)
    color_hex VARCHAR(7), -- For color variants
    image_url TEXT, -- For image variants
    UNIQUE(variant_type_id, value)
);

-- Product variant combinations
CREATE TABLE product_variants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    sku VARCHAR(100) UNIQUE NOT NULL,
    price_adjustment DECIMAL(10,2) DEFAULT 0, -- Added to base price
    stock_quantity INTEGER DEFAULT 0,
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Link variants to their options
CREATE TABLE product_variant_options (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_variant_id UUID NOT NULL REFERENCES product_variants(id) ON DELETE CASCADE,
    variant_option_id UUID NOT NULL REFERENCES variant_options(id) ON DELETE CASCADE,
    UNIQUE(product_variant_id, variant_option_id)
);

-- =====================================================
-- 6. FLASH DEALS / PROMOTIONS
-- =====================================================

CREATE TABLE flash_deals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    discount_type VARCHAR(20) NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
    discount_value DECIMAL(10,2) NOT NULL,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    is_active BOOLEAN DEFAULT true,
    max_uses INTEGER, -- NULL for unlimited
    current_uses INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products in flash deals
CREATE TABLE flash_deal_products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    flash_deal_id UUID NOT NULL REFERENCES flash_deals(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    deal_price DECIMAL(10,2), -- Calculated price after discount
    stock_limit INTEGER, -- Limited stock for deal
    UNIQUE(flash_deal_id, product_id)
);

-- =====================================================
-- 7. UPCOMING PRODUCTS
-- =====================================================

CREATE TABLE upcoming_products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    launch_date TIMESTAMP WITH TIME ZONE NOT NULL,
    is_notifiable BOOLEAN DEFAULT true, -- Users can request notifications
    notification_sent BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User notifications for upcoming products
CREATE TABLE upcoming_product_notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    upcoming_product_id UUID NOT NULL REFERENCES upcoming_products(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    notified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(upcoming_product_id, user_id)
);

-- =====================================================
-- 8. USER PROFILES
-- =====================================================

CREATE TABLE user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name VARCHAR(255),
    phone VARCHAR(20),
    avatar_url TEXT,
    preferred_language VARCHAR(5) REFERENCES languages(code) DEFAULT 'en',
    preferred_currency VARCHAR(3) REFERENCES currencies(code) DEFAULT 'USD',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User addresses
CREATE TABLE user_addresses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    address_type VARCHAR(20) CHECK (address_type IN ('billing', 'shipping')),
    is_default BOOLEAN DEFAULT false,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    address_line1 VARCHAR(255) NOT NULL,
    address_line2 VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 9. SHOPPING CART
-- =====================================================

CREATE TABLE cart_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    product_variant_id UUID REFERENCES product_variants(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, product_id, product_variant_id)
);

-- =====================================================
-- 10. ORDERS & CHECKOUT
-- =====================================================

CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number VARCHAR(50) UNIQUE NOT NULL,
    user_id UUID NOT NULL REFERENCES auth.users(id),
    
    -- Status tracking
    status VARCHAR(20) NOT NULL DEFAULT 'pending' 
        CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')),
    
    -- Pricing
    subtotal DECIMAL(10,2) NOT NULL,
    tax DECIMAL(10,2) DEFAULT 0,
    shipping_cost DECIMAL(10,2) DEFAULT 0,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL,
    currency_code VARCHAR(3) NOT NULL REFERENCES currencies(code),
    
    -- Shipping info
    shipping_address_id UUID REFERENCES user_addresses(id),
    shipping_method VARCHAR(50),
    tracking_number VARCHAR(100),
    
    -- Payment info
    payment_method VARCHAR(50) NOT NULL,
    payment_status VARCHAR(20) DEFAULT 'pending' 
        CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
    paid_at TIMESTAMP WITH TIME ZONE,
    
    -- Notes
    customer_notes TEXT,
    admin_notes TEXT,
    
    -- Timestamps
    confirmed_at TIMESTAMP WITH TIME ZONE,
    shipped_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    cancelled_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order items
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id),
    product_variant_id UUID REFERENCES product_variants(id),
    
    -- Snapshot of product at time of order
    product_name VARCHAR(255) NOT NULL,
    product_sku VARCHAR(100) NOT NULL,
    variant_details JSONB, -- Store variant info
    
    -- Pricing
    unit_price DECIMAL(10,2) NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    subtotal DECIMAL(10,2) NOT NULL,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order status history
CREATE TABLE order_status_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL,
    notes TEXT,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 11. REVIEWS & RATINGS
-- =====================================================

CREATE TABLE product_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    order_id UUID REFERENCES orders(id), -- Verified purchase
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(255),
    comment TEXT,
    is_verified_purchase BOOLEAN DEFAULT false,
    is_approved BOOLEAN DEFAULT false,
    helpful_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(product_id, user_id, order_id)
);

-- =====================================================
-- 12. ANALYTICS & REPORTING
-- =====================================================

-- Product views tracking
CREATE TABLE product_views (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id),
    session_id VARCHAR(255),
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Page visits (your existing table - enhanced)
CREATE TABLE page_visits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    page_type VARCHAR(20) NOT NULL CHECK (page_type IN ('MAIN', 'LIST', 'PRODUCT', 'CHECKOUT', 'OTHER')),
    page_path TEXT,
    device_resolution TEXT,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    user_id UUID REFERENCES auth.users(id),
    session_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 13. SETTINGS (Enhanced)
-- =====================================================

CREATE TABLE settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    common JSONB NOT NULL DEFAULT '{
        "pageSize": 12,
        "isMaintenanceMode": false,
        "freeShippingMinPrice": 50,
        "defaultTheme": "light",
        "defaultColor": "blue",
        "taxRate": 0.0,
        "lowStockThreshold": 10
    }',
    site JSONB NOT NULL,
    carousels JSONB NOT NULL,
    available_languages JSONB NOT NULL,
    default_language TEXT NOT NULL,
    available_currencies JSONB NOT NULL,
    default_currency TEXT NOT NULL,
    available_payment_methods JSONB NOT NULL,
    default_payment_method TEXT NOT NULL,
    available_delivery_dates JSONB NOT NULL,
    default_delivery_date TEXT NOT NULL,
    shipping_zones JSONB, -- Shipping costs by zone
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Categories
CREATE INDEX idx_categories_parent_id ON categories(parent_id);
CREATE INDEX idx_categories_url ON categories(url);
CREATE INDEX idx_categories_is_active ON categories(is_active);
CREATE INDEX idx_category_translations_category_id ON category_translations(category_id);
CREATE INDEX idx_category_translations_language ON category_translations(language_code);

-- Products
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_brand_id ON products(brand_id);
CREATE INDEX idx_products_is_available ON products(is_available);
CREATE INDEX idx_products_is_featured ON products(is_featured);
CREATE INDEX idx_products_url ON products(url);
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_product_translations_product_id ON product_translations(product_id);
CREATE INDEX idx_product_translations_language ON product_translations(language_code);

-- Product variants
CREATE INDEX idx_product_variants_product_id ON product_variants(product_id);
CREATE INDEX idx_product_variant_options_variant_id ON product_variant_options(product_variant_id);

-- Flash deals
CREATE INDEX idx_flash_deals_active ON flash_deals(is_active, start_date, end_date);
CREATE INDEX idx_flash_deal_products_deal_id ON flash_deal_products(flash_deal_id);
CREATE INDEX idx_flash_deal_products_product_id ON flash_deal_products(product_id);

-- Orders
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_orders_order_number ON orders(order_number);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);

-- Reviews
CREATE INDEX idx_product_reviews_product_id ON product_reviews(product_id);
CREATE INDEX idx_product_reviews_user_id ON product_reviews(user_id);
CREATE INDEX idx_product_reviews_approved ON product_reviews(is_approved);

-- Analytics
CREATE INDEX idx_product_views_product_id ON product_views(product_id);
CREATE INDEX idx_product_views_created_at ON product_views(created_at DESC);
CREATE INDEX idx_page_visits_time ON page_visits(time DESC);

-- =====================================================
-- ROW LEVEL SECURITY POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE languages ENABLE ROW LEVEL SECURITY;
ALTER TABLE currencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE category_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE variant_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE variant_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variant_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE flash_deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE flash_deal_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE upcoming_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE upcoming_product_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Public read access policies
CREATE POLICY "Public read languages" ON languages FOR SELECT USING (is_active = true);
CREATE POLICY "Public read currencies" ON currencies FOR SELECT USING (is_active = true);
CREATE POLICY "Public read categories" ON categories FOR SELECT USING (is_active = true);
CREATE POLICY "Public read category_translations" ON category_translations FOR SELECT USING (true);
CREATE POLICY "Public read brands" ON brands FOR SELECT USING (is_active = true);
CREATE POLICY "Public read products" ON products FOR SELECT USING (is_available = true);
CREATE POLICY "Public read product_translations" ON product_translations FOR SELECT USING (true);
CREATE POLICY "Public read variant_types" ON variant_types FOR SELECT USING (true);
CREATE POLICY "Public read variant_options" ON variant_options FOR SELECT USING (true);
CREATE POLICY "Public read product_variants" ON product_variants FOR SELECT USING (is_available = true);
CREATE POLICY "Public read product_variant_options" ON product_variant_options FOR SELECT USING (true);
CREATE POLICY "Public read active flash_deals" ON flash_deals FOR SELECT USING (is_active = true AND NOW() BETWEEN start_date AND end_date);
CREATE POLICY "Public read flash_deal_products" ON flash_deal_products FOR SELECT USING (true);
CREATE POLICY "Public read upcoming_products" ON upcoming_products FOR SELECT USING (true);
CREATE POLICY "Public read approved reviews" ON product_reviews FOR SELECT USING (is_approved = true);
CREATE POLICY "Public read settings" ON settings FOR SELECT USING (true);

-- User-specific policies
CREATE POLICY "Users manage own profile" ON user_profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "Users manage own addresses" ON user_addresses FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own cart" ON cart_items FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users view own orders" ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users view own order items" ON order_items FOR SELECT USING (
    EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
);
CREATE POLICY "Users manage own reviews" ON product_reviews FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage upcoming notifications" ON upcoming_product_notifications FOR ALL USING (auth.uid() = user_id);

-- Admin policies (for authenticated admins)
CREATE POLICY "Admins full access categories" ON categories FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admins full access category_translations" ON category_translations FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admins full access brands" ON brands FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admins full access products" ON products FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admins full access product_translations" ON product_translations FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admins full access variants" ON product_variants FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admins full access flash_deals" ON flash_deals FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admins full access orders" ON orders FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admins full access reviews" ON product_reviews FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admins full access settings" ON settings FOR ALL USING (auth.role() = 'authenticated');

-- =====================================================
-- FUNCTIONS & TRIGGERS
-- =====================================================

-- Function to create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, full_name, preferred_language, preferred_currency)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name'),
    'en',
    'USD'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update product stock after order
CREATE OR REPLACE FUNCTION update_product_stock_after_order()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.payment_status = 'paid' AND (OLD.payment_status IS NULL OR OLD.payment_status != 'paid') THEN
    -- Update stock for each order item
    UPDATE products p
    SET stock_quantity = p.stock_quantity - oi.quantity,
        updated_at = NOW()
    FROM order_items oi
    WHERE oi.order_id = NEW.id 
      AND oi.product_id = p.id
      AND oi.product_variant_id IS NULL;
    
    -- Update variant stock
    UPDATE product_variants pv
    SET stock_quantity = pv.stock_quantity - oi.quantity,
        updated_at = NOW()
    FROM order_items oi
    WHERE oi.order_id = NEW.id 
      AND oi.product_variant_id = pv.id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_stock_after_payment
  AFTER UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_product_stock_after_order();

-- Function to generate order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.order_number := 'ORD-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(nextval('order_number_seq')::TEXT, 6, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE SEQUENCE order_number_seq;

CREATE TRIGGER trigger_generate_order_number
  BEFORE INSERT ON orders
  FOR EACH ROW
  EXECUTE FUNCTION generate_order_number();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to relevant tables
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- VIEWS FOR ANALYTICS
-- =====================================================

-- Dashboard overview
CREATE OR REPLACE VIEW dashboard_overview AS
SELECT
    -- Total revenue (confirmed + processing + shipped + delivered orders)
    COALESCE(SUM(CASE WHEN status IN ('confirmed', 'processing', 'shipped', 'delivered') THEN total_amount ELSE 0 END), 0) as total_revenue,
    
    -- Total orders
    COUNT(*) as total_orders,
    
    -- Pending orders
    SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_orders,
    
    -- Average order value
    COALESCE(AVG(CASE WHEN status IN ('confirmed', 'processing', 'shipped', 'delivered') THEN total_amount END), 0) as avg_order_value,
    
    -- Today's revenue
    COALESCE(SUM(CASE WHEN status IN ('confirmed', 'processing', 'shipped', 'delivered') 
                      AND DATE(created_at) = CURRENT_DATE THEN total_amount ELSE 0 END), 0) as today_revenue,
    
    -- This month's revenue
    COALESCE(SUM(CASE WHEN status IN ('confirmed', 'processing', 'shipped', 'delivered') 
                      AND DATE_TRUNC('month', created_at) = DATE_TRUNC('month', CURRENT_DATE) 
                      THEN total_amount ELSE 0 END), 0) as month_revenue
FROM orders;

-- Top selling products
CREATE OR REPLACE VIEW top_selling_products AS
SELECT 
    p.id,
    pt.name,
    p.sku,
    p.images[1] as image_url,
    SUM(oi.quantity) as total_sold,
    SUM(oi.subtotal) as total_revenue,
    COUNT(DISTINCT oi.order_id) as order_count
FROM products p
JOIN product_translations pt ON p.id = pt.product_id AND pt.language_code = 'en'
JOIN order_items oi ON p.id = oi.product_id
JOIN orders o ON oi.order_id = o.id
WHERE o.status IN ('confirmed', 'processing', 'shipped', 'delivered')
GROUP BY p.id, pt.name, p.sku, p.images
ORDER BY total_sold DESC
LIMIT 10;

-- Low stock products
CREATE OR REPLACE VIEW low_stock_products AS
SELECT 
    p.id,
    pt.name,
    p.sku,
    p.stock_quantity,
    p.low_stock_threshold
FROM products p
JOIN product_translations pt ON p.id = pt.product_id AND pt.language_code = 'en'
WHERE p.stock_quantity <= p.low_stock_threshold
    AND p.is_available = true
ORDER BY p.stock_quantity ASC;

-- Revenue by day (last 30 days)
CREATE OR REPLACE VIEW revenue_by_day AS
SELECT 
    DATE(created_at) as date,
    COUNT(*) as order_count,
    SUM(total_amount) as revenue
FROM orders
WHERE status IN ('confirmed', 'processing', 'shipped', 'delivered')
    AND created_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY DATE(created_at)
ORDER BY date DESC;