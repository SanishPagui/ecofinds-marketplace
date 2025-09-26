import { Product } from "@/types/product"
import { collection, query, where, orderBy, limit, startAfter, getDocs, DocumentSnapshot } from "firebase/firestore"
import { db } from "./firebase"

export interface SearchFilters {
  query?: string
  category?: string
  minPrice?: number
  maxPrice?: number
  condition?: string
  location?: string
  sortBy?: "newest" | "oldest" | "price-low" | "price-high" | "relevance"
}

export interface SearchResult {
  products: Product[]
  hasMore: boolean
  lastDoc: DocumentSnapshot | null
}

export async function searchProducts(
  filters: SearchFilters,
  pageSize: number = 20,
  lastDoc?: DocumentSnapshot | null
): Promise<SearchResult> {
  try {
    let q = query(collection(db, "products"))

    // Apply filters
    if (filters.category && filters.category !== "all") {
      q = query(q, where("category", "==", filters.category))
    }

    if (filters.condition && filters.condition !== "all") {
      q = query(q, where("condition", "==", filters.condition))
    }

    if (filters.minPrice !== undefined) {
      q = query(q, where("price", ">=", filters.minPrice))
    }

    if (filters.maxPrice !== undefined) {
      q = query(q, where("price", "<=", filters.maxPrice))
    }

    // Only show available products
    q = query(q, where("status", "==", "available"))

    // Apply sorting
    switch (filters.sortBy) {
      case "newest":
        q = query(q, orderBy("createdAt", "desc"))
        break
      case "oldest":
        q = query(q, orderBy("createdAt", "asc"))
        break
      case "price-low":
        q = query(q, orderBy("price", "asc"))
        break
      case "price-high":
        q = query(q, orderBy("price", "desc"))
        break
      default:
        q = query(q, orderBy("createdAt", "desc"))
    }

    // Add pagination
    if (lastDoc) {
      q = query(q, startAfter(lastDoc))
    }

    q = query(q, limit(pageSize + 1)) // Get one extra to check if there are more

    const snapshot = await getDocs(q)
    const products: Product[] = []
    
    snapshot.docs.forEach((doc, index) => {
      if (index < pageSize) { // Only include pageSize items
        products.push({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        } as Product)
      }
    })

    // Filter by search query (client-side for better flexibility)
    let filteredProducts = products
    if (filters.query && filters.query.trim()) {
      const searchTerm = filters.query.toLowerCase().trim()
      filteredProducts = products.filter(product => 
        product.title.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm) ||
        product.sellerName.toLowerCase().includes(searchTerm)
      )
    }

    const hasMore = snapshot.docs.length > pageSize
    const newLastDoc = snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1] : null

    return {
      products: filteredProducts,
      hasMore,
      lastDoc: newLastDoc
    }
  } catch (error) {
    console.error("Error searching products:", error)
    throw error
  }
}

export function getSearchSuggestions(query: string, products: Product[]): string[] {
  if (!query.trim()) return []
  
  const suggestions = new Set<string>()
  const searchTerm = query.toLowerCase()
  
  products.forEach(product => {
    // Add matching titles
    if (product.title.toLowerCase().includes(searchTerm)) {
      suggestions.add(product.title)
    }
    
    // Add matching categories
    if (product.category.toLowerCase().includes(searchTerm)) {
      suggestions.add(product.category)
    }
    
    // Add matching seller names
    if (product.sellerName.toLowerCase().includes(searchTerm)) {
      suggestions.add(product.sellerName)
    }
  })
  
  return Array.from(suggestions).slice(0, 5) // Limit to 5 suggestions
}

export const PRODUCT_CATEGORIES = [
  "all",
  "electronics",
  "clothing",
  "furniture",
  "books",
  "sports",
  "home",
  "automotive",
  "jewelry",
  "toys",
  "other"
]

export const PRODUCT_CONDITIONS = [
  "all",
  "new",
  "like-new",
  "good",
  "fair",
  "poor"
]

export const SORT_OPTIONS = [
  { value: "relevance", label: "Most Relevant" },
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
]