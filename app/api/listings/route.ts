import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
  try {
    const listings = await prisma.listing.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: { name: true, image: true }
        }
      }
    });

    return NextResponse.json(listings);
  } catch (error) {
    console.error("Failed to fetch listings:", error);
    return NextResponse.json([], { status: 500 });
  }
}

// Keep your existing POST function below
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    const listing = await prisma.listing.create({
      data: {
        title: body.title || `${body.brand} ${body.size}`,
        brand: body.brand,
        size: body.size,
        condition: body.condition,
        price: parseFloat(body.price),
        description: body.description || "",
        images: body.images || [],
        userId: session.user.id,
      },
    });

    return NextResponse.json({ success: true, listing });
  } catch (error) {
    console.error("Create listing error:", error);
    return NextResponse.json({ error: "Failed to create listing" }, { status: 500 });
  }
}