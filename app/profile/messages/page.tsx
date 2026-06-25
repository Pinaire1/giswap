import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { formatDistanceToNow } from "date-fns";

export default async function MessagesPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/api/auth/signin");
  }

  const userId = session.user.id;

  const threads = await prisma.messageThread.findMany({
    where: { OR: [{ buyerId: userId }, { sellerId: userId }] },
    include: {
      listing: { select: { id: true, title: true, images: true } },
      buyer: { select: { id: true, name: true, image: true } },
      seller: { select: { id: true, name: true, image: true } },
      messages: {
        orderBy: { createdAt: "desc" as const },
        take: 1,
      },
    },
    orderBy: { createdAt: "desc" as const },
  });

  type Thread = (typeof threads)[number];

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-white mb-6">Messages</h1>

      {threads.length === 0 ? (
        <div className="text-zinc-500 text-center py-20">
          No messages yet. Browse listings and message a seller to get started.
        </div>
      ) : (
        <ul className="space-y-2">
          {threads.map((thread: Thread) => {
            const isBuyer = thread.buyerId === userId;
            const other = isBuyer ? thread.seller : thread.buyer;
            const lastMsg = thread.messages[0];

            return (
              <li key={thread.id}>
                <Link
                  href={`/profile/messages/${thread.id}`}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-zinc-900 hover:bg-zinc-800 transition"
                >
                  {other.image ? (
                    <Image
                      src={other.image}
                      alt={other.name ?? "User"}
                      width={44}
                      height={44}
                      className="rounded-full flex-shrink-0"
                    />
                  ) : (
                    <div className="w-11 h-11 rounded-full bg-zinc-700 flex items-center justify-center text-sm text-zinc-300 flex-shrink-0">
                      {other.name?.[0] ?? "?"}
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <span className="font-medium text-white text-sm truncate">
                        {other.name ?? "Unknown"}
                      </span>
                      {lastMsg && (
                        <span className="text-xs text-zinc-500 ml-2 flex-shrink-0">
                          {formatDistanceToNow(new Date(lastMsg.createdAt), {
                            addSuffix: true,
                          })}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-400 truncate mt-0.5">
                      {thread.listing.title}
                    </p>
                    {lastMsg && (
                      <p className="text-xs text-zinc-500 truncate mt-0.5">
                        {lastMsg.content}
                      </p>
                    )}
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
