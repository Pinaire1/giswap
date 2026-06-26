import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { validateListingCreate } from "@/lib/listing-validation";
import { rateLimitResponse } from "@/lib/rate-limit";

export async function GET() {
  try {
    const listings = await prisma.listing.findMany({
      where: { isSold: false },
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { id: true, name: true, image: true } },
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

    const limited = rateLimitResponse(`listings:${session.user.id}`, 10, 60_000);
    if (limited) return limited;

    const body = await request.json();
    const validated = validateListingCreate(body);

    if ("error" in validated) {
      return NextResponse.json({ error: validated.error }, { status: 400 });
    }

    const listing = await prisma.listing.create({
      data: {
        ...validated.data,
        userId: session.user.id,
      },
    });

    return NextResponse.json({ success: true, listing });
  } catch (error) {
    console.error("Create listing error:", error);
    return NextResponse.json({ error: "Failed to create listing" }, { status: 500 });
  }
}
