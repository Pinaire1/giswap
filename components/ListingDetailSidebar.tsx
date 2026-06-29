"use client";

import { useState, useRef } from "react";
import { useSession, signIn } from "next-auth/react";
import ShippingDelivery from "@/components/ShippingDelivery";
import MessageSeller from "@/components/messageseller";
import PaySeller from "@/components/PaySeller";
import StickyPurchaseBar from "@/components/StickyPurchaseBar";
import SellerTrustCard from "@/components/SellerTrustCard";
import ReportButton from "@/components/ReportButton";

const QUICK_REPLIES = [
  "Is this still available?",
  "What's the shipping cost?",
  "Can I pick this up locally?",
  "When can you ship?",
];

interface ListingDetailSidebarProps {
  title: string;
  price: string;
  condition: string;
  conditionClass: string;
  isSold: boolean;
  showReport?: boolean;
  brand: string;
  size: string;
  color: string | null;
  weight: string | null;
  seller: {
    id: string;
    name: string | null;
    image: string | null;
    paypalHandle: string | null;
    venmoHandle: string | null;
    createdAt: string;
    _count: { listings: number };
  };
  sellerId: string;
  listingId: string;
}

export default function ListingDetailSidebar({
  title,
  price,
  condition,
  conditionClass,
  isSold,
  showReport,
  brand,
  size,
  color,
  weight,
  seller,
  sellerId,
  listingId,
}: ListingDetailSidebarProps) {
  const { data: session, status } = useSession();
  const messageRef = useRef<HTMLDivElement>(null);
  const [draftMessage, setDraftMessage] = useState("");
  const sellerName = seller.name ?? "Seller";

  const scrollToMessage = () => {
    messageRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const fillMessage = (text: string) => {
    setDraftMessage(text);
    scrollToMessage();
  };

  return (
    <div className="flex flex-col lg:sticky lg:top-20 lg:self-start">
      <div className="belt-gradient h-0.5 w-16 rounded-full mb-4 sm:mb-6 opacity-60" />

      <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-2">
        {title}
      </h1>

      <div className="flex items-baseline gap-3 sm:gap-4 mb-5 sm:mb-6 flex-wrap">
        <span className="text-4xl sm:text-5xl font-black text-amber-400 tabular-nums">
          ${price}
        </span>
        <span className={`px-3 py-1 text-xs font-medium rounded-full border ${conditionClass}`}>
          {condition}
        </span>
        {isSold && (
          <span className="px-3 py-1 text-xs font-medium rounded-full border bg-red-950 text-red-400 border-red-800">
            Sold
          </span>
        )}
      </div>

      <ShippingDelivery
        itemPrice={price}
        isSold={isSold}
        onAskShipping={
          isSold
            ? undefined
            : () =>
                fillMessage(
                  "Hi! Could you share shipping cost, pickup options, and when you can ship?",
                )
        }
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-5 sm:mb-6 text-sm">
        <div className="bg-[#111] border border-[#1e2a4a] rounded-xl sm:rounded-2xl p-3 sm:p-4">
          <p className="text-gray-500 mb-1">Brand</p>
          <p className="text-white font-semibold">{brand}</p>
        </div>
        <div className="bg-[#111] border border-[#1e2a4a] rounded-xl sm:rounded-2xl p-3 sm:p-4">
          <p className="text-gray-500 mb-1">Size</p>
          <p className="text-white font-semibold">{size}</p>
        </div>
        {color && (
          <div className="bg-[#111] border border-[#1e2a4a] rounded-xl sm:rounded-2xl p-3 sm:p-4">
            <p className="text-gray-500 mb-1">Color</p>
            <p className="text-white font-semibold">{color}</p>
          </div>
        )}
        {weight && (
          <div className="bg-[#111] border border-[#1e2a4a] rounded-xl sm:rounded-2xl p-3 sm:p-4">
            <p className="text-gray-500 mb-1">Weight</p>
            <p className="text-white font-semibold">{weight}</p>
          </div>
        )}
      </div>

      <SellerTrustCard
        seller={{
          ...seller,
          createdAt: new Date(seller.createdAt),
        }}
        brand={brand}
      />

      {!isSold && (
        <>
          <div className="bg-[#111] border border-[#1e2a4a] rounded-2xl p-4 sm:p-5 mb-5 sm:mb-6">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-gray-600 mb-4">
              <span className="text-blue-400 font-medium">① Message &amp; agree</span>
              <span aria-hidden>→</span>
              <span>② Pay seller</span>
              <span aria-hidden>→</span>
              <span>③ Seller ships</span>
            </div>

            <div ref={messageRef}>
              <p className="text-gray-400 text-sm font-medium mb-3">Contact Seller</p>

              {status === "unauthenticated" ? (
                <div className="space-y-3">
                  <p className="text-gray-500 text-sm">
                    Sign in to message {sellerName} about shipping and availability.
                  </p>
                  <button
                    type="button"
                    onClick={() => signIn("google")}
                    className="w-full bg-blue-700 hover:bg-blue-600 text-white py-3 rounded-2xl font-semibold transition active:scale-95 text-sm"
                  >
                    Sign in to message seller
                  </button>
                </div>
              ) : status === "loading" ? (
                <p className="text-gray-600 text-sm">Loading…</p>
              ) : (
                <>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {QUICK_REPLIES.map((reply) => (
                      <button
                        key={reply}
                        type="button"
                        onClick={() => fillMessage(reply)}
                        className="px-3 py-1.5 text-[11px] font-medium rounded-xl border border-[#1e2a4a] text-gray-500 hover:border-purple-600 hover:text-purple-300 transition"
                      >
                        {reply}
                      </button>
                    ))}
                  </div>
                  <MessageSeller
                    sellerId={sellerId}
                    listingId={listingId}
                    sellerName={sellerName}
                    message={draftMessage}
                    onMessageChange={setDraftMessage}
                  />
                </>
              )}
            </div>
          </div>

          <PaySeller
            paypalHandle={seller.paypalHandle}
            venmoHandle={seller.venmoHandle}
            price={price}
            sellerName={sellerName}
          />

          <StickyPurchaseBar
            price={price}
            sellerName={sellerName}
            onMessage={scrollToMessage}
            visible={!!session}
          />
        </>
      )}

      {showReport && (
        <div className="mt-2">
          <ReportButton listingId={listingId} />
        </div>
      )}
    </div>
  );
}
