"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { createProduct, updateProduct } from "@/lib/products"
import { PRODUCT_CATEGORIES, type Product, type CreateProductData } from "@/types/product"
import { ImageIcon } from "lucide-react"

interface ProductFormProps {
  product?: Product
  mode: "create" | "edit"
}

export function ProductForm({ product, mode }: ProductFormProps) {
  const [formData, setFormData] = useState<CreateProductData>({
    title: product?.title || "",
    description: product?.description || "",
    price: product?.price || 0,
    category: product?.category || "",
    imageUrl: product?.imageUrl || "",
  })
  const [loading, setLoading] = useState(false)
  const { user, userProfile } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user || !userProfile) {
      toast({
        title: "Error",
        description: "You must be logged in to create a listing",
        variant: "destructive",
      })
      return
    }

    if (!formData.title.trim() || !formData.description.trim() || !formData.category) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    if (formData.price <= 0) {
      toast({
        title: "Error",
        description: "Price must be greater than 0",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      if (mode === "create") {
        await createProduct(formData, user.uid, userProfile.username)
        toast({
          title: "Success",
          description: "Product listing created successfully!",
        })
      } else if (product) {
        await updateProduct(product.id, formData)
        toast({
          title: "Success",
          description: "Product listing updated successfully!",
        })
      }
      router.push("/dashboard/listings")
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

  const handleInputChange = (field: keyof CreateProductData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{mode === "create" ? "Create New Listing" : "Edit Listing"}</CardTitle>
        <CardDescription>
          {mode === "create" ? "Add a new item to the EcoFinds marketplace" : "Update your product listing details"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Product Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Product Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="Enter product title"
              required
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)} required>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {PRODUCT_CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Price */}
          <div className="space-y-2">
            <Label htmlFor="price">Price ($) *</Label>
            <Input
              id="price"
              type="number"
              min="0.01"
              step="0.01"
              value={formData.price}
              onChange={(e) => handleInputChange("price", Number.parseFloat(e.target.value) || 0)}
              placeholder="0.00"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Describe your item in detail..."
              rows={4}
              required
            />
          </div>

          {/* Image Placeholder */}
          <div className="space-y-2">
            <Label>Product Image</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Image upload coming soon</p>
              <p className="text-sm text-gray-500">For now, we'll use a placeholder image</p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={loading} className="bg-green-600 hover:bg-green-700">
              {loading ? "Saving..." : mode === "create" ? "Create Listing" : "Update Listing"}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={loading}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
