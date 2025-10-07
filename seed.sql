-- =====================================================
-- SEED DATA FOR E-COMMERCE DATABASE
-- =====================================================

-- Note: Languages and Currencies are already seeded in the main schema

-- =====================================================
-- 1. BRANDS (10 records)
-- =====================================================

INSERT INTO brands (name, logo_url, is_active) VALUES
('Apple', 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=200', true),
('Samsung', 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=200', true),
('Nike', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200', true),
('Adidas', 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=200', true),
('Sony', 'https://images.unsplash.com/photo-1527698266440-12104e498b76?w=200', true),
('LG', 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=200', true),
('Dell', 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=200', true),
('HP', 'https://images.unsplash.com/photo-1527689368864-3a821dbccc34?w=200', true),
('Zara', 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=200', true),
('H&M', 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200', true);

-- =====================================================
-- 2. CATEGORIES (10+ records with subcategories)
-- =====================================================

-- Main Categories
INSERT INTO categories (id, parent_id, url, icon_url, sort_order, is_active) VALUES
('11111111-1111-1111-1111-111111111111', NULL, 'electronics', 'https://api.iconify.design/mdi:laptop.svg', 1, true),
('22222222-2222-2222-2222-222222222222', NULL, 'fashion', 'https://api.iconify.design/mdi:tshirt-crew.svg', 2, true),
('33333333-3333-3333-3333-333333333333', NULL, 'home-kitchen', 'https://api.iconify.design/mdi:home.svg', 3, true),
('44444444-4444-4444-4444-444444444444', NULL, 'sports-outdoors', 'https://api.iconify.design/mdi:basketball.svg', 4, true),
('55555555-5555-5555-5555-555555555555', NULL, 'beauty-health', 'https://api.iconify.design/mdi:heart.svg', 5, true);

-- Subcategories
INSERT INTO categories (id, parent_id, url, icon_url, sort_order, is_active) VALUES
-- Electronics subcategories
('11111111-1111-1111-1111-111111111112', '11111111-1111-1111-1111-111111111111', 'electronics/smartphones', NULL, 1, true),
('11111111-1111-1111-1111-111111111113', '11111111-1111-1111-1111-111111111111', 'electronics/laptops', NULL, 2, true),
('11111111-1111-1111-1111-111111111114', '11111111-1111-1111-1111-111111111111', 'electronics/headphones', NULL, 3, true),
('11111111-1111-1111-1111-111111111115', '11111111-1111-1111-1111-111111111111', 'electronics/cameras', NULL, 4, true),

-- Fashion subcategories
('22222222-2222-2222-2222-222222222223', '22222222-2222-2222-2222-222222222222', 'fashion/mens-clothing', NULL, 1, true),
('22222222-2222-2222-2222-222222222224', '22222222-2222-2222-2222-222222222222', 'fashion/womens-clothing', NULL, 2, true),
('22222222-2222-2222-2222-222222222225', '22222222-2222-2222-2222-222222222222', 'fashion/shoes', NULL, 3, true),
('22222222-2222-2222-2222-222222222226', '22222222-2222-2222-2222-222222222222', 'fashion/accessories', NULL, 4, true),

-- Home & Kitchen subcategories
('33333333-3333-3333-3333-333333333334', '33333333-3333-3333-3333-333333333333', 'home-kitchen/furniture', NULL, 1, true),
('33333333-3333-3333-3333-333333333335', '33333333-3333-3333-3333-333333333333', 'home-kitchen/appliances', NULL, 2, true);

-- Category Translations
INSERT INTO category_translations (category_id, language_code, name, description, meta_title, meta_description) VALUES
-- Main Categories - English
('11111111-1111-1111-1111-111111111111', 'en', 'Electronics', 'Latest electronics and gadgets', 'Electronics | FutureStore', 'Shop the latest electronics, smartphones, laptops, and tech accessories'),
('22222222-2222-2222-2222-222222222222', 'en', 'Fashion', 'Trendy clothing and accessories', 'Fashion | FutureStore', 'Discover the latest fashion trends for men and women'),
('33333333-3333-3333-3333-333333333333', 'en', 'Home & Kitchen', 'Everything for your home', 'Home & Kitchen | FutureStore', 'Shop furniture, appliances, and home essentials'),
('44444444-4444-4444-4444-444444444444', 'en', 'Sports & Outdoors', 'Sports equipment and outdoor gear', 'Sports | FutureStore', 'Get fit with our sports and outdoor equipment'),
('55555555-5555-5555-5555-555555555555', 'en', 'Beauty & Health', 'Beauty and wellness products', 'Beauty & Health | FutureStore', 'Shop beauty products and health essentials'),

-- Main Categories - Urdu
('11111111-1111-1111-1111-111111111111', 'ur', 'الیکٹرانکس', 'جدید الیکٹرانکس اور گیجٹس', 'الیکٹرانکس | فیوچر اسٹور', 'تازہ ترین الیکٹرانکس، سمارٹ فونز، لیپ ٹاپس خریدیں'),
('22222222-2222-2222-2222-222222222222', 'ur', 'فیشن', 'جدید لباس اور لوازمات', 'فیشن | فیوچر اسٹور', 'مردوں اور عورتوں کے لیے جدید فیشن'),
('33333333-3333-3333-3333-333333333333', 'ur', 'گھر اور باورچی خانہ', 'آپ کے گھر کے لیے ہر چیز', 'گھر اور باورچی خانہ | فیوچر اسٹور', 'فرنیچر، آلات اور گھریلو ضروریات'),
('44444444-4444-4444-4444-444444444444', 'ur', 'کھیل اور باہری', 'کھیلوں کا سامان اور باہری سامان', 'کھیل | فیوچر اسٹور', 'کھیلوں اور باہری سامان کے ساتھ فٹ رہیں'),
('55555555-5555-5555-5555-555555555555', 'ur', 'خوبصورتی اور صحت', 'خوبصورتی اور صحت کی مصنوعات', 'خوبصورتی | فیوچر اسٹور', 'خوبصورتی اور صحت کی مصنوعات'),

-- Main Categories - Arabic
('11111111-1111-1111-1111-111111111111', 'ar', 'إلكترونيات', 'أحدث الإلكترونيات والأدوات', 'إلكترونيات | متجر المستقبل', 'تسوق أحدث الإلكترونيات والهواتف الذكية وأجهزة الكمبيوتر'),
('22222222-2222-2222-2222-222222222222', 'ar', 'أزياء', 'ملابس وإكسسوارات عصرية', 'أزياء | متجر المستقبل', 'اكتشف أحدث صيحات الموضة للرجال والنساء'),
('33333333-3333-3333-3333-333333333333', 'ar', 'المنزل والمطبخ', 'كل شيء لمنزلك', 'المنزل | متجر المستقبل', 'تسوق الأثاث والأجهزة ومستلزمات المنزل'),
('44444444-4444-4444-4444-444444444444', 'ar', 'الرياضة والهواء الطلق', 'معدات رياضية وأدوات خارجية', 'رياضة | متجر المستقبل', 'احصل على اللياقة مع معداتنا الرياضية'),
('55555555-5555-5555-5555-555555555555', 'ar', 'الجمال والصحة', 'منتجات التجميل والعافية', 'الجمال | متجر المستقبل', 'تسوق منتجات التجميل والصحة'),

-- Subcategories - English
('11111111-1111-1111-1111-111111111112', 'en', 'Smartphones', 'Latest smartphones and accessories', 'Smartphones | FutureStore', 'Shop latest smartphones from top brands'),
('11111111-1111-1111-1111-111111111113', 'en', 'Laptops', 'Powerful laptops for work and gaming', 'Laptops | FutureStore', 'Find the perfect laptop for your needs'),
('11111111-1111-1111-1111-111111111114', 'en', 'Headphones', 'Premium audio experience', 'Headphones | FutureStore', 'Discover premium headphones and earbuds'),
('11111111-1111-1111-1111-111111111115', 'en', 'Cameras', 'Capture every moment', 'Cameras | FutureStore', 'Professional and consumer cameras'),
('22222222-2222-2222-2222-222222222223', 'en', 'Mens Clothing', 'Stylish clothing for men', 'Mens Fashion | FutureStore', 'Shop mens shirts, pants, and more'),
('22222222-2222-2222-2222-222222222224', 'en', 'Womens Clothing', 'Trendy womens fashion', 'Womens Fashion | FutureStore', 'Discover dresses, tops, and more'),
('22222222-2222-2222-2222-222222222225', 'en', 'Shoes', 'Footwear for every occasion', 'Shoes | FutureStore', 'Find your perfect pair of shoes'),
('22222222-2222-2222-2222-222222222226', 'en', 'Accessories', 'Complete your look', 'Accessories | FutureStore', 'Browse bags, watches, and jewelry'),
('33333333-3333-3333-3333-333333333334', 'en', 'Furniture', 'Stylish home furniture', 'Furniture | FutureStore', 'Transform your space with our furniture'),
('33333333-3333-3333-3333-333333333335', 'en', 'Appliances', 'Kitchen and home appliances', 'Appliances | FutureStore', 'Modern appliances for your home'),

-- Subcategories - Urdu
('11111111-1111-1111-1111-111111111112', 'ur', 'سمارٹ فونز', 'تازہ ترین سمارٹ فونز', 'سمارٹ فونز | فیوچر اسٹور', 'اعلیٰ برانڈز کے تازہ ترین سمارٹ فونز'),
('11111111-1111-1111-1111-111111111113', 'ur', 'لیپ ٹاپ', 'کام اور گیمنگ کے لیے طاقتور لیپ ٹاپ', 'لیپ ٹاپ | فیوچر اسٹور', 'اپنی ضروریات کے لیے بہترین لیپ ٹاپ'),
('11111111-1111-1111-1111-111111111114', 'ur', 'ہیڈفونز', 'پریمیم آڈیو تجربہ', 'ہیڈفونز | فیوچر اسٹور', 'پریمیم ہیڈفونز اور ایئر بڈز'),

-- Subcategories - Arabic
('11111111-1111-1111-1111-111111111112', 'ar', 'هواتف ذكية', 'أحدث الهواتف الذكية', 'هواتف | متجر المستقبل', 'تسوق أحدث الهواتف الذكية'),
('11111111-1111-1111-1111-111111111113', 'ar', 'أجهزة كمبيوتر محمولة', 'أجهزة قوية للعمل والألعاب', 'كمبيوتر | متجر المستقبل', 'اعثر على الكمبيوتر المحمول المثالي');

-- =====================================================
-- 3. VARIANT TYPES & OPTIONS
-- =====================================================

-- First, insert variant types if they don't exist
INSERT INTO variant_types (name, display_type) VALUES
('color', 'color'),
('size', 'text'),
('material', 'text')
ON CONFLICT (name) DO NOTHING;

-- Get variant type IDs and insert options
DO $$
DECLARE
    color_type_id UUID;
    size_type_id UUID;
    material_type_id UUID;
BEGIN
    -- Get type IDs
    SELECT id INTO color_type_id FROM variant_types WHERE name = 'color';
    SELECT id INTO size_type_id FROM variant_types WHERE name = 'size';
    SELECT id INTO material_type_id FROM variant_types WHERE name = 'material';

    -- Color options
    INSERT INTO variant_options (variant_type_id, value, display_value, color_hex) VALUES
    (color_type_id, 'black', 'Black', '#000000'),
    (color_type_id, 'white', 'White', '#FFFFFF'),
    (color_type_id, 'red', 'Red', '#FF0000'),
    (color_type_id, 'blue', 'Blue', '#0000FF'),
    (color_type_id, 'green', 'Green', '#00FF00'),
    (color_type_id, 'navy', 'Navy', '#000080'),
    (color_type_id, 'gray', 'Gray', '#808080'),
    (color_type_id, 'pink', 'Pink', '#FFC0CB'),
    (color_type_id, 'gold', 'Gold', '#FFD700'),
    (color_type_id, 'silver', 'Silver', '#C0C0C0');

    -- Size options
    INSERT INTO variant_options (variant_type_id, value, display_value) VALUES
    (size_type_id, 'XS', 'Extra Small'),
    (size_type_id, 'S', 'Small'),
    (size_type_id, 'M', 'Medium'),
    (size_type_id, 'L', 'Large'),
    (size_type_id, 'XL', 'Extra Large'),
    (size_type_id, 'XXL', '2X Large'),
    (size_type_id, '32GB', '32 GB'),
    (size_type_id, '64GB', '64 GB'),
    (size_type_id, '128GB', '128 GB'),
    (size_type_id, '256GB', '256 GB'),
    (size_type_id, '512GB', '512 GB');

    -- Material options
    INSERT INTO variant_options (variant_type_id, value, display_value) VALUES
    (material_type_id, 'cotton', 'Cotton'),
    (material_type_id, 'polyester', 'Polyester'),
    (material_type_id, 'leather', 'Leather'),
    (material_type_id, 'plastic', 'Plastic'),
    (material_type_id, 'metal', 'Metal');
END $$;

-- =====================================================
-- 4. PRODUCTS (20+ records across categories)
-- =====================================================

DO $$
DECLARE
    brand_apple_id UUID;
    brand_samsung_id UUID;
    brand_nike_id UUID;
    brand_sony_id UUID;
    brand_dell_id UUID;
    cat_smartphones_id UUID := '11111111-1111-1111-1111-111111111112';
    cat_laptops_id UUID := '11111111-1111-1111-1111-111111111113';
    cat_headphones_id UUID := '11111111-1111-1111-1111-111111111114';
    cat_mens_clothing_id UUID := '22222222-2222-2222-2222-222222222223';
    cat_shoes_id UUID := '22222222-2222-2222-2222-222222222225';
BEGIN
    -- Get brand IDs
    SELECT id INTO brand_apple_id FROM brands WHERE name = 'Apple';
    SELECT id INTO brand_samsung_id FROM brands WHERE name = 'Samsung';
    SELECT id INTO brand_nike_id FROM brands WHERE name = 'Nike';
    SELECT id INTO brand_sony_id FROM brands WHERE name = 'Sony';
    SELECT id INTO brand_dell_id FROM brands WHERE name = 'Dell';

    -- Insert Products
    INSERT INTO products (id, sku, url, category_id, brand_id, base_price, is_available, is_featured, stock_quantity, weight, images) VALUES
    -- Smartphones
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'APL-IPH15-PRO', 'iphone-15-pro', cat_smartphones_id, brand_apple_id, 999.99, true, true, 50, 0.2, 
     ARRAY['https://images.unsplash.com/photo-1592286927505-c0d6f6f53584?w=800', 'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=800']),
    
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'SAM-S24-ULT', 'samsung-galaxy-s24-ultra', cat_smartphones_id, brand_samsung_id, 1199.99, true, true, 45, 0.23, 
     ARRAY['https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800', 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800']),
    
    ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'APL-IPH14', 'iphone-14', cat_smartphones_id, brand_apple_id, 799.99, true, false, 75, 0.19, 
     ARRAY['https://images.unsplash.com/photo-1678652197831-2d180705cd2c?w=800']),
    
    ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'SAM-A54', 'samsung-galaxy-a54', cat_smartphones_id, brand_samsung_id, 449.99, true, false, 100, 0.2, 
     ARRAY['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800']),

    -- Laptops
    ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'APL-MBP-M3', 'macbook-pro-m3', cat_laptops_id, brand_apple_id, 1999.99, true, true, 30, 1.5, 
     ARRAY['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800', 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800']),
    
    ('ffffffff-ffff-ffff-ffff-ffffffffffff', 'DEL-XPS-15', 'dell-xps-15', cat_laptops_id, brand_dell_id, 1599.99, true, true, 25, 1.8, 
     ARRAY['https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800']),
    
    ('abcdefab-cdef-abcd-efab-cdefabcdefab', 'DEL-INS-14', 'dell-inspiron-14', cat_laptops_id, brand_dell_id, 699.99, true, false, 40, 1.6, 
     ARRAY['https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=800']),

    -- Headphones
    ('feedface-feed-face-feed-facefeedface', 'SON-WH1000XM5', 'sony-wh-1000xm5', cat_headphones_id, brand_sony_id, 399.99, true, true, 60, 0.3, 
     ARRAY['https://images.unsplash.com/photo-1545127398-14699f92334b?w=800', 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800']),
    
    ('deadbeef-dead-beef-dead-beefdeadbeef', 'APL-AIRPODS-PRO', 'airpods-pro-2', cat_headphones_id, brand_apple_id, 249.99, true, true, 80, 0.05, 
     ARRAY['https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=800']),
    
    ('baadf00d-baad-f00d-baad-f00dbaadf00d', 'SON-WF1000XM4', 'sony-wf-1000xm4', cat_headphones_id, brand_sony_id, 279.99, true, false, 55, 0.04, 
     ARRAY['https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800']),

    -- Mens Clothing
    ('c0ffee00-c0ff-ee00-c0ff-ee00c0ffee00', 'NIK-MENS-TEE', 'nike-mens-tshirt', cat_mens_clothing_id, brand_nike_id, 29.99, true, false, 200, 0.2, 
     ARRAY['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800', 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800']),
    
    ('f00dbabe-f00d-babe-f00d-babef00dbabe', 'NIK-HOODIE', 'nike-mens-hoodie', cat_mens_clothing_id, brand_nike_id, 59.99, true, false, 150, 0.5, 
     ARRAY['https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800']),

    -- Shoes
    ('facefeed-face-feed-face-feedfacefeed', 'NIK-AIR-MAX', 'nike-air-max-90', cat_shoes_id, brand_nike_id, 129.99, true, true, 120, 0.8, 
     ARRAY['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800', 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=800']),
    
    ('beefcafe-beef-cafe-beef-cafebeefcafe', 'NIK-AIR-JORDAN', 'nike-air-jordan-1', cat_shoes_id, brand_nike_id, 169.99, true, true, 90, 0.85, 
     ARRAY['https://images.unsplash.com/photo-1556906781-9a412961c28c?w=800']);

END $$;

-- Product Translations
INSERT INTO product_translations (product_id, language_code, name, description, short_description, special_features, meta_title, meta_description) VALUES
-- iPhone 15 Pro - English
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'en', 'iPhone 15 Pro', 
 'The iPhone 15 Pro is the most advanced iPhone ever. Featuring a stunning titanium design, A17 Pro chip, and Pro camera system with 5x optical zoom.',
 'Advanced titanium design with A17 Pro chip',
 ARRAY['Titanium Design', 'A17 Pro Chip', '5x Optical Zoom', 'ProMotion Display', 'All-Day Battery'],
 'iPhone 15 Pro - Buy Now | FutureStore',
 'Shop the new iPhone 15 Pro with titanium design and A17 Pro chip. Available in multiple colors and storage options.'),

-- iPhone 15 Pro - Urdu
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'ur', 'آئی فون 15 پرو', 
 'آئی فون 15 پرو اب تک کا سب سے جدید آئی فون ہے۔ شاندار ٹائٹینیم ڈیزائن، A17 پرو چپ، اور 5x آپٹیکل زوم والا پرو کیمرہ سسٹم۔',
 'ٹائٹینیم ڈیزائن اور A17 پرو چپ',
 ARRAY['ٹائٹینیم ڈیزائن', 'A17 پرو چپ', '5x آپٹیکل زوم', 'پرو موشن ڈسپلے', 'پورے دن کی بیٹری'],
 'آئی فون 15 پرو - ابھی خریدیں | فیوچر اسٹور',
 'ٹائٹینیم ڈیزائن اور A17 پرو چپ کے ساتھ نیا آئی فون 15 پرو خریدیں'),

-- iPhone 15 Pro - Arabic
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'ar', 'آيفون 15 برو', 
 'آيفون 15 برو هو أكثر آيفون تطوراً على الإطلاق. يتميز بتصميم تيتانيوم مذهل، ومعالج A17 برو، ونظام كاميرا احترافي مع تكبير بصري 5x.',
 'تصميم تيتانيوم متقدم مع معالج A17 برو',
 ARRAY['تصميم تيتانيوم', 'معالج A17 برو', 'تكبير بصري 5x', 'شاشة ProMotion', 'بطارية تدوم طوال اليوم'],
 'آيفون 15 برو - اشتر الآن | متجر المستقبل',
 'تسوق آيفون 15 برو الجديد بتصميم التيتانيوم ومعالج A17 برو'),

-- Samsung S24 Ultra - English
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'en', 'Samsung Galaxy S24 Ultra',
 'Meet Galaxy AI. The power of Galaxy S24 Ultra unlocks whole new levels of creativity, productivity and possibility — starting with the most important subject, you.',
 'AI-powered smartphone with 200MP camera',
 ARRAY['Galaxy AI', '200MP Camera', 'S Pen Included', 'Snapdragon 8 Gen 3', '5000mAh Battery'],
 'Samsung Galaxy S24 Ultra | FutureStore',
 'Experience the future with Galaxy S24 Ultra. Advanced AI features and 200MP camera.'),

-- Samsung S24 Ultra - Urdu
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'ur', 'سام سنگ گلیکسی S24 الٹرا',
 'گلیکسی AI سے ملیں۔ Galaxy S24 Ultra کی طاقت تخلیقی صلاحیت، پیداواری صلاحیت اور امکانات کی مکمل نئی سطحوں کو کھولتی ہے',
 'AI سے چلنے والا سمارٹ فون 200MP کیمرے کے ساتھ',
 ARRAY['گلیکسی AI', '200MP کیمرہ', 'S Pen شامل', 'Snapdragon 8 Gen 3', '5000mAh بیٹری'],
 'سام سنگ گلیکسی S24 الٹرا | فیوچر اسٹور',
 'Galaxy S24 Ultra کے ساتھ مستقبل کا تجربہ کریں'),

-- MacBook Pro M3 - English
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'en', 'MacBook Pro M3',
 'Mind-blowing. Head-turning. The most advanced chips ever built for a personal computer. Supercharged M3 Pro and M3 Max processors.',
 'Professional laptop with M3 chip',
 ARRAY['M3 Pro/Max Chip', 'Liquid Retina XDR Display', '22-Hour Battery', 'Thunderbolt 4', 'MagSafe 3'],
 'MacBook Pro M3 - Professional Laptop | FutureStore',
 'Buy MacBook Pro with M3 chip. Perfect for creative professionals and developers.'),

-- MacBook Pro M3 - Urdu
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'ur', 'میک بک پرو M3',
 'دماغ اڑا دینے والا۔ سر موڑ دینے والا۔ ذاتی کمپیوٹر کے لیے بنائے گئے سب سے جدید چپس۔ سپر چارجڈ M3 پرو اور M3 میکس پروسیسرز۔',
 'M3 چپ کے ساتھ پیشہ ور لیپ ٹاپ',
 ARRAY['M3 پرو/میکس چپ', 'لیکوئڈ ریٹینا XDR ڈسپلے', '22 گھنٹے کی بیٹری', 'تھنڈربولٹ 4', 'میگ سیف 3'],
 'میک بک پرو M3 - پیشہ ور لیپ ٹاپ | فیوچر اسٹور',
 'M3 چپ کے ساتھ میک بک پرو خریدیں'),

-- Sony WH-1000XM5 - English
('feedface-feed-face-feed-facefeedface', 'en', 'Sony WH-1000XM5 Headphones',
 'Industry-leading noise canceling with the new Auto NC Optimizer. Crystal clear hands-free calling. Up to 30-hour battery life.',
 'Premium noise canceling headphones',
 ARRAY['Industry-Leading NC', '30-Hour Battery', 'Crystal Clear Calls', 'Multipoint Connection', 'Hi-Res Audio'],
 'Sony WH-1000XM5 - Best Noise Canceling | FutureStore',
 'Experience the best noise canceling with Sony WH-1000XM5 headphones.'),

-- Nike Air Max 90 - English
('facefeed-face-feed-face-feedfacefeed', 'en', 'Nike Air Max 90',
 'Nothing as fly, nothing as comfortable, nothing as proven. The Nike Air Max 90 stays true to its OG running roots.',
 'Classic running shoes with Air cushioning',
 ARRAY['Air Cushioning', 'Waffle Outsole', 'Padded Collar', 'Mesh Upper', 'Rubber Sole'],
 'Nike Air Max 90 - Classic Sneakers | FutureStore',
 'Shop the iconic Nike Air Max 90 sneakers. Available in multiple colors.'),

-- Nike Air Max 90 - Urdu
('facefeed-face-feed-face-feedfacefeed', 'ur', 'نائیک ایئر میکس 90',
 'کچھ بھی اتنا خوبصورت نہیں، کچھ بھی اتنا آرام دہ نہیں، کچھ بھی اتنا ثابت شدہ نہیں۔ Nike Air Max 90 اپنی OG رننگ جڑوں کے ساتھ سچا رہتا ہے۔',
 'ایئر کشننگ کے ساتھ کلاسک رننگ جوتے',
 ARRAY['ایئر کشننگ', 'وافل آؤٹ سول', 'پیڈڈ کالر', 'میش اپر', 'ربڑ کا تلوا'],
 'نائیک ایئر میکس 90 - کلاسک سنیکرز | فیوچر اسٹور',
 'مشہور Nike Air Max 90 سنیکرز خریدیں');

-- =====================================================
-- 5. PRODUCT VARIANTS
-- =====================================================

DO $$
DECLARE
    color_black_id UUID;
    color_white_id UUID;
    color_blue_id UUID;
    color_silver_id UUID;
    color_gold_id UUID;
    size_128gb_id UUID;
    size_256gb_id UUID;
    size_512gb_id UUID;
    size_m_id UUID;
    size_l_id UUID;
    size_xl_id UUID;
BEGIN
    -- Get variant option IDs
    SELECT id INTO color_black_id FROM variant_options WHERE value = 'black' AND variant_type_id = (SELECT id FROM variant_types WHERE name = 'color');
    SELECT id INTO color_white_id FROM variant_options WHERE value = 'white' AND variant_type_id = (SELECT id FROM variant_types WHERE name = 'color');
    SELECT id INTO color_blue_id FROM variant_options WHERE value = 'blue' AND variant_type_id = (SELECT id FROM variant_types WHERE name = 'color');
    SELECT id INTO color_silver_id FROM variant_options WHERE value = 'silver' AND variant_type_id = (SELECT id FROM variant_types WHERE name = 'color');
    SELECT id INTO color_gold_id FROM variant_options WHERE value = 'gold' AND variant_type_id = (SELECT id FROM variant_types WHERE name = 'color');
    SELECT id INTO size_128gb_id FROM variant_options WHERE value = '128GB';
    SELECT id INTO size_256gb_id FROM variant_options WHERE value = '256GB';
    SELECT id INTO size_512gb_id FROM variant_options WHERE value = '512GB';
    SELECT id INTO size_m_id FROM variant_options WHERE value = 'M';
    SELECT id INTO size_l_id FROM variant_options WHERE value = 'L';
    SELECT id INTO size_xl_id FROM variant_options WHERE value = 'XL';

    -- iPhone 15 Pro Variants
    INSERT INTO product_variants (id, product_id, sku, price_adjustment, stock_quantity, is_available) VALUES
    ('aa111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'APL-IPH15-PRO-128-BLK', 0, 20, true),
    ('aa111111-1111-1111-1111-111111111112', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'APL-IPH15-PRO-256-BLK', 100, 18, true),
    ('aa111111-1111-1111-1111-111111111113', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'APL-IPH15-PRO-512-BLK', 200, 12, true),
    ('aa111111-1111-1111-1111-111111111114', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'APL-IPH15-PRO-128-WHT', 0, 15, true),
    ('aa111111-1111-1111-1111-111111111115', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'APL-IPH15-PRO-256-WHT', 100, 14, true),
    ('aa111111-1111-1111-1111-111111111116', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'APL-IPH15-PRO-128-BLU', 0, 10, true);

    -- Link variants to options (iPhone 15 Pro - Black 128GB)
    INSERT INTO product_variant_options (product_variant_id, variant_option_id) VALUES
    ('aa111111-1111-1111-1111-111111111111', color_black_id),
    ('aa111111-1111-1111-1111-111111111111', size_128gb_id);

    -- iPhone 15 Pro - Black 256GB
    INSERT INTO product_variant_options (product_variant_id, variant_option_id) VALUES
    ('aa111111-1111-1111-1111-111111111112', color_black_id),
    ('aa111111-1111-1111-1111-111111111112', size_256gb_id);

    -- iPhone 15 Pro - Black 512GB
    INSERT INTO product_variant_options (product_variant_id, variant_option_id) VALUES
    ('aa111111-1111-1111-1111-111111111113', color_black_id),
    ('aa111111-1111-1111-1111-111111111113', size_512gb_id);

    -- iPhone 15 Pro - White 128GB
    INSERT INTO product_variant_options (product_variant_id, variant_option_id) VALUES
    ('aa111111-1111-1111-1111-111111111114', color_white_id),
    ('aa111111-1111-1111-1111-111111111114', size_128gb_id);

    -- iPhone 15 Pro - White 256GB
    INSERT INTO product_variant_options (product_variant_id, variant_option_id) VALUES
    ('aa111111-1111-1111-1111-111111111115', color_white_id),
    ('aa111111-1111-1111-1111-111111111115', size_256gb_id);

    -- iPhone 15 Pro - Blue 128GB
    INSERT INTO product_variant_options (product_variant_id, variant_option_id) VALUES
    ('aa111111-1111-1111-1111-111111111116', color_blue_id),
    ('aa111111-1111-1111-1111-111111111116', size_128gb_id);

    -- Nike T-Shirt Variants
    INSERT INTO product_variants (id, product_id, sku, price_adjustment, stock_quantity, is_available) VALUES
    ('bb111111-1111-1111-1111-111111111111', 'c0ffee00-c0ff-ee00-c0ff-ee00c0ffee00', 'NIK-MENS-TEE-M-BLK', 0, 50, true),
    ('bb111111-1111-1111-1111-111111111112', 'c0ffee00-c0ff-ee00-c0ff-ee00c0ffee00', 'NIK-MENS-TEE-L-BLK', 0, 45, true),
    ('bb111111-1111-1111-1111-111111111113', 'c0ffee00-c0ff-ee00-c0ff-ee00c0ffee00', 'NIK-MENS-TEE-XL-BLK', 2, 40, true),
    ('bb111111-1111-1111-1111-111111111114', 'c0ffee00-c0ff-ee00-c0ff-ee00c0ffee00', 'NIK-MENS-TEE-M-WHT', 0, 50, true);

    -- Link Nike T-Shirt variants
    INSERT INTO product_variant_options (product_variant_id, variant_option_id) VALUES
    ('bb111111-1111-1111-1111-111111111111', color_black_id),
    ('bb111111-1111-1111-1111-111111111111', size_m_id),
    ('bb111111-1111-1111-1111-111111111112', color_black_id),
    ('bb111111-1111-1111-1111-111111111112', size_l_id),
    ('bb111111-1111-1111-1111-111111111113', color_black_id),
    ('bb111111-1111-1111-1111-111111111113', size_xl_id),
    ('bb111111-1111-1111-1111-111111111114', color_white_id),
    ('bb111111-1111-1111-1111-111111111114', size_m_id);

END $$;

-- =====================================================
-- 6. FLASH DEALS
-- =====================================================

DO $$
DECLARE
    deal_id UUID;
BEGIN
    -- Black Friday Sale
    INSERT INTO flash_deals (id, name, discount_type, discount_value, start_date, end_date, is_active, max_uses) 
    VALUES 
    ('fd111111-1111-1111-1111-111111111111', 'Black Friday 2024', 'percentage', 20.00, 
     NOW() - INTERVAL '1 day', NOW() + INTERVAL '7 days', true, NULL)
    RETURNING id INTO deal_id;

    -- Add products to flash deal
    INSERT INTO flash_deal_products (flash_deal_id, product_id, deal_price, stock_limit) VALUES
    (deal_id, 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 799.99, 20),  -- iPhone 15 Pro
    (deal_id, 'feedface-feed-face-feed-facefeedface', 319.99, 30),  -- Sony Headphones
    (deal_id, 'facefeed-face-feed-face-feedfacefeed', 103.99, 50);  -- Nike Air Max

    -- Tech Week Sale
    INSERT INTO flash_deals (id, name, discount_type, discount_value, start_date, end_date, is_active, max_uses) 
    VALUES 
    ('fd222222-2222-2222-2222-222222222222', 'Tech Week Sale', 'percentage', 15.00, 
     NOW() - INTERVAL '2 days', NOW() + INTERVAL '5 days', true, NULL)
    RETURNING id INTO deal_id;

    INSERT INTO flash_deal_products (flash_deal_id, product_id, deal_price, stock_limit) VALUES
    (deal_id, 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 1699.99, 15),  -- MacBook Pro
    (deal_id, 'ffffffff-ffff-ffff-ffff-ffffffffffff', 1359.99, 10);  -- Dell XPS

    -- Fashion Sale
    INSERT INTO flash_deals (id, name, discount_type, discount_value, start_date, end_date, is_active, max_uses) 
    VALUES 
    ('fd333333-3333-3333-3333-333333333333', 'Fashion Clearance', 'fixed', 10.00, 
     NOW(), NOW() + INTERVAL '3 days', true, 100);

    -- Add products to fashion sale
    INSERT INTO flash_deal_products (flash_deal_id, product_id, deal_price, stock_limit) VALUES
    ('fd333333-3333-3333-3333-333333333333', 'c0ffee00-c0ff-ee00-c0ff-ee00c0ffee00', 19.99, NULL),
    ('fd333333-3333-3333-3333-333333333333', 'f00dbabe-f00d-babe-f00d-babef00dbabe', 49.99, NULL);
END $$;

-- =====================================================
-- 7. UPCOMING PRODUCTS
-- =====================================================

INSERT INTO products (id, sku, url, category_id, brand_id, base_price, is_available, is_featured, stock_quantity, weight, images) VALUES
('99999999-9999-9999-9999-999999999991', 'APL-IPH16-PRO', 'iphone-16-pro-upcoming', '11111111-1111-1111-1111-111111111112', (SELECT id FROM brands WHERE name = 'Apple'), 1099.99, false, true, 0, 0.2, 
 ARRAY['https://images.unsplash.com/photo-1592286927505-c0d6f6f53584?w=800']),

('99999999-9999-9999-9999-999999999992', 'SAM-S25-ULT', 'samsung-galaxy-s25-ultra-upcoming', '11111111-1111-1111-1111-111111111112', (SELECT id FROM brands WHERE name = 'Samsung'), 1299.99, false, true, 0, 0.23, 
 ARRAY['https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800']);

-- Product translations for upcoming products
INSERT INTO product_translations (product_id, language_code, name, description, short_description, special_features) VALUES
('99999999-9999-9999-9999-999999999991', 'en', 'iPhone 16 Pro (Coming Soon)',
 'The next generation of iPhone. Revolutionary AI features, advanced camera system, and all-new design.',
 'Next-gen iPhone with AI features',
 ARRAY['Advanced AI', 'New Camera System', 'Improved Battery', 'A18 Pro Chip', 'USB-C']),

('99999999-9999-9999-9999-999999999991', 'ur', 'آئی فون 16 پرو (جلد آرہا ہے)',
 'آئی فون کی اگلی نسل۔ انقلابی AI فیچرز، جدید کیمرہ سسٹم، اور بالکل نیا ڈیزائن۔',
 'AI فیچرز کے ساتھ نئی نسل کا آئی فون',
 ARRAY['جدید AI', 'نیا کیمرہ سسٹم', 'بہتر بیٹری', 'A18 پرو چپ', 'USB-C']),

('99999999-9999-9999-9999-999999999992', 'en', 'Samsung Galaxy S25 Ultra (Coming Soon)',
 'Experience the future of mobile technology. Enhanced Galaxy AI, 200MP camera with advanced zoom.',
 'Future flagship with enhanced AI',
 ARRAY['Enhanced Galaxy AI', '200MP Camera', 'Snapdragon 8 Gen 4', 'Larger Battery', 'S Pen Pro']);

-- Add to upcoming products table
INSERT INTO upcoming_products (product_id, launch_date, is_notifiable) VALUES
('99999999-9999-9999-9999-999999999991', NOW() + INTERVAL '30 days', true),
('99999999-9999-9999-9999-999999999992', NOW() + INTERVAL '45 days', true);

-- =====================================================
-- 8. PRODUCT REVIEWS (Sample reviews)
-- =====================================================

-- Note: This requires actual user IDs from auth.users
-- You'll need to replace these with real user IDs after creating users
-- For now, we'll create a comment showing how to add reviews

/*
INSERT INTO product_reviews (product_id, user_id, rating, title, comment, is_verified_purchase, is_approved) VALUES
INSERT INTO product_reviews (product_id, user_id, rating, title, comment, is_verified_purchase, is_approved) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'YOUR_USER_ID_HERE', 5, 'Amazing Phone!', 'Best iPhone yet. The camera is incredible and battery lasts all day.', true, true),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'YOUR_USER_ID_HERE', 4, 'Great but expensive', 'Love the phone but wish it was cheaper. Worth it for the camera though.', true, true),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'YOUR_USER_ID_HERE', 5, 'Perfect for developers', 'M3 chip is incredibly fast. Best laptop for coding.', true, true);
*/

-- =====================================================
-- 9. SETTINGS
-- =====================================================

INSERT INTO settings (
    site,
    carousels,
    available_languages,
    default_language,
    available_currencies,
    default_currency,
    available_payment_methods,
    default_payment_method,
    available_delivery_dates,
    default_delivery_date,
    shipping_zones
) VALUES (
    -- Site info
    '{
        "name": "FutureStore Pro",
        "description": "Your one-stop shop for the latest tech and fashion",
        "email": "support@futurestore.com",
        "phone": "+1-234-567-8900",
        "address": "123 Commerce Street, Tech City, TC 12345",
        "social": {
            "facebook": "https://facebook.com/futurestore",
            "instagram": "https://instagram.com/futurestore",
            "twitter": "https://twitter.com/futurestore"
        }
    }'::jsonb,
    
    -- Carousels
    '[
        {
            "id": 1,
            "title": "iPhone 15 Pro - Now Available",
            "subtitle": "Experience the power of titanium",
            "image": "https://images.unsplash.com/photo-1592286927505-c0d6f6f53584?w=1200",
            "link": "/products/iphone-15-pro",
            "buttonText": "Shop Now"
        },
        {
            "id": 2,
            "title": "Black Friday Sale",
            "subtitle": "Up to 20% off on selected items",
            "image": "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200",
            "link": "/deals",
            "buttonText": "View Deals"
        },
        {
            "id": 3,
            "title": "New Arrivals",
            "subtitle": "Check out the latest products",
            "image": "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200",
            "link": "/new-arrivals",
            "buttonText": "Explore"
        }
    ]'::jsonb,
    
    -- Available languages
    '[
        {"code": "en", "name": "English", "flag": "🇺🇸"},
        {"code": "ur", "name": "اردو", "flag": "🇵🇰"},
        {"code": "ar", "name": "العربية", "flag": "🇦🇪"}
    ]'::jsonb,
    'en',
    
    -- Available currencies
    '[
        {"code": "USD", "symbol": "$", "name": "US Dollar"},
        {"code": "PKR", "symbol": "₨", "name": "Pakistani Rupee"},
        {"code": "AED", "symbol": "د.إ", "name": "UAE Dirham"}
    ]'::jsonb,
    'USD',
    
    -- Available payment methods
    '[
        {"id": "card", "name": "Credit/Debit Card", "icon": "credit-card"},
        {"id": "paypal", "name": "PayPal", "icon": "paypal"},
        {"id": "cod", "name": "Cash on Delivery", "icon": "cash"}
    ]'::jsonb,
    'card',
    
    -- Available delivery dates
    '[
        {"id": "standard", "name": "Standard (5-7 days)", "days": 7, "cost": 5.99},
        {"id": "express", "name": "Express (2-3 days)", "days": 3, "cost": 12.99},
        {"id": "overnight", "name": "Overnight", "days": 1, "cost": 24.99}
    ]'::jsonb,
    'standard',
    
    -- Shipping zones
    '{
        "domestic": {"name": "Domestic", "countries": ["US"], "baseCost": 5.99, "freeShippingThreshold": 50},
        "international": {"name": "International", "countries": ["PK", "AE", "SA"], "baseCost": 15.99, "freeShippingThreshold": 100}
    }'::jsonb
);

