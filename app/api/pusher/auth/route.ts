import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher";
import { parseThreadChannel } from "@/lib/pusher-channels";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  const formData = await req.formData();
  const socketId = String(formData.get("socket_id") ?? "");
  const channelName = String(formData.get("channel_name") ?? "");

  if (!socketId || !channelName) {
    return new NextResponse("Bad Request", { status: 400 });
  }

  const threadId = parseThreadChannel(channelName);
  if (!threadId) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  const thread = await prisma.messageThread.findUnique({
    where: { id: threadId },
    select: { buyerId: true, sellerId: true },
  });

  if (!thread) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  const userId = session.user.id;
  if (thread.buyerId !== userId && thread.sellerId !== userId) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  const authResponse = pusherServer.authorizeChannel(socketId, channelName);
  return NextResponse.json(authResponse);
}
