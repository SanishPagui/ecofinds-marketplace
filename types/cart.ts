export interface CartItem {
  id: string
  productId: string
  productTitle: string
  productPrice: number
  productCategory: string
  productImageUrl?: string
  sellerId: string
  sellerName: string
  quantity: number
  addedAt: Date
}

export interface Cart {
  id: string
  userId: string
  items: CartItem[]
  updatedAt: Date
}

export interface AddToCartData {
  productId: string
  productTitle: string
  productPrice: number
  productCategory: string
  productImageUrl?: string
  sellerId: string
  sellerName: string
  quantity?: number
}
