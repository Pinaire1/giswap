import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { notFound } from "next/navigation";
import Link from "next/link";
import ImageGallery from "@/components/ImageGallery";
import ListingDetailSidebar from "@/components/ListingDetailSidebar";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://giswap.vercel.app";

const CONDITION_COLOR: Record<string, string> = {
  New: "bg-blue-950 text-blue-300 border-blue-800",
  "Like New": "bg-purple-950 text-purple-300 border-purple-800",
  Good: "bg-amber-950 text-amber-400 border-amber-800",
  Worn: "bg-zinc-800 text-zinc-400 border-zinc-700",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const listing = await prisma.listing.findUnique({
    where: { id },
    select: {
      title: true,
      brand: true,
      size: true,
      condition: true,
      price: true,
      description: true,
      images: true,
    },
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
            image: true,
            paypalHandle: true,
            venmoHandle: true,
            createdAt: true,
            _count: { select: { listings: { where: { isSold: false } } } },
          },
        },
      },
    }),
    auth(),
  ]);

  if (!listing) notFound();

  const condClass = CONDITION_COLOR[listing.condition] ?? CONDITION_COLOR.Worn;
  const isOwnListing = session?.user?.id === listing.userId;
  const price = listing.price.toString();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 pb-28 lg:pb-12">
      <Link
        href="/listings"
        className="text-blue-400 hover:text-blue-300 text-sm mb-6 sm:mb-8 inline-flex items-center gap-1 transition"
      >
        ← Back to listings
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_min(420px,42%)] gap-8 lg:gap-12 mt-4 sm:mt-6">
        {/* Gallery + description */}
        <div className="min-w-0">
          <ImageGallery images={listing.images ?? []} title={listing.title} />

          {listing.description && (
            <div className="bg-[#111] border border-[#1e2a4a] rounded-xl sm:rounded-2xl p-4 sm:p-5 mt-6 lg:mt-8">
              <p className="text-gray-400 text-sm font-medium mb-2">Description</p>
              <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">
                {listing.description}
              </p>
            </div>
          )}
        </div>

        {/* Sticky purchase sidebar */}
        {isOwnListing ? (
          <div className="flex flex-col lg:sticky lg:top-20 lg:self-start">
            <div className="belt-gradient h-0.5 w-16 rounded-full mb-4 sm:mb-6 opacity-60" />
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-2">
              {listing.title}
            </h1>
            <div className="flex items-baseline gap-3 mb-6 flex-wrap">
              <span className="text-4xl sm:text-5xl font-black text-amber-400 tabular-nums">
                ${price}
              </span>
              <span
                className={`px-3 py-1 text-xs font-medium rounded-full border ${condClass}`}
              >
                {listing.condition}
              </span>
            </div>
            <Link
              href={`/listings/${listing.id}/edit`}
              className="text-center py-3 bg-[#111] border border-[#1e2a4a] hover:border-blue-600 text-gray-300 hover:text-blue-300 rounded-2xl font-medium text-sm transition"
            >
              Edit Listing
            </Link>
          </div>
        ) : (
          <ListingDetailSidebar
            title={listing.title}
            price={price}
            condition={listing.condition}
            conditionClass={condClass}
            isSold={listing.isSold}
            showReport={!!session?.user?.id}
            brand={listing.brand}
            size={listing.size}
            color={listing.color}
            weight={listing.weight}
            seller={{
              id: listing.user.id,
              name: listing.user.name,
              image: listing.user.image,
              paypalHandle: listing.user.paypalHandle,
              venmoHandle: listing.user.venmoHandle,
              createdAt: listing.user.createdAt.toISOString(),
              _count: listing.user._count,
            }}
            sellerId={listing.userId}
            listingId={listing.id}
          />
        )}
      </div>
    </div>
  );
}
