"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { useAnimation } from "@/contexts/AnimationContext"
import { AuthForm } from "@/components/auth/AuthForm"

export default function AuthPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin")
  const { user, loading } = useAuth()
  const router = useRouter()
  const { animateElement } = useAnimation()
  
  // Refs for animation targets
  const containerRef = useRef<HTMLDivElement>(null)
  const loaderRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard")
    }
  }, [user, loading, router])

  useEffect(() => {
    if (containerRef.current) {
      animateElement(containerRef.current, "fadeIn", { duration: 0.8 })
    }
    
    if (loaderRef.current && loading) {
      animateElement(loaderRef.current, "scaleIn", { duration: 0.6 })
    }
  }, [animateElement, loading])

  if (loading) {
    return (
      <div 
        ref={containerRef}
        className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-white"
      >
        <div 
          ref={loaderRef}
          className="flex flex-col items-center"
        >
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mb-4"></div>
          <p className="text-green-600 font-medium">Loading...</p>
        </div>
      </div>
    )
  }

  if (user) {
    return null // Will redirect
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <AuthForm 
        mode={mode} 
        onToggleMode={() => setMode(mode === "signin" ? "signup" : "signin")} 
      />
    </div>
  )
}
