"use client"

import { useState, useEffect, useRef } from "react"
import { useSearchParams } from "next/navigation"
import { ProductCard } from "@/components/marketplace/ProductCard"
import { SearchFilters } from "@/components/marketplace/SearchFilters"
import { useToast } from "@/hooks/use-toast"
import { getProductsByFilters } from "@/lib/products"
import type { Product } from "@/types/product"
import { Package, ShoppingBag } from "lucide-react"
import { LoadingSpinner, ProductCardSkeleton } from "@/components/ui/loading-spinner"
import { useAnimation } from "@/contexts/AnimationContext"

export default function MarketplacePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchLoading, setSearchLoading] = useState(false)
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const productsRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const productCardsRef = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    // Load products with search params if present
    const searchQuery = searchParams.get('q')
    const category = searchParams.get('category')
    
    if (searchQuery || category) {
      const initialFilters = {
        searchTerm: searchQuery || undefined,
        categories: category ? [category] : [],
      }
      loadProducts(initialFilters)
    } else {
      loadProducts()
    }
  }, [searchParams])
  
  // Get animation functions from context
  const { animateElement, createScrollAnimation, isMobile, getResponsiveValue } = useAnimation()
  
  // GSAP animations with responsive values
  useEffect(() => {
    if (!loading) {
      // Animate header with responsive values
      if (headerRef.current) {
        animateElement(headerRef.current, "fadeIn", { 
          duration: getResponsiveValue(0.8, 0.5), 
          delay: 0 
        })
      }
    }
      // Animate sidebar with responsive values
      const sidebar = document.querySelector('.lg\\:col-span-1 > div')
      if (sidebar) {
        // On mobile, animate from bottom instead of left
        if (isMobile) {
          animateElement(sidebar as HTMLElement, "slideInUp", { 
            duration: 0.5, 
            delay: 0.2,
            y: 30
          })
        } else {
          animateElement(sidebar as HTMLElement, "slideInLeft", { 
            duration: 0.8, 
            delay: 0.3,
            x: -50 
          })
        }
      }
      
      // Animate products container with responsive values
      if (productsRef.current) {
        // On mobile, animate from bottom instead of right
        if (isMobile) {
          animateElement(productsRef.current, "slideInUp", { 
            duration: 0.5, 
            delay: 0.3,
            y: 30
          })
        } else {
          animateElement(productsRef.current, "slideInRight", { 
            duration: 0.8, 
            delay: 0.5,
            x: 50 
          })
        }
      }
      
      // Stagger product cards with responsive values
      if (productCardsRef.current.length > 0 && products.length > 0) {
        const validRefs = productCardsRef.current.filter(ref => ref !== null) as HTMLDivElement[]
        validRefs.forEach(ref => animateElement(ref, "staggerItems", {
          stagger: getResponsiveValue(0.1, 0.05), 
          delay: getResponsiveValue(0.6, 0.4) 
        }))
      
      // Add scroll animations with responsive values
      createScrollAnimation("#marketplace-header", 'fadeIn', {
        opacity: 1,
        y: 0,
        duration: getResponsiveValue(0.8, 0.5),
        ease: "power2.out",
        // Adjust trigger points for mobile
        start: getResponsiveValue("top 80%", "top 90%"),
        end: getResponsiveValue("bottom 20%", "bottom 10%")
      })
    }
  }, [loading, products.length, animateElement, createScrollAnimation, isMobile, getResponsiveValue])

  const loadProducts = async (filters?: any) => {
    const isSearch = !!filters
    if (isSearch) {
      setSearchLoading(true)
    } else {
      setLoading(true)
    }

    try {
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("Request timed out")), 10000) // 10s timeout
      })

      const filterParams = filters
        ? {
            categories: filters.categories || [],
            minPrice: filters.minPrice || 0,
            maxPrice: filters.maxPrice || 5000,
            searchTerm: filters.searchTerm || undefined,
            condition: filters.condition || [],
            rating: filters.rating || 0,
            availability: filters.availability || [],
            sortBy: filters.sortBy || "newest",
          }
        : {}

      const productList = await Promise.race([getProductsByFilters(filterParams), timeoutPromise])
      setProducts(productList as Product[])
    } catch (error: any) {
      console.error("Error loading products:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to load products. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
      setSearchLoading(false)
    }
  }

  const handleAddToCart = (product: Product) => {
    // This function is no longer needed as ProductCard handles cart functionality internally
    toast({
      title: "Added to cart",
      description: `${product.title} has been added to your cart`,
      className: "bg-green-50 text-green-800 border-green-200",
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F7F4] p-6">
        <div className="space-y-8 max-w-7xl mx-auto">
          {/* Header Skeleton */}
          <div className="text-center py-8">
            <LoadingSpinner size="lg" variant="dots" text="Loading sustainable treasures..." />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters Sidebar Skeleton */}
            <div className="lg:col-span-1">
              <div className="card-minimal p-6 space-y-4">
                <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  ))}
                </div>
              </div>
            </div>

            {/* Products Grid Skeleton */}
            <div className="lg:col-span-3">
              <div className="card-minimal p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                  {[...Array(6)].map((_, i) => (
                    <ProductCardSkeleton key={i} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F8F7F4] p-6">
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Header */}
        <div id="marketplace-header" ref={headerRef} className="text-center py-8">
          <div className="inline-block p-3 bg-black/5 rounded-full mb-4">
            <ShoppingBag className="h-8 w-8 text-black" />
          </div>
          <h1 className="heading-xl text-center">
            EcoFinds Marketplace
          </h1>
          <p className="body-lg text-center mt-4 max-w-2xl mx-auto">
            Discover unique second-hand treasures and contribute to sustainable consumption
          </p>
          <div className="w-24 h-1 bg-black mx-auto mt-4"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="card-minimal p-6">
              <SearchFilters onFiltersChange={loadProducts} loading={searchLoading} totalProducts={products.length} />
            </div>
          </div>

          {/* Products Grid */}
          <div ref={productsRef} className="lg:col-span-3">
            <div className="card-minimal p-6">
              {products.length === 0 ? (
                <div className="text-center py-16">
                  <div className="bg-black/5 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                    <Package className="h-12 w-12 text-black" />
                  </div>
                  <h3 className="heading-md text-center mb-3">No products found</h3>
                  <p className="body-md text-center text-gray-600">
                    {searchLoading
                      ? "Searching for amazing finds..."
                      : "Try adjusting your search filters or check back later for new sustainable treasures."}
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h2 className="heading-md text-left">
                        {products.length} sustainable find{products.length !== 1 ? "s" : ""}
                      </h2>
                      <p className="body-md text-gray-600 mt-1">Ready for their next adventure</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {products.map((product, index) => (
                      <div key={product.id} className="h-full">
                        <ProductCard product={product} index={index} />
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
