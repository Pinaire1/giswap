import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import ChatClient from "./ui";
import { redirect, notFound } from "next/navigation";
import { threadChatInclude } from "@/lib/types";

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
    include: threadChatInclude,
  });

  if (!thread) notFound();

  const userId = session.user.id;
  if (thread.buyerId !== userId && thread.sellerId !== userId) notFound();

  return <ChatClient thread={thread} currentUserId={userId} />;
}
