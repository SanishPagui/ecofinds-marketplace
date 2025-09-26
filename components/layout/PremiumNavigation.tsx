"use client"

import React, { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useCart } from "@/contexts/CartContext"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { NotificationCenter } from "@/components/ui/notification-center"
import { 
  Leaf, 
  User, 
  Package, 
  ShoppingCart, 
  History, 
  Plus, 
  Menu, 
  X, 
  Search,
  Bell,
  Settings,
  ChevronDown,
  Home,
  Store,
  Heart,
  TrendingUp
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

interface PremiumNavigationProps {
  children: React.ReactNode
}

const mainNavigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "Marketplace", href: "/marketplace", icon: Store },
  { name: "Dashboard", href: "/dashboard", icon: Package },
]

const dashboardNavigation = [
  { name: "Overview", href: "/dashboard", icon: TrendingUp },
  { name: "My Listings", href: "/dashboard/listings", icon: Package },
  { name: "Cart", href: "/dashboard/cart", icon: ShoppingCart },
  { name: "Favorites", href: "/dashboard/favorites", icon: Heart },
  { name: "Purchase History", href: "/dashboard/history", icon: History },
  { name: "Profile", href: "/dashboard/profile", icon: User },
]

export function PremiumNavigation({ children }: PremiumNavigationProps) {
  const { user, userProfile, logout } = useAuth()
  const { getCartItemCount } = useCart()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  const cartItemCount = getCartItemCount()
  const isDashboard = pathname.startsWith('/dashboard')

  // Scroll effect for navigation bar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = async () => {
    await logout()
  }

  const NavItem = ({ item, isMobile = false }: { item: any; isMobile?: boolean }) => {
    const Icon = item.icon
    const isActive = pathname === item.href
    
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Link
          href={item.href}
          className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-300 relative group",
            isActive 
              ? "bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-600 border border-blue-200/50" 
              : "text-gray-600 hover:bg-gray-100/80 hover:text-gray-900",
            isMobile && "w-full"
          )}
          onClick={isMobile ? () => setSidebarOpen(false) : undefined}
        >
          {/* Background glow effect for active item */}
          {isActive && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-2xl"
              layoutId="activeNavItem"
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
          
          <Icon className={cn(
            "h-5 w-5 transition-colors",
            isActive ? "text-blue-600" : "text-gray-500 group-hover:text-gray-700"
          )} />
          
          <span className="relative z-10">{item.name}</span>
          
          {item.name === "Cart" && cartItemCount > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="ml-auto"
            >
              <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs px-2 py-1">
                {cartItemCount}
              </Badge>
            </motion.div>
          )}
          
          {/* Hover shimmer effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 opacity-0 group-hover:opacity-100"
            initial={{ x: "-100%" }}
            whileHover={{ x: "100%" }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          />
        </Link>
      </motion.div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F7F4] via-white to-gray-50/30">
      {/* Top Navigation Bar */}
      <motion.header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          isScrolled 
            ? "backdrop-blur-xl bg-white/90 border-b border-black/5 shadow-sm" 
            : "bg-transparent"
        )}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", bounce: 0.2, duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <motion.div 
              className="flex items-center gap-3"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link href="/" className="flex items-center gap-3">
                <div className="relative">
                  <motion.div
                    className="absolute inset-0 bg-black/5 rounded-xl blur-sm"
                    animate={{ 
                      scale: [1, 1.1, 1],
                      rotate: [0, 2, -2, 0] 
                    }}
                    transition={{ 
                      duration: 4, 
                      repeat: Infinity, 
                      ease: "easeInOut" 
                    }}
                  />
                  <Leaf className="relative h-8 w-8 text-black" />
                </div>
                <span className="text-xl font-serif font-semibold text-black">
                  EcoFinds
                </span>
              </Link>
            </motion.div>

            {/* Main Navigation */}
            <div className="hidden md:flex">
              <NavigationMenu>
                <NavigationMenuList className="gap-2">
                  {mainNavigation.map((item) => (
                    <NavigationMenuItem key={item.name}>
                      <NavigationMenuLink
                        className={cn(
                          "group inline-flex h-10 w-max items-center justify-center rounded-lg px-6 py-2 text-sm font-medium transition-all duration-300",
                          pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
                            ? "bg-black text-white"
                            : "text-gray-700 hover:bg-gray-100 hover:text-black"
                        )}
                        href={item.href}
                      >
                        <item.icon className="mr-2 h-4 w-4" />
                        {item.name}
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>
            </div>

            {/* Right side actions */}
            <div className="flex items-center gap-3">
              {/* Notifications */}
              <NotificationCenter />

              {/* Add Listing Button */}
              {user && (
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link href="/dashboard/listings/new">
                    <Button className="hidden sm:flex bg-black hover:bg-gray-800 text-white rounded-lg h-10 px-6 shadow-sm hover:shadow-md transition-all duration-300">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Listing
                    </Button>
                  </Link>
                </motion.div>
              )}

              {/* User Menu */}
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
                        <Avatar className="h-10 w-10 border border-gray-200">
                          <AvatarFallback className="bg-gray-100 text-black font-medium">
                            {userProfile?.username?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </motion.div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-64 p-2 bg-white border border-gray-200 shadow-lg" align="end">
                    <div className="flex items-center justify-start gap-3 p-3 mb-2 bg-gray-50 rounded-lg">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-black text-white font-medium">
                          {userProfile?.username?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-semibold text-black font-serif">{userProfile?.username || "User"}</p>
                        <p className="text-sm text-gray-500 truncate max-w-[150px]">{user?.email}</p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/profile" className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors">
                        <User className="mr-3 h-4 w-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/cart" className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors">
                        <ShoppingCart className="mr-3 h-4 w-4" />
                        Cart
                        {cartItemCount > 0 && (
                          <Badge className="ml-auto bg-black text-white text-xs">
                            {cartItemCount}
                          </Badge>
                        )}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard" className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors">
                        <Settings className="mr-3 h-4 w-4" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors">
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center gap-2">
                  <Link href="/auth">
                    <Button variant="ghost" className="rounded-lg text-gray-700 hover:text-black hover:bg-gray-100">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/auth">
                    <Button className="bg-black hover:bg-gray-800 text-white rounded-lg">
                      Get Started
                    </Button>
                  </Link>
                </div>
              )}

              {/* Mobile menu button */}
              <motion.div 
                className="md:hidden"
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setSidebarOpen(true)}
                  className="rounded-full h-10 w-10 p-0"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
            />
            <motion.div
              className="fixed inset-y-0 left-0 z-50 w-80 bg-white/95 backdrop-blur-xl border-r border-white/20 shadow-2xl md:hidden"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            >
              <div className="flex h-16 items-center justify-between px-6 border-b border-gray-200/50">
                <div className="flex items-center gap-3">
                  <Leaf className="h-6 w-6 text-green-600" />
                  <span className="text-lg font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                    EcoFinds
                  </span>
                </div>
                <motion.div whileTap={{ scale: 0.95 }}>
                  <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(false)} className="rounded-full h-8 w-8 p-0">
                    <X className="h-4 w-4" />
                  </Button>
                </motion.div>
              </div>
              
              <nav className="flex-1 px-6 py-6 space-y-2 overflow-y-auto">
                {/* Main Navigation */}
                <div className="mb-6">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Navigation</h3>
                  {mainNavigation.map((item) => (
                    <NavItem key={item.name} item={item} isMobile />
                  ))}
                </div>

                {/* Dashboard Navigation - only show if user is authenticated */}
                {user && (
                  <div>
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Dashboard</h3>
                    {dashboardNavigation.map((item) => (
                      <NavItem key={item.name} item={item} isMobile />
                    ))}
                  </div>
                )}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Dashboard Sidebar - Desktop */}
      {isDashboard && user && (
        <motion.aside
          className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:w-72 lg:flex lg:flex-col lg:pt-16"
          initial={{ x: -300 }}
          animate={{ x: 0 }}
          transition={{ type: "spring", bounce: 0.2, duration: 0.8, delay: 0.2 }}
        >
          <div className="flex flex-col flex-1 bg-white/60 backdrop-blur-xl border-r border-white/20">
            <nav className="flex-1 p-6 space-y-2">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Dashboard</h3>
              {dashboardNavigation.map((item) => (
                <NavItem key={item.name} item={item} />
              ))}
            </nav>
          </div>
        </motion.aside>
      )}

      {/* Main Content */}
      <motion.main
        className={cn(
          "pt-16 min-h-screen",
          isDashboard && user ? "lg:pl-72" : ""
        )}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        {children}
      </motion.main>
    </div>
  )
}