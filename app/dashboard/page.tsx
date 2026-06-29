"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import PageHeader from "@/components/ui/PageHeader";

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
    return null;
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
    <div className="page-container max-w-6xl">
      <PageHeader
        title={`Welcome back, ${session.user?.name?.split(" ")[0]}!`}
        subtitle="Here's what's happening with your gear"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-10 sm:mb-12">
        {statCards.map(({ label, value, color, border }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className={`card ${border} p-6 sm:p-8`}
          >
            <p className="text-gray-500 text-sm mb-2">{label}</p>
            <p className={`text-4xl sm:text-6xl font-black tabular-nums ${color}`}>{value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        <div className="card p-6 sm:p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-white">My Listings</h2>
            <Link href="/listings/new" className="text-blue-400 hover:text-blue-300 text-sm transition">
              + New Listing
            </Link>
          </div>
          <div className="text-center py-8 sm:py-12">
            <p className="text-4xl mb-3 opacity-20" aria-hidden="true">📦</p>
            <p className="text-gray-500 text-sm mb-4">View, edit, and mark your gis as sold.</p>
            <Link href="/profile" className="btn-primary text-sm">
              View listings →
            </Link>
          </div>
        </div>

        <div className="card p-6 sm:p-8">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-6">Messages</h2>
          <div className="text-center py-8 sm:py-12">
            <p className="text-4xl mb-3 opacity-20" aria-hidden="true">💬</p>
            <p className="text-gray-500 text-sm mb-4">Reply to buyers and sellers about your listings.</p>
            <Link href="/profile/messages" className="btn-primary text-sm">
              Open inbox →
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-10 sm:mt-12 text-center">
        <Link href="/profile" className="text-blue-400 hover:text-blue-300 transition text-sm">
          Manage Profile & Settings →
        </Link>
      </div>
    </div>
  );
}
