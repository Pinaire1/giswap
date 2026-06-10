"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") return <div className="p-12 text-center">Loading dashboard...</div>;
  if (!session) return null;

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-5xl font-bold mb-2 text-white"
      >
        Welcome back, {session.user?.name?.split(" ")[0]}!
      </motion.h1>
      <p className="text-emerald-400 text-xl mb-12">Here&apos;s what&apos;s happening with your gear</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
          <p className="text-gray-400 text-sm">Active Listings</p>
          <p className="text-6xl font-bold text-white mt-2">3</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
          <p className="text-gray-400 text-sm">Sold This Month</p>
          <p className="text-6xl font-bold text-emerald-400 mt-2">2</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
          <p className="text-gray-400 text-sm">Total Earnings</p>
          <p className="text-6xl font-bold text-white mt-2">$420</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* My Active Listings */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">My Active Listings</h2>
            <Link href="/listings/new" className="text-emerald-400 hover:underline text-sm">+ New Listing</Link>
          </div>
          <p className="text-gray-500 text-center py-12">You don&apos;t have any active listings yet.</p>
        </div>

        {/* Recent Activity / Messages */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
          <h2 className="text-2xl font-bold mb-6">Recent Messages</h2>
          <p className="text-gray-500 text-center py-12">No messages yet.</p>
        </div>
      </div>

      <div className="mt-12 text-center">
        <Link href="/profile" className="text-emerald-400 hover:underline">
          Manage Profile & Settings →
        </Link>
      </div>
    </div>
  );
}