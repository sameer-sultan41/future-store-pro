-- Supabase Database Schema
-- Converted from Prisma MongoDB schema to PostgreSQL

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Categories table
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    url VARCHAR(255) NOT NULL,
    icon_url TEXT,
    icon_size INTEGER[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Option sets table
CREATE TABLE option_sets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    options JSONB NOT NULL, -- Array of {name, value} objects
    type VARCHAR(20) NOT NULL CHECK (type IN ('TEXT', 'COLOR')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Category option sets junction table
CREATE TABLE category_option_sets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    option_id UUID NOT NULL REFERENCES option_sets(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(option_id, category_id)
);

-- Specification groups table
CREATE TABLE spec_groups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    specs TEXT[] NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Category spec groups junction table
CREATE TABLE category_spec_groups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    spec_group_id UUID NOT NULL REFERENCES spec_groups(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(spec_group_id, category_id)
);

-- Brands table
CREATE TABLE brands (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products table
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    is_available BOOLEAN DEFAULT true,
    description TEXT,
    special_features TEXT[],
    images TEXT[],
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
    option_sets UUID[],
    price DECIMAL(10,2) NOT NULL,
    sale_price DECIMAL(10,2),
    specs JSONB, -- Array of {specGroupID, specValues} objects
    brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE RESTRICT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Page visits table
CREATE TABLE page_visits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    page_type VARCHAR(20) NOT NULL CHECK (page_type IN ('MAIN', 'LIST', 'PRODUCT')),
    page_path TEXT,
    device_resolution TEXT,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users table (Supabase auth.users is extended)
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    email_verified TIMESTAMP WITH TIME ZONE,
    image TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: settings

CREATE TABLE IF NOT EXISTS settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    common JSONB NOT NULL DEFAULT '{
        "pageSize": 9,
        "isMaintenanceMode": false,
        "freeShippingMinPrice": 0,
        "defaultTheme": "light",
        "defaultColor": "blue"
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
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Ensure unique constraints for nested JSON fields if needed
-- Example: Ensure unique URL in carousels
-- ALTER TABLE settings ADD CONSTRAINT unique_carousel_url UNIQUE ((carousels->>'url'));

-- Add additional constraints or indexes as necessary

-- Indexes for better performance
CREATE INDEX idx_categories_parent_id ON categories(parent_id);
CREATE INDEX idx_categories_url ON categories(url);
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_brand_id ON products(brand_id);
CREATE INDEX idx_products_is_available ON products(is_available);
CREATE INDEX idx_page_visits_product_id ON page_visits(product_id);
CREATE INDEX idx_page_visits_time ON page_visits(time);

-- Row Level Security (RLS) policies
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE option_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE category_option_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE spec_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE category_spec_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Public read access for store data
CREATE POLICY "Public read access for categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public read access for option_sets" ON option_sets FOR SELECT USING (true);
CREATE POLICY "Public read access for category_option_sets" ON category_option_sets FOR SELECT USING (true);
CREATE POLICY "Public read access for spec_groups" ON spec_groups FOR SELECT USING (true);
CREATE POLICY "Public read access for category_spec_groups" ON category_spec_groups FOR SELECT USING (true);
CREATE POLICY "Public read access for brands" ON brands FOR SELECT USING (true);
CREATE POLICY "Public read access for products" ON products FOR SELECT USING (true);
CREATE POLICY "Public read access for settings" ON settings FOR SELECT USING (true);

-- Admin full access (authenticated users)
CREATE POLICY "Admin full access for categories" ON categories FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access for option_sets" ON option_sets FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access for category_option_sets" ON category_option_sets FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access for spec_groups" ON spec_groups FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access for category_spec_groups" ON category_spec_groups FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access for brands" ON brands FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access for products" ON products FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access for page_visits" ON page_visits FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access for settings" ON settings FOR ALL USING (auth.role() = 'authenticated');

-- User profile policies
CREATE POLICY "Users can view own profile" ON user_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, name, email, email_verified)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'name', NEW.email, NEW.email_confirmed_at);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
