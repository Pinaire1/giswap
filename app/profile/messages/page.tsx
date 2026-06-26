import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
import { formatDistanceToNow } from "date-fns";

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
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="belt-gradient h-0.5 w-16 rounded-full mb-6 opacity-60" />
      <h1 className="text-3xl font-black text-white mb-8">Messages</h1>

      {threads.length === 0 ? (
        <div className="bg-[#111] border border-[#1e2a4a] rounded-3xl p-12 text-center">
          <p className="text-5xl mb-4 opacity-20" aria-hidden="true">💬</p>
          <p className="text-gray-500">No messages yet.</p>
          <p className="text-gray-400 text-sm mt-2">Browse listings and message a seller to get started.</p>
          <Link href="/listings" className="mt-4 inline-block text-blue-400 hover:underline text-sm">
            Browse Gis →
          </Link>
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
                  className="flex items-center gap-4 p-4 rounded-2xl bg-[#111] border border-[#1e2a4a] hover:border-blue-700/50 hover:bg-[#141420] transition"
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
                        <span className="text-xs text-gray-400 ml-2 flex-shrink-0">
                          {formatDistanceToNow(new Date(lastMsg.createdAt), { addSuffix: true })}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-blue-400/70 truncate mt-0.5">{thread.listing.title}</p>
                    {lastMsg && (
                      <p className="text-xs text-gray-400 truncate mt-0.5">{lastMsg.content}</p>
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
