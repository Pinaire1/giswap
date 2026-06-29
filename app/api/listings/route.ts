import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { LISTING_CONDITIONS, LISTING_SIZES } from "@/lib/listing-constants";
import {
  parseListingSearchParams,
  searchListings,
} from "@/lib/listings-search";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const raw = Object.fromEntries(searchParams.entries());
    const search = parseListingSearchParams(raw);
    const { listings, total, totalPages } = await searchListings(search);

    const serialized = listings.map((l) => ({
      ...l,
      price: l.price.toString(),
      createdAt: l.createdAt.toISOString(),
      updatedAt: l.updatedAt.toISOString(),
    }));

    return NextResponse.json({
      listings: serialized,
      total,
      page: search.page,
      pageSize: search.pageSize,
      totalPages,
    });
  } catch (error) {
    console.error("Failed to fetch listings:", error);
    return NextResponse.json({ error: "Failed to fetch listings" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    const brand = String(body.brand ?? "").trim().slice(0, 100);
    const size = String(body.size ?? "").trim();
    const condition = String(body.condition ?? "").trim();
    const price = parseFloat(body.price);
    const description = String(body.description ?? "").trim().slice(0, 2000);
    const images: string[] = Array.isArray(body.images)
      ? body.images.slice(0, 5).filter((u: unknown) => typeof u === "string")
      : [];

    if (!brand) return NextResponse.json({ error: "Brand is required" }, { status: 400 });
    if (!LISTING_SIZES.includes(size as (typeof LISTING_SIZES)[number])) {
      return NextResponse.json({ error: "Invalid size" }, { status: 400 });
    }
    if (!LISTING_CONDITIONS.includes(condition as (typeof LISTING_CONDITIONS)[number])) {
      return NextResponse.json({ error: "Invalid condition" }, { status: 400 });
    }
    if (!isFinite(price) || price < 1 || price > 10000) {
      return NextResponse.json({ error: "Price must be between $1 and $10,000" }, { status: 400 });
    }

    const listing = await prisma.listing.create({
      data: {
        title: `${brand} ${size}`,
        brand,
        size,
        condition,
        price,
        description,
        images,
        userId: session.user.id,
      },
    });

    return NextResponse.json({ success: true, listing });
  } catch (error) {
    console.error("Create listing error:", error);
    return NextResponse.json({ error: "Failed to create listing" }, { status: 500 });
  }
}
