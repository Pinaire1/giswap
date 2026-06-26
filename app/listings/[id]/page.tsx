import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { notFound } from "next/navigation";
import Link from "next/link";
import MessageSeller from "@/components/messageseller";
import ReportButton from "@/components/ReportButton";
import PaySeller from "@/components/PaySeller";
import ImageGallery from "@/components/ImageGallery";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://giswap.vercel.app";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const listing = await prisma.listing.findUnique({
    where: { id },
    select: { title: true, brand: true, size: true, condition: true, price: true, description: true, images: true },
  });
  if (!listing) return { title: "Listing Not Found | GiSwap" };

  const title = `${listing.title} — $${listing.price} | GiSwap`;
  const description = listing.description
    ? listing.description.slice(0, 160)
    : `${listing.brand} ${listing.size} gi in ${listing.condition} condition for $${listing.price} on GiSwap.`;
  const image = listing.images?.[0] ?? `${BASE_URL}/og-default.png`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/listings/${id}`,
      siteName: "GiSwap",
      images: [{ url: image, width: 1200, height: 630, alt: listing.title }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default async function ListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [listing, session] = await Promise.all([
    prisma.listing.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            paypalHandle: true,
            venmoHandle: true,
            _count: { select: { listings: { where: { isSold: false } } } },
          },
        },
      },
    }),
    auth(),
  ]);

  if (!listing) notFound();

  const conditionColor: Record<string, string> = {
    New:        "bg-blue-950 text-blue-300 border-blue-800",
    "Like New":  "bg-purple-950 text-purple-300 border-purple-800",
    Good:       "bg-amber-950 text-amber-400 border-amber-800",
    Worn:       "bg-zinc-800 text-zinc-400 border-zinc-700",
  };
  const condClass = conditionColor[listing.condition] ?? conditionColor.Worn;
  const isOwnListing = session?.user?.id === listing.userId;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <Link
        href="/listings"
        className="text-blue-400 hover:text-blue-300 text-sm mb-6 sm:mb-8 inline-flex items-center gap-1 transition"
      >
        ← Back to listings
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mt-4 sm:mt-6">
        {/* Images */}
        <div>
          <ImageGallery images={listing.images ?? []} title={listing.title} />
        </div>

        {/* Details */}
        <div className="flex flex-col">
          <div className="belt-gradient h-0.5 w-16 rounded-full mb-4 sm:mb-6 opacity-60" />

          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-2">
            {listing.title}
          </h1>

          <div className="flex items-baseline gap-3 sm:gap-4 mb-5 sm:mb-6 flex-wrap">
            <span className="text-4xl sm:text-5xl font-black text-amber-400">
              ${listing.price.toString()}
            </span>
            <span
              className={`px-3 py-1 text-xs font-medium rounded-full border ${condClass}`}
            >
              {listing.condition}
            </span>
            {listing.isSold && (
              <span className="px-3 py-1 text-xs font-medium rounded-full border bg-red-950 text-red-400 border-red-800">
                Sold
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-5 sm:mb-6 text-sm">
            <div className="bg-[#111] border border-[#1e2a4a] rounded-xl sm:rounded-2xl p-3 sm:p-4">
              <p className="text-gray-500 mb-1">Brand</p>
              <p className="text-white font-semibold">{listing.brand}</p>
            </div>
            <div className="bg-[#111] border border-[#1e2a4a] rounded-xl sm:rounded-2xl p-3 sm:p-4">
              <p className="text-gray-500 mb-1">Size</p>
              <p className="text-white font-semibold">{listing.size}</p>
            </div>
            {listing.color && (
              <div className="bg-[#111] border border-[#1e2a4a] rounded-xl sm:rounded-2xl p-3 sm:p-4">
                <p className="text-gray-500 mb-1">Color</p>
                <p className="text-white font-semibold">{listing.color}</p>
              </div>
            )}
            {listing.weight && (
              <div className="bg-[#111] border border-[#1e2a4a] rounded-xl sm:rounded-2xl p-3 sm:p-4">
                <p className="text-gray-500 mb-1">Weight</p>
                <p className="text-white font-semibold">{listing.weight}</p>
              </div>
            )}
          </div>

          {listing.description && (
            <div className="bg-[#111] border border-[#1e2a4a] rounded-xl sm:rounded-2xl p-4 sm:p-5 mb-5 sm:mb-6">
              <p className="text-gray-400 text-sm font-medium mb-2">Description</p>
              <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">
                {listing.description}
              </p>
            </div>
          )}

          {/* Seller card */}
          <div className="bg-[#111] border border-[#1e2a4a] rounded-xl sm:rounded-2xl p-4 mb-5 sm:mb-6 flex items-center gap-3">
            {listing.user.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={listing.user.image}
                alt={listing.user.name ?? "Seller"}
                width={40}
                height={40}
                className="w-10 h-10 rounded-full ring-2 ring-blue-900 flex-shrink-0"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-blue-950 border border-blue-800 flex items-center justify-center flex-shrink-0 text-blue-400 font-bold text-sm">
                {(listing.user.name ?? "S")[0].toUpperCase()}
              </div>
            )}
            <div className="min-w-0">
              <p className="text-white font-semibold text-sm truncate">
                {listing.user.name ?? "Seller"}
              </p>
              <p className="text-gray-600 text-xs">
                {listing.user._count.listings} listing{listing.user._count.listings !== 1 ? "s" : ""} available
              </p>
            </div>
            <Link
              href={`/listings?brand=${encodeURIComponent(listing.brand)}`}
              className="ml-auto text-xs text-blue-400 hover:text-blue-300 transition shrink-0"
            >
              See more →
            </Link>
          </div>

          {isOwnListing ? (
            <div className="flex gap-3">
              <Link
                href={`/listings/${listing.id}/edit`}
                className="flex-1 text-center py-3 bg-[#111] border border-[#1e2a4a] hover:border-blue-600 text-gray-300 hover:text-blue-300 rounded-2xl font-medium text-sm transition"
              >
                Edit Listing
              </Link>
            </div>
          ) : (
            <>
              {!listing.isSold && (
                <>
                  <MessageSeller
                    sellerId={listing.userId}
                    listingId={listing.id}
                    sellerName={listing.user.name ?? "Seller"}
                  />

                  <PaySeller
                    paypalHandle={listing.user.paypalHandle ?? null}
                    venmoHandle={listing.user.venmoHandle ?? null}
                    price={listing.price.toString()}
                    sellerName={listing.user.name ?? "Seller"}
                  />
                </>
              )}
            </>
          )}

          {/* Report button — only for logged-in non-owners */}
          {session?.user?.id && !isOwnListing && (
            <div className="mt-4">
              <ReportButton listingId={listing.id} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
