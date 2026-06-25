"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { UploadButton } from "@/lib/uploadthing";

type ListingData = {
  id: string;
  brand: string;
  size: string;
  condition: string;
  price: string;
  description: string;
  images: string[];
};

const SIZES = ["A0", "A1", "A2", "A3", "A4", "A5", "A6"];
const CONDITIONS = [
  { label: "New", accent: "border-blue-600 text-blue-300" },
  { label: "Like New", accent: "border-purple-600 text-purple-300" },
  { label: "Good", accent: "border-amber-700 text-amber-400" },
  { label: "Worn", accent: "border-zinc-500 text-zinc-400" },
];

export default function EditListingForm({ listing }: { listing: ListingData }) {
  const router = useRouter();
  const [brand, setBrand] = useState(listing.brand);
  const [size, setSize] = useState(listing.size);
  const [condition, setCondition] = useState(listing.condition);
  const [price, setPrice] = useState(listing.price);
  const [description, setDescription] = useState(listing.description);
  const [images, setImages] = useState<string[]>(listing.images);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const inputClass =
    "w-full p-4 bg-[#0d0d0d] border border-[#1e2a4a] rounded-2xl text-white placeholder:text-gray-600 focus:border-blue-600 focus:outline-none transition";
  const labelClass = "block text-sm font-medium mb-2 text-gray-400";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const res = await fetch(`/api/listings/${listing.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brand,
          size,
          condition,
          price,
          description,
          images,
          title: `${brand} ${size}`,
        }),
      });

      if (res.ok) {
        router.push("/profile");
        router.refresh();
      } else {
        const data = await res.json();
        setError(data?.error ?? "Failed to save changes");
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <div className="belt-gradient h-0.5 w-16 rounded-full mb-6 opacity-70" />
      <h1 className="text-4xl font-black text-white mb-2">Edit Listing</h1>
      <p className="text-blue-400 mb-10 text-sm">Changes save immediately to the marketplace.</p>

      <form
        onSubmit={handleSubmit}
        className="space-y-8 bg-[#111] p-10 rounded-3xl border border-[#1e2a4a]"
      >
        <div>
          <label className={labelClass}>Brand</label>
          <input
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            className={inputClass}
            placeholder="Shoyoroll, Tatami, Kingz..."
            required
          />
        </div>

        <div>
          <label className={labelClass}>Size</label>
          <select
            value={size}
            onChange={(e) => setSize(e.target.value)}
            className={inputClass}
            required
          >
            {SIZES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>Condition</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {CONDITIONS.map(({ label, accent }) => (
              <label
                key={label}
                className={`border-2 rounded-2xl p-4 cursor-pointer text-center transition-all font-medium ${
                  condition === label
                    ? `${accent} bg-[#0d0d20]`
                    : "border-[#1e2a4a] bg-[#0d0d0d] text-gray-400 hover:bg-[#161626]"
                }`}
              >
                <input
                  type="radio"
                  name="condition"
                  value={label}
                  checked={condition === label}
                  onChange={() => setCondition(label)}
                  className="sr-only"
                />
                {label}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className={labelClass}>Price ($)</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className={inputClass}
            min="1"
            required
          />
        </div>

        <div>
          <label className={labelClass}>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={`${inputClass} h-32 resize-none`}
            placeholder="How many times used, any repairs, patches, etc..."
          />
        </div>

        <div>
          <label className={labelClass}>Photos</label>
          <div className="bg-[#0d0d0d] border border-[#1e2a4a] rounded-2xl p-4">
            <UploadButton
              endpoint="giImageUploader"
              onClientUploadComplete={(res) => {
                const urls = res.map((r) => r.url);
                setImages((prev) => [...prev, ...urls]);
              }}
              onUploadError={(err: Error) => setError(`Upload failed: ${err.message}`)}
              className="ut-button:bg-blue-700 ut-button:hover:bg-blue-600 ut-button:rounded-xl ut-button:font-semibold"
            />
          </div>

          {images.length > 0 && (
            <div className="flex flex-wrap gap-3 mt-4">
              {images.map((url, i) => (
                <div key={i} className="relative group">
                  <div className="relative w-24 h-24 rounded-2xl overflow-hidden border border-blue-900">
                    <Image src={url} alt={`photo ${i + 1}`} fill className="object-cover" />
                  </div>
                  <button
                    type="button"
                    onClick={() => setImages((prev) => prev.filter((_, idx) => idx !== i))}
                    className="absolute -top-2 -right-2 w-5 h-5 bg-red-600 rounded-full text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => router.push("/profile")}
            className="flex-1 py-4 rounded-2xl border border-[#1e2a4a] text-gray-400 hover:text-white hover:border-gray-600 transition font-semibold"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex-1 bg-blue-700 hover:bg-blue-600 disabled:bg-[#1a1a1a] disabled:text-gray-600 text-white py-4 rounded-2xl font-black transition"
          >
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
