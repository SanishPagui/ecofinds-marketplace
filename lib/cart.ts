import { doc, setDoc, getDoc, updateDoc, deleteDoc, Timestamp, arrayUnion } from "firebase/firestore"
import { db } from "@/lib/firebase"
import type { Cart, CartItem, AddToCartData } from "@/types/cart"

const CARTS_COLLECTION = "carts"

export async function getCart(userId: string): Promise<Cart | null> {
  const cartRef = doc(db, CARTS_COLLECTION, userId)
  const cartSnap = await getDoc(cartRef)

  if (cartSnap.exists()) {
    const data = cartSnap.data()
    return {
      id: cartSnap.id,
      ...data,
      items: data.items.map((item: any) => ({
        ...item,
        addedAt: item.addedAt.toDate(),
      })),
      updatedAt: data.updatedAt.toDate(),
    } as Cart
  }

  return null
}

export async function addToCart(userId: string, itemData: AddToCartData): Promise<void> {
  const cartRef = doc(db, CARTS_COLLECTION, userId)
  const existingCart = await getCart(userId)

  const newItem: CartItem = {
    id: `${itemData.productId}_${Date.now()}`,
    ...itemData,
    quantity: itemData.quantity || 1,
    addedAt: new Date(),
  }

  if (existingCart) {
    // Check if product already exists in cart
    const existingItemIndex = existingCart.items.findIndex((item) => item.productId === itemData.productId)

    if (existingItemIndex >= 0) {
      // Update quantity of existing item
      const updatedItems = [...existingCart.items]
      updatedItems[existingItemIndex].quantity += newItem.quantity

      await updateDoc(cartRef, {
        items: updatedItems.map((item) => ({
          ...item,
          addedAt: Timestamp.fromDate(item.addedAt),
        })),
        updatedAt: Timestamp.now(),
      })
    } else {
      // Add new item to cart
      await updateDoc(cartRef, {
        items: arrayUnion({
          ...newItem,
          addedAt: Timestamp.fromDate(newItem.addedAt),
        }),
        updatedAt: Timestamp.now(),
      })
    }
  } else {
    // Create new cart
    await setDoc(cartRef, {
      userId,
      items: [
        {
          ...newItem,
          addedAt: Timestamp.fromDate(newItem.addedAt),
        },
      ],
      updatedAt: Timestamp.now(),
    })
  }
}

export async function removeFromCart(userId: string, itemId: string): Promise<void> {
  const cartRef = doc(db, CARTS_COLLECTION, userId)
  const existingCart = await getCart(userId)

  if (existingCart) {
    const updatedItems = existingCart.items.filter((item) => item.id !== itemId)

    if (updatedItems.length === 0) {
      await deleteDoc(cartRef)
    } else {
      await updateDoc(cartRef, {
        items: updatedItems.map((item) => ({
          ...item,
          addedAt: Timestamp.fromDate(item.addedAt),
        })),
        updatedAt: Timestamp.now(),
      })
    }
  }
}

export async function updateCartItemQuantity(userId: string, itemId: string, quantity: number): Promise<void> {
  if (quantity <= 0) {
    await removeFromCart(userId, itemId)
    return
  }

  const cartRef = doc(db, CARTS_COLLECTION, userId)
  const existingCart = await getCart(userId)

  if (existingCart) {
    const updatedItems = existingCart.items.map((item) => (item.id === itemId ? { ...item, quantity } : item))

    await updateDoc(cartRef, {
      items: updatedItems.map((item) => ({
        ...item,
        addedAt: Timestamp.fromDate(item.addedAt),
      })),
      updatedAt: Timestamp.now(),
    })
  }
}

export async function clearCart(userId: string): Promise<void> {
  const cartRef = doc(db, CARTS_COLLECTION, userId)
  await deleteDoc(cartRef)
}
