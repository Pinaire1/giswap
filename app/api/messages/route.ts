import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { pusherServer } from "@/lib/pusher";
import { threadChannelName } from "@/lib/pusher-channels";
import { rateLimitResponse } from "@/lib/rate-limit";

// GET /api/messages — fetch all threads for the current user
export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  const threads = await prisma.messageThread.findMany({
    where: {
      OR: [{ buyerId: userId }, { sellerId: userId }],
    },
    include: {
      listing: { select: { id: true, title: true, images: true } },
      buyer: { select: { id: true, name: true, image: true } },
      seller: { select: { id: true, name: true, image: true } },
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ threads });
}

// POST /api/messages — send a message (creates thread if needed)
export async function POST(req: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const limited = rateLimitResponse(`messages:${session.user.id}`, 30, 60_000);
  if (limited) return limited;

  const body = await req.json();
  const content = String(body.content ?? "").trim().slice(0, 2000);
  const threadId = body.threadId ? String(body.threadId).trim() : "";
  const listingId = body.listingId ? String(body.listingId).trim() : "";

  if (!content) {
    return NextResponse.json({ error: "Missing content" }, { status: 400 });
  }

  const userId = session.user.id;
  let thread;

  if (threadId) {
    thread = await prisma.messageThread.findUnique({ where: { id: threadId } });
    if (!thread) {
      return NextResponse.json({ error: "Thread not found" }, { status: 404 });
    }
    if (thread.buyerId !== userId && thread.sellerId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  } else if (listingId) {
    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
      select: { userId: true, isSold: true },
    });

    if (!listing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }
    if (listing.isSold) {
      return NextResponse.json({ error: "Listing is sold" }, { status: 400 });
    }

    const sellerId = listing.userId;
    if (userId === sellerId) {
      return NextResponse.json(
        { error: "Cannot message yourself" },
        { status: 400 }
      );
    }

    thread = await prisma.messageThread.upsert({
      where: {
        listingId_buyerId_sellerId: { listingId, buyerId: userId, sellerId },
      },
      create: { listingId, buyerId: userId, sellerId },
      update: {},
    });
  } else {
    return NextResponse.json(
      { error: "Missing listingId or threadId" },
      { status: 400 }
    );
  }

  const message = await prisma.message.create({
    data: { content, fromId: userId, threadId: thread.id },
    include: { from: { select: { id: true, name: true, image: true } } },
  });

  await pusherServer.trigger(threadChannelName(thread.id), "new-message", message);

  return NextResponse.json({ success: true, thread, message });
}
