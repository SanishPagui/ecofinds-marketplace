"use client"

import { motion } from "framer-motion"
import { AuroraBackground } from "@/components/ui/aurora-background"
import Link from "next/link"

export default function Home() {
  const leftImages = [
    {
      src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/hemp-fabric-clothing-sustainable-fashion-Eta94tCG0FmQFh3jS0nwNpcSSCaFEJ.jpg",
      size: "w-24 h-24",
      shape: "rounded-lg",
      transform: "rotate-12",
      initialRotate: -15,
      delay: 0.5,
      margin: "",
    },
    {
      src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/reusable-water-bottle-stainless-steel-n8T1ng4LPFjuVSnPsGyH9mpLZ4ZOPw.jpg",
      size: "w-28 h-28",
      shape: "rounded-full",
      transform: "-rotate-6",
      initialRotate: 15,
      delay: 0.7,
      margin: "mt-8",
    },
    {
      src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/plant-based-skincare-products-natural-fGPi7lzxLlcpqdXF74uf87yLH2fkin.jpg",
      size: "w-22 h-22",
      shape: "rounded-lg",
      transform: "rotate-45",
      initialRotate: -10,
      delay: 0.9,
      margin: "",
    },
    {
      src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/organic-cotton-tote-bag-sustainable-TcTY8lphMExnVBhABPIwU85Rg70KPH.jpg",
      size: "w-32 h-24",
      shape: "rounded-full",
      transform: "-rotate-12",
      initialRotate: 20,
      delay: 1.1,
      margin: "-mt-4",
    },
  ]

  const rightImages = [
    {
      src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/solar-powered-gadget-eco-friendly-thXl3npaCp7TV6cGE4nbA4cGTVYLoa.jpg",
      size: "w-26 h-26",
      shape: "rounded-lg",
      transform: "rotate-30",
      initialRotate: -25,
      delay: 1.3,
      margin: "",
    },
    {
      src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/sustainable-eco-product-bamboo-utensils-eSY5m9kozVUUNNjEOsEwA5M4T61jLY.jpg",
      size: "w-28 h-28",
      shape: "rounded-full",
      transform: "-rotate-24",
      initialRotate: 10,
      delay: 1.5,
      margin: "mt-6",
    },
    {
      src: "http://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/recycled-glass-bottles-sustainable-home-nIlFF5tg8Ve6TWxIKYHxxIC5RupqUT.jpg",
      size: "w-24 h-32",
      shape: "rounded-lg",
      transform: "rotate-15",
      initialRotate: -30,
      delay: 1.7,
      margin: "",
    },
    {
      src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/wooden-kitchen-utensils-sustainable-4lV12P3jd4yyOH0dhXKhZQBn7gYIFI.jpg",
      size: "w-30 h-24",
      shape: "rounded-full",
      transform: "-rotate-18",
      initialRotate: 25,
      delay: 1.9,
      margin: "-mt-2",
    },
    {
      src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/natural-soap-bars-eco-friendly-sfA6UfNl4GPC4beX1tfcqSgMJCHDj6.jpg",
      size: "w-28 h-28",
      shape: "rounded-lg",
      transform: "rotate-36",
      initialRotate: -20,
      delay: 2.1,
      margin: "",
    },
  ]

  return (
    <AuroraBackground>
      <div className="relative min-h-screen overflow-hidden">
        <div className="absolute left-4 top-0 bottom-0 w-64 flex flex-col justify-center">
          <div className="grid grid-cols-2 gap-6 transform rotate-12">
            {leftImages.map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8, rotate: image.initialRotate }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ delay: image.delay, duration: 0.8 }}
                className={`${image.size} ${image.shape} overflow-hidden shadow-lg transform ${image.transform} ${image.margin}`}
              >
                <img src={image.src || "/placeholder.svg"} alt="Eco product" className="w-full h-full object-cover" />
              </motion.div>
            ))}
          </div>
        </div>

        <div className="absolute right-4 top-0 bottom-0 w-64 flex flex-col justify-center">
          <div className="grid grid-cols-2 gap-6 transform -rotate-12">
            {rightImages.map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8, rotate: image.initialRotate }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ delay: image.delay, duration: 0.8 }}
                className={`${image.size} ${image.shape} overflow-hidden shadow-lg transform ${image.transform} ${image.margin}`}
              >
                <img src={image.src || "/placeholder.svg"} alt="Eco product" className="w-full h-full object-cover" />
              </motion.div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-center min-h-screen px-8 md:px-16 mx-72">
          <motion.div
            initial={{ opacity: 0.0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.3,
              duration: 0.8,
              ease: "easeInOut",
            }}
            className="text-center flex flex-col gap-6 max-w-2xl"
          >
            <div className="text-4xl md:text-7xl font-bold text-black">EcoFinds</div>
            <div className="font-light text-lg md:text-2xl text-gray-800">
              Discover sustainable treasures and join our eco-conscious marketplace
            </div>
            <div className="flex gap-4 mt-4 justify-center">
              <Link href="/auth">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-emerald-800 rounded-full px-6 py-3 font-medium text-lg hover:bg-opacity-90 transition-colors border border-green-300"
                >
                  Let's Start
                </motion.button>
              </Link>
              <Link href="/marketplace">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-emerald-600 text-white rounded-full px-6 py-3 font-medium text-lg hover:bg-emerald-700 transition-colors"
                >
                  Browse Marketplace
                </motion.button>
              </Link>
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="text-gray-700 text-sm md:text-base mt-8"
            >
              Join our community of eco-conscious buyers and sellers
            </motion.div>
          </motion.div>
        </div>
      </div>
    </AuroraBackground>
  )
}
