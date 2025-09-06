"use client";

import { motion } from "framer-motion";
import React from "react";
import { AuroraBackground } from "@/components/ui/aurora-background";
import Link from "next/link";

export default function Home() {
  return (
    <AuroraBackground>
      <motion.div
        initial={{ opacity: 0.0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="relative flex flex-col gap-6 items-center justify-center min-h-screen px-4"
      >
        <div className="text-4xl md:text-7xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent text-center">
          EcoFinds
        </div>
        <div className="font-light text-lg md:text-2xl text-white/80 text-center max-w-2xl">
          Discover sustainable treasures and join our eco-conscious marketplace
        </div>
        <div className="flex gap-4 mt-4">
          <Link href="/auth/sign-in">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-emerald-800 rounded-full px-6 py-3 font-medium text-lg hover:bg-opacity-90 transition-colors"
            >
              Sign In
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
          className="absolute bottom-8 text-white/60 text-sm md:text-base"
        >
          Join our community of eco-conscious buyers and sellers
        </motion.div>
      </motion.div>
    </AuroraBackground>
  );
}
