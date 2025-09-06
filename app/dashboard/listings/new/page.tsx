"use client"

import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { ProductForm } from "@/components/products/ProductForm"

export default function NewListingPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create New Listing</h1>
          <p className="text-gray-600 mt-2">
            Add a new item to the EcoFinds marketplace and start selling sustainably.
          </p>
        </div>

        <ProductForm mode="create" />
      </div>
    </DashboardLayout>
  )
}
