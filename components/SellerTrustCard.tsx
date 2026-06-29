import Link from "next/link";

interface SellerTrustCardProps {
  seller: {
    id: string;
    name: string | null;
    image: string | null;
    paypalHandle: string | null;
    venmoHandle: string | null;
    createdAt: Date;
    _count: { listings: number };
  };
  brand: string;
}

export default function SellerTrustCard({ seller, brand }: SellerTrustCardProps) {
  const memberSince = seller.createdAt.getFullYear();
  const listingCount = seller._count.listings;

  return (
    <div className="bg-[#111] border border-[#1e2a4a] rounded-xl sm:rounded-2xl p-4 mb-5 sm:mb-6">
      <p className="text-xs text-gray-600 uppercase tracking-widest mb-3">Seller</p>
      <div className="flex items-start gap-3">
        {seller.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={seller.image}
            alt={seller.name ?? "Seller"}
            width={44}
            height={44}
            className="w-11 h-11 rounded-full ring-2 ring-blue-900 flex-shrink-0"
          />
        ) : (
          <div className="w-11 h-11 rounded-full bg-blue-950 border border-blue-800 flex items-center justify-center flex-shrink-0 text-blue-400 font-bold text-sm">
            {(seller.name ?? "S")[0].toUpperCase()}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="text-white font-semibold text-sm truncate">
            {seller.name ?? "Seller"}
          </p>
          <p className="text-gray-600 text-xs mt-0.5">
            {listingCount} listing{listingCount !== 1 ? "s" : ""} available · On GiSwap since {memberSince}
          </p>
          {(seller.paypalHandle || seller.venmoHandle) && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {seller.paypalHandle && (
                <span className="px-2 py-0.5 text-[11px] font-medium rounded-full border border-[#003087]/50 bg-[#003087]/10 text-blue-300">
                  PayPal ✓
                </span>
              )}
              {seller.venmoHandle && (
                <span className="px-2 py-0.5 text-[11px] font-medium rounded-full border border-[#008CFF]/30 bg-[#008CFF]/10 text-blue-300">
                  Venmo ✓
                </span>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="flex gap-4 mt-3 pt-3 border-t border-[#1e2a4a]">
        <Link
          href={`/listings?brand=${encodeURIComponent(brand)}`}
          className="text-xs text-blue-400 hover:text-blue-300 transition"
        >
          More {brand} gis →
        </Link>
      </div>
    </div>
  );
}
