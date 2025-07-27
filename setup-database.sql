-- Simplified Database Setup for VendorMitra
-- Run this in your Supabase SQL Editor

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
  verification_status BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create supplier_profiles table
CREATE TABLE IF NOT EXISTS supplier_profiles (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  company_name TEXT NOT NULL,
  gst_number TEXT,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  pincode TEXT NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  phone TEXT NOT NULL,
  rating DECIMAL(3, 2) DEFAULT 0,
  verification_status BOOLEAN DEFAULT false,
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

-- Create orders table with payment fields
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vendor_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  supplier_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  subtotal DECIMAL(10, 2) NOT NULL,
  delivery_charges DECIMAL(10, 2) DEFAULT 0,
  total DECIMAL(10, 2) NOT NULL,
  status TEXT CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')) DEFAULT 'pending',
  payment_status TEXT CHECK (payment_status IN ('pending', 'success', 'failed', 'refunded')) DEFAULT 'pending',
  payment_id TEXT,
  notes TEXT,
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

-- Create transactions table for payment records
CREATE TABLE IF NOT EXISTS transactions (
  id TEXT PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  payment_request_id TEXT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  fees DECIMAL(10, 2) DEFAULT 0,
  commission_amount DECIMAL(10, 2) DEFAULT 0,
  status TEXT CHECK (status IN ('pending', 'success', 'failed', 'refunded', 'cancelled')) DEFAULT 'pending',
  buyer_email TEXT NOT NULL,
  buyer_name TEXT NOT NULL,
  gateway_response JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create group_orders table for group buying
CREATE TABLE IF NOT EXISTS group_orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  supplier_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  min_participants INTEGER NOT NULL DEFAULT 5,
  current_participants INTEGER DEFAULT 0,
  discount_percentage DECIMAL(5, 2) DEFAULT 10.00,
  status TEXT CHECK (status IN ('active', 'completed', 'cancelled')) DEFAULT 'active',
  payment_status TEXT CHECK (payment_status IN ('pending', 'success', 'failed')) DEFAULT 'pending',
  ends_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create group_order_participants table
CREATE TABLE IF NOT EXISTS group_order_participants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  group_order_id UUID REFERENCES group_orders(id) ON DELETE CASCADE,
  vendor_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL,
  payment_status TEXT CHECK (payment_status IN ('pending', 'success', 'failed')) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(group_order_id, vendor_id)
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE supplier_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_order_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Create basic RLS policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Vendors can view own profile" ON vendor_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Vendors can insert own profile" ON vendor_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Vendors can update own profile" ON vendor_profiles FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Suppliers can view own profile" ON supplier_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Suppliers can insert own profile" ON supplier_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Suppliers can update own profile" ON supplier_profiles FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Suppliers can manage own products" ON products FOR ALL USING (auth.uid() = supplier_id);
CREATE POLICY "Vendors can view all products" ON products FOR SELECT USING (true);

CREATE POLICY "Users can view own orders" ON orders FOR SELECT USING (auth.uid() = vendor_id OR auth.uid() = supplier_id);
CREATE POLICY "Vendors can create orders" ON orders FOR INSERT WITH CHECK (auth.uid() = vendor_id);
CREATE POLICY "Suppliers can update orders" ON orders FOR UPDATE USING (auth.uid() = supplier_id);

CREATE POLICY "Users can view order items" ON order_items FOR SELECT USING (true);
CREATE POLICY "Users can insert order items" ON order_items FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view own transactions" ON transactions FOR SELECT USING (auth.uid() = vendor_id OR auth.uid() = supplier_id);
CREATE POLICY "Users can insert transactions" ON transactions FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update transactions" ON transactions FOR UPDATE USING (auth.uid() = vendor_id OR auth.uid() = supplier_id);

CREATE POLICY "Users can view group orders" ON group_orders FOR SELECT USING (true);
CREATE POLICY "Suppliers can create group orders" ON group_orders FOR INSERT WITH CHECK (auth.uid() = supplier_id);
CREATE POLICY "Suppliers can update own group orders" ON group_orders FOR UPDATE USING (auth.uid() = supplier_id);

CREATE POLICY "Users can view group order participants" ON group_order_participants FOR SELECT USING (true);
CREATE POLICY "Vendors can join group orders" ON group_order_participants FOR INSERT WITH CHECK (auth.uid() = vendor_id);
CREATE POLICY "Users can update own participation" ON group_order_participants FOR UPDATE USING (auth.uid() = vendor_id);

CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert notifications" ON notifications FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_orders_vendor_id ON orders(vendor_id);
CREATE INDEX IF NOT EXISTS idx_orders_supplier_id ON orders(supplier_id);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_transactions_order_id ON transactions(order_id);
CREATE INDEX IF NOT EXISTS idx_transactions_payment_request_id ON transactions(payment_request_id);
CREATE INDEX IF NOT EXISTS idx_products_supplier_id ON products(supplier_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_group_orders_supplier_id ON group_orders(supplier_id);
