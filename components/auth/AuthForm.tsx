"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useAnimation } from "@/contexts/AnimationContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Leaf } from "lucide-react"

interface AuthFormProps {
  mode: "signin" | "signup"
  onToggleMode: () => void
}

export function AuthForm({ mode, onToggleMode }: AuthFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [username, setUsername] = useState("")
  const [loading, setLoading] = useState(false)
  const { signIn, signUp } = useAuth()
  const { toast } = useToast()
  const { animateElement } = useAnimation()
  
  // Refs for animation targets
  const cardRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const toggleRef = useRef<HTMLDivElement>(null)
  
  // Animation effect
  useEffect(() => {
    if (cardRef.current) {
      animateElement(cardRef.current, "scaleIn", { duration: 0.6 })
    }
    
    if (logoRef.current) {
      animateElement(logoRef.current, "fadeIn", { duration: 0.6, delay: 0.2 })
    }
    
    if (titleRef.current) {
      animateElement(titleRef.current, "slideInUp", { duration: 0.6, delay: 0.3 })
    }
    
    if (formRef.current) {
      animateElement(formRef.current, "fadeIn", { duration: 0.6, delay: 0.4 })
    }
    
    if (toggleRef.current) {
      animateElement(toggleRef.current, "slideInUp", { duration: 0.6, delay: 0.5 })
    }
  }, [animateElement, mode])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (mode === "signup") {
        await signUp(email, password, username)
        toast({
          title: "Account created successfully!",
          description: "Welcome to EcoFinds",
        })
      } else {
        await signIn(email, password)
        toast({
          title: "Welcome back!",
          description: "Successfully signed in",
        })
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card ref={cardRef} className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <div ref={logoRef} className="flex items-center justify-center gap-2 mb-4">
            <div className="bg-green-100 p-3 rounded-full">
              <Leaf className="h-6 w-6 text-green-600" />
            </div>
            <span className="text-2xl font-bold text-green-600">EcoFinds</span>
          </div>
          <div ref={titleRef}>
            <CardTitle className="text-2xl">{mode === "signin" ? "Welcome Back" : "Join EcoFinds"}</CardTitle>
            <CardDescription className="mt-2">
              {mode === "signin"
                ? "Sign in to your account to continue shopping sustainably"
                : "Create an account to start buying and selling second-hand items"}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={loading}>
              {loading ? "Loading..." : mode === "signin" ? "Sign In" : "Sign Up"}
            </Button>
          </form>
          <div ref={toggleRef} className="mt-4 text-center">
            <button type="button" onClick={onToggleMode} className="text-sm text-green-600 hover:underline">
              {mode === "signin" ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
