import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable. Please add it to your .env.local file.')
}

if (!supabaseAnonKey) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable. Please add it to your .env.local file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
})

// Database types
export interface Profile {
  id: string
  role: "vendor" | "supplier"
  created_at: string
  updated_at: string
}

export interface VendorProfile {
  user_id: string
  business_name: string
  food_type?: string
  location?: string
  city?: string
  state?: string
  phone?: string
  gst_number?: string
  documents_url?: string
  verification_status: boolean
  rating: number
  created_at: string
}

export interface SupplierProfile {
  user_id: string
  company_name: string
  gst_number?: string
  address?: string
  city?: string
  state?: string
  phone?: string
  rating: number
  verification_status: boolean
  created_at: string
}

export interface Product {
  id: string
  supplier_id: string
  name: string
  category: string
  subcategory?: string
  price: number
  bulk_price?: number
  stock: number
  unit: string
  image_url?: string
  description?: string
  created_at: string
}

export interface Order {
  id: string
  vendor_id: string
  supplier_id: string
  subtotal: number
  delivery_charges: number
  total: number
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled"
  payment_id?: string
  created_at: string
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  quantity: number
  unit_price: number
  total_price: number
}

export interface GroupOrder {
  id: string
  creator_id: string
  title: string
  description?: string
  min_quantity: number
  current_quantity: number
  deadline?: string
  status: string
  created_at: string
}

export interface Transaction {
  id: string
  order_id: string
  payment_id: string
  amount: number
  status: string
  gateway_response?: any
  commission?: number
  created_at: string
}

export interface Notification {
  id: string
  user_id: string
  type: string
  title: string
  message: string
  read: boolean
  created_at: string
}
