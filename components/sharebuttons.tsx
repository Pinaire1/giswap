"use client";

import { useState } from "react";
import { Share2 } from "lucide-react";

interface ShareButtonsProps {
  title: string;
  url: string;
  price: number;
  brand: string;
  size: string;
}

export default function ShareButtons({ title, url, price, brand, size }: ShareButtonsProps) {
  const [status, setStatus] = useState("");
  const message = `Just listed: ${brand} ${size} for $${price} on GiSwap 👊 ${url} #BJJ #GiSwap #JiuJitsu`;

  const showStatus = (text: string) => {
    setStatus(text);
    setTimeout(() => setStatus(""), 4000);
  };

  const shareToInstagram = async () => {
    try {
      await navigator.clipboard.writeText(message);
      showStatus("Copied to clipboard — paste into Instagram to share.");
    } catch {
      showStatus(`Copy this to share on Instagram: ${message}`);
    }
  };

  const shareToFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const shareToTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const nativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, text: message, url });
      } catch {
        // User cancelled share sheet
      }
    } else {
      try {
        await navigator.clipboard.writeText(message);
        showStatus("Link copied to clipboard!");
      } catch {
        showStatus("Could not copy link. Please copy the URL manually.");
      }
    }
  };

  return (
    <div>
      <div className="flex flex-wrap gap-3 mt-6">
        <button
          type="button"
          onClick={nativeShare}
          className="flex items-center gap-2 px-6 py-3 bg-white text-black rounded-2xl font-medium hover:bg-gray-200 transition"
        >
          <Share2 size={20} aria-hidden="true" /> Share
        </button>

        <button
          type="button"
          onClick={shareToInstagram}
          className="flex items-center gap-2 px-6 py-3 bg-linear-to-r from-pink-500 to-purple-600 text-white rounded-2xl font-medium hover:brightness-110 transition"
        >
          <span aria-hidden="true">📸</span> Instagram
        </button>

        <button
          type="button"
          onClick={shareToFacebook}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-medium hover:bg-blue-700 transition"
        >
          <span aria-hidden="true">👍</span> Facebook
        </button>

        <button
          type="button"
          onClick={shareToTwitter}
          className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-2xl font-medium hover:bg-zinc-800 transition"
        >
          X / Twitter
        </button>
      </div>

      {status && (
        <p role="status" className="mt-3 text-sm text-gray-400">
          {status}
        </p>
      )}
    </div>
  );
}
