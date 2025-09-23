"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { useCart } from "@/contexts/CartContext"
import { useAuth } from "@/contexts/AuthContext"
import { useAnimation } from "@/contexts/AnimationContext"
import { getProductById } from "@/lib/products"
import type { Product } from "@/types/product"
import { ArrowLeft, Package, ShoppingCart, User, Heart } from "lucide-react"

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const { addItem } = useCart()
  const { user } = useAuth()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [addingToCart, setAddingToCart] = useState(false)
  
  // Refs for animations
  const productImageRef = useRef<HTMLDivElement>(null)
  const productInfoRef = useRef<HTMLDivElement>(null)
  const productActionsRef = useRef<HTMLDivElement>(null)
  const productDescriptionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const productId = params?.id as string
    if (!productId) return

    const loadProduct = async () => {
      setLoading(true)
      try {
        const productData = await getProductById(productId)
        setProduct(productData)
      } catch (error: any) {
        console.error("Error loading product:", error)
        toast({
          title: "Error",
          description: "Failed to load product details. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadProduct()
  }, [params?.id, toast])

  // Get animation functions from context
  const { animateElement, createScrollAnimation, isMobile, getResponsiveValue } = useAnimation()
  
  // GSAP animations with responsive values
  useEffect(() => {
    if (!loading && product) {
      // On mobile, use different animation patterns
      if (isMobile) {
        // For mobile, animate image and info from bottom with shorter durations
        if (productImageRef.current) {
          animateElement(productImageRef.current, "slideInUp", { 
            duration: 0.5, 
            delay: 0.1,
            y: 30
          })
        }
        if (productInfoRef.current) {
          animateElement(productInfoRef.current, "slideInUp", { 
            duration: 0.5, 
            delay: 0.2,
            y: 30
          })
        }
      } else {
        // For desktop, use side animations
        if (productImageRef.current) {
          animateElement(productImageRef.current, "slideInLeft", { 
            duration: 0.8, 
            delay: 0.2,
            x: -50
          })
        }
        if (productInfoRef.current) {
          animateElement(productInfoRef.current, "slideInRight", { 
            duration: 0.8, 
            delay: 0.3,
            x: 50
          })
        }
      }
      
      // Common animations for both mobile and desktop
      if (productActionsRef.current) {
        animateElement(productActionsRef.current, "fadeIn", { 
          duration: getResponsiveValue(0.6, 0.4), 
          delay: getResponsiveValue(0.6, 0.3)
        })
      }
      if (productDescriptionRef.current) {
        animateElement(productDescriptionRef.current, "fadeIn", { 
          duration: getResponsiveValue(0.6, 0.4), 
          delay: getResponsiveValue(0.8, 0.4)
        })
        
        // Add scroll animation for description
        createScrollAnimation(productDescriptionRef.current, 'fadeIn', {
          duration: getResponsiveValue(0.8, 0.5),
          start: 'top 80%',
          end: 'bottom 20%'
        })
      }
    }
  }, [loading, product, animateElement, createScrollAnimation, isMobile, getResponsiveValue])

  const handleAddToCart = async () => {
    if (!product) return
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

  if (loading) {
    return (
      <div className="p-6 lg:p-8 max-w-7xl mx-auto">
        <div className="flex flex-col items-center justify-center py-16 space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-black"></div>
          <div className="text-gray-600 font-medium animate-pulse">Loading product details...</div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="p-6 lg:p-8 max-w-7xl mx-auto">
        <div className="flex flex-col items-center justify-center py-16 space-y-4">
          <Package className="h-16 w-16 text-gray-400" />
          <h2 className="heading-lg text-center">Product not found</h2>
          <p className="body-md text-gray-600 text-center">The product you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => router.push("/marketplace")} className="mt-4 bg-black hover:bg-gray-800 text-white">
            Back to Marketplace
          </Button>
        </div>
      </div>
    )
  }

  const isOwnProduct = user?.uid === product.sellerId

  return (
    <div className="space-y-8 p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Back button */}
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="flex items-center text-gray-700 hover:text-black hover:bg-gray-50"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Marketplace
      </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Image */}
          <div ref={productImageRef} className="bg-white rounded-xl shadow-lg border border-green-100 p-6 hover:shadow-xl transition-all duration-300">
            <div className="aspect-square bg-gradient-to-br from-gray-50 to-green-50 rounded-lg flex items-center justify-center overflow-hidden">
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <Package className="h-24 w-24 text-gray-400" />
              )}
            </div>
            <div className="mt-4 flex justify-end">
              <Button variant="ghost" size="sm" className="text-rose-500 hover:text-rose-600 hover:bg-rose-50">
                <Heart className="h-5 w-5 mr-1" />
                Save
              </Button>
            </div>
          </div>

          {/* Product Info */}
          <div ref={productInfoRef} className="space-y-6">
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">{product.title}</h1>
                    <div className="flex items-center mt-2 space-x-2">
                      <Badge variant="secondary">{product.category}</Badge>
                      <span className="text-gray-500">•</span>
                      <div className="flex items-center text-gray-600">
                        <User className="h-4 w-4 mr-1" />
                        <span>{product.sellerName}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-green-600">${product.price}</p>
                </div>

                <Separator />

                {/* Actions */}
                <div ref={productActionsRef} className="pt-2">
                  {!isOwnProduct && (
                    <Button
                      onClick={handleAddToCart}
                      disabled={addingToCart}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      <ShoppingCart className="mr-2 h-5 w-5" />
                      {addingToCart ? "Adding..." : "Add to Cart"}
                    </Button>
                  )}
                  {isOwnProduct && (
                    <div className="bg-amber-50 text-amber-800 p-3 rounded-md text-center">
                      This is your own listing
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Product Description */}
            <Card className="card-minimal">
              <CardContent className="p-6">
                <h2 className="heading-md mb-4">Description</h2>
                <div id="product-description" ref={productDescriptionRef} className="prose text-gray-700 bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <p className="body-md">{product.description}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
    </div>
  )
}
