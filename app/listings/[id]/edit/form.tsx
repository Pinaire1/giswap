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

  const inputClass = "input";
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
    <div className="page-container max-w-3xl">
      <div className="page-accent" />
      <h1 className="page-title text-4xl mb-2">Edit Listing</h1>
      <p className="page-subtitle text-sm mb-8 sm:mb-10">Changes save immediately to the marketplace.</p>

      <form onSubmit={handleSubmit} className="space-y-8 card p-5 sm:p-10">
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
            className="flex-1 btn-outline py-4 min-h-[48px] font-semibold"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex-1 btn-primary py-4 min-h-[48px] font-black"
          >
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
