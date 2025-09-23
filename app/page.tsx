"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { AnimatedButton, AnimatedCard } from "@/components/ui/page-transition"
import { 
  Leaf, 
  ArrowRight, 
  ShoppingBag, 
  Users, 
  Recycle, 
  Heart,
  Star,
  TrendingUp,
  Award,
  Zap,
  Globe,
  ShieldCheck
} from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const { user } = useAuth()
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  })
  
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"])
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"])
  
  // Subtle mouse parallax effect
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20
      })
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

    const features = [
    {
      icon: Leaf,
      title: "Eco-Verified",
      description: "Every product meets our rigorous sustainability standards, certified by environmental experts."
    },
    {
      icon: Users,
      title: "Community Driven",
      description: "Join thousands of conscious consumers making informed choices for a better future."
    },
    {
      icon: ShieldCheck,
      title: "Quality Assured",
      description: "Premium products that last longer, reducing waste and delivering exceptional value."
    },
    {
      icon: Heart,
      title: "Purpose Driven",
      description: "Support brands that prioritize people and planet alongside profit."
    }
  ]

  const stats = [
    { label: "Items Saved", value: "10K+", icon: Heart },
    { label: "Happy Users", value: "5K+", icon: Users },
    { label: "CO₂ Reduced", value: "2.5T", icon: Leaf },
    { label: "Reviews", value: "4.9★", icon: Star }
  ]

  return (
    <div ref={containerRef} className="min-h-screen overflow-hidden bg-[#F8F7F4]">
      {/* Minimalist Animated Background */}
      <motion.div 
        className="fixed inset-0 -z-10"
        style={{ y: backgroundY }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#F8F7F4] via-white to-gray-50" />
        
        {/* Subtle Floating Elements */}
        <motion.div
          className="absolute top-1/3 left-1/4 w-32 h-32 bg-black/3 rounded-full blur-3xl"
          animate={{
            x: mousePosition.x * 0.5,
            y: mousePosition.y * 0.5,
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        
        <motion.div
          className="absolute bottom-1/3 right-1/4 w-24 h-24 bg-black/2 rounded-full blur-2xl"
          animate={{
            x: -mousePosition.x * 0.3,
            y: -mousePosition.y * 0.3,
            scale: [1.1, 1, 1.1],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      {/* Hero Section */}
      <motion.section 
        className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8"
        style={{ y: textY }}
      >
        <div className="max-w-4xl mx-auto text-center">
          {/* Hero Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mb-12"
          >
            <Badge className="px-6 py-2 text-sm font-medium bg-white/80 text-gray-700 border border-gray-200 backdrop-blur-sm">
              <Leaf className="w-4 h-4 mr-2" />
              Sustainable Living, Redefined
            </Badge>
          </motion.div>

          {/* Main Heading */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="mb-8"
          >
            <h1 className="heading-xl text-center leading-tight mb-6">
              Discover Beautiful,
              <br />
              <span className="italic">Sustainable</span> Treasures
            </h1>
          </motion.div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="body-lg text-center max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            Join a community of conscious consumers who believe that beautiful, high-quality items deserve a second life. Every purchase makes a difference.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
          >
            <Link href={user ? "/marketplace" : "/auth"}>
              <AnimatedButton
                variant="primary"
                size="lg"
                className="btn-primary group px-8 py-4 text-lg"
              >
                {user ? "Browse Marketplace" : "Start Exploring"}
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </AnimatedButton>
            </Link>
            
            <Link href="/marketplace">
              <AnimatedButton
                variant="outline"
                size="lg"
                className="btn-secondary px-8 py-4 text-lg"
              >
                <ShoppingBag className="mr-2 h-5 w-5" />
                View Collection
              </AnimatedButton>
            </Link>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.8 + index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-black/5 mb-3">
                  <stat.icon className="w-6 h-6 text-black" />
                </div>
                <div className="text-2xl font-serif font-semibold text-black">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        viewport={{ once: true }}
        className="py-24 px-4 sm:px-6 lg:px-8 bg-white"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="px-4 py-2 text-sm font-medium bg-gray-50 text-gray-700 border border-gray-200 mb-6">
              <Award className="w-4 h-4 mr-2" />
              Why Choose EcoFinds
            </Badge>
            <h2 className="heading-lg text-center mb-4">
              Thoughtful Shopping for a Better Tomorrow
            </h2>
            <p className="body-lg text-center max-w-2xl mx-auto">
              Every item tells a story. Every purchase makes a difference.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                viewport={{ once: true }}
              >
                <AnimatedCard className="card-minimal p-8 h-full text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-black/5 mb-6">
                    <feature.icon className="w-8 h-8 text-black" />
                  </div>
                  <h3 className="heading-md text-center mb-4">
                    {feature.title}
                  </h3>
                  <p className="body-md text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </AnimatedCard>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        viewport={{ once: true }}
        className="py-24 px-4 sm:px-6 lg:px-8 bg-[#F8F7F4]"
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
          >
            <h2 className="heading-lg text-center mb-6">
              Ready to Make a Difference?
            </h2>
            <p className="body-lg text-center mb-8 max-w-2xl mx-auto">
              Join our community of conscious consumers and start your sustainable shopping journey today.
            </p>
            <Link href={user ? "/dashboard" : "/auth"}>
              <AnimatedButton
                variant="primary"
                size="xl"
                className="btn-primary px-12 py-5 text-xl group"
              >
                {user ? "Go to Dashboard" : "Start Shopping Now"}
                <TrendingUp className="ml-3 h-6 w-6 transition-transform group-hover:translate-x-1" />
              </AnimatedButton>
            </Link>
          </motion.div>
        </div>
      </motion.section>
    </div>
  )
}
