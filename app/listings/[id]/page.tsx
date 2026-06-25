import { prisma } from "@/lib/prisma";
import MessageSeller from "@/components/messageseller";
import Image from "next/image";
import Link from "next/link";

export default async function ListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const listing = await prisma.listing.findUnique({
    where: { id },
    include: { user: true },
  });

  if (!listing) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Listing not found.
      </div>
    );
  }

  const conditionColor: Record<string, string> = {
    New:        "bg-blue-950 text-blue-300 border-blue-800",
    "Like New":  "bg-purple-950 text-purple-300 border-purple-800",
    Good:       "bg-amber-950 text-amber-400 border-amber-800",
    Worn:       "bg-zinc-800 text-zinc-400 border-zinc-700",
  };
  const condClass = conditionColor[listing.condition] ?? conditionColor.Worn;

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <Link href="/listings" className="text-blue-400 hover:text-blue-300 text-sm mb-8 inline-flex items-center gap-1 transition">
        ← Back to listings
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-6">
        {/* Images */}
        <div className="space-y-4">
          <div className="aspect-square bg-[#111] rounded-3xl overflow-hidden border border-[#1e2a4a] relative">
            {listing.images?.length > 0 ? (
              <Image
                src={listing.images[0]}
                alt={listing.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="h-full flex items-center justify-center text-8xl opacity-20">🥋</div>
            )}
          </div>
          {listing.images?.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {listing.images.slice(1).map((img, i) => (
                <div key={i} className="aspect-square rounded-xl overflow-hidden border border-[#1e2a4a] relative">
                  <Image src={img} alt={`${listing.title} ${i + 2}`} fill className="object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col">
          <div className="belt-gradient h-0.5 w-16 rounded-full mb-6 opacity-60" />

          <h1 className="text-4xl font-black text-white tracking-tight mb-2">{listing.title}</h1>

          <div className="flex items-baseline gap-4 mb-6">
            <span className="text-5xl font-black text-amber-400">${listing.price.toString()}</span>
            <span className={`px-3 py-1 text-xs font-medium rounded-full border ${condClass}`}>
              {listing.condition}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
            <div className="bg-[#111] border border-[#1e2a4a] rounded-2xl p-4">
              <p className="text-gray-500 mb-1">Brand</p>
              <p className="text-white font-semibold">{listing.brand}</p>
            </div>
            <div className="bg-[#111] border border-[#1e2a4a] rounded-2xl p-4">
              <p className="text-gray-500 mb-1">Size</p>
              <p className="text-white font-semibold">{listing.size}</p>
            </div>
          </div>

          {listing.description && (
            <div className="bg-[#111] border border-[#1e2a4a] rounded-2xl p-5 mb-6">
              <p className="text-gray-400 text-sm font-medium mb-2">Description</p>
              <p className="text-gray-300 text-sm leading-relaxed">{listing.description}</p>
            </div>
          )}

          <div className="mb-8 text-sm text-gray-500">
            Listed by <span className="text-blue-400">{listing.user.name ?? "Seller"}</span>
          </div>

          <MessageSeller
            sellerId={listing.userId}
            listingId={listing.id}
            sellerName={listing.user.name ?? "Seller"}
          />
        </div>
      </div>
    </div>
  );
}
