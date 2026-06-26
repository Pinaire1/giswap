"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ConfirmDialog from "@/components/ConfirmDialog";

type Listing = {
  id: string;
  title: string;
  brand: string;
  size: string;
  condition: string;
  price: string;
  isSold: boolean;
  images: string[];
};

export default function ProfileListings({ listings }: { listings: Listing[] }) {
  const router = useRouter();
  const [items, setItems] = useState(listings);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState("");

  const markSold = async (id: string) => {
    setLoadingId(id);
    try {
      const res = await fetch(`/api/listings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isSold: true }),
      });
      if (res.ok) {
        setItems((prev) =>
          prev.map((l) => (l.id === id ? { ...l, isSold: true } : l))
        );
        setStatusMsg("Listing marked as sold.");
        setTimeout(() => setStatusMsg(""), 3000);
      }
    } finally {
      setLoadingId(null);
    }
  };

  const deleteListing = async (id: string) => {
    setLoadingId(id);
    try {
      const res = await fetch(`/api/listings/${id}`, { method: "DELETE" });
      if (res.ok) {
        setItems((prev) => prev.filter((l) => l.id !== id));
        setStatusMsg("Listing deleted.");
        setTimeout(() => setStatusMsg(""), 3000);
        router.refresh();
      }
    } finally {
      setLoadingId(null);
      setDeleteTarget(null);
    }
  };

  if (items.length === 0) {
    return (
      <div className="bg-[#111] border border-[#1e2a4a] rounded-3xl p-10 text-center">
        <p className="text-7xl mb-4 opacity-30" aria-hidden="true">🥋</p>
        <p className="text-gray-400">You haven&apos;t listed any gis yet.</p>
        <Link
          href="/listings/new"
          className="mt-4 inline-block text-blue-400 hover:underline text-sm"
        >
          Post your first gi →
        </Link>
      </div>
    );
  }

  return (
    <>
      <div role="status" aria-live="polite" className="sr-only">
        {statusMsg}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((listing) => {
          const busy = loadingId === listing.id;
          return (
            <article
              key={listing.id}
              className="bg-[#111] border border-[#1e2a4a] rounded-3xl overflow-hidden hover:border-blue-700/50 transition"
            >
              {listing.images?.length > 0 ? (
                <div className="h-44 relative">
                  <Image
                    src={listing.images[0]}
                    alt={listing.title}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="h-44 flex items-center justify-center bg-[#0d0d0d] text-5xl opacity-20" aria-hidden="true">
                  🥋
                </div>
              )}

              <div className="p-5">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-white text-sm leading-tight">
                    {listing.title}
                  </h3>
                  <span className="text-amber-400 font-black text-sm ml-2 flex-shrink-0">
                    ${listing.price}
                  </span>
                </div>

                <p className="text-gray-400 text-xs mb-1">
                  {listing.brand} · {listing.size}
                </p>
                <p className="text-gray-400 text-xs mb-3">
                  {listing.condition}
                </p>

                <span
                  className={`px-2 py-0.5 rounded text-xs font-medium ${
                    listing.isSold
                      ? "bg-red-950 text-red-400 border border-red-900"
                      : "bg-blue-950 text-blue-400 border border-blue-900"
                  }`}
                >
                  {listing.isSold ? "Sold" : "Active"}
                </span>

                <div className="flex flex-wrap gap-2 mt-4">
                  <Link
                    href={`/listings/${listing.id}/edit`}
                    className="flex-1 py-2.5 text-xs font-medium text-center bg-[#0d0d0d] border border-[#1e2a4a] hover:border-blue-600 text-gray-400 hover:text-blue-300 rounded-xl transition min-h-[44px] flex items-center justify-center"
                  >
                    Edit
                  </Link>

                  {!listing.isSold && (
                    <button
                      type="button"
                      onClick={() => markSold(listing.id)}
                      disabled={busy}
                      aria-busy={busy}
                      className="flex-1 py-2.5 text-xs font-medium bg-amber-950/50 border border-amber-900/50 hover:bg-amber-900/30 text-amber-400 rounded-xl transition disabled:opacity-50 min-h-[44px]"
                    >
                      {busy ? "…" : "Mark Sold"}
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setDeleteTarget(listing.id)}
                    disabled={busy}
                    className="flex-1 py-2.5 text-xs font-medium bg-red-950/40 border border-red-900/40 hover:bg-red-900/30 text-red-400 rounded-xl transition disabled:opacity-50 min-h-[44px]"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Delete listing"
        message="Delete this listing? This can't be undone."
        confirmLabel="Delete"
        destructive
        onConfirm={() => deleteTarget && deleteListing(deleteTarget)}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  );
}
