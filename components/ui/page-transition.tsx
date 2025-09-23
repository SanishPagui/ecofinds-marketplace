"use client"

import { motion, AnimatePresence } from "framer-motion"
import { usePathname } from "next/navigation"
import { ReactNode, useEffect, useState } from "react"

interface PageTransitionProps {
  children: ReactNode
}

// Premium page transitions with sophisticated easing
export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname()
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    setIsVisible(false)
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [pathname])

  const pageVariants = {
    initial: {
      opacity: 0,
      y: 60,
      scale: 0.96,
      filter: "blur(10px)"
    },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
        staggerChildren: 0.05,
        delayChildren: 0.1
      }
    },
    exit: {
      opacity: 0,
      y: -60,
      scale: 1.04,
      filter: "blur(10px)",
      transition: {
        duration: 0.4,
        ease: [0.76, 0, 0.24, 1] as [number, number, number, number]
      }
    }
  }

  const childVariants = {
    initial: {
      opacity: 0,
      y: 40,
      rotateX: 10
    },
    animate: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number]
      }
    }
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      {isVisible && (
        <motion.div
          key={pathname}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="w-full min-h-screen"
          style={{ transformStyle: "preserve-3d" }}
        >
          <motion.div variants={childVariants}>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Premium animated button with magnetic hover effect
export function AnimatedButton({ 
  children, 
  className = "", 
  onClick,
  disabled = false,
  variant = "default",
  size = "md",
  magneticStrength = 0.3,
  ...props 
}: {
  children: ReactNode
  className?: string
  onClick?: () => void
  disabled?: boolean
  variant?: "default" | "primary" | "secondary" | "ghost" | "outline"
  size?: "sm" | "md" | "lg" | "xl"
  magneticStrength?: number
  [key: string]: any
}) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = (e: React.MouseEvent) => {
    if (disabled) return
    const rect = e.currentTarget.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    setMousePosition({
      x: (e.clientX - centerX) * magneticStrength,
      y: (e.clientY - centerY) * magneticStrength
    })
  }

  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
    xl: "px-10 py-5 text-xl"
  }

  const variantStyles = {
    default: "bg-white border-2 border-gray-200 text-gray-800 hover:border-gray-300 hover:bg-gray-50",
    primary: "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl",
    secondary: "bg-gradient-to-r from-gray-600 to-gray-700 text-white hover:from-gray-700 hover:to-gray-800",
    ghost: "bg-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-800",
    outline: "bg-transparent border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
  }

  return (
    <motion.button
      className={`
        relative inline-flex items-center justify-center font-semibold rounded-2xl
        transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-offset-2
        transform-gpu will-change-transform overflow-hidden group
        ${sizeStyles[size]}
        ${variantStyles[variant]}
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        ${className}
      `}
      animate={{
        x: isHovered ? mousePosition.x : 0,
        y: isHovered ? mousePosition.y : 0,
      }}
      whileHover={!disabled ? { 
        scale: 1.05,
        transition: { duration: 0.2, ease: "easeOut" }
      } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false)
        setMousePosition({ x: 0, y: 0 })
      }}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {/* Gradient overlay for premium effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        initial={false}
      />
      
      {/* Content */}
      <span className="relative z-10">{children}</span>
      
      {/* Ripple effect */}
      {variant === "primary" && (
        <motion.div
          className="absolute inset-0 bg-white/20 rounded-2xl"
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 1, opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      )}
    </motion.button>
  )
}

// Premium animated card with 3D tilt effect
export function AnimatedCard({ 
  children, 
  className = "",
  href,
  onClick,
  tiltStrength = 0.1,
  ...props 
}: {
  children: ReactNode
  className?: string
  href?: string
  onClick?: () => void
  tiltStrength?: number
  [key: string]: any
}) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    setMousePosition({
      x: (e.clientX - centerX) * tiltStrength,
      y: (e.clientY - centerY) * tiltStrength
    })
  }

  const cardVariants = {
    rest: {
      scale: 1,
      rotateX: 0,
      rotateY: 0,
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
    },
    hover: {
      scale: 1.02,
      rotateX: -mousePosition.y * 0.1,
      rotateY: mousePosition.x * 0.1,
      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.05)",
      transition: {
        duration: 0.3,
        ease: "easeOut" as const
      }
    }
  }

  const content = (
    <motion.div
      className={`
        relative rounded-3xl overflow-hidden cursor-pointer
        backdrop-blur-xl bg-white/80 border border-white/20
        ${className}
      `}
      variants={cardVariants}
      initial="rest"
      animate={isHovered ? "hover" : "rest"}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false)
        setMousePosition({ x: 0, y: 0 })
      }}
      onClick={onClick}
      style={{ 
        transformStyle: "preserve-3d",
        perspective: "1000px"
      }}
      {...props}
    >
      {/* Gradient border effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 opacity-0"
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Content wrapper */}
      <div className="relative z-10 h-full">
        {children}
      </div>
      
      {/* Shine effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12"
        initial={{ x: "-100%" }}
        animate={{ x: isHovered ? "100%" : "-100%" }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      />
    </motion.div>
  )

  if (href) {
    return (
      <a href={href} className="block">
        {content}
      </a>
    )
  }

  return content
}

// Floating action button with magnetic effect
export function FloatingActionButton({
  children,
  onClick,
  className = "",
  ...props
}: {
  children: ReactNode
  onClick?: () => void
  className?: string
  [key: string]: any
}) {
  return (
    <motion.button
      className={`
        fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600
        rounded-full shadow-lg text-white flex items-center justify-center
        backdrop-blur-xl border border-white/20 z-50
        ${className}
      `}
      whileHover={{ 
        scale: 1.1,
        boxShadow: "0 20px 40px rgba(0,0,0,0.2)"
      }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      {...props}
    >
      {children}
    </motion.button>
  )
}