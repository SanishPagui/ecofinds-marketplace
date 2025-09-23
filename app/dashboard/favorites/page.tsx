"use client"

import { useState, useEffect, useRef } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Heart, ShoppingCart } from "lucide-react"
import Link from "next/link"
import { useAnimation } from "@/contexts/AnimationContext"

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const { toast } = useToast()
  const { animateElement, getResponsiveValue } = useAnimation()
  
  // Refs for animations
  const headerRef = useRef<HTMLDivElement>(null)
  const emptyFavoritesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (user) {
      loadFavorites()
    }
  }, [user])

  // Animation effect
  useEffect(() => {
    if (!loading) {
      if (headerRef.current) {
        animateElement(headerRef.current, "fadeIn", {
          duration: getResponsiveValue(0.8, 0.6),
          delay: getResponsiveValue(0.2, 0.1),
        })
      }

      if (favorites.length === 0 && emptyFavoritesRef.current) {
        animateElement(emptyFavoritesRef.current, "fadeIn", {
          duration: getResponsiveValue(0.8, 0.6),
          delay: getResponsiveValue(0.5, 0.3),
        })
      }
    }
  }, [loading, favorites, animateElement, getResponsiveValue])

  const loadFavorites = async () => {
    if (!user) return

    try {
      // TODO: Implement favorites loading logic
      setFavorites([])
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load your favorites",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="p-6 lg:p-8">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div ref={headerRef}>
        <h1 className="heading-xl text-left">Favorites</h1>
        <p className="body-lg text-gray-600 mt-3">
          Keep track of items you love and want to purchase later.
        </p>
      </div>

      {/* Empty State */}
      {favorites.length === 0 && (
        <Card ref={emptyFavoritesRef} className="card-minimal">
          <CardContent className="flex flex-col items-center justify-center py-20">
            <div className="bg-black/5 rounded-full w-20 h-20 flex items-center justify-center mb-8">
              <Heart className="h-10 w-10 text-black" />
            </div>
            <h3 className="heading-md text-center mb-4">No favorites yet</h3>
            <p className="body-md text-gray-600 text-center max-w-md mb-10">
              Start browsing the marketplace and add items to your favorites by clicking the heart icon on products you love.
            </p>
            <Link href="/marketplace">
              <Button className="bg-black hover:bg-gray-800 text-white px-8 py-6 h-auto text-lg shadow-subtle transition-all duration-200 hover:scale-105">
                <ShoppingCart className="mr-2 h-5 w-5" />
                Browse Marketplace
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}