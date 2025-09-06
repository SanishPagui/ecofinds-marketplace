"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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

  useEffect(() => {
    if (user) {
      loadProducts()
    }
  }, [user])

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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Listings</h1>
            <p className="text-gray-600 mt-2">Manage your product listings and track their performance.</p>
          </div>
          <Link href="/dashboard/listings/new">
            <Button className="bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" />
              Add New Listing
            </Button>
          </Link>
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Package className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No listings yet</h3>
              <p className="text-gray-600 text-center mb-6">Start selling by creating your first product listing.</p>
              <Link href="/dashboard/listings/new">
                <Button className="bg-green-600 hover:bg-green-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Listing
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="overflow-hidden">
                <div className="aspect-square bg-gray-100 flex items-center justify-center">
                  <Package className="h-12 w-12 text-gray-400" />
                </div>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg line-clamp-1">{product.title}</CardTitle>
                    <Badge className={getStatusColor(product.status)}>{product.status}</Badge>
                  </div>
                  <CardDescription className="line-clamp-2">{product.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-2xl font-bold text-green-600">${product.price}</p>
                      <p className="text-sm text-gray-500">{product.category}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/dashboard/listings/${product.id}/edit`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full bg-transparent">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </Link>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700 bg-transparent"
                          disabled={deleteLoading === product.id}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Listing</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{product.title}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(product.id)}
                            className="bg-red-600 hover:bg-red-700"
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
    </DashboardLayout>
  )
}
