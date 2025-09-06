"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { getCart, addToCart, removeFromCart, updateCartItemQuantity, clearCart } from "@/lib/cart"
import type { Cart, AddToCartData } from "@/types/cart"

interface CartContextType {
  cart: Cart | null
  loading: boolean
  addItem: (item: AddToCartData) => Promise<void>
  removeItem: (itemId: string) => Promise<void>
  updateQuantity: (itemId: string, quantity: number) => Promise<void>
  clearCartItems: () => Promise<void>
  getCartTotal: () => number
  getCartItemCount: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null)
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      loadCart()
    } else {
      setCart(null)
      setLoading(false)
    }
  }, [user])

  const loadCart = async () => {
    if (!user) return

    try {
      const userCart = await getCart(user.uid)
      setCart(userCart)
    } catch (error) {
      console.error("Failed to load cart:", error)
    } finally {
      setLoading(false)
    }
  }

  const addItem = async (item: AddToCartData) => {
    if (!user) throw new Error("User must be logged in")

    await addToCart(user.uid, item)
    await loadCart()
  }

  const removeItem = async (itemId: string) => {
    if (!user) throw new Error("User must be logged in")

    await removeFromCart(user.uid, itemId)
    await loadCart()
  }

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (!user) throw new Error("User must be logged in")

    await updateCartItemQuantity(user.uid, itemId, quantity)
    await loadCart()
  }

  const clearCartItems = async () => {
    if (!user) throw new Error("User must be logged in")

    await clearCart(user.uid)
    setCart(null)
  }

  const getCartTotal = () => {
    if (!cart) return 0
    return cart.items.reduce((total, item) => total + item.productPrice * item.quantity, 0)
  }

  const getCartItemCount = () => {
    if (!cart) return 0
    return cart.items.reduce((count, item) => count + item.quantity, 0)
  }

  const value: CartContextType = {
    cart,
    loading,
    addItem,
    removeItem,
    updateQuantity,
    clearCartItems,
    getCartTotal,
    getCartItemCount,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
