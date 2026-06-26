import { prisma } from "@/lib/prisma";
import ListingsGrid from "@/components/ListingsGrid";
import { listingWithUserInclude, serializeListingPrice } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function ListingsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(0, parseInt(pageParam ?? "0", 10) || 0);
  const PAGE_SIZE = 24;

  const [listings, total] = await Promise.all([
    prisma.listing.findMany({
      where: { isSold: false },
      orderBy: { createdAt: "desc" },
      take: PAGE_SIZE,
      skip: page * PAGE_SIZE,
      include: listingWithUserInclude,
    }),
    prisma.listing.count({ where: { isSold: false } }),
  ]);

  const serialized = listings.map(serializeListingPrice);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-12">
        <div className="belt-gradient h-0.5 w-24 rounded-full mb-6 opacity-70" />
        <h1 className="text-5xl sm:text-6xl font-black text-white tracking-tighter leading-none mb-3">
          ON THE MAT
        </h1>
        <p className="text-blue-400 text-xl font-medium">
          {total} gi{total !== 1 ? "s" : ""} available
        </p>
      </div>

      <ListingsGrid listings={serialized} page={page} totalPages={totalPages} />
    </div>
  );
}
