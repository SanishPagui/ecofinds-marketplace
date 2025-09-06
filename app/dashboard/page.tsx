"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useCart } from "@/contexts/CartContext"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getUserProducts } from "@/lib/products"
import { getUserPurchaseStats } from "@/lib/purchases"
import { Package, ShoppingCart, History, TrendingUp } from "lucide-react"

export default function DashboardPage() {
  const { userProfile } = useAuth()
  const { getCartItemCount } = useCart()
  const { user } = useAuth()
  const [stats, setStats] = useState({
    listings: 0,
    purchases: 0,
    totalSpent: 0,
    itemsSaved: 0,
  })

  useEffect(() => {
    if (user) {
      loadStats()
    }
  }, [user])

  const loadStats = async () => {
    if (!user) return

    try {
      const [userProducts, purchaseStats] = await Promise.all([
        getUserProducts(user.uid),
        getUserPurchaseStats(user.uid),
      ])

      setStats({
        listings: userProducts.length,
        purchases: purchaseStats.totalPurchases,
        totalSpent: purchaseStats.totalSpent,
        itemsSaved: purchaseStats.itemsSaved,
      })
    } catch (error) {
      console.error("Failed to load stats:", error)
    }
  }

  const cartItemCount = getCartItemCount()

  const dashboardStats = [
    {
      title: "My Listings",
      value: stats.listings.toString(),
      description: "Active product listings",
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Cart Items",
      value: cartItemCount.toString(),
      description: "Items in your cart",
      icon: ShoppingCart,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Purchases",
      value: stats.purchases.toString(),
      description: "Total purchases made",
      icon: History,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Impact Score",
      value: stats.itemsSaved.toString(),
      description: "Items saved from waste",
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {userProfile?.username || "User"}!</h1>
          <p className="text-gray-600 mt-2">Here's what's happening with your sustainable marketplace activity.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {dashboardStats.map((stat) => {
            const Icon = stat.icon
            return (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
                  <div className={`p-2 rounded-full ${stat.bgColor}`}>
                    <Icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-gray-600 mt-1">{stat.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Get started with your sustainable marketplace journey</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium">List your first item</h3>
                  <p className="text-sm text-gray-600">Start selling items you no longer need</p>
                </div>
                <Package className="h-5 w-5 text-green-600" />
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium">Browse marketplace</h3>
                  <p className="text-sm text-gray-600">Find unique second-hand treasures</p>
                </div>
                <ShoppingCart className="h-5 w-5 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Environmental Impact</CardTitle>
              <CardDescription>Your contribution to sustainable consumption</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <div className="text-4xl font-bold text-green-600 mb-2">{stats.itemsSaved}</div>
                <p className="text-gray-600">Items saved from landfill</p>
                <p className="text-sm text-gray-500 mt-2">
                  {stats.totalSpent > 0
                    ? `Total spent: $${stats.totalSpent.toFixed(2)}`
                    : "Start buying and selling to make an impact!"}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
