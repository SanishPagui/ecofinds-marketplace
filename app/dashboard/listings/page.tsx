"use client"

import { useState, useEffect, useRef } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAnimation } from "@/contexts/AnimationContext"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import { getUserProducts, deleteProduct } from "@/lib/products"
import type { Product } from "@/types/product"
import { Plus, Edit, Trash2, Package } from "lucide-react"
import Link from "next/link"

export default function MyListingsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null)
  const { user } = useAuth()
  const { toast } = useToast()
  const { animateElement, isMobile, getResponsiveValue } = useAnimation()

  // Refs for animations
  const headerRef = useRef<HTMLDivElement>(null)
  const addButtonRef = useRef<HTMLDivElement>(null)
  const emptyListingRef = useRef<HTMLDivElement>(null)
  const productsGridRef = useRef<HTMLDivElement>(null)
  const productCardRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    if (user) {
      loadProducts()
    }
  }, [user])

  // Animation effect
  useEffect(() => {
    if (!loading) {
      if (headerRef.current) {
        animateElement(headerRef.current, "fadeIn", {
          duration: getResponsiveValue(0.8, 0.6),
          delay: getResponsiveValue(0.2, 0.1),
        })
      }

      if (addButtonRef.current) {
        animateElement(addButtonRef.current, "scaleIn", {
          duration: getResponsiveValue(0.6, 0.4),
          delay: getResponsiveValue(0.4, 0.2),
        })
      }

      if (products.length === 0 && emptyListingRef.current) {
        animateElement(emptyListingRef.current, "fadeIn", {
          duration: getResponsiveValue(0.8, 0.6),
          delay: getResponsiveValue(0.5, 0.3),
        })
      } else if (products.length > 0 && productsGridRef.current) {
        animateElement(productsGridRef.current, "fadeIn", {
          duration: getResponsiveValue(0.8, 0.6),
          delay: getResponsiveValue(0.5, 0.3),
        })

        // Animate each card
        productCardRefs.current.forEach((card, index) => {
          if (card) {
            const animation = isMobile ? "slideInUp" : "scaleIn"
            animateElement(card, animation, {
              duration: getResponsiveValue(0.6, 0.4),
              delay: getResponsiveValue(0.6 + index * 0.1, 0.4 + index * 0.08),
              y: isMobile ? 20 : 0,
            })

            const onEnter = () => animateElement(card, "pulse", { duration: 0.4 })
            card.addEventListener("mouseenter", onEnter)
            ;(card as any).__onEnter = onEnter
          }
        })
      }

      return () => {
        productCardRefs.current.forEach((card) => {
          if (card && (card as any).__onEnter) {
            card.removeEventListener("mouseenter", (card as any).__onEnter)
          }
        })
      }
    }
  }, [loading, products, animateElement, getResponsiveValue, isMobile])

  const loadProducts = async () => {
    if (!user) return

    try {
      const userProducts = await getUserProducts(user.uid)
      setProducts(userProducts)
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load your listings",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (productId: string) => {
    setDeleteLoading(productId)
    try {
      await deleteProduct(productId)
      setProducts((prev) => prev.filter((p) => p.id !== productId))
      toast({
        title: "Success",
        description: "Product listing deleted successfully",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete product listing",
        variant: "destructive",
      })
    } finally {
      setDeleteLoading(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "sold":
        return "bg-blue-100 text-blue-800"
      case "inactive":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <div className="p-6 lg:p-8">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div ref={headerRef}>
          <h1 className="heading-xl text-left">My Listings</h1>
          <p className="body-lg text-gray-600 mt-3">
            Manage your product listings and track their performance.
          </p>
        </div>
        <div ref={addButtonRef}>
          <Link href="/dashboard/listings/new">
            <Button className="bg-black hover:bg-gray-800 text-white shadow-subtle transition-all duration-200 hover:scale-105">
              <Plus className="h-4 w-4 mr-2" />
              Add New Listing
            </Button>
          </Link>
        </div>
      </div>

      {/* Products Grid */}
      {products.length === 0 ? (
        <Card ref={emptyListingRef} className="card-minimal">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="bg-black/5 rounded-full w-16 h-16 flex items-center justify-center mb-6">
              <Package className="h-8 w-8 text-black" />
            </div>
            <h3 className="heading-md text-center mb-4">No listings yet</h3>
            <p className="body-md text-gray-600 text-center mb-8 max-w-md">
              Start selling by creating your first product listing.
            </p>
            <Link href="/dashboard/listings/new">
              <Button className="bg-black hover:bg-gray-800 text-white shadow-subtle transition-all duration-200 hover:scale-105">
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Listing
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div
          ref={productsGridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {products.map((product, index) => (
            <Card
              key={product.id}
              ref={(el: HTMLDivElement | null) => {
                productCardRefs.current[index] = el;
              }}
              className="card-minimal overflow-hidden transition-all duration-300 hover:shadow-elegant"
            >
              {/* Product Image */}
              <div className="aspect-square bg-gray-50 flex items-center justify-center overflow-hidden">
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

              {/* Card Content */}
              <CardHeader className="pb-4 px-6 pt-6">
                <div className="flex items-start justify-between">
                  <CardTitle className="font-serif text-lg font-medium line-clamp-1">{product.title}</CardTitle>
                  <Badge className={`${getStatusColor(product.status)} font-medium`}>{product.status}</Badge>
                </div>
                <CardDescription className="body-sm text-gray-600 line-clamp-2 mt-2">{product.description}</CardDescription>
              </CardHeader>

              <CardContent className="pt-0 px-6 pb-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-2xl font-serif font-semibold text-black">₹{product.price}</p>
                    <p className="body-sm text-gray-500 mt-1">{product.category}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Link href={`/dashboard/listings/${product.id}/edit`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full border-gray-200 hover:border-black hover:bg-gray-50 transition-all duration-200">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  </Link>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300 hover:bg-red-50 transition-all duration-200"
                        disabled={deleteLoading === product.id}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="card-minimal">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="heading-md text-left">Delete Listing</AlertDialogTitle>
                        <AlertDialogDescription className="body-md text-gray-600">
                          Are you sure you want to delete "{product.title}"? This
                          action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="border-gray-200 hover:border-gray-300 hover:bg-gray-50">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(product.id)}
                          className="bg-red-600 hover:bg-red-700 text-white"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
