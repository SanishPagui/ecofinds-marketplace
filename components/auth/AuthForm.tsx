"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useAnimation } from "@/contexts/AnimationContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Leaf, Mail, Lock, User, ArrowRight, Eye, EyeOff } from "lucide-react"
import Link from "next/link"

interface AuthFormProps {
  mode: "signin" | "signup"
  onToggleMode: () => void
}

export function AuthForm({ mode, onToggleMode }: AuthFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [username, setUsername] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const { signIn, signUp } = useAuth()
  const { toast } = useToast()
  const { animateElement } = useAnimation()
  
  // Refs for animation targets
  const containerRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLDivElement>(null)
  
  // Animation effect
  useEffect(() => {
    if (containerRef.current) {
      animateElement(containerRef.current, "fadeIn", { duration: 0.8 })
    }
    
    if (heroRef.current) {
      animateElement(heroRef.current, "slideInLeft", { duration: 0.8, delay: 0.2 })
    }
    
    if (formRef.current) {
      animateElement(formRef.current, "slideInRight", { duration: 0.8, delay: 0.3 })
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
    <div ref={containerRef} className="min-h-screen flex">
      {/* Left Side - Hero Section */}
      <div ref={heroRef} className="hidden lg:flex lg:flex-1 relative overflow-hidden bg-black">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black opacity-90" />
        <div className="absolute inset-0" style={{
          background: `radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
                       radial-gradient(circle at 80% 50%, rgba(255, 255, 255, 0.03) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }} />
        
        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center p-16 text-white">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-white/10 p-3 rounded-full backdrop-blur-sm">
                <Leaf className="h-8 w-8 text-white" />
              </div>
              <span className="text-3xl font-serif font-semibold">EcoFinds</span>
            </div>
            
            <h1 className="heading-xl text-white mb-6">
              {mode === "signin" ? "Welcome Back" : "Join the Movement"}
            </h1>
            
            <p className="body-lg text-gray-300 mb-8 leading-relaxed">
              {mode === "signin" 
                ? "Continue your sustainable shopping journey. Discover unique items and reduce waste while saving money."
                : "Start your sustainable lifestyle today. Buy, sell, and discover eco-friendly treasures in our community marketplace."
              }
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-white rounded-full" />
                <span className="text-gray-300">Sustainable marketplace</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-white rounded-full" />
                <span className="text-gray-300">Reduce environmental impact</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-white rounded-full" />
                <span className="text-gray-300">Community-driven platform</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <span>Back to</span>
            <Link href="/" className="text-white hover:underline font-medium">
              Homepage →
            </Link>
          </div>
        </div>
      </div>

      {/* Right Side - Form Section */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-20">
        <div ref={formRef} className="w-full max-w-lg">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-10">
            <div className="bg-black/5 p-3 rounded-full">
              <Leaf className="h-6 w-6 text-black" />
            </div>
            <span className="text-2xl font-serif font-semibold text-black">EcoFinds</span>
          </div>

          <Card className="card-minimal border-0 shadow-none">
            <CardContent className="p-8 lg:p-10">
              <div className="text-center mb-10">
                <h2 className="heading-lg text-black mb-4">
                  {mode === "signin" ? "Sign In" : "Create Account"}
                </h2>
                <p className="body-md text-gray-600">
                  {mode === "signin" 
                    ? "Enter your credentials to access your account"
                    : "Fill in your details to get started"
                  }
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                {mode === "signup" && (
                  <div className="space-y-3">
                    <Label htmlFor="username" className="text-sm font-medium text-gray-700 mb-2 block">
                      Username
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="username"
                        type="text"
                        placeholder="Choose a username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="pl-10 h-14 border-gray-300 focus:border-black focus:ring-2 focus:ring-black/10 transition-all duration-200 text-base rounded-md"
                        required
                      />
                    </div>
                  </div>
                )}
                
                <div className="space-y-3">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700 mb-2 block">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-14 border-gray-300 focus:border-black focus:ring-2 focus:ring-black/10 transition-all duration-200 text-base rounded-md"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700 mb-2 block">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10 h-14 border-gray-300 focus:border-black focus:ring-2 focus:ring-black/10 transition-all duration-200 text-base rounded-md"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {mode === "signin" && (
                  <div className="flex items-center justify-between py-2">
                    <label className="flex items-center">
                      <input type="checkbox" className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black" />
                      <span className="ml-2 body-sm text-gray-600">Remember me</span>
                    </label>
                    <Link href="/forgot-password" className="body-sm text-black hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                )}

                <Button 
                  type="submit" 
                  className="w-full h-14 bg-black hover:bg-gray-800 text-white shadow-sm transition-all duration-200 hover:shadow-md text-base font-medium mt-10 rounded-md"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                      <span>Please wait...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <span>{mode === "signin" ? "Sign In" : "Create Account"}</span>
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  )}
                </Button>
              </form>

              <div className="mt-10 text-center">
                <p className="body-sm text-gray-600">
                  {mode === "signin" ? "Don't have an account?" : "Already have an account?"}
                  <button 
                    type="button" 
                    onClick={onToggleMode}
                    className="ml-2 text-black hover:underline font-medium"
                  >
                    {mode === "signin" ? "Sign up" : "Sign in"}
                  </button>
                </p>
              </div>

              <div className="mt-8 text-center">
                <p className="body-xs text-gray-500 leading-relaxed">
                  By continuing, you agree to our{" "}
                  <Link href="/terms" className="text-black hover:underline">Terms of Service</Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-black hover:underline">Privacy Policy</Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
