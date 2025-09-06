"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { getUserPurchases } from "@/lib/purchases"
import type { Purchase } from "@/types/purchase"
import { Package, Calendar, ShoppingBag, TrendingUp } from "lucide-react"
import Link from "next/link"

export default function PurchaseHistoryPage() {
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    if (user) {
      loadPurchases()
    }
  }, [user])

  const loadPurchases = async () => {
    if (!user) return

    try {
      const userPurchases = await getUserPurchases(user.uid)
      setPurchases(userPurchases)
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load purchase history",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "shipped":
        return "bg-blue-100 text-blue-800"
      case "delivered":
        return "bg-purple-100 text-purple-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const totalSpent = purchases.reduce((sum, purchase) => sum + purchase.totalAmount, 0)
  const totalItems = purchases.reduce(
    (sum, purchase) => sum + purchase.items.reduce((itemSum, item) => itemSum + item.quantity, 0),
    0,
  )

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
          <h1 className="text-3xl font-bold text-gray-900">Purchase History</h1>
          <p className="text-gray-600 mt-2">Track your sustainable shopping journey and environmental impact.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Orders</CardTitle>
              <ShoppingBag className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{purchases.length}</div>
              <p className="text-xs text-gray-600 mt-1">Completed purchases</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Spent</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalSpent.toFixed(2)}</div>
              <p className="text-xs text-gray-600 mt-1">On sustainable items</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Items Saved</CardTitle>
              <Package className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalItems}</div>
              <p className="text-xs text-gray-600 mt-1">From going to waste</p>
            </CardContent>
          </Card>
        </div>

        {/* Purchase History */}
        {purchases.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <ShoppingBag className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No purchases yet</h3>
              <p className="text-gray-600 text-center mb-6">
                Start shopping sustainably to see your purchase history here.
              </p>
              <Link href="/marketplace">
                <Button className="bg-green-600 hover:bg-green-700">Browse Marketplace</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {purchases.map((purchase) => (
              <Card key={purchase.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">Order #{purchase.id.slice(-8).toUpperCase()}</CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-1">
                        <Calendar className="h-4 w-4" />
                        {purchase.createdAt.toLocaleDateString()} at {purchase.createdAt.toLocaleTimeString()}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <Badge className={getStatusColor(purchase.status)}>
                        {purchase.status.charAt(0).toUpperCase() + purchase.status.slice(1)}
                      </Badge>
                      <p className="text-lg font-bold text-green-600 mt-1">${purchase.totalAmount.toFixed(2)}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {purchase.items.map((item, index) => (
                      <div key={index}>
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Package className="h-6 w-6 text-gray-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-medium text-gray-900 truncate">{item.productTitle}</h4>
                                <p className="text-sm text-gray-600">{item.productCategory}</p>
                                <p className="text-sm text-gray-500">by {item.sellerName}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-medium">
                                  ${item.productPrice} × {item.quantity}
                                </p>
                                <p className="text-sm text-gray-600">
                                  ${(item.productPrice * item.quantity).toFixed(2)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                        {index < purchase.items.length - 1 && <Separator className="mt-3" />}
                      </div>
                    ))}
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
