"use client"

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { ScrollToPlugin } from "gsap/ScrollToPlugin"
import { pageTransitionIn, pageTransitionOut } from "@/lib/animations"
import { useIsMobile } from "@/hooks/use-mobile"

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)
}

type AnimationContextType = {
  animatePageTransition: (callback?: () => void) => void
  animateElement: (element: Element | string, animation: string, options?: any) => gsap.core.Tween | undefined
  createScrollAnimation: (element: Element | string, animation: string, options?: any) => ScrollTrigger | undefined
  isAnimating: boolean
  isMobile: boolean
  getResponsiveValue: <T>(desktopValue: T, mobileValue: T) => T
}

const AnimationContext = createContext<AnimationContextType | undefined>(undefined)

export function AnimationProvider({ children }: { children: ReactNode }) {
  const [isAnimating, setIsAnimating] = useState(false)
  const isMobile = useIsMobile()

  // Initialize GSAP defaults
  useEffect(() => {
    // Set default ease for all animations
    gsap.defaults({
      ease: "power2.out",
    })

    // Clean up ScrollTrigger on unmount
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [])

  // Handle page transitions
  const animatePageTransition = (callback?: () => void) => {
    setIsAnimating(true)
    
    const tl = gsap.timeline({
      onComplete: () => {
        setIsAnimating(false)
        if (callback) callback()
      }
    })
    
    tl.add(pageTransitionOut())
      .add(pageTransitionIn())
    
    return tl
  }

  // Helper function to get responsive values based on screen size
  const getResponsiveValue = <T,>(desktopValue: T, mobileValue: T): T => {
    return isMobile ? mobileValue : desktopValue
  }

  // Animate a single element with predefined animations
  const animateElement = (element: Element | string, animation: string, options: any = {}) => {
    if (typeof window === "undefined") return
    
    const {
      duration = getResponsiveValue(0.5, 0.3),
      delay = getResponsiveValue(options.delay || 0, options.mobileDelay || options.delay || 0),
      ease = "power2.out",
      ...rest
    } = options
    
    switch (animation) {
      case "fadeIn":
        return gsap.fromTo(
          element,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration, delay, ease, ...rest }
        )
      case "fadeOut":
        return gsap.to(
          element,
          { opacity: 0, y: -20, duration, delay, ease, ...rest }
        )
      case "scaleIn":
        return gsap.fromTo(
          element,
          { opacity: 0, scale: 0.8 },
          { opacity: 1, scale: 1, duration, delay, ease: "back.out(1.7)", ...rest }
        )
      case "slideInRight":
        return gsap.fromTo(
          element,
          { opacity: 0, x: 50 },
          { opacity: 1, x: 0, duration, delay, ease, ...rest }
        )
      case "slideInLeft":
        return gsap.fromTo(
          element,
          { opacity: 0, x: -50 },
          { opacity: 1, x: 0, duration, delay, ease, ...rest }
        )
      case "slideInUp":
        return gsap.fromTo(
          element,
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, duration, delay, ease, ...rest }
        )
      case "pulse":
        return gsap.to(
          element,
          {
            scale: options.scale || 1.05,
            duration: duration / 2,
            ease: "power2.inOut",
            yoyo: true,
            repeat: 1,
            ...rest
          }
        )
      case "staggerItems":
        return gsap.fromTo(
          element,
          { opacity: 0, y: 20 },
          { 
            opacity: 1, 
            y: 0, 
            duration, 
            stagger: options.stagger || 0.1,
            delay, 
            ease, 
            ...rest 
          }
        )
      default:
        console.warn(`Animation type '${animation}' not recognized`)
        return undefined
    }
  }

  // Create scroll-triggered animations
  const createScrollAnimation = (element: Element | string, animation: string, options: any = {}) => {
    if (typeof window === "undefined") return
    
    const {
      start = getResponsiveValue(options.start || "top 80%", options.mobileStart || "top 90%"),
      end = getResponsiveValue(options.end || "bottom 20%", options.mobileEnd || "bottom 10%"),
      scrub = options.scrub || false,
      toggleActions = options.toggleActions || "play none none reverse",
      duration = getResponsiveValue(options.duration || 0.5, options.mobileDuration || 0.3),
      ...rest
    } = options
    
    let tween: gsap.core.Tween | undefined
    
    switch (animation) {
      case "fadeIn":
        tween = gsap.fromTo(
          element,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration, ...rest }
        )
        break
      case "scaleIn":
        tween = gsap.fromTo(
          element,
          { opacity: 0, scale: 0.8 },
          { opacity: 1, scale: 1, duration, ease: "back.out(1.7)", ...rest }
        )
        break
      case "slideInRight":
        tween = gsap.fromTo(
          element,
          { opacity: 0, x: 50 },
          { opacity: 1, x: 0, duration, ...rest }
        )
        break
      case "slideInLeft":
        tween = gsap.fromTo(
          element,
          { opacity: 0, x: -50 },
          { opacity: 1, x: 0, duration, ...rest }
        )
        break
      case "slideInUp":
        tween = gsap.fromTo(
          element,
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, duration, ...rest }
        )
        break
      default:
        console.warn(`Animation type '${animation}' not recognized for scroll animation`)
        return undefined
    }
    
    if (!tween) return undefined
    
    return ScrollTrigger.create({
      trigger: element,
      start,
      end,
      scrub,
      toggleActions,
      animation: tween,
    })
  }

  return (
    <AnimationContext.Provider
      value={{
        animatePageTransition,
        animateElement,
        createScrollAnimation,
        isAnimating,
        isMobile,
        getResponsiveValue
      }}
    >
      {children}
    </AnimationContext.Provider>
  )
}

export const useAnimation = () => {
  const context = useContext(AnimationContext)
  if (context === undefined) {
    throw new Error("useAnimation must be used within an AnimationProvider")
  }
  return context
}