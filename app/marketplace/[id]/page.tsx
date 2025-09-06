"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { useCart } from "@/contexts/CartContext"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { getProductById } from "@/lib/products"
import type { Product } from "@/types/product"
import { Package, ShoppingCart, ArrowLeft, User, Calendar } from "lucide-react"
import Link from "next/link"

export default function ProductDetailPage() {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [addingToCart, setAddingToCart] = useState(false)
  const { user } = useAuth()
  const { addItem } = useCart()
  const { toast } = useToast()
  const router = useRouter()
  const params = useParams()
  const productId = params.id as string

  useEffect(() => {
    if (productId) {
      loadProduct()
    }
  }, [productId])

  const loadProduct = async () => {
    try {
      const productData = await getProductById(productId)

      if (!productData) {
        toast({
          title: "Error",
          description: "Product not found",
          variant: "destructive",
        })
        router.push("/marketplace")
        return
      }

      setProduct(productData)
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load product",
        variant: "destructive",
      })
      router.push("/marketplace")
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = async () => {
    if (!product || !user) return

    if (user.uid === product.sellerId) {
      toast({
        title: "Cannot add own item",
        description: "You cannot add your own items to cart",
        variant: "destructive",
      })
      return
    }

    setAddingToCart(true)
    try {
      await addItem({
        productId: product.id,
        productTitle: product.title,
        productPrice: product.price,
        productCategory: product.category,
        productImageUrl: product.imageUrl,
        sellerId: product.sellerId,
        sellerName: product.sellerName,
      })

      toast({
        title: "Added to cart",
        description: `${product.title} has been added to your cart`,
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setAddingToCart(false)
    }
  }

  const isOwnProduct = user?.uid === product?.sellerId

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
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Back Button */}
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Marketplace
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
            <Package className="h-24 w-24 text-gray-400" />
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between mb-2">
                <h1 className="text-3xl font-bold text-gray-900">{product.title}</h1>
                <Badge variant="secondary">{product.category}</Badge>
              </div>
              <p className="text-3xl font-bold text-green-600">${product.price}</p>
            </div>

            <Separator />

            {/* Seller Info */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Seller Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="font-medium">{product.sellerName}</p>
                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Listed on {product.createdAt.toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-3">
              {!isOwnProduct ? (
                <Button
                  onClick={handleAddToCart}
                  disabled={addingToCart}
                  className="w-full bg-green-600 hover:bg-green-700"
                  size="lg"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  {addingToCart ? "Adding to Cart..." : "Add to Cart"}
                </Button>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm text-gray-600 text-center">This is your listing</p>
                  <Link href={`/dashboard/listings/${product.id}/edit`}>
                    <Button variant="outline" className="w-full bg-transparent" size="lg">
                      Edit Listing
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Product Description */}
        <Card>
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 whitespace-pre-wrap">{product.description}</p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
