"use client";

import { useState } from "react";
import Link from "next/link";

type Listing = {
  id: string;
  title: string;
  brand: string;
  size: string;
  condition: string;
  price: number | { toString(): string };
  isSold: boolean;
  isHidden: boolean;
  createdAt: Date | string;
  user: { id: string; name: string | null; email: string | null };
  _count: { reports: number };
};

type Filter = "all" | "active" | "hidden" | "sold" | "reported";

export default function AdminListingsClient({ listings: initial }: { listings: Listing[] }) {
  const [listings, setListings] = useState(initial);
  const [loading, setLoading] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const filtered = listings.filter((l) => {
    if (search && !l.title.toLowerCase().includes(search.toLowerCase()) &&
        !l.brand.toLowerCase().includes(search.toLowerCase()) &&
        !l.user.email?.toLowerCase().includes(search.toLowerCase())) return false;
    if (filter === "active") return !l.isSold && !l.isHidden;
    if (filter === "hidden") return l.isHidden;
    if (filter === "sold") return l.isSold;
    if (filter === "reported") return l._count.reports > 0;
    return true;
  });

  const patchListing = async (id: string, data: Record<string, unknown>) => {
    setLoading(id);
    try {
      const res = await fetch(`/api/listings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setListings((prev) => prev.map((l) => (l.id === id ? { ...l, ...data } : l)));
      }
    } finally {
      setLoading(null);
    }
  };

  const deleteListing = async (id: string) => {
    if (!confirm("Permanently delete this listing? This cannot be undone.")) return;
    setLoading(id);
    try {
      const res = await fetch(`/api/listings/${id}`, { method: "DELETE" });
      if (res.ok) setListings((prev) => prev.filter((l) => l.id !== id));
    } finally {
      setLoading(null);
    }
  };

  const tabs: { key: Filter; label: string }[] = [
    { key: "all", label: "All" },
    { key: "active", label: "Active" },
    { key: "hidden", label: "Hidden" },
    { key: "sold", label: "Sold" },
    { key: "reported", label: "Reported" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="belt-gradient h-0.5 w-16 rounded-full mb-6 opacity-70" />
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-4xl font-black text-white">Listings</h1>
        <span className="text-gray-500 text-sm">{listings.length} total</span>
      </div>
      <p className="text-gray-500 text-sm mb-8">Hide, restore, or delete listings.</p>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Search title, brand, or seller…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-[#111] border border-[#1e2a4a] rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-700"
        />
        <div className="flex gap-2">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setFilter(t.key)}
              className={`px-3 py-2 rounded-xl text-xs font-medium transition ${
                filter === t.key
                  ? "bg-blue-700 text-white"
                  : "bg-[#111] border border-[#1e2a4a] text-gray-400 hover:text-white"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-[#111] border border-[#1e2a4a] rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#1e2a4a] text-gray-500 text-xs uppercase">
              <th className="text-left px-5 py-3">Listing</th>
              <th className="text-left px-5 py-3">Seller</th>
              <th className="text-left px-5 py-3">Price</th>
              <th className="text-left px-5 py-3">Status</th>
              <th className="text-left px-5 py-3">Reports</th>
              <th className="text-left px-5 py-3">Listed</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((l) => (
              <tr key={l.id} className="border-b border-[#1a1a1a] last:border-0 hover:bg-[#0d0d0d] transition">
                <td className="px-5 py-3">
                  <Link href={`/listings/${l.id}`} className="text-white font-medium hover:text-blue-400 transition">
                    {l.title}
                  </Link>
                  <p className="text-gray-500 text-xs mt-0.5">{l.brand} · {l.size} · {l.condition}</p>
                </td>
                <td className="px-5 py-3 text-gray-400 text-xs">
                  {l.user.name ?? l.user.email}
                </td>
                <td className="px-5 py-3 text-white font-medium">
                  ${parseFloat(l.price.toString()).toFixed(2)}
                </td>
                <td className="px-5 py-3">
                  <div className="flex flex-col gap-1">
                    {l.isHidden && (
                      <span className="text-xs font-medium text-amber-400 bg-amber-950 border border-amber-900 px-2 py-0.5 rounded-full w-fit">
                        Hidden
                      </span>
                    )}
                    {l.isSold && (
                      <span className="text-xs font-medium text-gray-400 bg-zinc-800 border border-zinc-700 px-2 py-0.5 rounded-full w-fit">
                        Sold
                      </span>
                    )}
                    {!l.isHidden && !l.isSold && (
                      <span className="text-xs font-medium text-emerald-400 bg-emerald-950 border border-emerald-900 px-2 py-0.5 rounded-full w-fit">
                        Active
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-5 py-3">
                  {l._count.reports > 0 ? (
                    <Link href="/admin/reports" className="text-red-400 font-medium hover:underline">
                      {l._count.reports}
                    </Link>
                  ) : (
                    <span className="text-gray-600">0</span>
                  )}
                </td>
                <td className="px-5 py-3 text-gray-500 text-xs">
                  {new Date(l.createdAt).toLocaleDateString()}
                </td>
                <td className="px-5 py-3">
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => patchListing(l.id, { isHidden: !l.isHidden })}
                      disabled={loading === l.id}
                      className="px-3 py-1.5 text-xs font-medium rounded-lg transition disabled:opacity-50 bg-amber-950 border border-amber-900 text-amber-400 hover:bg-amber-900/50"
                    >
                      {l.isHidden ? "Unhide" : "Hide"}
                    </button>
                    <button
                      onClick={() => deleteListing(l.id)}
                      disabled={loading === l.id}
                      className="px-3 py-1.5 text-xs font-medium rounded-lg transition disabled:opacity-50 bg-red-950 border border-red-900 text-red-400 hover:bg-red-900/50"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="text-gray-600 text-center py-12">No listings found.</p>
        )}
      </div>
    </div>
  );
}
