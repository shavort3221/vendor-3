-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('vendor', 'supplier')) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create vendor_profiles table
CREATE TABLE IF NOT EXISTS vendor_profiles (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  business_name TEXT NOT NULL,
  food_type TEXT,
  location TEXT NOT NULL,
  phone TEXT NOT NULL,
  gst_number TEXT,
  documents_url TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  pincode TEXT NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  rating DECIMAL(3, 2) DEFAULT 0,
  verification_status TEXT CHECK (verification_status IN ('pending', 'verified', 'rejected')) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create supplier_profiles table
CREATE TABLE IF NOT EXISTS supplier_profiles (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  company_name TEXT NOT NULL,
  gst_number TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  pincode TEXT NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  phone TEXT NOT NULL,
  rating DECIMAL(3, 2) DEFAULT 0,
  verification_status TEXT CHECK (verification_status IN ('pending', 'verified', 'rejected')) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  supplier_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  subcategory TEXT,
  price DECIMAL(10, 2) NOT NULL,
  bulk_price DECIMAL(10, 2),
  stock INTEGER NOT NULL DEFAULT 0,
  unit TEXT NOT NULL,
  image_url TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vendor_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  supplier_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  subtotal DECIMAL(10, 2) NOT NULL,
  delivery_charges DECIMAL(10, 2) DEFAULT 0,
  total DECIMAL(10, 2) NOT NULL,
  status TEXT CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')) DEFAULT 'pending',
  payment_id TEXT,
  delivery_date DATE,
  group_order_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vendor_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  supplier_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  comment TEXT,
  images TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create group_orders table
CREATE TABLE IF NOT EXISTS group_orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  creator_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  min_quantity INTEGER NOT NULL,
  current_quantity INTEGER DEFAULT 0,
  deadline TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT CHECK (status IN ('active', 'completed', 'cancelled')) DEFAULT 'active',
  participants UUID[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  payment_id TEXT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  status TEXT CHECK (status IN ('pending', 'completed', 'failed', 'refunded')) DEFAULT 'pending',
  gateway_response JSONB,
  commission DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT CHECK (type IN ('order', 'payment', 'system', 'promotion')) NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE supplier_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Vendor profiles policies
CREATE POLICY "Vendors can view own profile" ON vendor_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Vendors can update own profile" ON vendor_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Vendors can insert own profile" ON vendor_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Suppliers can view vendor profiles" ON vendor_profiles FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'supplier')
);

-- Supplier profiles policies
CREATE POLICY "Suppliers can view own profile" ON supplier_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Suppliers can update own profile" ON supplier_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Suppliers can insert own profile" ON supplier_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Vendors can view supplier profiles" ON supplier_profiles FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'vendor')
);

-- Products policies
CREATE POLICY "Suppliers can manage own products" ON products FOR ALL USING (auth.uid() = supplier_id);
CREATE POLICY "Vendors can view all products" ON products FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'vendor')
);

-- Orders policies
CREATE POLICY "Vendors can view own orders" ON orders FOR SELECT USING (auth.uid() = vendor_id);
CREATE POLICY "Suppliers can view orders for their products" ON orders FOR SELECT USING (auth.uid() = supplier_id);
CREATE POLICY "Vendors can create orders" ON orders FOR INSERT WITH CHECK (auth.uid() = vendor_id);
CREATE POLICY "Suppliers can update order status" ON orders FOR UPDATE USING (auth.uid() = supplier_id);

-- Order items policies
CREATE POLICY "Users can view order items for their orders" ON order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM orders WHERE id = order_id AND (vendor_id = auth.uid() OR supplier_id = auth.uid()))
);

-- Reviews policies
CREATE POLICY "Vendors can create reviews" ON reviews FOR INSERT WITH CHECK (auth.uid() = vendor_id);
CREATE POLICY "Users can view reviews" ON reviews FOR SELECT TO authenticated;

-- Group orders policies
CREATE POLICY "Users can view active group orders" ON group_orders FOR SELECT USING (status = 'active');
CREATE POLICY "Vendors can create group orders" ON group_orders FOR INSERT WITH CHECK (
  auth.uid() = creator_id AND EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'vendor')
);
CREATE POLICY "Vendors can update own group orders" ON group_orders FOR UPDATE USING (auth.uid() = creator_id);

-- Transactions policies
CREATE POLICY "Users can view own transactions" ON transactions FOR SELECT USING (
  EXISTS (SELECT 1 FROM orders WHERE id = order_id AND (vendor_id = auth.uid() OR supplier_id = auth.uid()))
);

-- Notifications policies
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_vendor_profiles_city ON vendor_profiles(city);
CREATE INDEX IF NOT EXISTS idx_supplier_profiles_city ON supplier_profiles(city);
CREATE INDEX IF NOT EXISTS idx_products_supplier_id ON products(supplier_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_orders_vendor_id ON orders(vendor_id);
CREATE INDEX IF NOT EXISTS idx_orders_supplier_id ON orders(supplier_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_vendor_profiles_updated_at BEFORE UPDATE ON vendor_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_supplier_profiles_updated_at BEFORE UPDATE ON supplier_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_group_orders_updated_at BEFORE UPDATE ON group_orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
