"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import MessageSeller from "@/components/messageseller";

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

export default function ListingsGrid({ listings }: { listings: Listing[] }) {
  const { data: session } = useSession();
  const [searchTerm, setSearchTerm] = useState("");
  const [messagingListing, setMessagingListing] = useState<Listing | null>(null);

  const filtered = listings.filter(l =>
    l.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="mb-10">
        <input
          type="text"
          placeholder="Search brands or models..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-96 p-4 bg-zinc-900 border border-zinc-700 rounded-2xl text-white placeholder:text-gray-500 focus:border-emerald-500 focus:outline-none"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-3xl text-gray-400">
            {listings.length === 0 ? "No gis listed yet — be the first!" : "No gis match your search."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filtered.map((listing, index) => {
            const isOwnListing = session?.user?.id === listing.userId;

            return (
              <motion.div
                key={listing.id}
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                whileHover={{ y: -12, scale: 1.02 }}
                className="group bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden hover:border-emerald-500 transition-all duration-300"
              >
                <div className="h-64 bg-zinc-800 relative overflow-hidden">
                  {listing.images?.length > 0 ? (
                    <Image
                      src={listing.images[0]}
                      alt={listing.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div className="h-full flex items-center justify-center text-8xl opacity-30">🥋</div>
                  )}
                </div>

                <div className="p-7">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="text-xl font-bold text-white">{listing.brand} {listing.size}</h3>
                    <p className="text-2xl font-black text-emerald-400 shrink-0">${listing.price}</p>
                  </div>

                  <p className="text-gray-400 mt-2">by {listing.user.name ?? "Seller"}</p>

                  <div className="mt-5">
                    <span className="px-5 py-2 bg-emerald-950 text-emerald-400 text-sm font-medium rounded-full border border-emerald-900">
                      {listing.condition}
                    </span>
                  </div>

                  <Link
                    href={`/listings/${listing.id}`}
                    className="mt-8 block w-full text-center py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-lg transition active:scale-95"
                  >
                    VIEW GI
                  </Link>

                  {session && !isOwnListing && (
                    <button
                      onClick={() => setMessagingListing(listing)}
                      className="mt-3 w-full py-3 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-emerald-500 text-white rounded-2xl font-bold text-base transition active:scale-95"
                    >
                      Message Seller
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      <AnimatePresence>
        {messagingListing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e: React.MouseEvent<HTMLDivElement>) => {
              if (e.target === e.currentTarget) setMessagingListing(null);
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-zinc-900 border border-zinc-700 rounded-3xl p-8 w-full max-w-md"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white">Message Seller</h2>
                  <p className="text-gray-400 text-sm mt-1">
                    {messagingListing.brand} {messagingListing.size} — by {messagingListing.user.name ?? "Seller"}
                  </p>
                </div>
                <button
                  onClick={() => setMessagingListing(null)}
                  className="text-gray-500 hover:text-white text-3xl leading-none transition"
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
    </>
  );
}
