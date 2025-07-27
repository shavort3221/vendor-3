import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          user_id: string
          business_name: string | null
          phone: string | null
          address: string | null
          user_type: "vendor" | "supplier" | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          business_name?: string | null
          phone?: string | null
          address?: string | null
          user_type?: "vendor" | "supplier" | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          business_name?: string | null
          phone?: string | null
          address?: string | null
          user_type?: "vendor" | "supplier" | null
          created_at?: string
          updated_at?: string
        }
      }
      products: {
        Row: {
          id: string
          supplier_id: string
          name: string
          description: string | null
          price: number
          unit: string
          category: string
          stock_quantity: number
          min_order_quantity: number
          image_url: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          supplier_id: string
          name: string
          description?: string | null
          price: number
          unit: string
          category: string
          stock_quantity: number
          min_order_quantity: number
          image_url?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          supplier_id?: string
          name?: string
          description?: string | null
          price?: number
          unit?: string
          category?: string
          stock_quantity?: number
          min_order_quantity?: number
          image_url?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          vendor_id: string
          supplier_id: string
          order_number: string
          status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled"
          total_amount: number
          payment_status: "pending" | "paid" | "failed"
          payment_id: string | null
          delivery_address: string
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          vendor_id: string
          supplier_id: string
          order_number: string
          status?: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled"
          total_amount: number
          payment_status?: "pending" | "paid" | "failed"
          payment_id?: string | null
          delivery_address: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          vendor_id?: string
          supplier_id?: string
          order_number?: string
          status?: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled"
          total_amount?: number
          payment_status?: "pending" | "paid" | "failed"
          payment_id?: string | null
          delivery_address?: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          quantity: number
          unit_price: number
          total_price: number
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          product_id: string
          quantity: number
          unit_price: number
          total_price: number
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string
          quantity?: number
          unit_price?: number
          total_price?: number
          created_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          title: string
          message: string
          type: "info" | "success" | "warning" | "error"
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          message: string
          type?: "info" | "success" | "warning" | "error"
          is_read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          message?: string
          type?: "info" | "success" | "warning" | "error"
          is_read?: boolean
          created_at?: string
        }
      }
    }
  }
}
