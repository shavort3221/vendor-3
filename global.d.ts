// Global type definitions for VendorMitra

declare global {
  interface Window {
    // Add any global window properties here
  }
}

// Payment related types
export interface PaymentStatus {
  pending: 'pending'
  success: 'success'
  failed: 'failed'
  refunded: 'refunded'
  cancelled: 'cancelled'
}

// Order status types
export interface OrderStatus {
  pending: 'pending'
  confirmed: 'confirmed'
  shipped: 'shipped'
  delivered: 'delivered'
  cancelled: 'cancelled'
}

// User role types
export interface UserRole {
  vendor: 'vendor'
  supplier: 'supplier'
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Pagination types
export interface PaginationParams {
  page: number
  limit: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

// Environment variables
declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_SUPABASE_URL: string
    NEXT_PUBLIC_SUPABASE_ANON_KEY: string
    INSTAMOJO_API_KEY: string
    INSTAMOJO_AUTH_TOKEN: string
    INSTAMOJO_SALT: string
    NEXT_PUBLIC_BASE_URL: string
    NODE_ENV: 'development' | 'production' | 'test'
  }
}

export {}
