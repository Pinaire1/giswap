"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { UploadButton } from "@/lib/uploadthing";
import ShareButtons from "@/components/sharebuttons";
import Image from "next/image";

export default function NewListingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [newListing, setNewListing] = useState<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any

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

      const result = await res.json();

      if (res.ok) {
        setNewListing(result.listing);
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
      <motion.h1 
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-6xl font-black mb-3 text-white tracking-tighter"
      >
        Post Your Gi
      </motion.h1>
      <p className="text-emerald-400 text-xl mb-12">Let it roll again</p>

      <motion.form 
        onSubmit={handleSubmit} 
        className="space-y-8 bg-zinc-900 p-10 rounded-3xl border border-zinc-800"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Your existing form fields... */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-200">Brand</label>
          <input name="brand" type="text" className="w-full p-4 bg-zinc-800 border border-zinc-700 rounded-2xl text-white" placeholder="Shoyoroll, Tatami..." required />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-200">Size</label>
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
              <motion.label 
                key={cond} 
                whileHover={{ scale: 1.08, borderColor: "#10b981" }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-zinc-600 bg-zinc-800 hover:bg-zinc-700 rounded-2xl p-5 cursor-pointer text-center transition-all text-white font-medium"
              >
                <input type="radio" name="condition" value={cond} required className="mr-2 accent-emerald-500" />
                {cond}
              </motion.label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-200">Price ($)</label>
          <input name="price" type="number" className="w-full p-4 bg-zinc-800 border border-zinc-700 rounded-2xl text-white" placeholder="150" required />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-200">Description</label>
          <textarea name="description" className="w-full p-4 bg-zinc-800 border border-zinc-700 rounded-3xl h-32 text-white" placeholder="How many times used, any repairs, etc..." />
        </div>

        <div>
          <label className="block text-sm font-medium mb-4 text-gray-200">Upload Photos (max 5)</label>
          <UploadButton
            endpoint="giImageUploader"
            onClientUploadComplete={(res) => {
              const urls = res.map((r) => r.url);
              setUploadedImages((prev) => [...prev, ...urls]);
            }}
            onUploadError={(error: Error) => alert(`Upload failed: ${error.message}`)}
            className="ut-button:bg-emerald-600 ut-button:hover:bg-emerald-700"
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
        className="w-28 h-28 object-cover rounded-2xl border border-emerald-900"
      />
    ))}
  </div>
)}

        <motion.button
          type="submit"
          disabled={isSubmitting}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-5 rounded-2xl font-bold text-xl tracking-wider transition disabled:opacity-50"
        >
          {isSubmitting ? "THROWING ON THE MAT..." : "POST TO THE MAT"}
        </motion.button>
      </motion.form>

      {/* Share Section - Shows after successful post */}
      {newListing && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-12 bg-zinc-900 p-8 rounded-3xl border border-emerald-900"
        >
          <h3 className="text-2xl font-bold text-emerald-400 mb-6">🎉 Gi Posted Successfully!</h3>
          <p className="text-gray-300 mb-6">Help spread the word and get it sold faster!</p>
          
          <ShareButtons 
            title={newListing.title}
            url={`https://giswap.vercel.app/listings/${newListing.id}`}
            price={newListing.price}
            brand={newListing.brand}
            size={newListing.size}
          />
        </motion.div>
      )}
    </div>
  );
}