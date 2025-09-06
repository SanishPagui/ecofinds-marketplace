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
  category?: string
  minPrice?: number
  maxPrice?: number
  searchTerm?: string
}): Promise<Product[]> {
  console.log("[v0] Getting products with filters:", filters)
  let products = await getAllProducts()
  console.log("[v0] Initial products count:", products.length)

  if (filters.category) {
    products = products.filter((product) => product.category === filters.category)
  }

  if (filters.minPrice !== undefined) {
    products = products.filter((product) => product.price >= filters.minPrice!)
  }

  if (filters.maxPrice !== undefined) {
    products = products.filter((product) => product.price <= filters.maxPrice!)
  }

  if (filters.searchTerm) {
    const searchLower = filters.searchTerm.toLowerCase()
    products = products.filter(
      (product) =>
        product.title.toLowerCase().includes(searchLower) || product.description.toLowerCase().includes(searchLower),
    )
  }

  console.log("[v0] Filtered products count:", products.length)
  return products
}
