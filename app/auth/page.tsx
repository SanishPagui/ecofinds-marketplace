"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { AuthForm } from "@/components/auth/AuthForm"

export default function AuthPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin")
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    )
  }

  if (user) {
    return null // Will redirect
  }

  return <AuthForm mode={mode} onToggleMode={() => setMode(mode === "signin" ? "signup" : "signin")} />
}
