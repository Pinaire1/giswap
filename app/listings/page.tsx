"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

type Listing = {
  id: string;
  title: string;
  brand: string;
  size: string;
  condition: string;
  price: number;
  images: string[];
  user: { name: string; email: string };
};

export default function ListingsPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch("/api/listings")
      .then(res => res.json())
      .then(data => {
        setListings(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = listings.filter(l => 
    l.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="p-12 text-center text-xl">Loading gis from the mat...</div>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <motion.h1 
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-6xl font-black text-white mb-4 tracking-tighter"
      >
        ON THE MAT
      </motion.h1>
      <p className="text-emerald-400 text-2xl mb-12">Find your next roll</p>

      <div className="mb-10">
        <input
          type="text"
          placeholder="Search brands or models..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-96 p-4 bg-zinc-900 border border-zinc-700 rounded-2xl text-white placeholder:text-gray-500 focus:border-emerald-500"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-3xl text-gray-400">No gis found on the mat...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filtered.map((listing, index) => (
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
                <div className="flex justify-between">
                  <h3 className="text-2xl font-bold text-white">{listing.brand} {listing.size}</h3>
                  <p className="text-3xl font-black text-emerald-400">${listing.price}</p>
                </div>

                <p className="text-gray-400 mt-2">by {listing.user.name}</p>

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
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}