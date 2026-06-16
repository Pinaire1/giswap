import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import ChatClient from "./ui";

export default async function ThreadPage({
  params,
}: {
  params: Promise<{ threadId: string }>;
}) {
  const { threadId } = await params;

  const session = await auth();

  if (!session?.user?.id) {
    return (
      <div className="p-10 text-center">
        Login required
      </div>
    );
  }

  const thread =
    await prisma.messageThread.findUnique({
      where: {
        id: threadId,
      },
      include: {
        listing: true,
        buyer: true,
        seller: true,
        messages: {
          include: {
            from: true,
          },
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

  if (!thread) {
    return (
      <div className="p-10 text-center">
        Thread not found
      </div>
    );
  }

  return (
    <ChatClient
      thread={thread}
      currentUserId={session.user.id}
    />
  );
}