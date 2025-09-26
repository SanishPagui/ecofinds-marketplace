"use client"

import React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { SearchBar } from "@/components/ui/search-bar"
import { NotificationCenter } from "@/components/ui/notification-center"
import { ShoppingCart, User, Menu, X } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { useCart } from "@/contexts/CartContext"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

interface NavigationProps {
  className?: string
}

export function Navigation({ className }: NavigationProps) {
  const { user, logout } = useAuth()
  const { getCartItemCount } = useCart()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)

  const cartItemCount = getCartItemCount()

  const navigationLinks = [
    { href: "/home", label: "Home" },
    { href: "/marketplace", label: "Marketplace" },
    ...(user ? [
      { href: "/dashboard", label: "Dashboard" },
      { href: "/dashboard/listings", label: "My Listings" }
    ] : [])
  ]

  return (
    <nav className={cn("border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50", className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">E</span>
            </div>
            <span className="font-bold text-xl text-gray-900 hidden sm:block">
              EcoFinds
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigationLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Search Bar - Hidden on mobile */}
          <div className="hidden lg:flex flex-1 max-w-md mx-8">
            <SearchBar />
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2">
            {/* Mobile Search - Show search icon on mobile */}
            <div className="lg:hidden">
              <SearchBar />
            </div>

            {user ? (
              <>
                {/* Notifications */}
                <NotificationCenter />
                
                {/* Cart */}
                <Link href="/dashboard/cart">
                  <Button variant="ghost" size="sm" className="relative rounded-full h-10 w-10 p-0">
                    <ShoppingCart className="h-4 w-4" />
                    {cartItemCount > 0 && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1"
                      >
                        <Badge className="bg-green-500 text-white text-xs px-1.5 py-0.5 min-w-[18px] h-[18px] flex items-center justify-center">
                          {cartItemCount > 9 ? "9+" : cartItemCount}
                        </Badge>
                      </motion.div>
                    )}
                  </Button>
                </Link>

                {/* Profile Dropdown */}
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-full h-10 w-10 p-0"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  >
                    <User className="h-4 w-4" />
                  </Button>
                  
                  {isMobileMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50"
                    >
                      <Link
                        href="/dashboard/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Profile
                      </Link>
                      <Link
                        href="/dashboard"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                      <hr className="my-1" />
                      <button
                        onClick={() => {
                          logout()
                          setIsMobileMenuOpen(false)
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        Sign Out
                      </button>
                    </motion.div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/auth">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth">
                  <Button size="sm" className="bg-green-600 hover:bg-green-700">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="rounded-full h-10 w-10 p-0"
              >
                {isMobileMenuOpen ? (
                  <X className="h-4 w-4" />
                ) : (
                  <Menu className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gray-200"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {/* Mobile Search Bar */}
              <div className="lg:hidden px-3 py-2">
                <SearchBar />
              </div>
              
              {navigationLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              
              {!user && (
                <div className="pt-4 pb-3 border-t border-gray-200">
                  <div className="flex items-center px-3 space-x-3">
                    <Link href="/auth" className="flex-1">
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/auth" className="flex-1">
                      <Button 
                        className="w-full bg-green-600 hover:bg-green-700"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Get Started
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  )
}