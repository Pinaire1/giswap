"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function NewListingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") return <div className="p-8 text-center">Loading...</div>;
  if (!session) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setIsSubmitting(true);

  const formData = new FormData(e.currentTarget);
  
  const data = {
    title: `${formData.get("brand")} ${formData.get("size")}`,
    brand: formData.get("brand"),
    size: formData.get("size"),
    condition: formData.get("condition"),
    price: formData.get("price"),
    description: formData.get("description"),
  };

  try {
    const res = await fetch("/api/listings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (res.ok) {
      alert("✅ Gi posted successfully!");
      e.currentTarget?.reset();        // Safe reset
      // Optional: redirect to browse page
      // router.push("/listings");
    } else {
      alert(`Failed to post: ${result.error || "Unknown error"}`);
    }
  } catch (error) {
    console.error(error);
    alert("Network error - please try again");
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-8">Sell Your Gi</h1>

      <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 rounded-2xl shadow">
        {/* ... same form fields as before ... */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Brand</label>
            <input name="brand" type="text" className="w-full p-3 border rounded-xl" placeholder="Shoyoroll, Tatami..." required />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Size</label>
            <select name="size" className="w-full p-3 border rounded-xl" required>
              <option value="">Select Size</option>
              <option>A0</option><option>A1</option><option>A2</option>
              <option>A3</option><option>A4</option><option>A5</option><option>A6</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Condition</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {["New", "Like New", "Good", "Worn"].map((cond) => (
              <label key={cond} className="border rounded-xl p-4 cursor-pointer hover:bg-gray-50">
                <input type="radio" name="condition" value={cond} required className="mr-2" />
                {cond}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Price ($)</label>
          <input name="price" type="number" className="w-full p-3 border rounded-xl" placeholder="150" required />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea name="description" className="w-full p-3 border rounded-xl h-32" placeholder="Details about the gi..." />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-orange-600 text-white py-4 rounded-xl font-medium hover:bg-orange-700 disabled:opacity-50"
        >
          {isSubmitting ? "Posting..." : "Post Gi for Sale"}
        </button>
      </form>
    </div>
  );
}