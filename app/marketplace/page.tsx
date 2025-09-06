"use client"

import { useState, useEffect } from "react"
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
      const filterParams = filters
        ? {
            category: filters.category || undefined,
            minPrice: filters.minPrice ? Number.parseFloat(filters.minPrice) : undefined,
            maxPrice: filters.maxPrice ? Number.parseFloat(filters.maxPrice) : undefined,
            searchTerm: filters.searchTerm || undefined,
          }
        : {}

      const productList = await getProductsByFilters(filterParams)
      setProducts(productList)
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load products",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
      setSearchLoading(false)
    }
  }

  const handleAddToCart = (product: Product) => {
    // TODO: Implement cart functionality
    toast({
      title: "Added to cart",
      description: `${product.title} has been added to your cart`,
    })
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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Marketplace</h1>
          <p className="text-gray-600 mt-2">
            Discover unique second-hand items and contribute to sustainable consumption.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <SearchFilters onFiltersChange={loadProducts} loading={searchLoading} />
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {products.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600">
                  {searchLoading
                    ? "Searching..."
                    : "Try adjusting your search filters or check back later for new listings."}
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <p className="text-gray-600">
                    {products.length} product{products.length !== 1 ? "s" : ""} found
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
