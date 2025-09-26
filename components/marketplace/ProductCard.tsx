"use client"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Heart, ShoppingCart, Star, MapPin, Eye, Sparkles, Package } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useCart } from "@/contexts/CartContext"
import { useAuth } from "@/contexts/AuthContext"
import { useToast } from "@/hooks/use-toast"
import { useAnimation } from "@/contexts/AnimationContext"
import type { Product } from "@/types/product"

interface ProductCardProps {
  product: Product
  index?: number
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const [loading, setLoading] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const { addItem } = useCart()
  const { user } = useAuth()
  const { toast } = useToast()
  
  // Refs for animations
  const cardRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const buttonsRef = useRef<HTMLDivElement>(null)

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
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

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsLiked(!isLiked)
  }

  const isOwnProduct = user?.uid === product.sellerId

  // Get animation functions from context
  const { animateElement } = useAnimation()
  
  // GSAP animations
  useEffect(() => {
    if (cardRef.current) {
      animateElement(cardRef.current, "scaleIn", { duration: 0.5, delay: 0 })
    }
    if (imageRef.current) {
      animateElement(imageRef.current, "fadeIn", { duration: 0.5, delay: 0.1 })
    }
    if (contentRef.current) {
      animateElement(contentRef.current, "fadeIn", { duration: 0.5, delay: 0.2 })
    }
    if (buttonsRef.current) {
      animateElement(buttonsRef.current, "fadeIn", { duration: 0.5, delay: 0.3 })
    }
  }, [animateElement])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        delay: index * 0.1, 
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1]
      }}
      className="group h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ willChange: 'transform' }}
    >
      <Link href={`/marketplace/${product.id}`}>
        <Card ref={cardRef} className="card-minimal overflow-hidden relative h-full transition-all duration-300 group-hover:shadow-elegant">
          
          <CardContent className="p-0 relative z-10 h-full flex flex-col">
            {/* Image Container */}
            <div ref={imageRef} className="relative aspect-square overflow-hidden">
              {product.imageUrl ? (
                <Image
                  src={product.imageUrl || "/placeholder.svg"}
                  alt={product.title}
                  fill
                  className={`object-cover transition-all duration-700 group-hover:scale-105 ${
                    imageLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                  onLoad={() => setImageLoaded(true)}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              ) : (
                <div className="w-full h-full bg-gray-50 flex items-center justify-center">
                  <Package className="h-12 w-12 text-gray-400" />
                </div>
              )}
              
              {/* Shimmer loading effect */}
              {!imageLoaded && product.imageUrl && (
                <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-white to-gray-200 animate-shimmer" />
              )}
              
              {/* Overlay with actions - Only show on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {/* Action buttons */}
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={isHovered ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                    transition={{ delay: 0.1, duration: 0.2 }}
                  >
                    <Button
                      size="icon"
                      className="h-9 w-9 bg-white/90 text-gray-700 hover:bg-white hover:text-red-500 transition-colors shadow-subtle"
                      onClick={handleLike}
                    >
                      <Heart className={`h-4 w-4 transition-all duration-200 ${
                        isLiked ? 'fill-red-500 text-red-500' : ''
                      }`} />
                    </Button>
                  </motion.div>
                  
                  {!isOwnProduct && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={isHovered ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                      transition={{ delay: 0.15, duration: 0.2 }}
                    >
                      <Button
                        size="icon"
                        className="h-9 w-9 bg-white/90 text-gray-700 hover:bg-black hover:text-white transition-colors shadow-subtle"
                        onClick={handleAddToCart}
                        disabled={loading}
                      >
                        <ShoppingCart className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  )}
                </div>
                
                {/* Quick view button */}
                <motion.div
                  className="absolute bottom-4 left-4 right-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={isHovered ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                  transition={{ delay: 0.2, duration: 0.2 }}
                >
                  <Button 
                    className="w-full bg-white/90 text-gray-900 hover:bg-white transition-colors shadow-subtle"
                    size="sm"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Quick View
                  </Button>
                </motion.div>
              </div>
              
              {/* Category badge */}
              <div className="absolute top-4 left-4">
                <Badge className="bg-white/90 text-gray-700 border border-gray-200/50 shadow-subtle">
                  {product.category}
                </Badge>
              </div>
            </div>
            
            {/* Content */}
            <div ref={contentRef} className="p-6 space-y-4 flex-1 flex flex-col bg-white">
              <div className="space-y-2 flex-1">
                <h3 className="font-serif text-lg font-medium line-clamp-2 group-hover:text-gray-900 transition-colors duration-200">
                  {product.title}
                </h3>
                <p className="body-sm text-gray-600 line-clamp-2 leading-relaxed">
                  {product.description}
                </p>
              </div>
              
              {/* Price and seller info */}
              <div className="flex items-center justify-between mt-auto pt-2">
                <div className="flex items-center gap-1">
                  <span className="text-xl font-serif font-semibold text-black">
                    ₹{product.price}
                  </span>
                </div>
                
                <div className="text-xs text-gray-500 font-medium">
                  by {product.sellerName}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  )
}
