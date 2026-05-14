"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { UploadButton } from "@/lib/uploadthing";

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
      <h1 className="text-4xl font-bold mb-8">Sell Your Gi</h1>

      <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 rounded-2xl shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Brand</label>
            <input name="brand" type="text" className="w-full p-3 border rounded-xl" placeholder="e.g. Shoyoroll" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Size</label>
            <select name="size" className="w-full p-3 border rounded-xl" required>
              <option value="">Select Size</option>
              {["A0","A1","A2","A3","A4","A5","A6"].map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Condition</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {["New", "Like New", "Good", "Worn"].map((cond) => (
              <label key={cond} className="border rounded-xl p-4 cursor-pointer hover:bg-gray-50 text-center">
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
          <textarea name="description" className="w-full p-3 border rounded-xl h-32" placeholder="Describe the gi..." />
        </div>

        <div>
  <label className="block text-sm font-medium mb-4">Upload Photos (max 5)</label>
  <UploadButton
    endpoint="giImageUploader"
    onClientUploadComplete={(res) => {
      const urls = res.map((r) => r.url);
      setUploadedImages((prev) => [...prev, ...urls]);
      alert("Images uploaded successfully!");
    }}
    onUploadError={(error: Error) => {
      alert(`Upload failed: ${error.message}`);
    }}
    className="ut-button:bg-orange-600 ut-button:hover:bg-orange-700 ut-button:text-white ut-button:font-medium ut-button:py-3 ut-button:px-6 ut-button:rounded-xl"
  />
</div>

        {uploadedImages.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {uploadedImages.map((url, i) => (
              <img key={i} src={url} alt="uploaded" className="w-28 h-28 object-cover rounded-lg border" />
            ))}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-orange-600 hover:bg-orange-700 text-white py-4 rounded-xl font-medium transition disabled:opacity-50"
        >
          {isSubmitting ? "Posting Gi..." : "Post Gi for Sale"}
        </button>
      </form>
    </div>
  );
}