import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  Timestamp,
} from "firebase/firestore"
import { db } from "@/lib/firebase"
import type { Product, CreateProductData } from "@/types/product"

const PRODUCTS_COLLECTION = "products"

export async function createProduct(
  productData: CreateProductData,
  sellerId: string,
  sellerName: string,
): Promise<string> {
  const docRef = await addDoc(collection(db, PRODUCTS_COLLECTION), {
    ...productData,
    sellerId,
    sellerName,
    status: "active",
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  })
  return docRef.id
}

export async function updateProduct(productId: string, updates: Partial<CreateProductData>): Promise<void> {
  const productRef = doc(db, PRODUCTS_COLLECTION, productId)
  await updateDoc(productRef, {
    ...updates,
    updatedAt: Timestamp.now(),
  })
}

export async function deleteProduct(productId: string): Promise<void> {
  const productRef = doc(db, PRODUCTS_COLLECTION, productId)
  await deleteDoc(productRef)
}

export async function getProductById(productId: string): Promise<Product | null> {
  const productRef = doc(db, PRODUCTS_COLLECTION, productId)
  const productSnap = await getDoc(productRef)

  if (productSnap.exists()) {
    const data = productSnap.data()
    return {
      id: productSnap.id,
      ...data,
      createdAt: data.createdAt.toDate(),
      updatedAt: data.updatedAt.toDate(),
    } as Product
  }

  return null
}

export async function getUserProducts(userId: string): Promise<Product[]> {
  const q = query(collection(db, PRODUCTS_COLLECTION), where("sellerId", "==", userId), orderBy("createdAt", "desc"))

  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt.toDate(),
    updatedAt: doc.data().updatedAt.toDate(),
  })) as Product[]
}

export async function getAllProducts(): Promise<Product[]> {
  console.log("[v0] Fetching all products from Firestore")
  const q = query(collection(db, PRODUCTS_COLLECTION), where("status", "==", "active"), orderBy("createdAt", "desc"))

  const querySnapshot = await getDocs(q)
  console.log("[v0] Firestore query result:", querySnapshot.size, "documents")

  const products = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt.toDate(),
    updatedAt: doc.data().updatedAt.toDate(),
  })) as Product[]

  console.log("[v0] Processed products:", products)
  return products
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  const q = query(
    collection(db, PRODUCTS_COLLECTION),
    where("category", "==", category),
    where("status", "==", "active"),
    orderBy("createdAt", "desc"),
  )

  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt.toDate(),
    updatedAt: doc.data().updatedAt.toDate(),
  })) as Product[]
}

export async function searchProducts(searchTerm: string): Promise<Product[]> {
  const allProducts = await getAllProducts()

  const searchLower = searchTerm.toLowerCase()
  return allProducts.filter(
    (product) =>
      product.title.toLowerCase().includes(searchLower) ||
      product.description.toLowerCase().includes(searchLower) ||
      product.category.toLowerCase().includes(searchLower),
  )
}

export async function getProductsByFilters(filters: {
  categories?: string[]
  minPrice?: number
  maxPrice?: number
  searchTerm?: string
  condition?: string[]
  rating?: number
  availability?: string[]
  sortBy?: string
}): Promise<Product[]> {
  console.log("[v2] Getting products with advanced filters:", filters)

  let products = await getAllProducts()
  console.log("[v2] Initial products count:", products.length)

  // Categories filter
  if (filters.categories && filters.categories.length > 0) {
    products = products.filter(product => 
      filters.categories!.some(category => 
        product.category?.toLowerCase() === category.toLowerCase()
      )
    )
  }

  // Price filters
  if (filters.minPrice !== undefined) {
    products = products.filter((product) => Number(product.price) >= filters.minPrice!)
  }

  if (filters.maxPrice !== undefined) {
    products = products.filter((product) => Number(product.price) <= filters.maxPrice!)
  }

  // Search filter
  if (filters.searchTerm) {
    const searchLower = filters.searchTerm.toLowerCase()
    products = products.filter(
      (product) =>
        product.title.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower) ||
        product.category?.toLowerCase().includes(searchLower) ||
        product.sellerName?.toLowerCase().includes(searchLower)
    )
  }

  // Condition filter (placeholder - would need condition field in Product type)
  if (filters.condition && filters.condition.length > 0) {
    // For now, we'll simulate this by filtering based on price ranges as a proxy for condition
    // In a real app, you'd have a condition field in the Product type
    products = products.filter(product => {
      const price = Number(product.price)
      if (filters.condition!.includes("new") && price > 1000) return true
      if (filters.condition!.includes("excellent") && price > 500 && price <= 1000) return true
      if (filters.condition!.includes("good") && price > 100 && price <= 500) return true
      if (filters.condition!.includes("fair") && price <= 100) return true
      return filters.condition!.length === 0
    })
  }

  // Rating filter (placeholder - would need rating field in Product type)
  if (filters.rating && filters.rating > 0) {
    // For now, we'll simulate this by using product age as a proxy for rating
    // In a real app, you'd have a rating field in the Product type
    const now = new Date()
    products = products.filter(product => {
      const daysSinceCreated = Math.floor((now.getTime() - product.createdAt.getTime()) / (1000 * 3600 * 24))
      const simulatedRating = Math.max(1, 5 - Math.floor(daysSinceCreated / 10))
      return simulatedRating >= filters.rating!
    })
  }

  // Availability filter (placeholder)
  if (filters.availability && filters.availability.length > 0) {
    // For now, all products are considered "available"
    // In a real app, you'd have availability fields in the Product type
    if (!filters.availability.includes("available")) {
      products = []
    }
  }

  // Sorting
  switch (filters.sortBy) {
    case "price-low":
      products.sort((a, b) => Number(a.price) - Number(b.price))
      break
    case "price-high":
      products.sort((a, b) => Number(b.price) - Number(a.price))
      break
    case "oldest":
      products.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
      break
    case "rating":
      // Simulate rating sort using price as proxy
      products.sort((a, b) => Number(b.price) - Number(a.price))
      break
    case "popular":
      // Simulate popularity using creation date as proxy
      products.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      break
    case "newest":
    default:
      products.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      break
  }

  console.log("[v2] Filtered and sorted products count:", products.length)
  return products
}
