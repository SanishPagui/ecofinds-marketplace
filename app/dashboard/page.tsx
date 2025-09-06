"use client"

import { useState, useEffect, useRef } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useCart } from "@/contexts/CartContext"
import { useAnimation } from "@/contexts/AnimationContext"
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
  
  // Animation refs
  const welcomeRef = useRef(null)
  const statsGridRef = useRef(null)
  const statCardRefs = useRef([])
  const quickActionsRef = useRef(null)
  const environmentalImpactRef = useRef(null)
  
  // Clear refs array on render
  statCardRefs.current = []

  useEffect(() => {
    if (user) {
      loadStats()
    }
  }, [user])
  
  // GSAP animations
  const { animateElement, createScrollAnimation } = useAnimation()
  
  useEffect(() => {
    // Animate welcome section
    if (welcomeRef.current) {
      animateElement(welcomeRef.current, 'fadeIn', { duration: 0.8, delay: 0 })
    }
    
    // Animate stats grid
    if (statsGridRef.current) {
      animateElement(statsGridRef.current, 'fadeIn', { duration: 0.5, delay: 0.2 })
    }
    
    // Stagger stat cards
    if (statCardRefs.current.length > 0) {
      const validRefs = statCardRefs.current.filter(ref => ref !== null)
      validRefs.forEach((ref, index) => {
        animateElement(ref, 'scaleIn', { duration: 0.5, delay: 0.3 + (index * 0.1) })
      })
      
      // Add hover animations to stat cards
      validRefs.forEach((ref) => {
        (ref as HTMLElement).addEventListener('mouseenter', () => {
          animateElement(ref, 'pulse', { duration: 0.3 })
        })
      })
    }
    
    // Animate quick actions card
    if (quickActionsRef.current) {
      animateElement(quickActionsRef.current, 'slideInLeft', { duration: 0.8, delay: 0.5 })
      
      // Add scroll animation
      createScrollAnimation(quickActionsRef.current, 'fadeIn', {
        start: 'top bottom-=100px',
        end: 'bottom top+=100px',
        scrub: false,
        toggleActions: 'play none none none',
        duration: 0.5
      })
    }
    
    // Animate environmental impact card
    if (environmentalImpactRef.current) {
      animateElement(environmentalImpactRef.current, 'slideInRight', { duration: 0.8, delay: 0.6 })
      
      // Add scroll animation
      createScrollAnimation(environmentalImpactRef.current, 'fadeIn', {
        start: 'top bottom-=100px',
        end: 'bottom top+=100px',
        scrub: false,
        toggleActions: 'play none none none',
        duration: 0.5
      })
    }
    
    // Cleanup function
    return () => {
      const validRefs = statCardRefs.current.filter(ref => ref !== null)
      validRefs.forEach((ref) => {
        (ref as HTMLElement).removeEventListener('mouseenter', () => {})
      })
    }
  }, [animateElement, createScrollAnimation])

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
        <div ref={welcomeRef}>
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {userProfile?.username || "User"}!</h1>
          <p className="text-gray-600 mt-2">Here's what's happening with your sustainable marketplace activity.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" ref={statsGridRef}>
          {dashboardStats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card 
                key={stat.title}
                ref={(el: HTMLDivElement | null): void => {
                  if (el) statCardRefs.current[index] = el as HTMLDivElement
                }}
              >
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
          <Card ref={quickActionsRef}>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Get started with your sustainable marketplace journey</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-green-50 hover:border-green-200 transition-colors duration-300">
                <div>
                  <h3 className="font-medium">List your first item</h3>
                  <p className="text-sm text-gray-600">Start selling items you no longer need</p>
                </div>
                <Package className="h-5 w-5 text-green-600" />
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-blue-50 hover:border-blue-200 transition-colors duration-300">
                <div>
                  <h3 className="font-medium">Browse marketplace</h3>
                  <p className="text-sm text-gray-600">Find unique second-hand treasures</p>
                </div>
                <ShoppingCart className="h-5 w-5 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card ref={environmentalImpactRef}>
            <CardHeader>
              <CardTitle>Environmental Impact</CardTitle>
              <CardDescription>Your contribution to sustainable consumption</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <div className="text-4xl font-bold text-green-600 mb-2">{stats.itemsSaved}</div>
                <p className="text-gray-600">Items saved from landfill</p>
                <div className="mt-4 p-2 bg-green-50 rounded-lg">
                  <p className="text-sm text-gray-700">
                    {stats.totalSpent > 0
                      ? `Total spent: Rs${stats.totalSpent.toFixed(2)}`
                      : "Start buying and selling to make an impact!"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
