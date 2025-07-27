import { z } from 'zod'
import { VALIDATION_RULES } from './constants'

// User authentication schemas
export const signUpSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['vendor', 'supplier'], {
    required_error: 'Please select a role'
  }),
  businessName: z.string().min(2, 'Business name must be at least 2 characters'),
  phone: z.string().regex(VALIDATION_RULES.PHONE, 'Invalid phone number'),
  address: z.string().min(10, 'Address must be at least 10 characters'),
  city: z.string().min(2, 'City must be at least 2 characters'),
  state: z.string().min(2, 'State must be at least 2 characters'),
  pincode: z.string().regex(VALIDATION_RULES.PINCODE, 'Invalid pincode'),
  gstNumber: z.string().optional(),
  foodType: z.string().optional()
})

export const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
})

// Profile schemas
export const vendorProfileSchema = z.object({
  businessName: z.string().min(2, 'Business name must be at least 2 characters'),
  foodType: z.string().optional(),
  location: z.string().min(2, 'Location must be at least 2 characters'),
  phone: z.string().regex(VALIDATION_RULES.PHONE, 'Invalid phone number'),
  gstNumber: z.string().optional(),
  city: z.string().min(2, 'City must be at least 2 characters'),
  state: z.string().min(2, 'State must be at least 2 characters'),
  pincode: z.string().regex(VALIDATION_RULES.PINCODE, 'Invalid pincode')
})

export const supplierProfileSchema = z.object({
  companyName: z.string().min(2, 'Company name must be at least 2 characters'),
  gstNumber: z.string().regex(VALIDATION_RULES.GST, 'Invalid GST number').optional(),
  address: z.string().min(10, 'Address must be at least 10 characters'),
  phone: z.string().regex(VALIDATION_RULES.PHONE, 'Invalid phone number'),
  city: z.string().min(2, 'City must be at least 2 characters'),
  state: z.string().min(2, 'State must be at least 2 characters'),
  pincode: z.string().regex(VALIDATION_RULES.PINCODE, 'Invalid pincode')
})

// Product schemas
export const productSchema = z.object({
  name: z.string().min(2, 'Product name must be at least 2 characters'),
  category: z.string().min(1, 'Category is required'),
  subcategory: z.string().optional(),
  price: z.number().min(0.01, 'Price must be greater than 0'),
  bulkPrice: z.number().min(0.01, 'Bulk price must be greater than 0').optional(),
  stock: z.number().min(0, 'Stock cannot be negative'),
  unit: z.string().min(1, 'Unit is required'),
  description: z.string().optional(),
  imageUrl: z.string().url('Invalid image URL').optional()
})

// Order schemas
export const orderItemSchema = z.object({
  productId: z.string().min(1, 'Product is required'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  unitPrice: z.number().min(0.01, 'Unit price must be greater than 0')
})

export const orderSchema = z.object({
  supplierId: z.string().min(1, 'Supplier is required'),
  items: z.array(orderItemSchema).min(1, 'At least one item is required'),
  deliveryCharges: z.number().min(0, 'Delivery charges cannot be negative'),
  notes: z.string().optional()
})

// Payment schemas
export const paymentSchema = z.object({
  orderId: z.string().min(1, 'Order ID is required'),
  amount: z.number().min(1, 'Amount must be at least ₹1'),
  buyerName: z.string().min(2, 'Buyer name must be at least 2 characters'),
  buyerEmail: z.string().email('Invalid email address'),
  buyerPhone: z.string().regex(VALIDATION_RULES.PHONE, 'Invalid phone number')
})

// Group order schemas
export const groupOrderSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().optional(),
  minQuantity: z.number().min(1, 'Minimum quantity must be at least 1'),
  deadline: z.date().min(new Date(), 'Deadline must be in the future'),
  discountPercentage: z.number().min(0).max(30, 'Discount cannot exceed 30%')
})

// Search and filter schemas
export const searchSchema = z.object({
  query: z.string().optional(),
  category: z.string().optional(),
  minPrice: z.number().min(0).optional(),
  maxPrice: z.number().min(0).optional(),
  location: z.string().optional(),
  sortBy: z.enum(['price', 'name', 'rating', 'created_at']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional()
})

// Pagination schema
export const paginationSchema = z.object({
  page: z.number().min(1, 'Page must be at least 1'),
  limit: z.number().min(1).max(100, 'Limit must be between 1 and 100'),
  search: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional()
})

// Notification schema
export const notificationSchema = z.object({
  type: z.string().min(1, 'Notification type is required'),
  title: z.string().min(1, 'Title is required'),
  message: z.string().min(1, 'Message is required'),
  data: z.record(z.any()).optional()
})

// Export types
export type SignUpInput = z.infer<typeof signUpSchema>
export type SignInInput = z.infer<typeof signInSchema>
export type VendorProfileInput = z.infer<typeof vendorProfileSchema>
export type SupplierProfileInput = z.infer<typeof supplierProfileSchema>
export type ProductInput = z.infer<typeof productSchema>
export type OrderInput = z.infer<typeof orderSchema>
export type PaymentInput = z.infer<typeof paymentSchema>
export type GroupOrderInput = z.infer<typeof groupOrderSchema>
export type SearchInput = z.infer<typeof searchSchema>
export type PaginationInput = z.infer<typeof paginationSchema>
export type NotificationInput = z.infer<typeof notificationSchema>
