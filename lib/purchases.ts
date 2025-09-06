import { collection, doc, addDoc, getDocs, getDoc, query, where, orderBy, Timestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"
import type { Purchase, CreatePurchaseData } from "@/types/purchase"

const PURCHASES_COLLECTION = "purchases"

export async function createPurchase(
  purchaseData: CreatePurchaseData,
  buyerId: string,
  buyerName: string,
): Promise<string> {
  const docRef = await addDoc(collection(db, PURCHASES_COLLECTION), {
    ...purchaseData,
    buyerId,
    buyerName,
    status: "confirmed",
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  })
  return docRef.id
}

export async function getUserPurchases(userId: string): Promise<Purchase[]> {
  const q = query(collection(db, PURCHASES_COLLECTION), where("buyerId", "==", userId), orderBy("createdAt", "desc"))

  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt.toDate(),
    updatedAt: doc.data().updatedAt.toDate(),
  })) as Purchase[]
}

export async function getPurchaseById(purchaseId: string): Promise<Purchase | null> {
  const purchaseRef = doc(db, PURCHASES_COLLECTION, purchaseId)
  const purchaseSnap = await getDoc(purchaseRef)

  if (purchaseSnap.exists()) {
    const data = purchaseSnap.data()
    return {
      id: purchaseSnap.id,
      ...data,
      createdAt: data.createdAt.toDate(),
      updatedAt: data.updatedAt.toDate(),
    } as Purchase
  }

  return null
}

export async function getUserPurchaseStats(userId: string): Promise<{
  totalPurchases: number
  totalSpent: number
  itemsSaved: number
}> {
  const purchases = await getUserPurchases(userId)

  const totalPurchases = purchases.length
  const totalSpent = purchases.reduce((sum, purchase) => sum + purchase.totalAmount, 0)
  const itemsSaved = purchases.reduce(
    (sum, purchase) => sum + purchase.items.reduce((itemSum, item) => itemSum + item.quantity, 0),
    0,
  )

  return {
    totalPurchases,
    totalSpent,
    itemsSaved,
  }
}
