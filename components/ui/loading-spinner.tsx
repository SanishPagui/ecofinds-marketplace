"use client"

import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

interface LoadingSpinnerProps {
  className?: string
  size?: "sm" | "md" | "lg" | "xl"
  variant?: "default" | "dots" | "pulse" | "bounce"
  text?: string
}

export function LoadingSpinner({ 
  className, 
  size = "md", 
  variant = "default",
  text 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6", 
    lg: "h-8 w-8",
    xl: "h-12 w-12"
  }

  if (variant === "dots") {
    return (
      <div className={cn("flex items-center justify-center space-x-1", className)}>
        <div className="flex space-x-1">
          <div className="h-2 w-2 bg-green-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="h-2 w-2 bg-green-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="h-2 w-2 bg-green-600 rounded-full animate-bounce"></div>
        </div>
        {text && <span className="ml-2 text-sm text-green-600 animate-pulse">{text}</span>}
      </div>
    )
  }

  if (variant === "pulse") {
    return (
      <div className={cn("flex items-center justify-center", className)}>
        <div className={cn(
          "bg-green-600 rounded-full animate-pulse",
          sizeClasses[size]
        )}></div>
        {text && <span className="ml-2 text-sm text-green-600 animate-pulse">{text}</span>}
      </div>
    )
  }

  if (variant === "bounce") {
    return (
      <div className={cn("flex items-center justify-center", className)}>
        <div className={cn(
          "bg-green-600 rounded-full animate-bounce",
          sizeClasses[size]
        )}></div>
        {text && <span className="ml-2 text-sm text-green-600 animate-pulse">{text}</span>}
      </div>
    )
  }

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <Loader2 className={cn(
        "animate-spin text-green-600",
        sizeClasses[size]
      )} />
      {text && <span className="ml-2 text-sm text-green-600 animate-pulse">{text}</span>}
    </div>
  )
}

// Skeleton loading component
export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer",
        className
      )}
      {...props}
    />
  )
}

// Card skeleton for product loading
export function ProductCardSkeleton() {
  return (
    <div className="border border-gray-200 rounded-xl p-4 space-y-4 animate-pulse">
      <Skeleton className="h-48 w-full rounded-lg" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
      <div className="flex justify-between items-center">
        <Skeleton className="h-6 w-1/4" />
        <Skeleton className="h-8 w-20 rounded-md" />
      </div>
    </div>
  )
}