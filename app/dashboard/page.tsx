"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

type Stats = {
  activeListings: number;
  soldCount: number;
  totalEarnings: number;
};

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/dashboard/stats")
        .then((r) => r.json())
        .then(setStats)
        .catch(console.error);
    }
  }, [status]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading dashboard...
      </div>
    );
  }
  if (!session) return null;

  const statCards = [
    {
      label: "Active Listings",
      value: stats ? String(stats.activeListings) : "—",
      color: "text-blue-400",
      border: "border-blue-900/50",
    },
    {
      label: "Sold",
      value: stats ? String(stats.soldCount) : "—",
      color: "text-purple-400",
      border: "border-purple-900/50",
    },
    {
      label: "Total Earnings",
      value: stats ? `$${stats.totalEarnings.toFixed(0)}` : "—",
      color: "text-amber-400",
      border: "border-amber-900/50",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="belt-gradient h-0.5 w-16 rounded-full mb-8 opacity-70" />

      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-5xl font-black mb-1 text-white tracking-tight"
      >
        Welcome back, {session.user?.name?.split(" ")[0]}!
      </motion.h1>
      <p className="text-blue-400 text-lg mb-12">
        Here&apos;s what&apos;s happening with your gear
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {statCards.map(({ label, value, color, border }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className={`bg-[#111] border ${border} rounded-3xl p-8`}
          >
            <p className="text-gray-500 text-sm mb-2">{label}</p>
            <p className={`text-6xl font-black ${color}`}>{value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-[#111] border border-[#1e2a4a] rounded-3xl p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">My Listings</h2>
            <Link
              href="/listings/new"
              className="text-blue-400 hover:text-blue-300 text-sm transition"
            >
              + New Listing
            </Link>
          </div>
          <p className="text-gray-600 text-center py-12">
            <Link href="/profile" className="text-blue-400 hover:underline">
              View &amp; manage your listings →
            </Link>
          </p>
        </div>

        <div className="bg-[#111] border border-[#1e2a4a] rounded-3xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Messages</h2>
          <p className="text-gray-600 text-center py-12">
            <Link
              href="/profile/messages"
              className="text-purple-400 hover:underline"
            >
              Open inbox →
            </Link>
          </p>
        </div>
      </div>

      <div className="mt-12 text-center">
        <Link
          href="/profile"
          className="text-blue-400 hover:text-blue-300 transition text-sm"
        >
          Manage Profile & Settings →
        </Link>
      </div>
    </div>
  );
}
