"use client";   // ← This line is required for Framer Motion

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="min-h-screen bg-black overflow-hidden">
      {/* Hero Section */}
      <div className="relative h-screen flex items-center justify-center">
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff15_1px,transparent_1px)] bg-size-[50px_50px]"></div>

        <Image
          src="/jiujitsu-hands.jpg"
          alt="BJJ Hands"
          fill
          className="object-cover opacity-40"
          priority
        />

        <div className="relative z-10 text-center px-6 max-w-5xl">
          <motion.h1 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-7xl font-bold tracking-tighter text-white mb-4"
          >
            Roll Different.
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-6xl font-bold text-emerald-400 mb-10"
          >
            Buy. Sell. Share.
          </motion.p>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-gray-400 mb-12 max-w-xl mx-auto"
          >
            Built by grapplers, for grapplers.
          </motion.p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <Link 
                href="/listings" 
                className="block px-10 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-lg font-medium transition"
              >
                Browse Gis
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <Link 
                href="/listings/new" 
                className="block px-10 py-4 border-2 border-white text-white rounded-2xl text-lg font-medium hover:bg-white hover:text-black transition"
              >
                Sell Your Gi
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}