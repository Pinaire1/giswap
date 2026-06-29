"use client";

interface StickyPurchaseBarProps {
  price: string;
  sellerName: string;
  onMessage: () => void;
  visible: boolean;
}

export default function StickyPurchaseBar({
  price,
  sellerName,
  onMessage,
  visible,
}: StickyPurchaseBarProps) {
  if (!visible) return null;

  return (
    <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-[#0d0d0d]/95 backdrop-blur-md border-t border-[#1e2a4a] px-4 py-3 safe-area-pb">
      <div className="flex items-center justify-between gap-3 max-w-5xl mx-auto">
        <div className="min-w-0">
          <p className="text-xl font-black text-amber-400 tabular-nums">${price}</p>
          <p className="text-[11px] text-gray-600 truncate">+ shipping · ask {sellerName}</p>
        </div>
        <button
          type="button"
          onClick={onMessage}
          className="shrink-0 px-5 py-3 bg-blue-700 hover:bg-blue-600 text-white rounded-xl font-semibold text-sm transition active:scale-95"
        >
          Message
        </button>
      </div>
    </div>
  );
}
