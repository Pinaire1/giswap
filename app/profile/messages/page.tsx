import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import PageHeader from "@/components/ui/PageHeader";
import EmptyState from "@/components/ui/EmptyState";

export const dynamic = "force-dynamic";

export default async function MessagesPage() {
  const session = await auth();

  if (!session?.user?.id) redirect("/login");

  const userId = session.user.id;

  const threads = await prisma.messageThread.findMany({
    where: { OR: [{ buyerId: userId }, { sellerId: userId }] },
    include: {
      listing: { select: { id: true, title: true, images: true } },
      buyer:   { select: { id: true, name: true, image: true } },
      seller:  { select: { id: true, name: true, image: true } },
      messages: { orderBy: { createdAt: "desc" as const }, take: 1 },
    },
    orderBy: { createdAt: "desc" as const },
  });

  type Thread = (typeof threads)[number];

  return (
    <div className="page-container-narrow">
      <PageHeader title="Messages" />

      {threads.length === 0 ? (
        <EmptyState
          icon="💬"
          title="No messages yet"
          description="Browse listings and message a seller to get started."
          action={{ href: "/listings", label: "Browse Gis" }}
        />
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
                  className="flex items-center gap-4 p-4 rounded-2xl card card-hover min-h-[72px]"
                >
                  {other.image ? (
                    <Image
                      src={other.image}
                      alt={other.name ?? "User"}
                      width={44}
                      height={44}
                      className="rounded-full ring-1 ring-blue-900 flex-shrink-0"
                    />
                  ) : (
                    <div className="w-11 h-11 rounded-full bg-blue-950 border border-blue-800 flex items-center justify-center text-sm text-blue-400 flex-shrink-0">
                      {other.name?.[0] ?? "?"}
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <span className="font-semibold text-white text-sm truncate">
                        {other.name ?? "Unknown"}
                      </span>
                      {lastMsg && (
                        <span className="text-xs text-gray-600 ml-2 flex-shrink-0">
                          {formatDistanceToNow(new Date(lastMsg.createdAt), { addSuffix: true })}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-blue-400/70 truncate mt-0.5">{thread.listing.title}</p>
                    {lastMsg && (
                      <p className="text-xs text-gray-600 truncate mt-0.5">{lastMsg.content}</p>
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
