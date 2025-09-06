"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useCart } from "@/contexts/CartContext"
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
import { Leaf, User, Package, ShoppingCart, History, Plus, Menu, X } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

interface DashboardLayoutProps {
  children: React.ReactNode
}

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Package },
  { name: "Browse", href: "/marketplace", icon: Package },
  { name: "My Listings", href: "/dashboard/listings", icon: Package },
  { name: "Cart", href: "/dashboard/cart", icon: ShoppingCart },
  { name: "Purchase History", href: "/dashboard/history", icon: History },
]

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, userProfile, logout } = useAuth()
  const { getCartItemCount } = useCart()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
  }

  const cartItemCount = getCartItemCount()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div className={cn("fixed inset-0 z-50 lg:hidden", sidebarOpen ? "block" : "hidden")}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white">
          <div className="flex h-16 items-center justify-between px-4 border-b">
            <div className="flex items-center gap-2">
              <Leaf className="h-6 w-6 text-green-600" />
              <span className="text-lg font-bold text-green-600">EcoFinds</span>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          <nav className="flex-1 px-4 py-4 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors relative",
                    pathname === item.href ? "bg-green-100 text-green-700" : "text-gray-600 hover:bg-gray-100",
                  )}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className="h-5 w-5" />
                  {item.name}
                  {item.name === "Cart" && cartItemCount > 0 && (
                    <Badge className="ml-auto bg-green-600 text-white text-xs">{cartItemCount}</Badge>
                  )}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-1 bg-white border-r">
          <div className="flex h-16 items-center px-4 border-b">
            <div className="flex items-center gap-2">
              <Leaf className="h-6 w-6 text-green-600" />
              <span className="text-lg font-bold text-green-600">EcoFinds</span>
            </div>
          </div>
          <nav className="flex-1 px-4 py-4 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors relative",
                    pathname === item.href ? "bg-green-100 text-green-700" : "text-gray-600 hover:bg-gray-100",
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {item.name}
                  {item.name === "Cart" && cartItemCount > 0 && (
                    <Badge className="ml-auto bg-green-600 text-white text-xs">{cartItemCount}</Badge>
                  )}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-40 flex h-16 items-center justify-between bg-white border-b px-4 lg:px-6">
          <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex items-center gap-4">
            <Link href="/dashboard/listings/new">
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Listing
              </Button>
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-green-100 text-green-700">
                      {userProfile?.username?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{userProfile?.username || "User"}</p>
                    <p className="w-[200px] truncate text-sm text-muted-foreground">{user?.email}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/profile" className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Page content */}
        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  )
}
