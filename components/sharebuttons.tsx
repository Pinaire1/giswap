"use client";

import { Share2 } from "lucide-react";

interface ShareButtonsProps {
  title: string;
  url: string;
  price: number;
  brand: string;
  size: string;
}

export default function ShareButtons({ title, url, price, brand, size }: ShareButtonsProps) {
  const message = `Just listed: ${brand} ${size} for $${price} on GiSwap 👊 ${url} #BJJ #GiSwap #JiuJitsu`;

  const shareToInstagram = () => {
    alert("📸 Copy this and share it on Instagram:\n\n" + message);
  };

  const shareToFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(message)}`, "_blank");
  };

  const shareToTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`, "_blank");
  };

  const nativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: message,
          url: url,
        });
      } catch {
        console.log("Share cancelled");
      }
    } else {
      navigator.clipboard.writeText(message);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <div className="flex flex-wrap gap-3 mt-6">
      <button
        onClick={nativeShare}
        className="flex items-center gap-2 px-6 py-3 bg-white text-black rounded-2xl font-medium hover:bg-gray-200 transition"
      >
        <Share2 size={20} /> Share
      </button>

      <button
        onClick={shareToInstagram}
        className="flex items-center gap-2 px-6 py-3 bg-linear-to-r from-pink-500 to-purple-600 text-white rounded-2xl font-medium hover:brightness-110 transition"
      >
        📸 Instagram
      </button>

      <button
        onClick={shareToFacebook}
        className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-medium hover:bg-blue-700 transition"
      >
        👍 Facebook
      </button>

      <button
        onClick={shareToTwitter}
        className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-2xl font-medium hover:bg-zinc-800 transition"
      >
        𝕏 X / Twitter
      </button>
    </div>
  );
}