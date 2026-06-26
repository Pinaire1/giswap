import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { VALID_SIZES, VALID_CONDITIONS } from "@/lib/constants";
import { parseStringArray } from "@/lib/types";

export async function GET() {
  try {
    const listings = await prisma.listing.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { id: true, name: true, email: true, image: true } },
      },
    });
    return NextResponse.json(listings);
  } catch (error) {
    console.error("Failed to fetch listings:", error);
    return NextResponse.json([], { status: 500 });
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
    const images = parseStringArray(body.images, 5);

    if (!brand) return NextResponse.json({ error: "Brand is required" }, { status: 400 });
    if (!VALID_SIZES.includes(size)) return NextResponse.json({ error: "Invalid size" }, { status: 400 });
    if (!VALID_CONDITIONS.includes(condition)) return NextResponse.json({ error: "Invalid condition" }, { status: 400 });
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
