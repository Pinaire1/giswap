"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Heart } from "lucide-react";
import MessageSeller from "@/components/messageseller";

type Listing = {
  id: string;
  title: string;
  brand: string;
  size: string;
  color: string | null;
  condition: string;
  price: string;
  images: string[];
  userId: string;
  createdAt: string;
  isSaved?: boolean;
  user: { id: string; name: string | null; email: string | null };
};

const conditionColor: Record<string, string> = {
  New:        "bg-blue-950/80 text-blue-300 border-blue-800",
  "Like New":  "bg-purple-950/80 text-purple-300 border-purple-800",
  Good:       "bg-amber-950/80 text-amber-400 border-amber-800",
  Worn:       "bg-zinc-800/80 text-zinc-400 border-zinc-700",
};

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86_400_000);
  if (days === 0) return "today";
  if (days === 1) return "1d ago";
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

function SaveButton({ listingId, initialSaved }: { listingId: string; initialSaved: boolean }) {
  const [saved, setSaved] = useState(initialSaved);
  const [pending, startTransition] = useTransition();

  const toggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    startTransition(async () => {
      const res = await fetch(`/api/listings/${listingId}/save`, { method: "POST" });
      if (res.ok) setSaved((s) => !s);
    });
  };

  return (
    <button
      onClick={toggle}
      disabled={pending}
      aria-label={saved ? "Unsave listing" : "Save listing"}
      className={`absolute top-3 right-3 w-9 h-9 flex items-center justify-center rounded-full border backdrop-blur-sm transition-all active:scale-90 z-10 ${
        saved
          ? "bg-red-900/80 border-red-700 text-red-400"
          : "bg-black/50 border-white/10 text-gray-400 hover:text-red-400 hover:border-red-800"
      }`}
    >
      <Heart size={16} fill={saved ? "currentColor" : "none"} />
    </button>
  );
}

export default function ListingsGrid({
  listings,
  page = 0,
  totalPages = 1,
}: {
  listings: Listing[];
  page?: number;
  totalPages?: number;
}) {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [messagingListing, setMessagingListing] = useState<Listing | null>(null);

  const pageHref = (p: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (p === 0) params.delete("page");
    else params.set("page", String(p));
    const qs = params.toString();
    return `/listings${qs ? `?${qs}` : ""}`;
  };

  return (
    <>
      {listings.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-2xl text-gray-600">No gis match your filters.</p>
          <Link href="/listings" className="mt-4 inline-block text-blue-400 hover:text-blue-300 text-sm transition">
            Clear filters
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6">
          {listings.map((listing, index) => {
            const isOwnListing = session?.user?.id === listing.userId;
            const condClass = conditionColor[listing.condition] ?? conditionColor.Worn;

            return (
              <div
                key={listing.id}
                className="card-in group bg-[#111] border border-[#1e2a4a] rounded-2xl overflow-hidden hover:border-blue-600 hover:shadow-lg hover:shadow-blue-900/30 hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col"
                style={{ animationDelay: `${Math.min(index * 0.03, 0.3)}s` }}
                onClick={() => router.push(`/listings/${listing.id}`)}
              >
                {/* Image */}
                <div className="h-52 bg-[#161616] relative overflow-hidden flex-shrink-0">
                  {listing.images?.length > 0 ? (
                    <Image
                      src={listing.images[0]}
                      alt={listing.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="h-full flex items-center justify-center text-6xl opacity-20">
                      🥋
                    </div>
                  )}

                  {/* Condition badge overlaid on image */}
                  <span className={`absolute top-3 left-3 px-2.5 py-1 text-xs font-semibold rounded-full border backdrop-blur-sm ${condClass}`}>
                    {listing.condition}
                  </span>

                  {/* Photo count */}
                  {listing.images?.length > 1 && (
                    <span className="absolute bottom-3 left-3 px-2 py-0.5 bg-black/60 text-white text-xs rounded-full backdrop-blur-sm">
                      {listing.images.length} photos
                    </span>
                  )}

                  {session && !isOwnListing && (
                    <SaveButton listingId={listing.id} initialSaved={listing.isSaved ?? false} />
                  )}
                </div>

                {/* Info */}
                <div className="p-4 flex flex-col flex-1">
                  <div className="flex justify-between items-start gap-2 mb-1">
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-white leading-snug truncate">
                        {listing.title}
                      </h3>
                      <p className="text-xs text-gray-600 mt-0.5">
                        {listing.brand} · {listing.size}
                        {listing.color ? ` · ${listing.color}` : ""}
                      </p>
                    </div>
                    <p className="text-lg font-black text-amber-400 shrink-0 tabular-nums">
                      ${listing.price}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-auto pt-3 border-t border-[#1e2a4a] mt-3">
                    <p className="text-gray-600 text-xs truncate">
                      {listing.user.name ?? "Seller"}
                    </p>
                    <p className="text-gray-700 text-xs shrink-0 ml-2">
                      {timeAgo(listing.createdAt)}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="mt-3 flex gap-2">
                    <Link
                      href={`/listings/${listing.id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="flex-1 text-center py-2.5 bg-blue-700 hover:bg-blue-600 text-white rounded-xl font-semibold transition active:scale-95 text-xs"
                    >
                      View Gi
                    </Link>

                    {session && !isOwnListing && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setMessagingListing(listing);
                        }}
                        className="flex-1 py-2.5 bg-transparent hover:bg-purple-950/40 border border-[#2a2a4a] hover:border-purple-600 text-gray-400 hover:text-purple-300 rounded-xl font-medium text-xs transition active:scale-95"
                      >
                        Message
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Message modal */}
      <AnimatePresence>
        {messagingListing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-label="Message seller"
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
            onClick={(e: React.MouseEvent<HTMLDivElement>) => {
              if (e.target === e.currentTarget) setMessagingListing(null);
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 30 }}
              className="bg-[#111] border border-[#1e2a4a] rounded-t-3xl sm:rounded-3xl p-6 sm:p-8 w-full sm:max-w-md shadow-2xl shadow-blue-950/50"
            >
              <div className="belt-gradient h-0.5 w-full rounded-full mb-6 opacity-60" />
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl font-bold text-white">Message Seller</h2>
                  <p className="text-gray-500 text-sm mt-1">
                    {messagingListing.title} · {messagingListing.user.name ?? "Seller"}
                  </p>
                </div>
                <button
                  onClick={() => setMessagingListing(null)}
                  aria-label="Close message dialog"
                  className="text-gray-600 hover:text-white text-2xl leading-none transition"
                >
                  ×
                </button>
              </div>
              <MessageSeller
                sellerId={messagingListing.userId}
                listingId={messagingListing.id}
                sellerName={messagingListing.user.name ?? "Seller"}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 mt-16">
          {page > 0 && (
            <Link
              href={pageHref(page - 1)}
              className="px-5 py-2.5 bg-[#111] border border-[#1e2a4a] hover:border-blue-600 text-gray-400 hover:text-white rounded-xl text-sm font-medium transition"
            >
              ← Previous
            </Link>
          )}
          <span className="text-gray-600 text-sm">
            Page {page + 1} of {totalPages}
          </span>
          {page < totalPages - 1 && (
            <Link
              href={pageHref(page + 1)}
              className="px-5 py-2.5 bg-[#111] border border-[#1e2a4a] hover:border-blue-600 text-gray-400 hover:text-white rounded-xl text-sm font-medium transition"
            >
              Next →
            </Link>
          )}
        </div>
      )}
    </>
  );
}
