import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  LISTING_BRANDS,
  LISTING_CONDITIONS,
  LISTING_SIZES,
  LISTINGS_PAGE_SIZE,
} from "@/lib/listing-constants";

/** Search backend. Swap to "fts" when PostgreSQL full-text search is enabled. */
export type ListingSearchBackend = "ilike" | "fts";

export const LISTING_SEARCH_BACKEND: ListingSearchBackend = "ilike";

export const LISTING_SEARCH_PARAM_KEYS = [
  "q",
  "brand",
  "size",
  "condition",
  "minPrice",
  "maxPrice",
  "page",
] as const;

export type ListingSearchParamKey = (typeof LISTING_SEARCH_PARAM_KEYS)[number];

export type ListingSearchParams = Partial<
  Record<Exclude<ListingSearchParamKey, "page">, string>
> & {
  page?: string;
};

export type ParsedListingSearch = {
  q: string;
  brand: string;
  size: string;
  condition: string;
  minPrice: number | null;
  maxPrice: number | null;
  page: number;
  pageSize: number;
  hasFilters: boolean;
};

function parsePrice(value: string | undefined): number | null {
  if (!value?.trim()) return null;
  const n = parseFloat(value);
  return Number.isFinite(n) && n >= 0 ? n : null;
}

export function parseListingSearchParams(
  raw: Record<string, string | undefined>,
): ParsedListingSearch {
  const q = (raw.q ?? "").trim().slice(0, 200);
  const brand = (raw.brand ?? "").trim().slice(0, 100);
  const size = (raw.size ?? "").trim();
  const condition = (raw.condition ?? "").trim();
  const minPrice = parsePrice(raw.minPrice);
  const maxPrice = parsePrice(raw.maxPrice);
  const page = Math.max(0, parseInt(raw.page ?? "0", 10) || 0);

  const validSize = LISTING_SIZES.includes(size as (typeof LISTING_SIZES)[number])
    ? size
    : "";
  const validCondition = LISTING_CONDITIONS.includes(
    condition as (typeof LISTING_CONDITIONS)[number],
  )
    ? condition
    : "";

  const hasFilters = Boolean(
    q || brand || validSize || validCondition || minPrice !== null || maxPrice !== null,
  );

  return {
    q,
    brand,
    size: validSize,
    condition: validCondition,
    minPrice,
    maxPrice,
    page,
    pageSize: LISTINGS_PAGE_SIZE,
    hasFilters,
  };
}

/**
 * ILIKE text match for PostgreSQL (Prisma `contains` + `mode: "insensitive"`).
 * When migrating to FTS, replace this with tsvector / plainto_tsquery logic
 * behind the same `ListingSearchBackend` switch.
 */
function ilikeContains(value: string): Prisma.StringFilter {
  return { contains: value, mode: "insensitive" };
}

function buildIlikeWhere(search: ParsedListingSearch): Prisma.ListingWhereInput {
  const where: Prisma.ListingWhereInput = { isSold: false };

  if (search.q) {
    where.title = ilikeContains(search.q);
  }

  if (search.brand) {
    where.brand = ilikeContains(search.brand);
  }

  if (search.size) {
    where.size = search.size;
  }

  if (search.condition) {
    where.condition = search.condition;
  }

  if (search.minPrice !== null || search.maxPrice !== null) {
    where.price = {};
    if (search.minPrice !== null) {
      (where.price as Prisma.DecimalFilter).gte = search.minPrice;
    }
    if (search.maxPrice !== null) {
      (where.price as Prisma.DecimalFilter).lte = search.maxPrice;
    }
  }

  return where;
}

/** Placeholder for future PostgreSQL full-text search implementation. */
function buildFtsWhere(search: ParsedListingSearch): Prisma.ListingWhereInput {
  void search;
  throw new Error(
    "PostgreSQL full-text search is not enabled. Set LISTING_SEARCH_BACKEND to 'ilike' or implement FTS.",
  );
}

export function buildListingWhere(search: ParsedListingSearch): Prisma.ListingWhereInput {
  switch (LISTING_SEARCH_BACKEND) {
    case "fts":
      return buildFtsWhere(search);
    case "ilike":
    default:
      return buildIlikeWhere(search);
  }
}

export function listingSearchToQueryString(
  search: Partial<ListingSearchParams>,
  base?: URLSearchParams,
): string {
  const params = new URLSearchParams(base?.toString() ?? "");

  for (const key of LISTING_SEARCH_PARAM_KEYS) {
    const value = search[key]?.trim();
    if (value) params.set(key, value);
    else params.delete(key);
  }

  return params.toString();
}

export function applyListingSearchUpdates(
  current: URLSearchParams,
  updates: Partial<Record<ListingSearchParamKey, string>>,
  options?: { resetPage?: boolean },
): URLSearchParams {
  const params = new URLSearchParams(current.toString());

  if (options?.resetPage !== false) {
    params.delete("page");
  }

  for (const [key, value] of Object.entries(updates) as [ListingSearchParamKey, string][]) {
    if (value?.trim()) params.set(key, value.trim());
    else params.delete(key);
  }

  return params;
}

export function listingsBrowsePath(params: URLSearchParams): string {
  const qs = params.toString();
  return `/listings${qs ? `?${qs}` : ""}`;
}

export async function searchListings(search: ParsedListingSearch) {
  const where = buildListingWhere(search);

  const [listings, total] = await Promise.all([
    prisma.listing.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: search.pageSize,
      skip: search.page * search.pageSize,
      include: {
        user: { select: { id: true, name: true, email: true, image: true } },
      },
    }),
    prisma.listing.count({ where }),
  ]);

  const totalPages = Math.ceil(total / search.pageSize);

  return { listings, total, totalPages };
}

export { LISTING_BRANDS, LISTING_CONDITIONS, LISTING_SIZES };
