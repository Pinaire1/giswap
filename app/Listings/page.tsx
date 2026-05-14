"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Listing = {
  id: string;
  title: string;
  brand: string;
  size: string;
  condition: string;
  price: number;
  images: string[];
  user: {
    name: string;
  };
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
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const filteredListings = listings.filter(listing =>
    listing.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    listing.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="p-12 text-center">Loading gis...</div>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-bold">Browse Gis</h1>

        <input
          type="text"
          placeholder="Search by brand..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-80 p-4 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      {filteredListings.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-2xl text-gray-500">No listings yet</p>
          <Link href="/listings/new" className="text-orange-600 hover:underline mt-4 inline-block">
            Sell your first gi →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredListings.map((listing) => (
            <div key={listing.id} className="bg-white rounded-2xl shadow overflow-hidden">
              <div className="h-64 bg-gray-200 flex items-center justify-center text-6xl">
                🥋
              </div>
              <div className="p-6">
                <h3 className="font-semibold text-xl">{listing.brand} {listing.size}</h3>
                <p className="text-orange-600 text-2xl font-bold mt-1">${listing.price}</p>
                <p className="text-sm text-gray-500 mt-1">Posted by {listing.user.name}</p>
                
                <Link
                  href={`/listings/${listing.id}`}
                  className="mt-6 block w-full text-center py-3 border border-gray-900 rounded-xl hover:bg-gray-900 hover:text-white"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}