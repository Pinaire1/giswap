"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { UploadButton } from "@/lib/uploadthing";
import Image from "next/image";

export default function NewListingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  if (status === "loading") return <div className="p-12 text-center">Loading...</div>;
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
      images: uploadedImages,
    };

    try {
      const res = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        alert("✅ Gi posted successfully!");
        e.currentTarget.reset();
        setUploadedImages([]);
      } else {
        alert("Failed to post gi");
      }
    } catch (error) {
      console.error(error);
      alert("Error posting gi");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-8 text-white">Sell Your Gi</h1>

      <form onSubmit={handleSubmit} className="space-y-8 bg-zinc-900 p-8 rounded-3xl border border-zinc-800">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">Brand</label>
            <input name="brand" type="text" className="w-full p-4 bg-zinc-800 border border-zinc-700 rounded-2xl text-white" placeholder="Shoyoroll, Tatami..." required />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">Size</label>
            <select name="size" className="w-full p-4 bg-zinc-800 border border-zinc-700 rounded-2xl text-white" required>
              <option value="">Select Size</option>
              {["A0","A1","A2","A3","A4","A5","A6"].map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

                <div>
          <label className="block text-sm font-medium mb-2 text-gray-200">Condition</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {["New", "Like New", "Good", "Worn"].map((cond) => (
              <label 
                key={cond} 
                className="border border-zinc-600 bg-zinc-800 hover:bg-zinc-700 hover:border-emerald-500 rounded-2xl p-4 cursor-pointer text-center transition-all text-white font-medium"
              >
                <input type="radio" name="condition" value={cond} required className="mr-2 accent-emerald-500" />
                {cond}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-200">Price ($)</label>
          <input 
            name="price" 
            type="number" 
            className="w-full p-4 bg-zinc-800 border border-zinc-600 rounded-2xl text-white placeholder:text-gray-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" 
            placeholder="150" 
            required 
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-200">Description</label>
          <textarea 
            name="description" 
            className="w-full p-4 bg-zinc-800 border border-zinc-600 rounded-3xl h-32 text-white placeholder:text-gray-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" 
            placeholder="How many times used, any repairs, rips, etc..." 
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-4 text-gray-300">Upload Photos (max 5)</label>
          <UploadButton
            endpoint="giImageUploader"
            onClientUploadComplete={(res) => {
              const urls = res.map((r) => r.url);
              setUploadedImages((prev) => [...prev, ...urls]);
            }}
            onUploadError={(error: Error) => alert(`Upload failed: ${error.message}`)}
            className="ut-button:bg-emerald-600 ut-button:hover:bg-emerald-700 ut-button:text-white"
          />
        </div>

{uploadedImages.length > 0 && (
  <div className="flex flex-wrap gap-4">
    {uploadedImages.map((url, i) => (
      <Image 
        key={i} 
        src={url} 
        alt={`uploaded ${i}`}
        width={112}
        height={112}
        className="object-cover rounded-2xl border border-zinc-700"
      />
    ))}
  </div>
)}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-2xl font-medium text-lg transition disabled:opacity-50"
        >
          {isSubmitting ? "Posting Gi..." : "Post Gi for Sale"}
        </button>
      </form>
    </div>
  );
}