-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE user_role AS ENUM ('vendor', 'supplier');
CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled');

-- Create profiles table (extends auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE,
  role user_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Create vendor_profiles table
CREATE TABLE vendor_profiles (
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  business_name TEXT NOT NULL,
  food_type TEXT,
  location TEXT,
  city TEXT,
  state TEXT,
  phone TEXT,
  gst_number TEXT,
  documents_url TEXT,
  verification_status BOOLEAN DEFAULT FALSE,
  rating DECIMAL(3,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (user_id)
);

-- Create supplier_profiles table
CREATE TABLE supplier_profiles (
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  gst_number TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  phone TEXT,
  rating DECIMAL(3,2) DEFAULT 0,
  verification_status BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (user_id)
);

-- Create products table
CREATE TABLE products (
  id UUID DEFAULT uuid_generate_v4(),
  supplier_id UUID REFERENCES auth.users ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  subcategory TEXT,
  price DECIMAL(10,2) NOT NULL,
  bulk_price DECIMAL(10,2),
  stock INTEGER DEFAULT 0,
  unit TEXT DEFAULT 'kg',
  image_url TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Create orders table
CREATE TABLE orders (
  id UUID DEFAULT uuid_generate_v4(),
  vendor_id UUID REFERENCES auth.users ON DELETE CASCADE,
  supplier_id UUID REFERENCES auth.users ON DELETE CASCADE,
  subtotal DECIMAL(10,2) NOT NULL,
  delivery_charges DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  status order_status DEFAULT 'pending',
  payment_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Create order_items table
CREATE TABLE order_items (
  id UUID DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders ON DELETE CASCADE,
  product_id UUID REFERENCES products ON DELETE CASCADE,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (id)
);

-- Create reviews table
CREATE TABLE reviews (
  id UUID DEFAULT uuid_generate_v4(),
  vendor_id UUID REFERENCES auth.users ON DELETE CASCADE,
  supplier_id UUID REFERENCES auth.users ON DELETE CASCADE,
  order_id UUID REFERENCES orders ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  images TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Create group_orders table
CREATE TABLE group_orders (
  id UUID DEFAULT uuid_generate_v4(),
  creator_id UUID REFERENCES auth.users ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  min_quantity INTEGER NOT NULL,
  current_quantity INTEGER DEFAULT 0,
  deadline TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Create transactions table
CREATE TABLE transactions (
  id UUID DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders ON DELETE CASCADE,
  payment_id TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL,
  gateway_response JSONB,
  commission DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Create notifications table
CREATE TABLE notifications (
  id UUID DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Enable Row Level Security
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

-- Create RLS Policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Vendors can manage own profile" ON vendor_profiles FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Public can view verified vendors" ON vendor_profiles FOR SELECT USING (verification_status = true);

CREATE POLICY "Suppliers can manage own profile" ON supplier_profiles FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Public can view verified suppliers" ON supplier_profiles FOR SELECT USING (verification_status = true);

CREATE POLICY "Suppliers can manage own products" ON products FOR ALL USING (auth.uid() = supplier_id);
CREATE POLICY "Anyone can view products" ON products FOR SELECT TO authenticated USING (true);

CREATE POLICY "Vendors can view own orders" ON orders FOR SELECT USING (auth.uid() = vendor_id);
CREATE POLICY "Suppliers can view their orders" ON orders FOR SELECT USING (auth.uid() = supplier_id);
CREATE POLICY "Vendors can create orders" ON orders FOR INSERT WITH CHECK (auth.uid() = vendor_id);
CREATE POLICY "Suppliers can update order status" ON orders FOR UPDATE USING (auth.uid() = supplier_id);

CREATE POLICY "Users can view order items for their orders" ON order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM orders WHERE id = order_id AND (vendor_id = auth.uid() OR supplier_id = auth.uid()))
);

CREATE POLICY "Users can view notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);

-- Add indexes for performance
CREATE INDEX idx_products_supplier_id ON products(supplier_id);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_orders_vendor_id ON orders(vendor_id);
CREATE INDEX idx_orders_supplier_id ON orders(supplier_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(read);
