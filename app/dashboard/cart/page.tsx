"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { PaymentOptions } from "@/components/marketplace/PaymentOptions"
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
import { useAnimation } from "@/contexts/AnimationContext"
import { useToast } from "@/hooks/use-toast"
import { createPurchase } from "@/lib/purchases"
import { Package, Trash2, ShoppingCart, Minus, Plus } from "lucide-react"
import Link from "next/link"

export default function CartPage() {
  const { cart, loading, removeItem, updateQuantity, clearCartItems, getCartTotal } = useCart()
  const { user, userProfile } = useAuth()
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set())
  const [checkingOut, setCheckingOut] = useState(false)
  const [showPayment, setShowPayment] = useState(false)
  const { toast } = useToast()
  const router = useRouter()
  
  // Refs for animations
  const headerRef = useRef<HTMLDivElement>(null)
  const emptyCartRef = useRef<HTMLDivElement>(null)
  const cartItemsRef = useRef<HTMLDivElement>(null)
  const summaryCardRef = useRef<HTMLDivElement>(null)
  const cartItemRefs = useRef<(HTMLDivElement | null)[]>([])

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

  const handleCheckout = () => {
    if (!user || !userProfile || !cart) return
    setShowPayment(true)
  }

  const handlePaymentComplete = async (method: string, details: any) => {
    if (!user || !userProfile || !cart) return

    setCheckingOut(true)
    try {
      // Process payment with Stripe
      if (method === 'credit_card' && details.paymentMethodId) {
        // Call our Stripe API route
        const response = await fetch('/api/stripe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: getCartTotal(),
            paymentMethodId: details.paymentMethodId,
            description: `EcoFinds purchase by ${userProfile.username}`,
          }),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || 'Payment processing failed');
        }

        // If payment was successful, continue with order creation
        if (result.success && result.paymentIntent) {
          const paymentDetails = {
            ...details,
            paymentIntentId: result.paymentIntent.id,
            paymentStatus: result.paymentIntent.status,
          };

          const purchaseItems = cart.items.map((item) => ({
            productId: item.productId,
            productTitle: item.productTitle,
            productPrice: item.productPrice,
            productCategory: item.productCategory,
            productImageUrl: item.productImageUrl,
            sellerId: item.sellerId,
            sellerName: item.sellerName,
            quantity: item.quantity,
          }));

          await createPurchase(
            {
              items: purchaseItems,
              totalAmount: getCartTotal(),
              paymentMethod: 'stripe',
              paymentDetails: paymentDetails,
            },
            user.uid,
            userProfile.username,
          );

          await clearCartItems();

          toast({
            title: "Order placed successfully!",
            description: "Your sustainable purchase has been confirmed",
          });

          router.push("/dashboard/history");
        }
      } else {
        throw new Error('Invalid payment method');
      }
    } catch (error: any) {
      toast({
        title: "Payment Error",
        description: error.message || "Failed to process checkout",
        variant: "destructive",
      });
    } finally {
      setCheckingOut(false);
      setShowPayment(false);
    }
  }

  // GSAP animations with responsive features
  const { animateElement, createScrollAnimation, isMobile, getResponsiveValue } = useAnimation()
  
  useEffect(() => {
    // Animate header with responsive values
    if (headerRef.current) {
      animateElement(headerRef.current, 'fadeIn', { 
        duration: getResponsiveValue(0.5, 0.3), 
        delay: 0 
      })
    }
    
    // Animate empty cart message with responsive values
    if (emptyCartRef.current && (!cart?.items || cart.items.length === 0)) {
      animateElement(emptyCartRef.current, 'slideInUp', { 
        duration: getResponsiveValue(0.5, 0.4), 
        delay: getResponsiveValue(0.2, 0.1),
        y: getResponsiveValue(50, 30)
      })
      
      // Add hover animation to the browse button
      const browseButton = emptyCartRef.current.querySelector('a button')
      if (browseButton) {
        browseButton.addEventListener('mouseenter', () => {
          animateElement(browseButton, 'pulse', { duration: 0.5 })
        })
      }
    }
    
    // Animate cart items container
    if (cartItemsRef.current && cart?.items && cart.items.length > 0) {
      animateElement(cartItemsRef.current, 'fadeIn', { duration: 0.5, delay: 0.1 })
    }
    
    // Stagger cart items
    if (cartItemRefs.current.length > 0 && cart?.items && cart.items.length > 0) {
      const validRefs = cartItemRefs.current.filter(ref => ref !== null) as HTMLDivElement[]
      validRefs.forEach((ref, index) => {
        animateElement(ref, 'fadeIn', { 
          duration: 0.5, 
          delay: 0.3 + (index * 0.1) 
        })
      })
      
      // Add scroll animations to cart items
      validRefs.forEach((ref) => {
        createScrollAnimation(ref, 'fadeIn',{
          trigger: ref,
          start: "top bottom-=100",
          end: "bottom top+=100",
          scrub: false,
          once: true,
          duration: 0.5
        })
      })
    }
    
    // Animate summary card
    if (summaryCardRef.current) {
      animateElement(summaryCardRef.current, 'slideInRight', { duration: 0.8, delay: 0.4 })
      
      // Add scroll animation to keep summary card visible
      createScrollAnimation(summaryCardRef.current,'none', {
        trigger: summaryCardRef.current,
        start: 'top top+=100px',
        end: 'bottom bottom-=200px',
        scrub: false,
        once: false,
        onEnter: () => {
          summaryCardRef.current && animateElement(summaryCardRef.current, 'highlight', { duration: 0.5 })
        }
      })
    }
    
    // Cleanup function
    return () => {
      const browseButton = emptyCartRef.current?.querySelector('a button')
      if (browseButton) {
        browseButton.removeEventListener('mouseenter', () => {})
      }
    }
  }, [cart?.items.length, animateElement, createScrollAnimation])

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto space-y-8 p-6 lg:p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="heading-xl text-left">Shopping Cart</h1>
            <p className="body-lg text-gray-600 mt-3">Loading your cart...</p>
          </div>
        </div>
        <Card className="card-minimal">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-t-2 border-black mb-6"></div>
            <h3 className="heading-md text-center mb-4">Loading your cart</h3>
            <p className="body-md text-gray-600 text-center">
              Please wait while we retrieve your items...
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const cartItems = cart?.items || []
  const total = getCartTotal()

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between" ref={headerRef}>
        <div>
          <h1 className="heading-xl text-left">Shopping Cart</h1>
          <p className="body-lg text-gray-600 mt-3">
            {cartItems.length === 0
              ? "Your cart is empty"
              : `${cartItems.length} item${cartItems.length !== 1 ? "s" : ""} in your cart`}
          </p>
        </div>
        {cartItems.length > 0 && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300 hover:bg-red-50">
                Clear Cart
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="card-minimal">
              <AlertDialogHeader>
                <AlertDialogTitle className="heading-md text-left">Clear Cart</AlertDialogTitle>
                <AlertDialogDescription className="body-md text-gray-600">
                  Are you sure you want to remove all items from your cart? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="border-gray-200 hover:border-gray-300 hover:bg-gray-50">Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleClearCart} className="bg-red-600 hover:bg-red-700">
                  Clear Cart
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>

      {cartItems.length === 0 ? (
        <Card className="card-minimal border-dashed border-2 border-gray-200">
          <CardContent className="flex flex-col items-center justify-center py-20" ref={emptyCartRef}>
            <div className="bg-black/5 rounded-full w-20 h-20 flex items-center justify-center mb-8">
              <ShoppingCart className="h-10 w-10 text-black" />
            </div>
            <h3 className="heading-md text-center mb-4">Your cart is empty</h3>
            <p className="body-md text-gray-600 text-center max-w-md mb-10">
              Start shopping to add sustainable products to your cart and contribute to eco-friendly consumption.
            </p>
            <Link href="/marketplace">
              <Button className="bg-black hover:bg-gray-800 text-white px-8 py-6 h-auto text-lg shadow-subtle transition-all duration-200 hover:scale-105">
                <ShoppingCart className="mr-2 h-5 w-5" />
                Browse Marketplace
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6" ref={cartItemsRef}>
            {cartItems.map((item, index) => (
              <Card 
                key={item.id}
                ref={(el: HTMLDivElement | null): void => {
                  cartItemRefs.current[index] = el;
                }}
                className="card-minimal"
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-6">
                    {/* Product Image */}
                    <div className="w-24 h-24 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Package className="h-8 w-8 text-gray-400" />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-serif text-lg font-medium text-black truncate">{item.productTitle}</h3>
                          <p className="body-sm text-gray-600 mt-1">{item.productCategory}</p>
                          <p className="body-sm text-gray-500">by {item.sellerName}</p>
                        </div>
                        <p className="text-xl font-serif font-semibold text-black">₹{item.productPrice}</p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between mt-6">
                        <div className="flex items-center gap-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1 || updatingItems.has(item.id)}
                            className="w-10 h-10 p-0 border-gray-200 hover:border-black"
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
                            className="w-16 text-center border-gray-200 focus:border-black"
                            min="1"
                            disabled={updatingItems.has(item.id)}
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            disabled={updatingItems.has(item.id)}
                            className="w-10 h-10 p-0 border-gray-200 hover:border-black"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="card-minimal">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="heading-md text-left">Remove Item</AlertDialogTitle>
                              <AlertDialogDescription className="body-md text-gray-600">
                                Are you sure you want to remove "{item.productTitle}" from your cart?
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="border-gray-200 hover:border-gray-300 hover:bg-gray-50">Cancel</AlertDialogCancel>
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
            <Card className="card-minimal sticky top-24" ref={summaryCardRef}>
              <CardHeader className="bg-gray-50 border-b border-gray-100">
                <CardTitle className="flex items-center font-serif text-lg">
                  <ShoppingCart className="mr-2 h-5 w-5 text-black" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between body-sm pb-3 border-b border-gray-100 last:border-0">
                      <span className="truncate mr-2 font-medium">
                        {item.productTitle} × {item.quantity}
                      </span>
                      <span className="font-medium">₹{(item.productPrice * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <Separator className="bg-gray-200" />

                <div className="flex justify-between text-lg">
                  <span className="font-serif font-medium">Total</span>
                  <span className="font-serif font-semibold text-black">₹{total.toFixed(2)}</span>
                </div>

                {!showPayment ? (
                  <div className="space-y-4">
                    <Button
                      onClick={handleCheckout}
                      disabled={checkingOut}
                      className="w-full bg-black hover:bg-gray-800 text-white shadow-subtle transition-all duration-200 hover:scale-105"
                      size="lg"
                    >
                      {checkingOut ? (
                        <>
                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent border-white"></div>
                          Processing...
                        </>
                      ) : (
                        <>Proceed to Payment</>
                      )}
                    </Button>
                    <p className="body-xs text-gray-500 text-center flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      Secure checkout • Sustainable shopping
                    </p>
                  </div>
                ) : (
                  <PaymentOptions 
                    onPaymentMethodSelected={handlePaymentComplete}
                    total={total}
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}
