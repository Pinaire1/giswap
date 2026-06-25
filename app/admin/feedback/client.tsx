"use client";

import { useState } from "react";
import Link from "next/link";

type Feedback = {
  id: string;
  category: string;
  rating: number | null;
  message: string;
  context: string | null;
  status: string;
  createdAt: Date | string;
  user: { id: string; name: string | null; email: string | null } | null;
};

const statusColor: Record<string, string> = {
  new: "bg-blue-950 text-blue-400 border-blue-800",
  reviewed: "bg-zinc-800 text-zinc-400 border-zinc-700",
};

const contextLabel: Record<string, string> = {
  "buy-flow": "Buyer → Sent Message",
  "sell-flow": "Seller → Posted Listing",
  general: "Floating Button",
};

export default function AdminFeedbackClient({ feedbacks: initial }: { feedbacks: Feedback[] }) {
  const [feedbacks, setFeedbacks] = useState(initial);
  const [filter, setFilter] = useState<"all" | "new" | "reviewed">("new");
  const [loading, setLoading] = useState<string | null>(null);

  const filtered = filter === "all" ? feedbacks : feedbacks.filter((f) => f.status === filter);
  const newCount = feedbacks.filter((f) => f.status === "new").length;

  const markReviewed = async (feedbackId: string) => {
    setLoading(feedbackId);
    try {
      const res = await fetch("/api/feedback", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ feedbackId, status: "reviewed" }),
      });
      if (res.ok) {
        setFeedbacks((prev) =>
          prev.map((f) => (f.id === feedbackId ? { ...f, status: "reviewed" } : f))
        );
      }
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="belt-gradient h-0.5 w-16 rounded-full mb-6 opacity-70" />
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-4xl font-black text-white">Feedback</h1>
        {newCount > 0 && (
          <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
            {newCount} new
          </span>
        )}
      </div>
      <div className="flex items-center justify-between mb-10">
        <p className="text-gray-500 text-sm">User-submitted product feedback.</p>
        <Link
          href="/admin/reports"
          className="text-xs text-gray-500 hover:text-blue-400 transition"
        >
          View Reports →
        </Link>
      </div>

      <div className="flex gap-2 mb-8">
        {(["all", "new", "reviewed"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition capitalize ${
              filter === tab
                ? "bg-blue-700 text-white"
                : "bg-[#111] border border-[#1e2a4a] text-gray-400 hover:text-white"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-gray-600 text-center py-16">No feedback in this category.</p>
      ) : (
        <div className="space-y-4">
          {filtered.map((fb) => (
            <div key={fb.id} className="bg-[#111] border border-[#1e2a4a] rounded-3xl p-6">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-white font-semibold text-sm">{fb.category}</span>
                  <span
                    className={`px-2 py-0.5 text-xs font-medium rounded-full border ${
                      statusColor[fb.status] ?? statusColor.new
                    }`}
                  >
                    {fb.status}
                  </span>
                  {fb.context && (
                    <span className="px-2 py-0.5 text-xs rounded-full bg-[#0d0d0d] border border-[#1e2a4a] text-gray-500">
                      {contextLabel[fb.context] ?? fb.context}
                    </span>
                  )}
                  {fb.rating !== null && (
                    <span className="text-amber-400 text-sm">
                      {"★".repeat(fb.rating)}
                      <span className="text-gray-700">{"★".repeat(5 - fb.rating)}</span>
                    </span>
                  )}
                </div>
              </div>

              <div className="bg-[#0d0d0d] rounded-2xl p-4 mb-4 text-sm text-gray-300">
                {fb.message}
              </div>

              <div className="flex items-center justify-between">
                <p className="text-gray-600 text-xs">
                  {fb.user
                    ? (fb.user.name ?? fb.user.email ?? "Unknown user")
                    : "Anonymous"}{" "}
                  · {new Date(fb.createdAt).toLocaleDateString()}
                </p>
                {fb.status === "new" && (
                  <button
                    onClick={() => markReviewed(fb.id)}
                    disabled={loading === fb.id}
                    className="px-4 py-2 text-xs font-medium bg-zinc-800 border border-zinc-700 text-zinc-400 hover:bg-zinc-700 rounded-xl transition disabled:opacity-50"
                  >
                    {loading === fb.id ? "Saving…" : "Mark Reviewed"}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
