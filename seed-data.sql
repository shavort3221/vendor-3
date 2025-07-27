-- Insert sample vendors (these will be created via auth signup)
-- Vendors will be created through the application signup process

-- Insert sample products for suppliers
INSERT INTO products (supplier_id, name, category, subcategory, price, bulk_price, stock, unit, description) VALUES
-- Vegetables
('00000000-0000-0000-0000-000000000001', 'Fresh Onions', 'Vegetables', 'Root Vegetables', 45.00, 40.00, 500, 'kg', 'Premium quality red onions, fresh from farm'),
('00000000-0000-0000-0000-000000000001', 'Tomatoes', 'Vegetables', 'Fruits', 65.00, 60.00, 300, 'kg', 'Ripe red tomatoes, perfect for cooking'),
('00000000-0000-0000-0000-000000000001', 'Potatoes', 'Vegetables', 'Root Vegetables', 35.00, 32.00, 800, 'kg', 'Fresh potatoes, ideal for all cooking needs'),
('00000000-0000-0000-0000-000000000001', 'Green Chilies', 'Vegetables', 'Spices', 80.00, 75.00, 100, 'kg', 'Fresh green chilies, medium spice level'),
('00000000-0000-0000-0000-000000000001', 'Ginger', 'Vegetables', 'Spices', 120.00, 110.00, 150, 'kg', 'Fresh ginger root, aromatic and flavorful'),

-- Dairy Products
('00000000-0000-0000-0000-000000000002', 'Paneer', 'Dairy', 'Cheese', 340.00, 320.00, 50, 'kg', 'Fresh cottage cheese, made daily'),
('00000000-0000-0000-0000-000000000002', 'Full Cream Milk', 'Dairy', 'Milk', 48.00, 45.00, 200, 'liter', 'Fresh full cream milk, rich and creamy'),
('00000000-0000-0000-0000-000000000002', 'Curd', 'Dairy', 'Yogurt', 55.00, 50.00, 100, 'kg', 'Fresh homemade curd, thick and creamy'),
('00000000-0000-0000-0000-000000000002', 'Butter', 'Dairy', 'Fats', 450.00, 420.00, 30, 'kg', 'Pure white butter, unsalted'),

-- Spices
('00000000-0000-0000-0000-000000000003', 'Turmeric Powder', 'Spices', 'Ground Spices', 120.00, 110.00, 200, 'kg', 'Pure turmeric powder, bright yellow color'),
('00000000-0000-0000-0000-000000000003', 'Red Chili Powder', 'Spices', 'Ground Spices', 280.00, 260.00, 150, 'kg', 'Hot red chili powder, premium quality'),
('00000000-0000-0000-0000-000000000003', 'Cumin Seeds', 'Spices', 'Whole Spices', 450.00, 420.00, 100, 'kg', 'Aromatic cumin seeds, hand-picked'),
('00000000-0000-0000-0000-000000000003', 'Coriander Powder', 'Spices', 'Ground Spices', 180.00, 165.00, 120, 'kg', 'Fresh ground coriander powder'),
('00000000-0000-0000-0000-000000000003', 'Garam Masala', 'Spices', 'Blended Spices', 380.00, 350.00, 80, 'kg', 'Traditional garam masala blend'),

-- Oils & Fats
('00000000-0000-0000-0000-000000000004', 'Sunflower Oil', 'Oils', 'Cooking Oil', 120.00, 115.00, 300, 'liter', 'Refined sunflower oil, light and healthy'),
('00000000-0000-0000-0000-000000000004', 'Mustard Oil', 'Oils', 'Cooking Oil', 140.00, 135.00, 200, 'liter', 'Pure mustard oil, cold-pressed'),
('00000000-0000-0000-0000-000000000004', 'Ghee', 'Oils', 'Clarified Butter', 480.00, 450.00, 100, 'kg', 'Pure cow ghee, traditional taste'),

-- Grains & Staples
('00000000-0000-0000-0000-000000000005', 'Basmati Rice', 'Grains', 'Rice', 85.00, 80.00, 1000, 'kg', 'Premium basmati rice, long grain'),
('00000000-0000-0000-0000-000000000005', 'Wheat Flour', 'Grains', 'Flour', 42.00, 40.00, 800, 'kg', 'Fresh wheat flour, finely ground'),
('00000000-0000-0000-0000-000000000005', 'Chickpea Flour', 'Grains', 'Flour', 65.00, 62.00, 300, 'kg', 'Pure chickpea flour, protein-rich'),
('00000000-0000-0000-0000-000000000005', 'Lentils (Dal)', 'Grains', 'Pulses', 95.00, 90.00, 400, 'kg', 'Mixed lentils, high protein'),

-- Snack Ingredients
('00000000-0000-0000-0000-000000000006', 'Puffed Rice', 'Snacks', 'Base Ingredients', 35.00, 32.00, 200, 'kg', 'Light puffed rice for chaat'),
('00000000-0000-0000-0000-000000000006', 'Sev', 'Snacks', 'Toppings', 180.00, 170.00, 100, 'kg', 'Crispy gram flour noodles'),
('00000000-0000-0000-0000-000000000006', 'Tamarind Paste', 'Snacks', 'Chutneys', 120.00, 110.00, 80, 'kg', 'Sweet and sour tamarind paste'),
('00000000-0000-0000-0000-000000000006', 'Mint Chutney', 'Snacks', 'Chutneys', 85.00, 80.00, 60, 'kg', 'Fresh mint chutney, spicy and tangy');

-- Insert sample notifications
INSERT INTO notifications (user_id, type, title, message) VALUES
('00000000-0000-0000-0000-000000000001', 'system', 'Welcome to VendorMitra!', 'Your account has been created successfully. Complete your profile verification to start ordering.'),
('00000000-0000-0000-0000-000000000001', 'promotion', 'Special Offer: 15% Off', 'Join group orders this week and save up to 15% on bulk purchases. Limited time offer!'),
('00000000-0000-0000-0000-000000000001', 'system', 'New Suppliers Available', '3 new verified suppliers have joined in your area. Check out their products now.');
