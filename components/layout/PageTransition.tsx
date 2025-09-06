"use client"

import { ReactNode, useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import { useAnimation } from "@/contexts/AnimationContext"

interface PageTransitionProps {
  children: ReactNode
}

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname()
  const { animateElement } = useAnimation()
  const pageRef = useRef<HTMLDivElement>(null)
  const prevPathRef = useRef<string>(pathname)

  useEffect(() => {
    // Only animate if this isn't the first render
    if (prevPathRef.current !== pathname && pageRef.current) {
      // Animate the new page content
      animateElement(pageRef.current, "fadeIn", { duration: 0.6, delay: 0.1 })
    }
    
    // Update the previous path
    prevPathRef.current = pathname
  }, [pathname, animateElement])

  return (
    <div ref={pageRef} className="page-transition-container">
      {children}
    </div>
  )
}