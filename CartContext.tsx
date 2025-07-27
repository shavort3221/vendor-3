"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useAuth } from "./AuthContext"
import { supabase } from "@/lib/supabase"
import { instamojoService } from "@/lib/instamojo"
import type { Product } from "@/lib/supabase"

interface CartItem {
  id: string
  product: Product
  quantity: number
  unit_price: number
  total_price: number
}

interface CartContextType {
  items: CartItem[]
  totalItems: number
  totalAmount: number
  addItem: (product: Product, quantity: number) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  createOrder: () => Promise<{ success?: boolean; error?: string; paymentUrl?: string }>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const { user } = useAuth()

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalAmount = items.reduce((sum, item) => sum + item.total_price, 0)

  const addItem = (product: Product, quantity: number) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.product.id === product.id)

      if (existingItem) {
        return prevItems.map((item) =>
          item.product.id === product.id
            ? {
                ...item,
                quantity: item.quantity + quantity,
                total_price: (item.quantity + quantity) * item.unit_price,
              }
            : item,
        )
      } else {
        return [
          ...prevItems,
          {
            id: `${product.id}-${Date.now()}`,
            product,
            quantity,
            unit_price: product.price,
            total_price: quantity * product.price,
          },
        ]
      }
    })
  }

  const removeItem = (productId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.product.id !== productId))
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId)
      return
    }

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.product.id === productId
          ? {
              ...item,
              quantity,
              total_price: quantity * item.unit_price,
            }
          : item,
      ),
    )
  }

  const clearCart = () => {
    setItems([])
  }

  const createOrder = async () => {
    if (!user || items.length === 0) {
      return { error: "Invalid order data" }
    }

    try {
      // Group items by supplier
      const supplierGroups = items.reduce(
        (groups, item) => {
          const supplierId = item.product.supplier_id
          if (!groups[supplierId]) {
            groups[supplierId] = []
          }
          groups[supplierId].push(item)
          return groups
        },
        {} as Record<string, CartItem[]>,
      )

      // Create orders for each supplier
      const orders = []

      for (const [supplierId, supplierItems] of Object.entries(supplierGroups)) {
        const subtotal = supplierItems.reduce((sum, item) => sum + item.total_price, 0)
        const deliveryCharges = subtotal > 1000 ? 0 : 50 // Free delivery above ₹1000
        const total = subtotal + deliveryCharges

        const { data: order, error } = await supabase
          .from("orders")
          .insert({
            vendor_id: user.id,
            supplier_id: supplierId,
            subtotal,
            delivery_charges: deliveryCharges,
            total,
            status: "pending",
          })
          .select()
          .single()

        if (error) throw error

        // Create order items
        const orderItems = supplierItems.map((item) => ({
          order_id: order.id,
          product_id: item.product.id,
          quantity: item.quantity,
          unit_price: item.unit_price,
          total_price: item.total_price,
        }))

        const { error: itemsError } = await supabase.from("order_items").insert(orderItems)

        if (itemsError) throw itemsError

        orders.push(order)
      }

      // Create payment request for total amount
      const totalOrderAmount = orders.reduce((sum, order) => sum + order.total, 0)
      const commission = instamojoService.calculateCommission(totalOrderAmount)

              const paymentRequest = await instamojoService.createPaymentRequest({
        purpose: `VendorMitra Order - ${orders.map((o) => o.id).join(", ")}`,
        amount: totalOrderAmount,
        buyer_name: user.profile?.business_name || user.email || "Customer",
        email: user.email || "",
        phone: user.profile?.phone || "9999999999",
        redirect_url: `${window.location.origin}/payment/success`,
        webhook: `${window.location.origin}/api/payment/webhook`,
        allow_repeated_payments: false,
      })

      if (paymentRequest.success) {
        // Update orders with payment ID
        for (const order of orders) {
          await supabase.from("orders").update({ payment_id: paymentRequest.payment_request.id }).eq("id", order.id)

          // Create transaction record
          await supabase.from("transactions").insert({
            order_id: order.id,
            payment_id: paymentRequest.payment_request.id,
            amount: order.total,
            status: "pending",
            commission,
          })
        }

        clearCart()
        return {
          success: true,
          paymentUrl: paymentRequest.payment_request.longurl,
        }
      } else {
        throw new Error("Payment request failed")
      }
    } catch (error: any) {
      console.error("Order creation error:", error)
      return { error: error.message || "Order creation failed" }
    }
  }

  // Persist cart to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedCart = localStorage.getItem("vendormitra_cart")
      if (savedCart) {
        try {
          setItems(JSON.parse(savedCart))
        } catch (error) {
          console.error("Error loading cart from localStorage:", error)
        }
      }
    }
  }, [])

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("vendormitra_cart", JSON.stringify(items))
      } catch (error) {
        console.error("Error saving cart to localStorage:", error)
      }
    }
  }, [items])

  return (
    <CartContext.Provider
      value={{
        items,
        totalItems,
        totalAmount,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        createOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
