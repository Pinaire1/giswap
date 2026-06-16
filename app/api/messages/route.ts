import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { pusherServer } from "@/lib/pusher";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { sellerId, listingId, content } =
      await request.json();

    if (!sellerId || !content) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const message = await prisma.message.create({
      data: {
        content,
        fromId: session.user.id,
        toId: sellerId,
        listingId,
      },
    });

    // 🔥 REALTIME PUSH
    await pusherServer.trigger(
      `listing-${listingId}`,
      "new-message",
      message
    );

    return NextResponse.json({
      success: true,
      message,
    });
  } catch (error) {
    console.error("Message error:", error);

    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}