"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import MessageSeller from "@/components/messageseller";
import { useDialog } from "@/lib/use-dialog";

type Listing = {
  id: string;
  title: string;
  brand: string;
  size: string;
  condition: string;
  price: string;
  images: string[];
  userId: string;
  user: { id: string; name: string | null; email: string | null };
};

const conditionColor: Record<string, string> = {
  New:        "bg-blue-950 text-blue-300 border-blue-800",
  "Like New":  "bg-purple-950 text-purple-300 border-purple-800",
  Good:       "bg-amber-950 text-amber-400 border-amber-800",
  Worn:       "bg-zinc-800 text-zinc-400 border-zinc-700",
};

function MessageModal({
  listing,
  onClose,
}: {
  listing: Listing;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  useDialog(true, onClose, dialogRef);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      role="presentation"
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={(e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="message-dialog-title"
        initial={{ scale: 0.95, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 30 }}
        className="bg-[#111] border border-[#1e2a4a] rounded-t-3xl sm:rounded-3xl p-6 sm:p-8 w-full sm:max-w-md shadow-2xl shadow-blue-950/50"
      >
        <div className="belt-gradient h-0.5 w-full rounded-full mb-6 opacity-60" />

        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 id="message-dialog-title" className="text-xl font-bold text-white">
              Message Seller
            </h2>
            <p className="text-gray-400 text-sm mt-1">
              {listing.brand} {listing.size} ·{" "}
              {listing.user.name ?? "Seller"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close message dialog"
            className="text-gray-400 hover:text-white text-2xl leading-none transition"
          >
            ×
          </button>
        </div>

        <MessageSeller
          sellerId={listing.userId}
          listingId={listing.id}
          sellerName={listing.user.name ?? "Seller"}
        />
      </motion.div>
    </motion.div>
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
  const [searchTerm, setSearchTerm] = useState("");
  const [messagingListing, setMessagingListing] = useState<Listing | null>(null);

  const filtered = listings.filter(
    (l) =>
      l.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {/* Search */}
      <div className="mb-10">
        <label htmlFor="listing-search" className="sr-only">
          Search listings by brand or model
        </label>
        <input
          id="listing-search"
          type="search"
          placeholder="Search brands or models..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-96 p-4 bg-[#111] border border-[#1e2a4a] rounded-2xl text-white placeholder:text-gray-500 focus:border-blue-600 focus:outline-none transition"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-2xl text-gray-400">
            {listings.length === 0
              ? "No gis on the mat yet — be the first to post!"
              : "No gis match your search."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {filtered.map((listing, index) => {
            const isOwnListing = session?.user?.id === listing.userId;
            const condClass =
              conditionColor[listing.condition] ?? conditionColor.Worn;

            return (
              <article
                key={listing.id}
                className="card-in group bg-[#111] border border-[#1e2a4a] rounded-3xl overflow-hidden hover:border-blue-600 hover:shadow-lg hover:shadow-blue-900/30 hover:-translate-y-1.5 hover:scale-[1.02] transition-all duration-300"
                style={{ animationDelay: `${Math.min(index * 0.03, 0.3)}s` }}
              >
                <Link
                  href={`/listings/${listing.id}`}
                  className="block focus-visible:rounded-t-3xl"
                >
                  {/* Image */}
                  <div className="h-56 sm:h-60 bg-[#161616] relative overflow-hidden">
                    {listing.images?.length > 0 ? (
                      <Image
                        src={listing.images[0]}
                        alt={listing.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <div className="h-full flex items-center justify-center text-7xl opacity-20" aria-hidden="true">
                        🥋
                      </div>
                    )}
                    <div className="absolute top-0 left-0 right-0 h-0.5 belt-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  {/* Info */}
                  <div className="p-5 md:p-6">
                    <div className="flex justify-between items-start gap-2 mb-1">
                      <h3 className="text-base md:text-lg font-bold text-white leading-tight">
                        {listing.brand} {listing.size}
                      </h3>
                      <p className="text-xl md:text-2xl font-black text-amber-400 shrink-0">
                        ${listing.price}
                      </p>
                    </div>

                    <p className="text-gray-400 text-sm mb-4">
                      by {listing.user.name ?? "Seller"}
                    </p>

                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full border ${condClass}`}
                    >
                      {listing.condition}
                    </span>
                  </div>
                </Link>

                {/* Buttons */}
                <div className="px-5 md:px-6 pb-5 md:pb-6 space-y-2">
                  <Link
                    href={`/listings/${listing.id}`}
                    className="block w-full text-center py-3 bg-blue-700 hover:bg-blue-600 text-white rounded-2xl font-bold transition active:scale-95 text-sm"
                  >
                    View Gi
                  </Link>

                  {session && !isOwnListing && (
                    <button
                      type="button"
                      onClick={() => setMessagingListing(listing)}
                      className="w-full py-3 bg-transparent hover:bg-purple-950/40 border border-[#2a2a4a] hover:border-purple-600 text-gray-300 hover:text-purple-300 rounded-2xl font-medium text-sm transition active:scale-95"
                    >
                      Message Seller
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Message modal */}
      <AnimatePresence>
        {messagingListing && (
          <MessageModal
            listing={messagingListing}
            onClose={() => setMessagingListing(null)}
          />
        )}
      </AnimatePresence>

      {/* Pagination */}
      {totalPages > 1 && (
        <nav aria-label="Listings pagination" className="flex justify-center items-center gap-3 mt-16">
          {page > 0 && (
            <Link
              href={`/listings?page=${page - 1}`}
              className="px-5 py-2.5 bg-[#111] border border-[#1e2a4a] hover:border-blue-600 text-gray-400 hover:text-white rounded-xl text-sm font-medium transition"
            >
              ← Previous
            </Link>
          )}
          <span className="text-gray-400 text-sm">
            Page {page + 1} of {totalPages}
          </span>
          {page < totalPages - 1 && (
            <Link
              href={`/listings?page=${page + 1}`}
              className="px-5 py-2.5 bg-[#111] border border-[#1e2a4a] hover:border-blue-600 text-gray-400 hover:text-white rounded-xl text-sm font-medium transition"
            >
              Next →
            </Link>
          )}
        </nav>
      )}
    </>
  );
}
