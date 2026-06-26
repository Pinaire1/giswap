"use client";

import { useState } from "react";
import Link from "next/link";
import ConfirmDialog from "@/components/ConfirmDialog";

type Report = {
  id: string;
  reason: string;
  details: string | null;
  status: string;
  createdAt: Date | string;
  reporter: { id: string; name: string | null; email: string | null };
  listing: { id: string; title: string; brand: string; userId: string };
};

const statusColor: Record<string, string> = {
  pending: "bg-amber-950 text-amber-400 border-amber-800",
  reviewed: "bg-blue-950 text-blue-400 border-blue-800",
  dismissed: "bg-zinc-800 text-zinc-400 border-zinc-700",
};

const TABS = ["all", "pending", "reviewed", "dismissed"] as const;
type Tab = (typeof TABS)[number];

export default function AdminReportsClient({ reports: initial }: { reports: Report[] }) {
  const [reports, setReports] = useState(initial);
  const [filter, setFilter] = useState<Tab>("pending");
  const [loading, setLoading] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const filtered = filter === "all" ? reports : reports.filter((r) => r.status === filter);

  const updateStatus = async (reportId: string, status: string) => {
    setLoading(reportId);
    try {
      const res = await fetch("/api/reports", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reportId, status }),
      });
      if (res.ok) {
        setReports((prev) =>
          prev.map((r) => (r.id === reportId ? { ...r, status } : r))
        );
      }
    } finally {
      setLoading(null);
    }
  };

  const removeListing = async (listingId: string) => {
    const res = await fetch(`/api/listings/${listingId}`, { method: "DELETE" });
    if (res.ok) {
      setReports((prev) => prev.filter((r) => r.listing.id !== listingId));
    }
    setDeleteTarget(null);
  };

  const pending = reports.filter((r) => r.status === "pending").length;
  const panelId = `reports-panel-${filter}`;

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="belt-gradient h-0.5 w-16 rounded-full mb-6 opacity-70" />
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-4xl font-black text-white">Moderation</h1>
        {pending > 0 && (
          <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full">
            {pending} pending
          </span>
        )}
      </div>
      <p className="text-gray-400 text-sm mb-10">Review reported listings.</p>

      {/* Filter tabs */}
      <div role="tablist" aria-label="Filter reports by status" className="flex gap-2 mb-8">
        {TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            role="tab"
            id={`tab-${tab}`}
            aria-selected={filter === tab}
            aria-controls={panelId}
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

      <div id={panelId} role="tabpanel" aria-labelledby={`tab-${filter}`}>
        {filtered.length === 0 ? (
          <p className="text-gray-400 text-center py-16">No reports in this category.</p>
        ) : (
          <div className="space-y-4">
            {filtered.map((report) => (
              <div
                key={report.id}
                className="bg-[#111] border border-[#1e2a4a] rounded-3xl p-6"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <Link
                        href={`/listings/${report.listing.id}`}
                        className="font-bold text-white hover:text-blue-400 transition"
                      >
                        {report.listing.title}
                      </Link>
                      <span
                        className={`px-2 py-0.5 text-xs font-medium rounded-full border ${
                          statusColor[report.status] ?? statusColor.pending
                        }`}
                      >
                        {report.status}
                      </span>
                    </div>
                    <p className="text-gray-400 text-xs">
                      Reported by {report.reporter.name ?? report.reporter.email} ·{" "}
                      {new Date(report.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="bg-[#0d0d0d] rounded-2xl p-4 mb-4 text-sm">
                  <p className="text-amber-400 font-medium mb-1">{report.reason}</p>
                  {report.details && (
                    <p className="text-gray-400 mt-1">{report.details}</p>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  {report.status === "pending" && (
                    <button
                      type="button"
                      onClick={() => updateStatus(report.id, "reviewed")}
                      disabled={loading === report.id}
                      aria-busy={loading === report.id}
                      className="px-4 py-2 text-xs font-medium bg-blue-950 border border-blue-800 text-blue-400 hover:bg-blue-900/50 rounded-xl transition disabled:opacity-50"
                    >
                      Mark Reviewed
                    </button>
                  )}
                  {report.status !== "dismissed" && (
                    <button
                      type="button"
                      onClick={() => updateStatus(report.id, "dismissed")}
                      disabled={loading === report.id}
                      className="px-4 py-2 text-xs font-medium bg-zinc-800 border border-zinc-700 text-zinc-400 hover:bg-zinc-700 rounded-xl transition disabled:opacity-50"
                    >
                      Dismiss
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(report.listing.id)}
                    className="px-4 py-2 text-xs font-medium bg-red-950/50 border border-red-900/50 text-red-400 hover:bg-red-900/30 rounded-xl transition"
                  >
                    Remove Listing
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Remove listing"
        message="Permanently delete this listing? This cannot be undone."
        confirmLabel="Delete listing"
        destructive
        onConfirm={() => deleteTarget && removeListing(deleteTarget)}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