-- =====================================================
-- 10. PAGE VISITS (Sample analytics data)
-- =====================================================

-- Insert sample page visits for the last 30 days
DO $$
DECLARE
    i INTEGER;
    random_date TIMESTAMP;
BEGIN
    FOR i IN 1..100 LOOP
        random_date := NOW() - (random() * INTERVAL '30 days');
        
        INSERT INTO page_visits (time, page_type, page_path, device_resolution, session_id) VALUES
        (random_date, 
         CASE (random() * 4)::int
            WHEN 0 THEN 'MAIN'
            WHEN 1 THEN 'LIST'
            WHEN 2 THEN 'PRODUCT'
            WHEN 3 THEN 'CHECKOUT'
            ELSE 'OTHER'
         END,
         '/products',
         '1920x1080',
         'session-' || md5(random()::text)
        );
    END LOOP;
END $$;

-- =====================================================
-- COMPLETION MESSAGE
-- =====================================================

DO $$
BEGIN
    RAISE NOTICE '========================================';
    RAISE NOTICE 'SEED DATA INSERTED SUCCESSFULLY!';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Summary:';
    RAISE NOTICE '- 10 Brands';
    RAISE NOTICE '- 15 Categories (5 main + 10 subcategories)';
    RAISE NOTICE '- 14 Products with translations';
    RAISE NOTICE '- 10+ Product Variants';
    RAISE NOTICE '- 3 Active Flash Deals';
    RAISE NOTICE '- 2 Upcoming Products';
    RAISE NOTICE '- 1 Settings record';
    RAISE NOTICE '- 100 Sample page visits';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Next Steps:';
    RAISE NOTICE '1. Create test users via Supabase Auth';
    RAISE NOTICE '2. Add product reviews with real user IDs';
    RAISE NOTICE '3. Create test orders';
    RAISE NOTICE '4. Test your application!';
    RAISE NOTICE '========================================';
END $$;