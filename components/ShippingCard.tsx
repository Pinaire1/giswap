import type { Carrier, Prisma } from "@prisma/client";
import { CARRIER_LABELS } from "@/lib/shipping";

type Decimal = Prisma.Decimal;

interface Props {
  price: Decimal;
  pickupAvailable: boolean;
  shippingAvailable: boolean;
  shippingCost: Decimal | null;
  shipsFromCity: string | null;
  shipsFromState: string | null;
  handlingTime: string | null;
  preferredCarrier: Carrier | null;
}

function fmt(d: Decimal | null | number): string {
  if (d === null || d === undefined) return "—";
  const n = typeof d === "number" ? d : parseFloat(d.toString());
  return n.toFixed(2);
}

export default function ShippingCard({
  price,
  pickupAvailable,
  shippingAvailable,
  shippingCost,
  shipsFromCity,
  shipsFromState,
  handlingTime,
  preferredCarrier,
}: Props) {
  const hasDeliveryInfo = pickupAvailable || shippingAvailable;
  if (!hasDeliveryInfo) return null;

  const priceNum = parseFloat(price.toString());
  const shippingNum = shippingCost !== null ? parseFloat(shippingCost.toString()) : null;
  const estimatedTotal =
    shippingAvailable && shippingNum !== null ? priceNum + shippingNum : null;

  const shippingLabel =
    shippingNum === null ? null : shippingNum === 0 ? "Free" : `+$${fmt(shippingNum)}`;

  return (
    <div className="space-y-3">
      {/* ── Price Summary ── */}
      {shippingAvailable && (
        <div className="bg-[#111] border border-[#1e2a4a] rounded-2xl overflow-hidden">
          <div className="px-5 py-3 border-b border-[#1e2a4a]">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Price Summary
            </p>
          </div>
          <div className="px-5 py-4 space-y-2.5 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Price</span>
              <span className="text-white font-semibold">${fmt(price)}</span>
            </div>
            {shippingLabel && (
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Shipping</span>
                <span className={shippingNum === 0 ? "text-emerald-400 font-semibold" : "text-white font-semibold"}>
                  {shippingLabel}
                </span>
              </div>
            )}
            {estimatedTotal !== null && (
              <>
                <div className="border-t border-[#1e2a4a] pt-2.5 flex justify-between items-center">
                  <span className="text-gray-300 font-semibold">Estimated Total</span>
                  <span className="text-amber-400 font-black text-lg">${fmt(estimatedTotal)}</span>
                </div>
                <p className="text-xs text-gray-600">
                  Does not include taxes or payment processing fees.
                </p>
              </>
            )}
          </div>
        </div>
      )}

      {/* ── Delivery Options ── */}
      <div className="bg-[#111] border border-[#1e2a4a] rounded-2xl overflow-hidden">
        <div className="px-5 py-3 border-b border-[#1e2a4a]">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            📦 Delivery
          </p>
        </div>

        <div className="px-5 py-4 space-y-3">
          {/* Availability pills */}
          <div className="flex flex-wrap gap-2">
            {shippingAvailable && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-950 border border-blue-800 text-blue-300 text-xs font-semibold">
                <svg className="h-3.5 w-3.5 text-blue-400 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Ships Anywhere
              </span>
            )}
            {pickupAvailable && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950 border border-emerald-800 text-emerald-300 text-xs font-semibold">
                <svg className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Local Pickup
              </span>
            )}
          </div>

          {/* Shipping details */}
          {shippingAvailable && (
            <dl className="space-y-2.5 pt-1 border-t border-[#1a1a1a] text-sm">
              {shipsFromCity && shipsFromState && (
                <div className="flex justify-between items-start gap-4">
                  <dt className="text-gray-500 flex items-center gap-1.5 flex-shrink-0">
                    <span aria-hidden="true">📍</span> Ships From
                  </dt>
                  <dd className="text-white font-medium text-right">
                    {shipsFromCity}, {shipsFromState}
                  </dd>
                </div>
              )}
              {handlingTime && (
                <div className="flex justify-between items-center gap-4">
                  <dt className="text-gray-500 flex items-center gap-1.5 flex-shrink-0">
                    <span aria-hidden="true">⏱</span> Handling
                  </dt>
                  <dd className="text-white font-medium">{handlingTime}</dd>
                </div>
              )}
              {preferredCarrier && (
                <div className="flex justify-between items-center gap-4">
                  <dt className="text-gray-500 flex items-center gap-1.5 flex-shrink-0">
                    <span aria-hidden="true">🚚</span> Carrier
                  </dt>
                  <dd className="text-white font-medium">{CARRIER_LABELS[preferredCarrier]}</dd>
                </div>
              )}
            </dl>
          )}
        </div>
      </div>
    </div>
  );
}
