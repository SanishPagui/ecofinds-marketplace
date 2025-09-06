"use client"

import { useState, useEffect, useRef } from "react"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { ProductCard } from "@/components/marketplace/ProductCard"
import { SearchFilters } from "@/components/marketplace/SearchFilters"
import { useToast } from "@/hooks/use-toast"
import { getProductsByFilters } from "@/lib/products"
import type { Product } from "@/types/product"
import { Package, ShoppingBag } from "lucide-react"
import { useAnimation } from "@/contexts/AnimationContext"

export default function MarketplacePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchLoading, setSearchLoading] = useState(false)
  const { toast } = useToast()
  const productsRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const productCardsRef = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    loadProducts()
  }, [])
  
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
            category: filters.category || undefined,
            minPrice: filters.minPrice ? Number.parseFloat(filters.minPrice) : undefined,
            maxPrice: filters.maxPrice ? Number.parseFloat(filters.maxPrice) : undefined,
            searchTerm: filters.searchTerm || undefined,
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
    toast({
      title: "Added to cart",
      description: `${product.title} has been added to your cart`,
      className: "bg-green-50 text-green-800 border-green-200",
    })
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-16 space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-green-600"></div>
          <div className="text-green-600 font-medium animate-pulse">
            {isMobile ? "Loading treasures..." : "Loading sustainable treasures..."}
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl shadow-sm">
        {/* Header */}
        <div id="marketplace-header" ref={headerRef} className="text-center py-8">
          <div className="inline-block p-3 bg-green-100 rounded-full mb-4">
            <ShoppingBag className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent">
            EcoFinds Marketplace
          </h1>
          <p className="text-green-700 mt-4 text-xl font-medium max-w-2xl mx-auto">
            Discover unique second-hand treasures and contribute to sustainable consumption
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-emerald-500 mx-auto mt-4 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-green-100 p-6">
              <SearchFilters onFiltersChange={loadProducts} loading={searchLoading} />
            </div>
          </div>

          {/* Products Grid */}
          <div ref={productsRef} className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border border-green-100 p-6">
              {products.length === 0 ? (
                <div className="text-center py-16">
                  <div className="bg-green-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 animate-pulse">
                    <Package className="h-12 w-12 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-semibold text-green-800 mb-3">No products found</h3>
                  <p className="text-green-600 text-lg">
                    {searchLoading
                      ? "Searching for amazing finds..."
                      : "Try adjusting your search filters or check back later for new sustainable treasures."}
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h2 className="text-2xl font-semibold text-green-800">
                        {products.length} sustainable find{products.length !== 1 ? "s" : ""}
                      </h2>
                      <p className="text-green-600 mt-1">Ready for their next adventure</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {products.map((product, index) => (
                      <div
                        key={product.id}
                        ref={(el: HTMLDivElement | null): void => {
                          productCardsRef.current[index] = el;
                        }}
                        className={`group transition-all duration-500 ${isMobile ? 'hover:scale-102 hover:-translate-y-1' : 'hover:scale-105 hover:-translate-y-2'}`}
                      >
                        <div className="bg-gradient-to-br from-white to-green-50 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-green-100 group-hover:border-green-300">
                          <ProductCard product={product} onAddToCart={handleAddToCart} />
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
