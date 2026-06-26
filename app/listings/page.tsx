import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import ListingsGrid from "@/components/ListingsGrid";
import FilterBar from "@/components/FilterBar";
import { Suspense } from "react";
import type { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

export default async function ListingsPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    q?: string;
    size?: string;
    condition?: string;
    brand?: string;
    minPrice?: string;
    maxPrice?: string;
  }>;
}) {
  const {
    page: pageParam,
    q,
    size,
    condition,
    brand,
    minPrice,
    maxPrice,
  } = await searchParams;

  const page = Math.max(0, parseInt(pageParam ?? "0", 10) || 0);
  const PAGE_SIZE = 24;

  const session = await auth();

  const where: Prisma.ListingWhereInput = { isSold: false };

  if (q) {
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { brand: { contains: q, mode: "insensitive" } },
    ];
  }
  if (size) where.size = size;
  if (condition) where.condition = condition;
  if (brand) where.brand = { contains: brand, mode: "insensitive" };
  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) (where.price as Prisma.DecimalFilter).gte = parseFloat(minPrice);
    if (maxPrice) (where.price as Prisma.DecimalFilter).lte = parseFloat(maxPrice);
  }

  const [listings, total, saved] = await Promise.all([
    prisma.listing.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: PAGE_SIZE,
      skip: page * PAGE_SIZE,
      include: {
        user: { select: { id: true, name: true, image: true } },
      },
    }),
    prisma.listing.count({ where }),
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

  const totalPages = Math.ceil(total / PAGE_SIZE);

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

      <ListingsGrid listings={serialized} page={page} totalPages={totalPages} />
    </div>
  );
}
