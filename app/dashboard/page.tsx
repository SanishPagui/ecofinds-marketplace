"use client"

import { useState, useEffect, useRef } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useCart } from "@/contexts/CartContext"
import { useAnimation } from "@/contexts/AnimationContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getUserProducts } from "@/lib/products"
import { getUserPurchaseStats } from "@/lib/purchases"
import { Package, ShoppingCart, History, TrendingUp, Plus, ArrowRight, Heart, User, Calendar } from "lucide-react"
import Link from "next/link"

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
      link: "/dashboard/listings",
      trend: stats.listings > 0 ? "+" : "0"
    },
    {
      title: "Cart Items",
      value: cartItemCount.toString(),
      description: "Items in your cart",
      icon: ShoppingCart,
      link: "/dashboard/cart",
      trend: cartItemCount > 0 ? "+" : "0"
    },
    {
      title: "Total Purchases",
      value: stats.purchases.toString(),
      description: "Completed orders",
      icon: History,
      link: "/dashboard/history",
      trend: stats.purchases > 0 ? "+" : "0"
    },
    {
      title: "Impact Score",
      value: stats.itemsSaved.toString(),
      description: "Items saved from waste",
      icon: TrendingUp,
      link: "/dashboard/history",
      trend: stats.itemsSaved > 0 ? "+" : "0"
    },
  ]

  const quickActions = [
    {
      title: "Create New Listing",
      description: "List an item you want to sell",
      icon: Plus,
      link: "/dashboard/listings/new",
      primary: true
    },
    {
      title: "Browse Marketplace",
      description: "Discover sustainable products",
      icon: ShoppingCart,
      link: "/marketplace",
      primary: false
    },
    {
      title: "View Favorites",
      description: "Items you've saved for later",
      icon: Heart,
      link: "/dashboard/favorites",
      primary: false
    },
    {
      title: "Manage Profile",
      description: "Update your account settings",
      icon: User,
      link: "/dashboard/profile",
      primary: false
    }
  ]

  return (
    <div className="space-y-12 p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <div ref={welcomeRef} className="text-center space-y-6">
        <div className="space-y-4">
          <h1 className="heading-xl text-center">Welcome back, {userProfile?.username || "User"}!</h1>
          <p className="body-lg text-gray-600 max-w-2xl mx-auto">
            Manage your sustainable marketplace journey. Track your impact, list new items, and discover eco-friendly treasures.
          </p>
        </div>
        
        {/* Quick Create Button */}
        <div className="flex justify-center">
          <Link href="/dashboard/listings/new">
            <Button className="bg-black hover:bg-gray-800 text-white shadow-subtle transition-all duration-200 hover:scale-105 px-8 py-6 h-auto text-lg">
              <Plus className="h-5 w-5 mr-3" />
              Create New Listing
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div ref={statsGridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardStats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Link key={stat.title} href={stat.link}>
              <Card 
                ref={(el: HTMLDivElement | null): void => {
                  if (el) (statCardRefs.current as HTMLDivElement[])[index] = el
                }}
                className="card-minimal transition-all duration-300 hover:shadow-elegant hover:scale-105 cursor-pointer group"
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="bg-black/5 group-hover:bg-black/10 rounded-full p-3 transition-colors">
                      <Icon className="h-6 w-6 text-black" />
                    </div>
                    <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-black transition-colors" />
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div className="text-3xl font-serif font-semibold text-black">{stat.value}</div>
                    <div>
                      <h3 className="font-medium text-black">{stat.title}</h3>
                      <p className="body-sm text-gray-600 mt-1">{stat.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      {/* Quick Actions Grid */}
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="heading-lg text-black">Quick Actions</h2>
          <p className="body-md text-gray-600 mt-3">Everything you need to manage your sustainable marketplace experience</p>
        </div>
        
        <div ref={quickActionsRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => {
            const Icon = action.icon
            return (
              <Link key={action.title} href={action.link}>
                <Card className={`card-minimal transition-all duration-300 hover:shadow-elegant hover:scale-105 cursor-pointer group h-full ${action.primary ? 'ring-2 ring-black/10' : ''}`}>
                  <CardContent className="p-6 text-center space-y-4">
                    <div className={`mx-auto rounded-full p-4 w-fit transition-colors ${action.primary ? 'bg-black text-white group-hover:bg-gray-800' : 'bg-black/5 group-hover:bg-black/10'}`}>
                      <Icon className={`h-6 w-6 ${action.primary ? 'text-white' : 'text-black'}`} />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-serif text-lg font-medium text-black">{action.title}</h3>
                      <p className="body-sm text-gray-600">{action.description}</p>
                    </div>
                    <div className="flex items-center justify-center text-gray-400 group-hover:text-black transition-colors">
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Environmental Impact Section */}
      <div ref={environmentalImpactRef} className="space-y-8">
        <div className="text-center">
          <h2 className="heading-lg text-black">Your Environmental Impact</h2>
          <p className="body-md text-gray-600 mt-3">Track your contribution to sustainable consumption</p>
        </div>
        
        <Card className="card-minimal">
          <CardContent className="p-8">
            <div className="text-center space-y-6">
              <div className="space-y-4">
                <div className="text-6xl font-serif font-semibold text-black">{stats.itemsSaved}</div>
                <div>
                  <h3 className="heading-md text-black">Items Saved from Landfill</h3>
                  <p className="body-md text-gray-600 mt-2">
                    {stats.totalSpent > 0
                      ? `Total contribution to sustainable economy: ₹${stats.totalSpent.toFixed(2)}`
                      : "Start your sustainable journey today by buying or selling eco-friendly items!"}
                  </p>
                </div>
              </div>
              
              {stats.itemsSaved === 0 && (
                <div className="pt-4">
                  <Link href="/marketplace">
                    <Button variant="outline" className="border-gray-200 hover:border-black hover:bg-gray-50 transition-all duration-200 hover:scale-105">
                      Explore Sustainable Products
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
