"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

type Listing = {
  id: string;
  title: string;
  brand: string;
  size: string;
  condition: string;
  price: number;
  images: string[];
  user: { name: string };
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

  if (loading) return <div className="p-12 text-center text-xl">Loading gis...</div>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex justify-between items-end mb-10">
        <h1 className="text-5xl font-bold text-white">Browse Gis</h1>
        <input
          type="text"
          placeholder="Search brands..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-80 p-4 bg-zinc-900 border border-zinc-700 rounded-2xl text-white placeholder:text-gray-500"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-3xl text-gray-400">No gis found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filtered.map((listing) => (
            <div key={listing.id} className="group bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden hover:border-emerald-500 transition-all hover:-translate-y-1">
              <div className="h-64 bg-zinc-800 relative">
  {listing.images?.length > 0 ? (
    <Image
      src={listing.images[0]}
      alt={listing.title}
      fill
      className="object-cover"
    />
  ) : (
    <div className="h-full flex items-center justify-center text-7xl opacity-30">🥋</div>
  )}
</div>

              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold text-white">{listing.brand} {listing.size}</h3>
                    <p className="text-emerald-400 text-2xl font-bold mt-1">${listing.price}</p>
                  </div>
                </div>

                <p className="text-gray-400 text-sm mt-4">Posted by {listing.user.name}</p>

                <div className="mt-4">
                  <span className="inline-block px-4 py-1 bg-zinc-800 text-xs rounded-full text-emerald-400">
                    {listing.condition}
                  </span>
                </div>

                <Link
                  href={`/listings/${listing.id}`}
                  className="mt-6 block w-full text-center py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-medium transition"
                >
                  View Gi
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}