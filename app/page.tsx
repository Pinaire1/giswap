"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] overflow-hidden">
      {/* Hero Section */}
      <div className="relative h-screen flex items-center justify-center">
        {/* Subtle radial dot grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] bg-[size:50px_50px]" />

        {/* Belt-tinted overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-950/20 via-transparent to-purple-950/20 pointer-events-none" />

        <Image
          src="/jiujitsu-hands.jpg"
          alt="BJJ Hands"
          fill
          className="object-cover opacity-30"
          priority
        />

        <div className="relative z-10 text-center px-6 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-900/40 border border-blue-700/50 rounded-full text-blue-300 text-sm font-medium mb-8 tracking-wide"
          >
            🥋 The BJJ Gi Marketplace
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-7xl md:text-8xl font-black tracking-tighter text-white mb-4 leading-none"
          >
            Roll Different.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-6xl font-black mb-10 belt-text"
          >
            Buy. Sell. Share.
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-lg text-gray-400 mb-12 max-w-xl mx-auto"
          >
            Built by grapplers, for grapplers. Find your next gi or give yours a new home.
          </motion.p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/listings"
                className="block px-10 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-lg font-bold transition shadow-lg shadow-blue-900/40"
              >
                Browse Gis
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/listings/new"
                className="block px-10 py-4 border-2 border-purple-600 text-purple-300 hover:bg-purple-900/30 rounded-2xl text-lg font-bold transition"
              >
                Sell Your Gi
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Belt stripe at bottom of hero */}
        <div className="absolute bottom-0 left-0 right-0 belt-gradient h-1 opacity-50" />
      </div>

      {/* Belt progression section */}
      <div className="max-w-5xl mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl font-black text-white mb-4">Every Roll Counts</h2>
        <p className="text-gray-500 mb-12">Your gi has a story. Pass it on.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { belt: "bg-blue-600", label: "Buy", desc: "Find quality gis at real grappler prices.", shadow: "shadow-blue-900/40" },
            { belt: "bg-purple-600", label: "Sell", desc: "List your gi and reach the community.", shadow: "shadow-purple-900/40" },
            { belt: "bg-amber-700", label: "Connect", desc: "Message sellers directly. No middleman.", shadow: "shadow-amber-900/40" },
          ].map(({ belt, label, desc, shadow }) => (
            <div key={label} className={`bg-[#111] border border-[#1e2a4a] rounded-3xl p-8 shadow-lg ${shadow}`}>
              <div className={`w-12 h-2 ${belt} rounded-full mx-auto mb-6`} />
              <h3 className="text-2xl font-bold text-white mb-2">{label}</h3>
              <p className="text-gray-500">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
