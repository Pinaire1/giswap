"use client";

import { useEffect, useRef, useState } from "react";
import { pusherClient } from "@/lib/pusher-client";
import Image from "next/image";
import Link from "next/link";

type Message = {
  id: string;
  content: string;
  fromId: string;
  createdAt: string | Date;
  from?: {
    id: string;
    name?: string | null;
    image?: string | null;
  };
};

type Thread = {
  id: string;
  listingId: string;
  buyerId: string;
  sellerId: string;
  listing: { id: string; title: string; images: string[] };
  buyer:   { id: string; name?: string | null; image?: string | null };
  seller:  { id: string; name?: string | null; image?: string | null };
  messages: Message[];
};

interface ChatClientProps {
  thread: Thread;
  currentUserId: string;
}

export default function ChatClient({ thread, currentUserId }: ChatClientProps) {
  const [messages, setMessages] = useState<Message[]>(thread.messages);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const isBuyer = currentUserId === thread.buyerId;
  const other = isBuyer ? thread.seller : thread.buyer;
  const sellerId = thread.sellerId;

  useEffect(() => {
    const channel = pusherClient.subscribe(`thread-${thread.id}`);
    channel.bind("new-message", (newMessage: Message) => {
      setMessages((prev) => {
        if (prev.some((m) => m.id === newMessage.id)) return prev;
        return [...prev, newMessage];
      });
    });
    return () => { pusherClient.unsubscribe(`thread-${thread.id}`); };
  }, [thread.id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    setLoading(true);

    const tempId = `temp-${Date.now()}`;
    const tempMessage: Message = {
      id: tempId,
      content: trimmed,
      fromId: currentUserId,
      from: { id: currentUserId },
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, tempMessage]);
    setText("");

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId: thread.listingId, sellerId, content: trimmed }),
      });

      const data = await res.json();

      if (data?.message) {
        setMessages((prev) =>
          prev.map((m) => (m.id === tempId ? (data.message as Message) : m))
        );
      }
    } catch (error) {
      console.error(error);
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="max-w-2xl mx-auto h-[calc(100vh-64px)] flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-[#1e2a4a] bg-[#0d0d0d]">
        <Link href="/profile/messages" className="text-gray-500 hover:text-blue-400 mr-1 transition text-lg">
          ←
        </Link>

        {other.image ? (
          <Image
            src={other.image}
            alt={other.name ?? "User"}
            width={36}
            height={36}
            className="rounded-full ring-1 ring-blue-800"
          />
        ) : (
          <div className="w-9 h-9 rounded-full bg-blue-950 border border-blue-800 flex items-center justify-center text-sm text-blue-400">
            {other.name?.[0] ?? "?"}
          </div>
        )}

        <div>
          <p className="font-semibold text-white text-sm">{other.name ?? "Unknown"}</p>
          <Link
            href={`/listings/${thread.listing.id}`}
            className="text-xs text-blue-400/70 hover:text-blue-400 transition"
          >
            {thread.listing.title}
          </Link>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-[#0a0a0a]">
        {messages.length === 0 && (
          <p className="text-center text-gray-700 text-sm mt-8">No messages yet. Say hello!</p>
        )}

        {messages.map((msg) => {
          const isMine = msg.fromId === currentUserId;
          const isTemp = msg.id.startsWith("temp-");

          return (
            <div key={msg.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[72%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  isMine
                    ? `bg-blue-700 text-white ${isTemp ? "opacity-60" : ""}`
                    : "bg-[#1a1a2e] border border-[#1e2a4a] text-gray-200"
                }`}
              >
                {msg.content}
              </div>
            </div>
          );
        })}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-[#1e2a4a] bg-[#0d0d0d] flex gap-2 items-center">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message…"
          className="flex-1 bg-[#111] border border-[#1e2a4a] rounded-full px-4 py-2.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-blue-600 transition"
        />

        <button
          onClick={sendMessage}
          disabled={loading || !text.trim()}
          className="bg-blue-700 hover:bg-blue-600 disabled:bg-[#1a1a1a] disabled:text-gray-600 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-full text-sm font-semibold transition"
        >
          {loading ? "…" : "Send"}
        </button>
      </div>
    </div>
  );
}
