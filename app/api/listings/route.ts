import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    console.log("Session in API:", session); // ← Very important for debugging

    if (!session?.user?.id) {
      console.error("No user ID in session:", session);
      return NextResponse.json({ 
        error: "Unauthorized - No user session found" 
      }, { status: 401 });
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
        images: [],
        userId: session.user.id,
      },
    });

    console.log("✅ Listing created:", listing.id);
    return NextResponse.json({ success: true, listing });

  } catch (error: any) {
    console.error("Full error:", error);
    return NextResponse.json({ 
      error: error.message || "Failed to create listing" 
    }, { status: 500 });
  }
}