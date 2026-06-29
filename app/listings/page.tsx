import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import ListingsGrid from "@/components/ListingsGrid";
import FilterBar from "@/components/FilterBar";
import { Suspense } from "react";
import {
  parseListingSearchParams,
  searchListings,
  type ListingSearchParams,
} from "@/lib/listings-search";

export const dynamic = "force-dynamic";

export default async function ListingsPage({
  searchParams,
}: {
  searchParams: Promise<ListingSearchParams>;
}) {
  const raw = await searchParams;
  const search = parseListingSearchParams(raw);

  const session = await auth();

  const [{ listings, total, totalPages }, saved] = await Promise.all([
    searchListings(search),
    session?.user?.id
      ? prisma.savedListing.findMany({
          where: { userId: session.user.id },
          select: { listingId: true },
        })
      : Promise.resolve([]),
  ]);

  const savedIds = new Set(saved.map((s) => s.listingId));

  const serialized = listings.map((l) => ({
    ...l,
    price: l.price.toString(),
    createdAt: l.createdAt.toISOString(),
    updatedAt: l.updatedAt.toISOString(),
    isSaved: savedIds.has(l.id),
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="mb-8">
        <div className="belt-gradient h-0.5 w-24 rounded-full mb-6 opacity-70" />
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tighter leading-none mb-3">
          ON THE MAT
        </h1>
      </div>

      <Suspense>
        <FilterBar total={total} />
      </Suspense>

      <ListingsGrid
        listings={serialized}
        page={search.page}
        totalPages={totalPages}
        hasFilters={search.hasFilters}
      />
    </div>
  );
}
