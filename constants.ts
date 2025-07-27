// Application constants and configuration

export const APP_CONFIG = {
  name: 'VendorMitra',
  description: 'B2B Marketplace for Street Food Vendors',
  version: '1.0.0',
  url: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
  supportEmail: 'support@vendormitra.com',
  phone: '+91-1800-123-4567'
}

export const PAYMENT_CONFIG = {
  commissionRate: 0.025, // 2.5%
  minOrderAmount: 1,
  maxOrderAmount: 100000,
  supportedCurrencies: ['INR'],
  paymentMethods: ['card', 'upi', 'netbanking', 'wallet']
}

export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled'
} as const

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  SUCCESS: 'success',
  FAILED: 'failed',
  REFUNDED: 'refunded',
  CANCELLED: 'cancelled'
} as const

export const USER_ROLES = {
  VENDOR: 'vendor',
  SUPPLIER: 'supplier'
} as const

export const PRODUCT_CATEGORIES = [
  'Vegetables',
  'Fruits',
  'Grains',
  'Spices',
  'Dairy',
  'Meat',
  'Seafood',
  'Beverages',
  'Snacks',
  'Other'
] as const

export const DELIVERY_CHARGES = {
  LOCAL: 50,
  REGIONAL: 100,
  NATIONAL: 200
}

export const GROUP_ORDER_CONFIG = {
  minParticipants: 5,
  maxParticipants: 50,
  defaultDiscount: 0.10, // 10%
  maxDiscount: 0.30, // 30%
  deadlineHours: 72 // 3 days
}

export const NOTIFICATION_TYPES = {
  ORDER_CREATED: 'order_created',
  ORDER_CONFIRMED: 'order_confirmed',
  ORDER_SHIPPED: 'order_shipped',
  ORDER_DELIVERED: 'order_delivered',
  PAYMENT_RECEIVED: 'payment_received',
  PAYMENT_FAILED: 'payment_failed',
  GROUP_ORDER_JOINED: 'group_order_joined',
  GROUP_ORDER_COMPLETED: 'group_order_completed'
} as const

export const API_ENDPOINTS = {
  AUTH: {
    SIGNUP: '/api/auth/signup',
    SIGNIN: '/api/auth/signin',
    SIGNOUT: '/api/auth/signout'
  },
  PAYMENT: {
    CREATE: '/api/payment/create',
    STATUS: '/api/payment/status',
    WEBHOOK: '/api/payment/webhook'
  },
  ORDERS: {
    CREATE: '/api/orders',
    LIST: '/api/orders',
    DETAILS: '/api/orders/[id]',
    UPDATE: '/api/orders/[id]'
  },
  PRODUCTS: {
    LIST: '/api/products',
    CREATE: '/api/products',
    UPDATE: '/api/products/[id]',
    DELETE: '/api/products/[id]'
  }
} as const

export const ERROR_MESSAGES = {
  AUTHENTICATION_FAILED: 'Authentication failed. Please try again.',
  PAYMENT_FAILED: 'Payment failed. Please try again.',
  ORDER_NOT_FOUND: 'Order not found.',
  PRODUCT_NOT_FOUND: 'Product not found.',
  INSUFFICIENT_STOCK: 'Insufficient stock available.',
  INVALID_AMOUNT: 'Invalid amount specified.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.'
} as const

export const SUCCESS_MESSAGES = {
  ORDER_CREATED: 'Order created successfully!',
  PAYMENT_SUCCESS: 'Payment completed successfully!',
  PRODUCT_ADDED: 'Product added successfully!',
  PRODUCT_UPDATED: 'Product updated successfully!',
  PROFILE_UPDATED: 'Profile updated successfully!',
  GROUP_ORDER_JOINED: 'Successfully joined group order!'
} as const

export const VALIDATION_RULES = {
  PHONE: /^[6-9]\d{9}$/,
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  GST: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
  PINCODE: /^[1-9][0-9]{5}$/
} as const
