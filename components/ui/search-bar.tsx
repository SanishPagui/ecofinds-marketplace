"use client"

import React, { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Search, 
  X, 
  Filter, 
  TrendingUp,
  Clock,
  ArrowRight
} from "lucide-react"
import { useSearch } from "@/hooks/use-search"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

interface SearchBarProps {
  className?: string
  placeholder?: string
  autoFocus?: boolean
  onClose?: () => void
}

export function SearchBar({ 
  className, 
  placeholder = "Search products...", 
  autoFocus = false,
  onClose 
}: SearchBarProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [recentSearches] = useState<string[]>([
    "Vintage furniture",
    "Electronics",
    "Clothing"
  ])
  
  const searchRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  
  const {
    searchQuery,
    updateSearchQuery,
    suggestions,
    showSuggestions,
    setShowSuggestions,
    selectSuggestion,
    clearSearch,
    loading
  } = useSearch()

  useEffect(() => {
    if (autoFocus && searchRef.current) {
      searchRef.current.focus()
    }
  }, [autoFocus])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsExpanded(false)
        setShowSuggestions(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [setShowSuggestions])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // Save to recent searches
      const query = searchQuery.trim()
      
      // Navigate to marketplace with search query
      const params = new URLSearchParams()
      params.set('q', query)
      router.push(`/marketplace?${params.toString()}`)
      
      setIsExpanded(false)
      setShowSuggestions(false)
      onClose?.()
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateSearchQuery(e.target.value)
  }

  const handleInputFocus = () => {
    setIsExpanded(true)
    if (searchQuery.trim()) {
      setShowSuggestions(true)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    selectSuggestion(suggestion)
    const params = new URLSearchParams()
    params.set('q', suggestion)
    router.push(`/marketplace?${params.toString()}`)
    setIsExpanded(false)
    onClose?.()
  }

  const handleClear = () => {
    clearSearch()
    searchRef.current?.focus()
  }

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <form onSubmit={handleSubmit} className="relative">
        <div className={cn(
          "relative transition-all duration-300",
          isExpanded ? "w-80" : "w-64"
        )}>
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            ref={searchRef}
            type="text"
            placeholder={placeholder}
            value={searchQuery}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            className={cn(
              "pl-10 pr-20 h-10 border-gray-200 focus:border-black transition-all duration-300",
              isExpanded && "shadow-lg border-black"
            )}
          />
          
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
            {searchQuery && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleClear}
                className="h-6 w-6 p-0 hover:bg-gray-100 rounded-full"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
            
            <Button
              type="submit"
              variant="ghost"
              size="sm"
              disabled={!searchQuery.trim() || loading}
              className="h-6 w-6 p-0 hover:bg-gray-100 rounded-full"
            >
              <ArrowRight className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {loading && (
          <div className="absolute right-12 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black" />
          </div>
        )}
      </form>

      {/* Search Suggestions Dropdown */}
      <AnimatePresence>
        {(isExpanded && (showSuggestions || searchQuery === "")) && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto"
          >
            {/* Search Suggestions */}
            {suggestions.length > 0 && (
              <div className="p-3 border-b border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-600">Suggestions</span>
                </div>
                <div className="space-y-1">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-gray-50 transition-colors flex items-center gap-3"
                    >
                      <Search className="h-3 w-3 text-gray-400" />
                      <span>{suggestion}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Searches */}
            {searchQuery === "" && recentSearches.length > 0 && (
              <div className="p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-600">Recent Searches</span>
                </div>
                <div className="space-y-1">
                  {recentSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(search)}
                      className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-gray-50 transition-colors flex items-center gap-3"
                    >
                      <Clock className="h-3 w-3 text-gray-400" />
                      <span className="text-gray-700">{search}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="p-3 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => {
                    router.push('/marketplace')
                    setIsExpanded(false)
                    onClose?.()
                  }}
                  variant="ghost"
                  size="sm"
                  className="text-xs"
                >
                  <Filter className="h-3 w-3 mr-1" />
                  Advanced Search
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}