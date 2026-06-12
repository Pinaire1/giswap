import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export default async function MessagesPage() {
  const session = await auth();

  if (!session?.user?.id) {
    return (
      <div className="p-10 text-center text-white">
        Please log in to view messages.
      </div>
    );
  }

  const messages = await prisma.message.findMany({
    where: {
      toId: session.user.id,
      read: false,
    },
    include: {
      from: true,
      listing: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-6">
        Messages
      </h1>

      {messages.length === 0 ? (
        <p className="text-zinc-400">
          No messages yet.
        </p>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl"
            >
              <div className="flex justify-between items-center">
                <p className="font-semibold text-white">
                  {msg.from.name || "User"}
                </p>

                <p className="text-xs text-zinc-500">
                  {new Date(msg.createdAt).toLocaleString()}
                </p>
              </div>

              <p className="text-zinc-300 mt-2">
                {msg.content}
              </p>

              {msg.listing && (
                <p className="text-emerald-400 text-sm mt-3">
                  Re: {msg.listing.title}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}