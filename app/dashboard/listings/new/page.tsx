"use client"

import { ProductForm } from "@/components/products/ProductForm"

export default function NewListingPage() {
  return (
    <div className="space-y-6 p-6 lg:p-8 max-w-7xl mx-auto">
      <div>
        <h1 className="heading-xl text-left">Create New Listing</h1>
        <p className="body-lg text-gray-600 mt-3">
          Add a new item to the EcoFinds marketplace and start selling sustainably.
        </p>
      </div>

      <ProductForm mode="create" />
    </div>
  )
}
