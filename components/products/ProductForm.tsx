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
import { Upload, X, ImageIcon } from "lucide-react"

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
  const [imagePreview, setImagePreview] = useState<string>(product?.imageUrl || "")
  const [imageFile, setImageFile] = useState<File | null>(null)

  const { user, userProfile } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  const compressImage = (file: File, maxWidth = 800, quality = 0.8): Promise<string> => {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")!
      const img = new Image()

      img.onload = () => {
        // Calculate new dimensions
        const ratio = Math.min(maxWidth / img.width, maxWidth / img.height)
        canvas.width = img.width * ratio
        canvas.height = img.height * ratio

        // Draw and compress
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        const compressedDataUrl = canvas.toDataURL("image/jpeg", quality)
        resolve(compressedDataUrl)
      }

      img.src = URL.createObjectURL(file)
    })
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file",
        variant: "destructive",
      })
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB",
        variant: "destructive",
      })
      return
    }

    setImageFile(file)

    try {
      const compressedImage = await compressImage(file, 800, 0.7)

      const sizeInBytes = (compressedImage.length * 3) / 4
      if (sizeInBytes > 900000) {
        // 900KB limit to stay under 1MB
        toast({
          title: "Image too large",
          description: "Please select a smaller image or try a different format",
          variant: "destructive",
        })
        return
      }

      setImagePreview(compressedImage)
      setFormData((prev) => ({ ...prev, imageUrl: compressedImage }))
    } catch (error) {
      toast({
        title: "Error processing image",
        description: "Failed to process the image. Please try again.",
        variant: "destructive",
      })
    }
  }

  const removeImage = () => {
    setImageFile(null)
    setImagePreview("")
    setFormData((prev) => ({ ...prev, imageUrl: "" }))
  }

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

          {/* Image Upload */}
          <div className="space-y-2">
            <Label>Product Image</Label>
            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview || "/placeholder.svg"}
                  alt="Product preview"
                  className="w-full h-48 object-cover rounded-lg border"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={removeImage}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">Upload a product image</p>
                <p className="text-sm text-gray-500 mb-4">JPG, PNG up to 5MB</p>
                <label htmlFor="image-upload">
                  <Button type="button" variant="outline" className="cursor-pointer bg-transparent" asChild>
                    <span>
                      <Upload className="h-4 w-4 mr-2" />
                      Choose Image
                    </span>
                  </Button>
                </label>
                <input id="image-upload" type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </div>
            )}
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
