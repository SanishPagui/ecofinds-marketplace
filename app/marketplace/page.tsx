"use client"

import { useState, useEffect, useRef } from "react"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { ProductCard } from "@/components/marketplace/ProductCard"
import { SearchFilters } from "@/components/marketplace/SearchFilters"
import { useToast } from "@/hooks/use-toast"
import { getProductsByFilters } from "@/lib/products"
import type { Product } from "@/types/product"
import { Package } from "lucide-react"

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
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-green-600"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl shadow-sm">
        {/* Header */}
        <div ref={headerRef} className="text-center">
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
                  <div className="bg-green-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
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
                        ref={(el) => (productCardsRef.current[index] = el)}
                        className="group transition-all duration-500 hover:scale-105 hover:-translate-y-2"
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
