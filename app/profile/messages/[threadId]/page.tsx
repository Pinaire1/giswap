import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import ChatClient from "./ui";
import { redirect, notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ThreadPage({
  params,
}: {
  params: Promise<{ threadId: string }>;
}) {
  const { threadId } = await params;
  const session = await auth();

  if (!session?.user?.id) redirect("/login");

  const thread = await prisma.messageThread.findUnique({
    where: { id: threadId },
    include: {
      listing: { select: { id: true, title: true, images: true } },
      buyer: { select: { id: true, name: true, image: true } },
      seller: { select: { id: true, name: true, image: true } },
      messages: {
        include: { from: true },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!thread) notFound();

  const userId = session.user.id;
  if (thread.buyerId !== userId && thread.sellerId !== userId) notFound();

  return <ChatClient thread={thread} currentUserId={userId} />;
}
