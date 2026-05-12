"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function NewListingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if not logged in - using useEffect (correct way)
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

  if (!session) {
    return null; // Will redirect via useEffect
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // TODO: Connect to backend later
    alert("Form submitted! (Backend connection coming next)");
    
    setIsSubmitting(false);
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-8">Sell Your Gi</h1>

      <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 rounded-2xl shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Brand</label>
            <input
              type="text"
              className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="e.g. Shoyoroll, Tatami, Fuji"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Size</label>
            <select className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500" required>
              <option value="">Select Size</option>
              <option>A0</option>
              <option>A1</option>
              <option>A2</option>
              <option>A3</option>
              <option>A4</option>
              <option>A5</option>
              <option>A6</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Condition</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {["New", "Like New", "Good", "Worn"].map((cond) => (
              <label key={cond} className="border rounded-xl p-4 cursor-pointer hover:bg-gray-50 transition">
                <input type="radio" name="condition" value={cond} className="mr-2" required />
                {cond}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Price ($)</label>
          <input
            type="number"
            className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="150"
            min="1"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            className="w-full p-3 border rounded-xl h-32 focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="Describe the gi (material, how many times used, any flaws, etc.)"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-orange-600 text-white py-4 rounded-xl font-medium hover:bg-orange-700 disabled:opacity-50 transition"
        >
          {isSubmitting ? "Posting Gi..." : "Post Gi for Sale"}
        </button>
      </form>
    </div>
  );
}