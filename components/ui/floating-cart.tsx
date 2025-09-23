"use client"

import { ShoppingCart, X } from "lucide-react"
import { useCart } from "@/contexts/CartContext"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

export function FloatingCartButton() {
  const { cart, getCartItemCount, getCartTotal } = useCart()
  const [isExpanded, setIsExpanded] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const itemCount = getCartItemCount()
  const totalPrice = getCartTotal()
  const items = cart?.items || []
  
  const lastScrollY = useRef(0)
  
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setIsVisible(false)
      } else {
        setIsVisible(true)
      }
      
      lastScrollY.current = currentScrollY
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (itemCount === 0) return null

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 transition-transform duration-300 ease-in-out ${
        isVisible ? 'translate-y-0' : 'translate-y-16'
      }`}
      style={{ willChange: 'transform' }}
    >
      {!isExpanded ? (
        // Compact Cart Button - Fixed size to prevent layout shifts
        <button
          className="relative bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-300 transition-colors duration-200 flex items-center justify-center"
          onClick={() => setIsExpanded(true)}
          style={{ width: '56px', height: '56px' }}
        >
          <ShoppingCart className="h-6 w-6" />
          
          {/* Badge - Fixed positioning */}
          <div
            className="absolute bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold"
            style={{ 
              top: '-8px', 
              right: '-8px', 
              width: '24px', 
              height: '24px',
              minWidth: '24px'
            }}
          >
            {itemCount > 99 ? '99+' : itemCount}
          </div>
        </button>
      ) : (
        // Expanded Cart Preview - Fixed width to prevent layout shifts
        <Card 
          className="bg-white shadow-xl border-0 overflow-hidden"
          style={{ width: '320px', maxWidth: '320px' }}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Cart ({itemCount})
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(false)}
                className="h-8 w-8 p-0 hover:bg-gray-100 shrink-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-3" style={{ maxHeight: '240px', overflowY: 'auto' }}>
              {items.slice(0, 3).map((item) => (
                <div
                  key={item.productId}
                  className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg"
                >
                  <div 
                    className="bg-green-100 rounded-md flex items-center justify-center shrink-0"
                    style={{ width: '40px', height: '40px' }}
                  >
                    {item.productImageUrl ? (
                      <img 
                        src={item.productImageUrl} 
                        alt={item.productTitle} 
                        className="w-full h-full object-cover rounded-md"
                      />
                    ) : (
                      <span className="text-xs font-medium text-green-600">
                        {item.productTitle.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.productTitle}</p>
                    <p className="text-xs text-gray-500">₹{item.productPrice}</p>
                  </div>
                  <span className="text-sm font-semibold text-green-600 shrink-0">
                    ×{item.quantity}
                  </span>
                </div>
              ))}
              
              {items.length > 3 && (
                <div className="text-center text-sm text-gray-500 py-2">
                  +{items.length - 3} more items
                </div>
              )}
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <span className="font-semibold">Total:</span>
                <span className="font-bold text-lg text-green-600">₹{totalPrice.toFixed(2)}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsExpanded(false)}
                  className="text-xs"
                >
                  Continue
                </Button>
                <Link href="/dashboard/cart">
                  <Button
                    size="sm"
                    className="w-full bg-green-600 hover:bg-green-700 text-xs"
                  >
                    View Cart
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}