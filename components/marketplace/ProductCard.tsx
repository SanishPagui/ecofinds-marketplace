"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useCart } from "@/contexts/CartContext"
import { useAuth } from "@/contexts/AuthContext"
import { useToast } from "@/hooks/use-toast"
import type { Product } from "@/types/product"
import { Package, ShoppingCart } from "lucide-react"
import Link from "next/link"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const [loading, setLoading] = useState(false)
  const { addItem } = useCart()
  const { user } = useAuth()
  const { toast } = useToast()

  const handleAddToCart = async () => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to add items to cart",
        variant: "destructive",
      })
      return
    }

    if (user.uid === product.sellerId) {
      toast({
        title: "Cannot add own item",
        description: "You cannot add your own items to cart",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
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
      setLoading(false)
    }
  }

  const isOwnProduct = user?.uid === product.sellerId

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-square bg-gray-100 flex items-center justify-center overflow-hidden">
        {product.imageUrl ? (
          <img
            src={product.imageUrl || "/placeholder.svg"}
            alt={product.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <Package className="h-12 w-12 text-gray-400" />
        )}
      </div>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg line-clamp-1">{product.title}</CardTitle>
          <Badge variant="secondary">{product.category}</Badge>
        </div>
        <CardDescription className="line-clamp-2">{product.description}</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-2xl font-bold text-green-600">₹{product.price}</p>
            <p className="text-sm text-gray-500">by {product.sellerName}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/marketplace/${product.id}`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full bg-transparent">
              View Details
            </Button>
          </Link>
          {!isOwnProduct && (
            <Button size="sm" onClick={handleAddToCart} disabled={loading} className="bg-green-600 hover:bg-green-700">
              <ShoppingCart className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
