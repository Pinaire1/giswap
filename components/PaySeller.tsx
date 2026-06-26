"use client";

import { useState } from "react";

interface PaySellerProps {
  paypalHandle: string | null;
  venmoHandle: string | null;
  price: string;
  sellerName: string;
}

function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const el = document.createElement("textarea");
      el.value = value;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex items-center justify-between gap-3 bg-[#0d0d0d] border border-[#1e2a4a] rounded-xl px-4 py-3">
      <div>
        <p className="text-xs text-gray-400 mb-0.5">{label}</p>
        <p className="text-white font-semibold text-sm">@{value}</p>
      </div>
      <button
        type="button"
        onClick={copy}
        aria-label={copied ? `${label} copied to clipboard` : `Copy ${label} handle`}
        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex-shrink-0 ${
          copied
            ? "bg-green-900/50 text-green-400 border border-green-800"
            : "bg-[#1a1a2e] border border-[#1e2a4a] text-gray-400 hover:text-white hover:border-blue-600"
        }`}
      >
        <span aria-live="polite">{copied ? "Copied ✓" : "Copy"}</span>
      </button>
    </div>
  );
}

export default function PaySeller({
  paypalHandle,
  venmoHandle,
  price,
  sellerName,
}: PaySellerProps) {
  if (!paypalHandle && !venmoHandle) return null;

  return (
    <div className="bg-[#111] border border-[#1e2a4a] rounded-2xl p-4 sm:p-5 mb-5 sm:mb-6">
      <p className="text-gray-400 text-sm font-medium mb-1">Pay Seller</p>
      <p className="text-gray-400 text-xs mb-4">
        Send{" "}
        <span className="text-amber-400 font-semibold">${price}</span> to{" "}
        {sellerName} after agreeing on the deal.
      </p>

      <div className="space-y-2">
        {paypalHandle && (
          <CopyButton value={paypalHandle} label="PayPal" />
        )}
        {venmoHandle && (
          <CopyButton value={venmoHandle} label="Venmo" />
        )}
      </div>

      <p className="text-gray-400 text-xs mt-4">
        Always confirm the deal via messages before sending payment.
      </p>
    </div>
  );
}
