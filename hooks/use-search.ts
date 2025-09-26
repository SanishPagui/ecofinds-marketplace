"use client"

import { useState, useEffect, useCallback } from "react"
import { Product } from "@/types/product"
import { searchProducts, getSearchSuggestions, SearchFilters, SearchResult } from "@/lib/search"
import { DocumentSnapshot } from "firebase/firestore"
import { useDebounce } from "./use-debounce"

export function useSearch() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState<SearchFilters>({})
  const [results, setResults] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(false)
  const [lastDoc, setLastDoc] = useState<DocumentSnapshot | null>(null)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  const debouncedQuery = useDebounce(searchQuery, 300)

  const search = useCallback(async (
    searchFilters: SearchFilters,
    isLoadMore: boolean = false
  ) => {
    setLoading(true)
    try {
      const result: SearchResult = await searchProducts(
        searchFilters,
        20,
        isLoadMore ? lastDoc : null
      )

      if (isLoadMore) {
        setResults(prev => [...prev, ...result.products])
      } else {
        setResults(result.products)
      }

      setHasMore(result.hasMore)
      setLastDoc(result.lastDoc)
    } catch (error) {
      console.error("Search error:", error)
      setResults([])
      setHasMore(false)
      setLastDoc(null)
    } finally {
      setLoading(false)
    }
  }, [lastDoc])

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      search({ ...filters, query: debouncedQuery }, true)
    }
  }, [loading, hasMore, filters, debouncedQuery, search])

  const updateFilters = useCallback((newFilters: Partial<SearchFilters>) => {
    const updatedFilters = { ...filters, ...newFilters }
    setFilters(updatedFilters)
    setLastDoc(null) // Reset pagination
    search({ ...updatedFilters, query: debouncedQuery })
  }, [filters, debouncedQuery, search])

  const updateSearchQuery = useCallback((query: string) => {
    setSearchQuery(query)
    
    // Generate suggestions
    if (query.trim()) {
      const suggestions = getSearchSuggestions(query, results)
      setSuggestions(suggestions)
      setShowSuggestions(true)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }, [results])

  const clearSearch = useCallback(() => {
    setSearchQuery("")
    setSuggestions([])
    setShowSuggestions(false)
    setFilters({})
    setResults([])
    setLastDoc(null)
    setHasMore(false)
  }, [])

  const selectSuggestion = useCallback((suggestion: string) => {
    setSearchQuery(suggestion)
    setShowSuggestions(false)
  }, [])

  // Search when debounced query or filters change
  useEffect(() => {
    if (debouncedQuery.trim() || Object.keys(filters).length > 0) {
      search({ ...filters, query: debouncedQuery })
    } else {
      setResults([])
      setHasMore(false)
      setLastDoc(null)
    }
  }, [debouncedQuery, search])

  return {
    searchQuery,
    updateSearchQuery,
    filters,
    updateFilters,
    results,
    loading,
    hasMore,
    loadMore,
    suggestions,
    showSuggestions,
    setShowSuggestions,
    selectSuggestion,
    clearSearch
  }
}