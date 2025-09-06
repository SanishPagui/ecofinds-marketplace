"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { ProductForm } from "@/components/products/ProductForm"
import { useToast } from "@/hooks/use-toast"
import { getProductById } from "@/lib/products"
import type { Product } from "@/types/product"

export default function EditListingPage() {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const params = useParams()
  const productId = params.id as string

  useEffect(() => {
    if (user && productId) {
      loadProduct()
    }
  }, [user, productId])

  const loadProduct = async () => {
    try {
      const productData = await getProductById(productId)

      if (!productData) {
        toast({
          title: "Error",
          description: "Product not found",
          variant: "destructive",
        })
        router.push("/dashboard/listings")
        return
      }

      if (productData.sellerId !== user?.uid) {
        toast({
          title: "Error",
          description: "You don't have permission to edit this product",
          variant: "destructive",
        })
        router.push("/dashboard/listings")
        return
      }

      setProduct(productData)
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load product",
        variant: "destructive",
      })
      router.push("/dashboard/listings")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        </div>
      </DashboardLayout>
    )
  }

  if (!product) {
    return null
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Listing</h1>
          <p className="text-gray-600 mt-2">Update your product listing details.</p>
        </div>

        <ProductForm product={product} mode="edit" />
      </div>
    </DashboardLayout>
  )
}
