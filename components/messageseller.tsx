"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface MessageSellerProps {
  sellerName: string;
  sellerId: string;
  listingId: string;
}

export default function MessageSeller({
  sellerId,
  listingId,
  sellerName,
}: MessageSellerProps) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");

  const sendMessage = async () => {
    if (!message.trim()) return;
    setIsSending(true);
    setError("");

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sellerId, listingId, content: message }),
      });

      const data = await res.json();

      if (res.ok && data?.thread?.id) {
        router.push(`/profile/messages/${data.thread.id}`);
      } else {
        setError(data?.error ?? "Failed to send message");
      }
    } catch {
      setError("Error sending message. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-3">
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder={`Hi ${sellerName}, I'm interested in this listing…`}
        className="w-full p-4 bg-[#0d0d0d] border border-[#1e2a4a] rounded-2xl text-sm text-white placeholder:text-gray-600 h-28 resize-none focus:outline-none focus:border-blue-600 transition"
      />

      {error && <p className="text-red-400 text-xs">{error}</p>}

      <button
        onClick={sendMessage}
        disabled={isSending || !message.trim()}
        className="w-full bg-blue-700 hover:bg-blue-600 disabled:bg-[#1a1a1a] disabled:text-gray-600 disabled:cursor-not-allowed text-white py-3 rounded-2xl font-semibold transition active:scale-95"
      >
        {isSending ? "Sending…" : `Message ${sellerName}`}
      </button>
    </div>
  );
}
