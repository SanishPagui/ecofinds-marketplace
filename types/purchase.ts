export interface PurchaseItem {
  productId: string
  productTitle: string
  productPrice: number
  productCategory: string
  productImageUrl?: string
  sellerId: string
  sellerName: string
  quantity: number
}

export interface Purchase {
  id: string
  buyerId: string
  buyerName: string
  items: PurchaseItem[]
  totalAmount: number
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled"
  paymentMethod?: string
  paymentDetails?: any
  createdAt: Date
  updatedAt: Date
}

export interface CreatePurchaseData {
  items: PurchaseItem[]
  totalAmount: number
  paymentMethod?: string
  paymentDetails?: any
}
