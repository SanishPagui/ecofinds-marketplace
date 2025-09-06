"use client"

import { useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { useAnimation } from "@/contexts/AnimationContext"
import { Leaf } from "lucide-react"

export default function HomePage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const { animateElement, isMobile, getResponsiveValue } = useAnimation()
  
  // Refs for animation targets
  const containerRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const loaderRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Animate elements on load with responsive timing
    if (containerRef.current) {
      animateElement(containerRef.current, "fadeIn", { 
        duration: getResponsiveValue(0.8, 0.5) 
      })
    }
    
    if (logoRef.current) {
      animateElement(logoRef.current, "scaleIn", { 
        duration: getResponsiveValue(1, 0.7), 
        delay: getResponsiveValue(0.2, 0.1) 
      })
    }
    
    if (titleRef.current) {
      animateElement(titleRef.current, "slideInUp", { 
        duration: getResponsiveValue(0.8, 0.5), 
        delay: getResponsiveValue(0.4, 0.2),
        y: getResponsiveValue(50, 30) 
      })
    }
    
    if (subtitleRef.current) {
      animateElement(subtitleRef.current, "slideInUp", { 
        duration: getResponsiveValue(0.8, 0.5), 
        delay: getResponsiveValue(0.6, 0.3),
        y: getResponsiveValue(50, 30) 
      })
    }
    
    if (loaderRef.current) {
      animateElement(loaderRef.current, "fadeIn", { 
        duration: getResponsiveValue(0.8, 0.5), 
        delay: getResponsiveValue(0.8, 0.4) 
      })
    }
    
    // Redirect after animations
    const redirectTimer = setTimeout(() => {
      if (!loading) {
        if (user) {
          router.push("/dashboard")
        } else {
          router.push("/auth")
        }
      }
    }, 1500) // Delay redirect to show animations
    
    return () => clearTimeout(redirectTimer)
  }, [user, loading, router, animateElement, getResponsiveValue])

  return (
    <div 
      ref={containerRef} 
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-green-50 to-white p-4"
    >
      <div ref={logoRef} className="mb-6 text-green-600">
        <div className="bg-green-100 p-6 rounded-full">
          <Leaf size={64} />
        </div>
      </div>
      
      <h1 
        ref={titleRef} 
        className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-4"
      >
        EcoFinds Marketplace
      </h1>
      
      <p 
        ref={subtitleRef} 
        className="text-xl text-center text-gray-600 max-w-md mb-8"
      >
        Discover unique sustainable products and promote eco-friendly consumption
      </p>
      
      <div ref={loaderRef} className="mt-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    </div>
  )
}
