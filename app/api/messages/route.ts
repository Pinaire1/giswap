import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { pusherServer } from "@/lib/pusher";

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

  const { listingId, sellerId, content } = await req.json();

  if (!listingId || !sellerId || !content?.trim()) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const buyerId = session.user.id;

  if (buyerId === sellerId) {
    return NextResponse.json(
      { error: "Cannot message yourself" },
      { status: 400 }
    );
  }

  const thread = await prisma.messageThread.upsert({
    where: { listingId_buyerId_sellerId: { listingId, buyerId, sellerId } },
    create: { listingId, buyerId, sellerId },
    update: {},
  });

  const message = await prisma.message.create({
    data: { content, fromId: buyerId, threadId: thread.id },
    include: { from: { select: { id: true, name: true, image: true } } },
  });

  await pusherServer.trigger(`thread-${thread.id}`, "new-message", message);

  return NextResponse.json({ success: true, thread, message });
}
