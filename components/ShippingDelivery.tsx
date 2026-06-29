"use client";

import type { ComponentType } from "react";
import { Truck, MapPin, Clock, Package, DollarSign } from "lucide-react";

export type ShippingInfo = {
  ships?: boolean;
  pickup?: boolean;
  shippingCost?: string;
  location?: string;
  shipsWithin?: string;
  carrier?: string;
};

interface ShippingDeliveryProps {
  itemPrice: string;
  shipping?: ShippingInfo | null;
  isSold?: boolean;
  onAskShipping?: () => void;
}

function DeliveryRow({
  icon: Icon,
  label,
  value,
}: {
  icon: ComponentType<{ size?: number; className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2 min-w-0">
        <Icon size={16} className="text-blue-400/70 shrink-0" />
        <span className="text-xs text-gray-500">{label}</span>
      </div>
      <span className="text-sm font-semibold text-white text-right">{value}</span>
    </div>
  );
}

function methodLabel(info: ShippingInfo): string {
  const parts: string[] = [];
  if (info.ships) parts.push("Ships");
  if (info.pickup) parts.push("Local pickup");
  return parts.length > 0 ? parts.join(" · ") : "—";
}

function hasShippingData(info: ShippingInfo | null | undefined): boolean {
  if (!info) return false;
  return !!(
    info.ships ||
    info.pickup ||
    info.shippingCost ||
    info.location ||
    info.shipsWithin ||
    info.carrier
  );
}

export default function ShippingDelivery({
  itemPrice,
  shipping,
  isSold,
  onAskShipping,
}: ShippingDeliveryProps) {
  const hasData = hasShippingData(shipping);

  return (
    <div className="bg-[#111] border border-[#1e2a4a] rounded-2xl p-4 sm:p-5 mb-5 sm:mb-6">
      <div className="belt-gradient h-0.5 w-12 rounded-full mb-4 opacity-50" />
      <p className="text-gray-400 text-sm font-medium mb-3">Shipping &amp; Delivery</p>

      {isSold ? (
        <p className="text-gray-500 text-sm">This item has sold.</p>
      ) : hasData && shipping ? (
        <div className="space-y-3">
          <DeliveryRow icon={Truck} label="Delivery" value={methodLabel(shipping)} />
          {shipping.shippingCost && (
            <DeliveryRow icon={DollarSign} label="Shipping" value={shipping.shippingCost} />
          )}
          {shipping.location && (
            <DeliveryRow icon={MapPin} label="Ships from" value={shipping.location} />
          )}
          {shipping.shipsWithin && (
            <DeliveryRow icon={Clock} label="Ships within" value={shipping.shipsWithin} />
          )}
          {shipping.carrier && (
            <DeliveryRow icon={Package} label="Shipped by" value={shipping.carrier} />
          )}
          <div className="pt-3 mt-1 border-t border-[#1e2a4a] flex items-center justify-between">
            <span className="text-xs text-gray-500">Item price</span>
            <span className="text-sm font-semibold text-white tabular-nums">${itemPrice}</span>
          </div>
          {shipping.shippingCost && shipping.shippingCost !== "Free" && (
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">Est. total</span>
              <span className="text-sm text-gray-400 tabular-nums">
                ${itemPrice} + shipping
              </span>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-gray-500 text-sm leading-relaxed">
            Shipping details aren&apos;t listed yet. Message the seller to confirm cost,
            pickup options, and delivery timing before paying.
          </p>
          {onAskShipping && (
            <button
              type="button"
              onClick={onAskShipping}
              className="w-full py-2.5 px-4 border border-[#1e2a4a] hover:border-blue-600 text-gray-400 hover:text-blue-300 rounded-xl text-xs font-medium transition"
            >
              Ask about shipping
            </button>
          )}
        </div>
      )}
    </div>
  );
}
