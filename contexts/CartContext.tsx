"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"

interface CartItem {
  id: string
  name: string
  price: number
  unit: string
  quantity: number
  supplier_id: string
  supplier_name?: string
  min_order_quantity: number
  stock_quantity: number
  image_url?: string
}

interface CartState {
  items: CartItem[]
  totalItems: number
  totalAmount: number
}

type CartAction =
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "LOAD_CART"; payload: CartItem[] }

interface CartContextType extends CartState {
  addItem: (item: Omit<CartItem, "quantity">) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  getItemQuantity: (id: string) => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingItem = state.items.find((item) => item.id === action.payload.id)

      if (existingItem) {
        const newQuantity = existingItem.quantity + action.payload.quantity
        const updatedItems = state.items.map((item) =>
          item.id === action.payload.id ? { ...item, quantity: newQuantity } : item,
        )

        return {
          ...state,
          items: updatedItems,
          totalItems: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
          totalAmount: updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
        }
      } else {
        const updatedItems = [...state.items, action.payload]
        return {
          ...state,
          items: updatedItems,
          totalItems: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
          totalAmount: updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
        }
      }
    }

    case "REMOVE_ITEM": {
      const updatedItems = state.items.filter((item) => item.id !== action.payload)
      return {
        ...state,
        items: updatedItems,
        totalItems: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
        totalAmount: updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
      }
    }

    case "UPDATE_QUANTITY": {
      if (action.payload.quantity <= 0) {
        return cartReducer(state, { type: "REMOVE_ITEM", payload: action.payload.id })
      }

      const updatedItems = state.items.map((item) =>
        item.id === action.payload.id ? { ...item, quantity: action.payload.quantity } : item,
      )

      return {
        ...state,
        items: updatedItems,
        totalItems: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
        totalAmount: updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
      }
    }

    case "CLEAR_CART":
      return {
        items: [],
        totalItems: 0,
        totalAmount: 0,
      }

    case "LOAD_CART": {
      return {
        items: action.payload,
        totalItems: action.payload.reduce((sum, item) => sum + item.quantity, 0),
        totalAmount: action.payload.reduce((sum, item) => sum + item.price * item.quantity, 0),
      }
    }

    default:
      return state
  }
}

const initialState: CartState = {
  items: [],
  totalItems: 0,
  totalAmount: 0,
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)
  const { toast } = useToast()

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("vendormitra-cart")
    if (savedCart) {
      try {
        const cartItems = JSON.parse(savedCart)
        dispatch({ type: "LOAD_CART", payload: cartItems })
      } catch (error) {
        console.error("Error loading cart from localStorage:", error)
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("vendormitra-cart", JSON.stringify(state.items))
  }, [state.items])

  const addItem = (item: Omit<CartItem, "quantity">) => {
    const quantity = item.min_order_quantity || 1

    if (quantity > item.stock_quantity) {
      toast({
        title: "Insufficient Stock",
        description: `Only ${item.stock_quantity} ${item.unit} available`,
        variant: "destructive",
      })
      return
    }

    dispatch({
      type: "ADD_ITEM",
      payload: { ...item, quantity },
    })

    toast({
      title: "Added to Cart",
      description: `${item.name} has been added to your cart`,
    })
  }

  const removeItem = (id: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: id })
    toast({
      title: "Removed from Cart",
      description: "Item has been removed from your cart",
    })
  }

  const updateQuantity = (id: string, quantity: number) => {
    const item = state.items.find((item) => item.id === id)

    if (item) {
      if (quantity < item.min_order_quantity) {
        toast({
          title: "Minimum Order Quantity",
          description: `Minimum order quantity is ${item.min_order_quantity} ${item.unit}`,
          variant: "destructive",
        })
        return
      }

      if (quantity > item.stock_quantity) {
        toast({
          title: "Insufficient Stock",
          description: `Only ${item.stock_quantity} ${item.unit} available`,
          variant: "destructive",
        })
        return
      }
    }

    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } })
  }

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" })
    toast({
      title: "Cart Cleared",
      description: "All items have been removed from your cart",
    })
  }

  const getItemQuantity = (id: string) => {
    const item = state.items.find((item) => item.id === id)
    return item?.quantity || 0
  }

  const value = {
    ...state,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getItemQuantity,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
