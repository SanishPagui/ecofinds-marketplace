"use client"

import { useState, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { PRODUCT_CATEGORIES } from "@/types/product"
import { Search, Filter, X, ChevronDown, ChevronUp, Star, MapPin, Clock, DollarSign, Sparkles, Grid, List, SortAsc, SortDesc, Eye } from "lucide-react"

interface SearchFiltersProps {
  onFiltersChange: (filters: {
    searchTerm: string
    categories: string[]
    minPrice: number
    maxPrice: number
    condition: string[]
    rating: number
    availability: string[]
    sortBy: string
    priceRange: number[]
    viewMode?: 'grid' | 'list'
  }) => void
  loading?: boolean
  totalProducts?: number
}

export function SearchFilters({ onFiltersChange, loading, totalProducts = 0 }: SearchFiltersProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<number[]>([0, 5000])
  const [selectedConditions, setSelectedConditions] = useState<string[]>([])
  const [minRating, setMinRating] = useState(0)
  const [selectedAvailability, setSelectedAvailability] = useState<string[]>([])
  const [sortBy, setSortBy] = useState("newest")
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  
  // Collapsible sections state
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    price: true,
    condition: true,
    rating: false,
    availability: false
  })

  // Enhanced filter options with icons
  const conditions = [
    { id: "new", label: "Brand New", description: "Never used", count: 0 },
    { id: "excellent", label: "Like New", description: "Barely used", count: 0 },
    { id: "good", label: "Good", description: "Some wear", count: 0 },
    { id: "fair", label: "Fair", description: "Well used", count: 0 }
  ]

  const availabilityOptions = [
    { id: "available", label: "Available Now", count: 0 },
    { id: "reserved", label: "Reserved", count: 0 },
    { id: "pickup", label: "Pickup Available", count: 0 },
    { id: "delivery", label: "Delivery Available", count: 0 }
  ]

  const sortOptions = [
    { value: "newest", label: "Newest First", icon: <Sparkles className="h-4 w-4" /> },
    { value: "oldest", label: "Oldest First", icon: <Clock className="h-4 w-4" /> },
    { value: "price-low", label: "Price: Low to High", icon: <SortAsc className="h-4 w-4" /> },
    { value: "price-high", label: "Price: High to Low", icon: <SortDesc className="h-4 w-4" /> },
    { value: "rating", label: "Highest Rated", icon: <Star className="h-4 w-4" /> },
    { value: "popular", label: "Most Popular", icon: <Eye className="h-4 w-4" /> }
  ]

  // Enhanced categories with icons
  const enhancedCategories = PRODUCT_CATEGORIES.map(category => ({
    id: category.toLowerCase().replace(/\s+/g, '-'),
    label: category,
    icon: getCategoryIcon(category),
    count: Math.floor(Math.random() * 100) + 10 // Mock count
  }))

  function getCategoryIcon(category: string) {
    const icons: { [key: string]: string } = {
      'Electronics': '📱',
      'Furniture': '🪑',
      'Clothing': '👕',
      'Books': '📚',
      'Sports': '⚽',
      'Home': '🏠',
      'Toys': '🧸',
      'Automotive': '🚗'
    }
    return icons[category] || '📦'
  }

  // Calculate active filters count
  const activeFiltersCount = useMemo(() => {
    let count = 0
    if (searchTerm) count++
    if (selectedCategories.length > 0) count++
    if (priceRange[0] > 0 || priceRange[1] < 5000) count++
    if (selectedConditions.length > 0) count++
    if (minRating > 0) count++
    if (selectedAvailability.length > 0) count++
    return count
  }, [searchTerm, selectedCategories, priceRange, selectedConditions, minRating, selectedAvailability])

  // Apply filters effect with enhanced data
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onFiltersChange({
        searchTerm,
        categories: selectedCategories,
        minPrice: priceRange[0],
        maxPrice: priceRange[1],
        condition: selectedConditions,
        rating: minRating,
        availability: selectedAvailability,
        sortBy,
        priceRange,
        viewMode
      })
    }, 300) // Reduced debounce for better UX

    return () => clearTimeout(timeoutId)
  }, [searchTerm, selectedCategories, priceRange, selectedConditions, minRating, selectedAvailability, sortBy, viewMode, onFiltersChange])

  const handleCategoryChange = (category: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories(prev => [...prev, category])
    } else {
      setSelectedCategories(prev => prev.filter(c => c !== category))
    }
  }

  const handleConditionChange = (condition: string, checked: boolean) => {
    if (checked) {
      setSelectedConditions(prev => [...prev, condition])
    } else {
      setSelectedConditions(prev => prev.filter(c => c !== condition))
    }
  }

  const handleAvailabilityChange = (availability: string, checked: boolean) => {
    if (checked) {
      setSelectedAvailability(prev => [...prev, availability])
    } else {
      setSelectedAvailability(prev => prev.filter(a => a !== availability))
    }
  }

  const handleClearAll = () => {
    setSearchTerm("")
    setSelectedCategories([])
    setPriceRange([0, 5000])
    setSelectedConditions([])
    setMinRating(0)
    setSelectedAvailability([])
    setSortBy("newest")
  }

  const removeFilter = (type: string, value?: string) => {
    switch (type) {
      case "search":
        setSearchTerm("")
        break
      case "category":
        if (value) setSelectedCategories(prev => prev.filter(c => c !== value))
        break
      case "condition":
        if (value) setSelectedConditions(prev => prev.filter(c => c !== value))
        break
      case "availability":
        if (value) setSelectedAvailability(prev => prev.filter(a => a !== value))
        break
      case "price":
        setPriceRange([0, 5000])
        break
      case "rating":
        setMinRating(0)
        break
    }
  }

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }))
  }

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Sort Options */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Sort By</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Active Filters */}
      {activeFiltersCount > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">
                Active Filters ({activeFiltersCount})
              </CardTitle>
              <Button variant="outline" size="sm" onClick={handleClearAll}>
                Clear All
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-wrap gap-2">
              {searchTerm && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Search: {searchTerm}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => removeFilter("search")} />
                </Badge>
              )}
              {selectedCategories.map(category => (
                <Badge key={category} variant="secondary" className="flex items-center gap-1">
                  {category}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => removeFilter("category", category)} />
                </Badge>
              ))}
              {selectedConditions.map(condition => (
                <Badge key={condition} variant="secondary" className="flex items-center gap-1">
                  {conditions.find(c => c.id === condition)?.label}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => removeFilter("condition", condition)} />
                </Badge>
              ))}
              {(priceRange[0] > 0 || priceRange[1] < 5000) && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  ₹{priceRange[0]} - ₹{priceRange[1]}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => removeFilter("price")} />
                </Badge>
              )}
              {minRating > 0 && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  {minRating}+ Stars
                  <X className="h-3 w-3 cursor-pointer" onClick={() => removeFilter("rating")} />
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Categories Filter */}
      <Card>
        <Collapsible open={expandedSections.categories} onOpenChange={() => toggleSection("categories")}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Categories
                </CardTitle>
                {expandedSections.categories ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-0">
              <div className="space-y-3">
                {PRODUCT_CATEGORIES.map(category => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox
                      id={`category-${category}`}
                      checked={selectedCategories.includes(category)}
                      onCheckedChange={(checked) => handleCategoryChange(category, checked as boolean)}
                    />
                    <Label htmlFor={`category-${category}`} className="text-sm cursor-pointer flex-1">
                      {category}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Price Range Filter */}
      <Card>
        <Collapsible open={expandedSections.price} onOpenChange={() => toggleSection("price")}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Price Range
                </CardTitle>
                {expandedSections.price ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-0">
              <div className="space-y-4">
                <div className="px-3">
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={5000}
                    min={0}
                    step={50}
                    className="w-full"
                  />
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>₹{priceRange[0]}</span>
                  <span>₹{priceRange[1]}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs">Min</Label>
                    <Input
                      type="number"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                      className="h-8"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Max</Label>
                    <Input
                      type="number"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                      className="h-8"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Condition Filter */}
      <Card>
        <Collapsible open={expandedSections.condition} onOpenChange={() => toggleSection("condition")}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Condition
                </CardTitle>
                {expandedSections.condition ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-0">
              <div className="space-y-3">
                {conditions.map(condition => (
                  <div key={condition.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`condition-${condition.id}`}
                      checked={selectedConditions.includes(condition.id)}
                      onCheckedChange={(checked) => handleConditionChange(condition.id, checked as boolean)}
                    />
                    <Label htmlFor={`condition-${condition.id}`} className="text-sm cursor-pointer flex-1">
                      {condition.label}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Rating Filter */}
      <Card>
        <Collapsible open={expandedSections.rating} onOpenChange={() => toggleSection("rating")}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  Customer Rating
                </CardTitle>
                {expandedSections.rating ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-0">
              <div className="space-y-3">
                {[4, 3, 2, 1].map(rating => (
                  <div key={rating} className="flex items-center space-x-2">
                    <Checkbox
                      id={`rating-${rating}`}
                      checked={minRating === rating}
                      onCheckedChange={(checked) => setMinRating(checked ? rating : 0)}
                    />
                    <Label htmlFor={`rating-${rating}`} className="text-sm cursor-pointer flex items-center gap-1">
                      <div className="flex">
                        {[...Array(rating)].map((_, i) => (
                          <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        ))}
                        {[...Array(5 - rating)].map((_, i) => (
                          <Star key={i} className="h-3 w-3 text-gray-300" />
                        ))}
                      </div>
                      & Up
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Availability Filter */}
      <Card>
        <Collapsible open={expandedSections.availability} onOpenChange={() => toggleSection("availability")}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Availability
                </CardTitle>
                {expandedSections.availability ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-0">
              <div className="space-y-3">
                {availabilityOptions.map(option => (
                  <div key={option.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`availability-${option.id}`}
                      checked={selectedAvailability.includes(option.id)}
                      onCheckedChange={(checked) => handleAvailabilityChange(option.id, checked as boolean)}
                    />
                    <Label htmlFor={`availability-${option.id}`} className="text-sm cursor-pointer flex-1">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Results Summary */}
      {!loading && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-green-800">
                {totalProducts === 0 ? "No products found" : `${totalProducts} product${totalProducts !== 1 ? "s" : ""} found`}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
