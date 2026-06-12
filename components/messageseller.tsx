"use client";

import { useState } from "react";

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
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [sent, setSent] = useState(false);

  const sendMessage = async () => {
    if (!message.trim()) return;

    setIsSending(true);

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sellerId,
          listingId,
          content: message,
        }),
      });

      if (res.ok) {
        setSent(true);
        setMessage("");
        setTimeout(() => setSent(false), 5000);
      } else {
        alert("Failed to send message");
      }
    } catch (error) {
      console.error(error);
      alert("Error sending message. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="mt-4">
      {!sent ? (
        <div className="space-y-3">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={`Hi ${sellerName}, I'm interested in this listing...`}
            className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-2xl text-sm h-24 resize-y focus:outline-none focus:border-emerald-500"
          />

          <button
            onClick={sendMessage}
            disabled={isSending || !message.trim()}
            className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-zinc-700 text-white py-3 rounded-2xl font-medium transition"
          >
            {isSending ? "Sending..." : "Send Message to Seller"}
          </button>
        </div>
      ) : (
        <div className="text-emerald-400 text-center py-4 font-medium bg-emerald-950/30 rounded-2xl">
          Message sent successfully! 🎉
        </div>
      )}
    </div>
  );
}