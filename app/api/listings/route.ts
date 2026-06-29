import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { HANDLING_TIMES, CARRIERS } from "@/lib/shipping";
import type { Carrier } from "@prisma/client";

const VALID_SIZES = ["A0", "A1", "A2", "A3", "A4", "A5", "A6"];
const VALID_CONDITIONS = ["New", "Like New", "Good", "Worn"];

export async function GET() {
  try {
    const listings = await prisma.listing.findMany({
      where: { isHidden: false },
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

    // Core fields
    const brand = String(body.brand ?? "").trim().slice(0, 100);
    const size = String(body.size ?? "").trim();
    const condition = String(body.condition ?? "").trim();
    const price = parseFloat(body.price);
    const description = String(body.description ?? "").trim().slice(0, 2000);
    const images: string[] = Array.isArray(body.images)
      ? body.images.slice(0, 5).filter((u: unknown) => typeof u === "string")
      : [];

    if (!brand) return NextResponse.json({ error: "Brand is required" }, { status: 400 });
    if (!VALID_SIZES.includes(size)) return NextResponse.json({ error: "Invalid size" }, { status: 400 });
    if (!VALID_CONDITIONS.includes(condition)) return NextResponse.json({ error: "Invalid condition" }, { status: 400 });
    if (!isFinite(price) || price < 1 || price > 10000) {
      return NextResponse.json({ error: "Price must be between $1 and $10,000" }, { status: 400 });
    }

    // Shipping fields
    const pickupAvailable = Boolean(body.pickupAvailable);
    const shippingAvailable = Boolean(body.shippingAvailable);

    let shippingCost: number | null = null;
    let shipsFromCity: string | null = null;
    let shipsFromState: string | null = null;
    let handlingTime: string | null = null;
    let preferredCarrier: Carrier | null = null;

    if (shippingAvailable) {
      const rawCost = body.shippingCost;
      if (rawCost !== null && rawCost !== undefined && rawCost !== "") {
        shippingCost = parseFloat(rawCost);
        if (!isFinite(shippingCost) || shippingCost < 0) {
          return NextResponse.json({ error: "Shipping cost cannot be negative" }, { status: 400 });
        }
      }

      shipsFromCity = String(body.shipsFromCity ?? "").trim().slice(0, 100);
      shipsFromState = String(body.shipsFromState ?? "").trim();
      handlingTime = String(body.handlingTime ?? "").trim();
      const carrier = String(body.preferredCarrier ?? "").trim();

      if (!shipsFromCity) return NextResponse.json({ error: "City is required when shipping is enabled" }, { status: 400 });
      if (!shipsFromState) return NextResponse.json({ error: "State is required when shipping is enabled" }, { status: 400 });
      if (!HANDLING_TIMES.includes(handlingTime as typeof HANDLING_TIMES[number])) {
        return NextResponse.json({ error: "Invalid handling time" }, { status: 400 });
      }
      if (!CARRIERS.includes(carrier as Carrier)) {
        return NextResponse.json({ error: "Invalid carrier" }, { status: 400 });
      }
      preferredCarrier = carrier as Carrier;
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
        pickupAvailable,
        shippingAvailable,
        shippingCost,
        shipsFromCity,
        shipsFromState,
        handlingTime,
        preferredCarrier,
      },
    });

    return NextResponse.json({ success: true, listing });
  } catch (error) {
    console.error("Create listing error:", error);
    return NextResponse.json({ error: "Failed to create listing" }, { status: 500 });
  }
}
