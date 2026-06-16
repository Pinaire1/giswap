import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { listingId, sellerId, content } = await req.json();

    if (!listingId || !sellerId || !content) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const buyerId = session.user.id;

    // 1. Create or get thread
    const thread = await prisma.messageThread.upsert({
      where: {
        listingId_buyerId_sellerId: {
          listingId,
          buyerId,
          sellerId,
        },
      },
      create: {
        listingId,
        buyerId,
        sellerId,
      },
      update: {},
    });

    // 2. Create message
    const message = await prisma.message.create({
      data: {
        content,
        fromId: buyerId,
        threadId: thread.id,
      },
    });

    return NextResponse.json({
      success: true,
      thread,
      message,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}