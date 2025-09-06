"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
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
import { useCart } from "@/contexts/CartContext"
import { useAuth } from "@/contexts/AuthContext"
import { useToast } from "@/hooks/use-toast"
import { createPurchase } from "@/lib/purchases"
import { Package, Trash2, ShoppingCart, Minus, Plus } from "lucide-react"
import Link from "next/link"

export default function CartPage() {
  const { cart, loading, removeItem, updateQuantity, clearCartItems, getCartTotal } = useCart()
  const { user, userProfile } = useAuth()
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set())
  const [checkingOut, setCheckingOut] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return

    setUpdatingItems((prev) => new Set(prev).add(itemId))
    try {
      await updateQuantity(itemId, newQuantity)
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update quantity",
        variant: "destructive",
      })
    } finally {
      setUpdatingItems((prev) => {
        const newSet = new Set(prev)
        newSet.delete(itemId)
        return newSet
      })
    }
  }

  const handleRemoveItem = async (itemId: string, itemTitle: string) => {
    try {
      await removeItem(itemId)
      toast({
        title: "Item removed",
        description: `₹{itemTitle} has been removed from your cart`,
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to remove item",
        variant: "destructive",
      })
    }
  }

  const handleClearCart = async () => {
    try {
      await clearCartItems()
      toast({
        title: "Cart cleared",
        description: "All items have been removed from your cart",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to clear cart",
        variant: "destructive",
      })
    }
  }

  const handleCheckout = async () => {
    if (!user || !userProfile || !cart) return

    setCheckingOut(true)
    try {
      const purchaseItems = cart.items.map((item) => ({
        productId: item.productId,
        productTitle: item.productTitle,
        productPrice: item.productPrice,
        productCategory: item.productCategory,
        productImageUrl: item.productImageUrl,
        sellerId: item.sellerId,
        sellerName: item.sellerName,
        quantity: item.quantity,
      }))

      await createPurchase(
        {
          items: purchaseItems,
          totalAmount: getCartTotal(),
        },
        user.uid,
        userProfile.username,
      )

      await clearCartItems()

      toast({
        title: "Order placed successfully!",
        description: "Your sustainable purchase has been confirmed",
      })

      router.push("/dashboard/history")
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to process checkout",
        variant: "destructive",
      })
    } finally {
      setCheckingOut(false)
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

  const cartItems = cart?.items || []
  const total = getCartTotal()

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
            <p className="text-gray-600 mt-2">
              {cartItems.length === 0
                ? "Your cart is empty"
                : `${cartItems.length} item${cartItems.length !== 1 ? "s" : ""} in your cart`}
            </p>
          </div>
          {cartItems.length > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="text-red-600 hover:text-red-700 bg-transparent">
                  Clear Cart
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Clear Cart</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to remove all items from your cart? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleClearCart} className="bg-red-600 hover:bg-red-700">
                    Clear Cart
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>

        {cartItems.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <ShoppingCart className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
              <p className="text-gray-600 text-center mb-6">
                Start shopping to add items to your cart and contribute to sustainable consumption.
              </p>
              <Link href="/marketplace">
                <Button className="bg-green-600 hover:bg-green-700">Browse Marketplace</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      {/* Product Image */}
                      <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Package className="h-8 w-8 text-gray-400" />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-medium text-gray-900 truncate">{item.productTitle}</h3>
                            <p className="text-sm text-gray-600">{item.productCategory}</p>
                            <p className="text-sm text-gray-500">by {item.sellerName}</p>
                          </div>
                          <p className="text-lg font-bold text-green-600">₹{item.productPrice}</p>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1 || updatingItems.has(item.id)}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <Input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => {
                                const newQuantity = Number.parseInt(e.target.value) || 1
                                if (newQuantity !== item.quantity) {
                                  handleQuantityChange(item.id, newQuantity)
                                }
                              }}
                              className="w-16 text-center"
                              min="1"
                              disabled={updatingItems.has(item.id)}
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                              disabled={updatingItems.has(item.id)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Remove Item</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to remove "{item.productTitle}" from your cart?
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleRemoveItem(item.id, item.productTitle)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Remove
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="truncate mr-2">
                          {item.productTitle} × {item.quantity}
                        </span>
                        <span>₹{(item.productPrice * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-green-600">₹{total.toFixed(2)}</span>
                  </div>

                  <Button
                    onClick={handleCheckout}
                    disabled={checkingOut}
                    className="w-full bg-green-600 hover:bg-green-700"
                    size="lg"
                  >
                    {checkingOut ? "Processing..." : "Complete Purchase"}
                  </Button>

                  <p className="text-xs text-gray-500 text-center">Secure checkout • Sustainable shopping</p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
