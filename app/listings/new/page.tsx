"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { UploadButton } from "@/lib/uploadthing";
import Image from "next/image";

const COMMON_BRANDS = [
  "Shoyoroll", "Tatami", "Kingz", "Scramble", "Hyperfly",
  "Fuji", "Venum", "Sanabul", "Flow", "Gameness",
];

const SIZES = ["A0", "A1", "A2", "A3", "A4", "A5", "A6"];

export default function NewListingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [customBrand, setCustomBrand] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400" role="status">
        Loading...
      </div>
    );
  }
  if (!session) return null;

  const brand = selectedBrand === "Other" ? customBrand : selectedBrand;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedSize) return;
    setIsSubmitting(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = {
      title: `${brand} ${selectedSize}`,
      brand,
      size: selectedSize,
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
        router.push(`/listings/${result.listing.id}`);
      } else {
        setError("Failed to post gi. Please try again.");
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error(err);
      setError("Error posting gi. Please try again.");
      setIsSubmitting(false);
    }
  };

  const inputClass = "w-full p-4 bg-[#0d0d0d] border border-[#1e2a4a] rounded-2xl text-white placeholder:text-gray-500 focus:border-blue-600 focus:outline-none transition";
  const labelClass = "block text-sm font-medium mb-2 text-gray-400";
  const chipBase = "border-2 border-[#1e2a4a] bg-[#0d0d0d] hover:bg-[#161626] rounded-2xl px-3 py-3 cursor-pointer text-center transition-all font-medium text-gray-400 min-h-[44px] flex items-center justify-center";
  const chipActive = "border-blue-600 text-blue-300 bg-[#0d0d20]";

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
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
        className="space-y-8 bg-[#111] p-5 sm:p-10 rounded-3xl border border-[#1e2a4a]"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        aria-busy={isSubmitting}
      >
        {/* Brand */}
        <fieldset>
          <legend className={`${labelClass} px-0`}>Brand</legend>
          <div className="flex flex-wrap gap-2">
            {[...COMMON_BRANDS, "Other"].map((b) => (
              <motion.button
                key={b}
                type="button"
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedBrand(b)}
                aria-pressed={selectedBrand === b}
                className={`${chipBase} ${selectedBrand === b ? chipActive : ""}`}
              >
                {b}
              </motion.button>
            ))}
          </div>
          {selectedBrand === "Other" && (
            <>
              <label htmlFor="custom-brand" className="sr-only">
                Custom brand name
              </label>
              <input
                id="custom-brand"
                type="text"
                className={`${inputClass} mt-3`}
                placeholder="Enter brand name"
                value={customBrand}
                onChange={(e) => setCustomBrand(e.target.value)}
                required
                autoFocus
              />
            </>
          )}
          <input type="hidden" name="brand" value={brand} required />
        </fieldset>

        {/* Size */}
        <fieldset>
          <legend className={`${labelClass} px-0`}>Size</legend>
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
            {SIZES.map((s) => (
              <motion.button
                key={s}
                type="button"
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedSize(s)}
                aria-pressed={selectedSize === s}
                className={`${chipBase} ${selectedSize === s ? chipActive : ""}`}
              >
                {s}
              </motion.button>
            ))}
          </div>
          <input type="hidden" name="size" value={selectedSize} required />
        </fieldset>

        {/* Condition */}
        <fieldset>
          <legend className={`${labelClass} px-0`}>Condition</legend>
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
        </fieldset>

        {/* Price */}
        <div>
          <label htmlFor="listing-price" className={labelClass}>Price ($)</label>
          <input
            id="listing-price"
            name="price"
            type="number"
            className={inputClass}
            placeholder="150"
            min="1"
            required
          />
        </div>

        {/* Photos */}
        <div>
          <span id="photos-label" className={labelClass}>Photos (max 5)</span>
          <div className="bg-[#0d0d0d] border border-[#1e2a4a] rounded-2xl p-4" aria-labelledby="photos-label">
            <UploadButton
              endpoint="giImageUploader"
              onClientUploadComplete={(res) => {
                const urls = res.map((r: { url: string }) => r.url);
                setUploadedImages((prev) => [...prev, ...urls]);
              }}
              onUploadError={(uploadError: Error) => setError(`Upload failed: ${uploadError.message}`)}
              className="ut-button:bg-blue-700 ut-button:hover:bg-blue-600 ut-button:rounded-xl ut-button:font-semibold"
            />
          </div>
          {uploadedImages.length > 0 && (
            <div className="flex flex-wrap gap-3 mt-3">
              {uploadedImages.map((url, i) => (
                <div key={i} className="relative w-24 h-24 rounded-2xl overflow-hidden border border-blue-900">
                  <Image src={url} alt={`Listing photo ${i + 1}`} fill className="object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="listing-description" className={labelClass}>
            Description <span className="text-gray-400">(optional)</span>
          </label>
          <textarea
            id="listing-description"
            name="description"
            className={`${inputClass} h-32 resize-none`}
            placeholder="How many times used, any repairs, patches, etc..."
          />
        </div>

        {error && (
          <p role="alert" className="text-red-400 text-sm">
            {error}
          </p>
        )}

        <motion.button
          type="submit"
          disabled={isSubmitting || !brand || !selectedSize}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="w-full bg-blue-700 hover:bg-blue-600 disabled:bg-[#1a1a1a] disabled:text-gray-400 text-white py-5 rounded-2xl font-black text-xl tracking-wider transition"
        >
          {isSubmitting ? "THROWING ON THE MAT…" : "POST TO THE MAT"}
        </motion.button>
      </motion.form>
    </div>
  );
}
