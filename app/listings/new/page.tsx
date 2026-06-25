"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { UploadButton } from "@/lib/uploadthing";
import ShareButtons from "@/components/sharebuttons";
import FeedbackModal from "@/components/FeedbackModal";
import Image from "next/image";

export default function NewListingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [newListing, setNewListing] = useState<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  if (status === "loading") return (
    <div className="min-h-screen flex items-center justify-center text-gray-500">Loading...</div>
  );
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
        setShowFeedback(true);
        e.currentTarget.reset();
        setUploadedImages([]);
      } else {
        alert("Failed to post gi. Please try again.");
      }
    } catch (error) {
      console.error(error);
      alert("Error posting gi. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = "w-full p-4 bg-[#0d0d0d] border border-[#1e2a4a] rounded-2xl text-white placeholder:text-gray-600 focus:border-blue-600 focus:outline-none transition";
  const labelClass = "block text-sm font-medium mb-2 text-gray-400";

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <div className="belt-gradient h-0.5 w-16 rounded-full mb-6 opacity-70" />

      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl sm:text-6xl font-black mb-2 text-white tracking-tighter"
      >
        Post Your Gi
      </motion.h1>
      <p className="text-blue-400 text-lg mb-12">Let it roll again</p>

      <motion.form
        onSubmit={handleSubmit}
        className="space-y-8 bg-[#111] p-6 sm:p-10 rounded-3xl border border-[#1e2a4a]"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <label className={labelClass}>Brand</label>
          <input
            name="brand"
            type="text"
            className={inputClass}
            placeholder="Shoyoroll, Tatami, Kingz..."
            required
          />
        </div>

        <div>
          <label className={labelClass}>Size</label>
          <select name="size" className={inputClass} required>
            <option value="">Select Size</option>
            {["A0", "A1", "A2", "A3", "A4", "A5", "A6"].map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>Condition</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "New",       accent: "border-blue-600 text-blue-300" },
              { label: "Like New",  accent: "border-purple-600 text-purple-300" },
              { label: "Good",      accent: "border-amber-700 text-amber-400" },
              { label: "Worn",      accent: "border-zinc-500 text-zinc-400" },
            ].map(({ label, accent }) => (
              <motion.label
                key={label}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`border-2 border-[#1e2a4a] bg-[#0d0d0d] hover:bg-[#161626] rounded-2xl p-4 cursor-pointer text-center transition-all text-gray-400 font-medium has-[:checked]:${accent} has-[:checked]:bg-[#0d0d20]`}
              >
                <input type="radio" name="condition" value={label} required className="sr-only" />
                {label}
              </motion.label>
            ))}
          </div>
        </div>

        <div>
          <label className={labelClass}>Price ($)</label>
          <input
            name="price"
            type="number"
            className={inputClass}
            placeholder="150"
            min="1"
            required
          />
        </div>

        <div>
          <label className={labelClass}>Description</label>
          <textarea
            name="description"
            className={`${inputClass} h-32 resize-none`}
            placeholder="How many times used, any repairs, patches, etc..."
          />
        </div>

        <div>
          <label className={labelClass}>Photos (max 5)</label>
          <div className="bg-[#0d0d0d] border border-[#1e2a4a] rounded-2xl p-4">
            <UploadButton
              endpoint="giImageUploader"
              onClientUploadComplete={(res) => {
                const urls = res.map((r: any) => r.url); // eslint-disable-line @typescript-eslint/no-explicit-any
                setUploadedImages((prev) => [...prev, ...urls]);
              }}
              onUploadError={(error: Error) => alert(`Upload failed: ${error.message}`)}
              className="ut-button:bg-blue-700 ut-button:hover:bg-blue-600 ut-button:rounded-xl ut-button:font-semibold"
            />
          </div>
        </div>

        {uploadedImages.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {uploadedImages.map((url, i) => (
              <div key={i} className="relative w-24 h-24 rounded-2xl overflow-hidden border border-blue-900">
                <Image src={url} alt={`uploaded ${i}`} fill className="object-cover" />
              </div>
            ))}
          </div>
        )}

        <motion.button
          type="submit"
          disabled={isSubmitting}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="w-full bg-blue-700 hover:bg-blue-600 disabled:bg-[#1a1a1a] disabled:text-gray-600 text-white py-5 rounded-2xl font-black text-xl tracking-wider transition"
        >
          {isSubmitting ? "THROWING ON THE MAT…" : "POST TO THE MAT"}
        </motion.button>
      </motion.form>

      {newListing && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-10 bg-[#111] p-8 rounded-3xl border border-blue-900/50"
        >
          <div className="belt-gradient h-0.5 w-full rounded-full mb-6 opacity-50" />
          <h3 className="text-2xl font-bold text-blue-300 mb-2">Gi Posted!</h3>
          <p className="text-gray-400 text-sm mb-6">Help spread the word and get it sold faster.</p>
          <ShareButtons
            title={newListing.title}
            url={`${process.env.NEXT_PUBLIC_APP_URL ?? "https://giswap.vercel.app"}/listings/${newListing.id}`}
            price={newListing.price}
            brand={newListing.brand}
            size={newListing.size}
          />
        </motion.div>
      )}

      <FeedbackModal
        open={showFeedback}
        context="sell-flow"
        onClose={() => setShowFeedback(false)}
      />
    </div>
  );
}
