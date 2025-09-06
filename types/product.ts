export interface Product {
  id: string
  title: string
  description: string
  price: number
  category: string
  imageUrl?: string
  sellerId: string
  sellerName: string
  createdAt: Date
  updatedAt: Date
  status: "active" | "sold" | "inactive"
}

export interface CreateProductData {
  title: string
  description: string
  price: number
  category: string
  imageUrl?: string
}

export const PRODUCT_CATEGORIES = [
  "Electronics",
  "Clothing & Fashion",
  "Home & Garden",
  "Books & Media",
  "Sports & Outdoors",
  "Toys & Games",
  "Furniture",
  "Art & Collectibles",
  "Automotive",
  "Other",
] as const

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number]
