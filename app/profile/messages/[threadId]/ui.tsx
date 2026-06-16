"use client";

import { useEffect, useRef, useState } from "react";
import { pusherClient } from "@/lib/pusher-client";

type Message = {
  id: string;
  content: string;
  fromId: string;
  createdAt: string | Date;
  from?: {
    id: string;
    name?: string | null;
  };
};

type Thread = {
  id: string;
  listingId: string;
  buyerId: string;
  sellerId: string;
  listing: {
    title: string;
  };
  buyer: {
    name?: string | null;
  };
  seller: {
    name?: string | null;
  };
  messages: Message[];
};

interface ChatClientProps {
  thread: Thread;
  currentUserId: string;
}

export default function ChatClient({
  thread,
  currentUserId,
}: ChatClientProps) {
  const [messages, setMessages] = useState<Message[]>(
    thread.messages
  );

  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  };
  useEffect(() => {
  const channel = pusherClient.subscribe(
    `thread-${thread.id}`
  );

  channel.bind(
    "new-message",
    (newMessage: Message) => {
      setMessages((prev) => {
        const exists = prev.some(
          (m) => m.id === newMessage.id
        );

        if (exists) return prev;

        return [...prev, newMessage];
      });
    }
  );

  return () => {
    pusherClient.unsubscribe(
      `thread-${thread.id}`
    );
  };
}, [thread.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!text.trim()) return;

    setLoading(true);

    const tempMessage: Message = {
      id: Date.now().toString(),
      content: text,
      fromId: currentUserId,
      from: {
        id: currentUserId,
      },
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, tempMessage]);
    setText("");

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          listingId: thread.listingId,
          toId:
            currentUserId === thread.buyerId
              ? thread.sellerId
              : thread.buyerId,
          content: tempMessage.content,
        }),
      });

      const data = await res.json();

      if (data?.message) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === tempMessage.id
              ? (data.message as Message)
              : m
          )
        );
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto h-screen flex flex-col bg-zinc-950 text-white">
      {/* Header */}
      <div className="p-4 border-b border-zinc-800">
        <h1 className="font-bold text-lg">
          {thread.listing.title}
        </h1>

        <p className="text-sm text-zinc-400">
          Chat with{" "}
          {currentUserId === thread.buyerId
            ? thread.seller.name ?? "Seller"
            : thread.buyer.name ?? "Buyer"}
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => {
          const isMine =
            msg.fromId === currentUserId;

          return (
            <div
              key={msg.id}
              className={`flex ${
                isMine
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm ${
                  isMine
                    ? "bg-emerald-600"
                    : "bg-zinc-800"
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
      <div className="p-4 border-t border-zinc-800 flex gap-2">
        <input
          value={text}
          onChange={(e) =>
            setText(e.target.value)
          }
          placeholder="Type a message..."
          className="flex-1 bg-zinc-900 border border-zinc-700 rounded-2xl px-4 py-2 text-sm"
        />

        <button
          onClick={sendMessage}
          disabled={
            loading || !text.trim()
          }
          className="bg-emerald-600 px-4 py-2 rounded-2xl disabled:bg-zinc-700"
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
}