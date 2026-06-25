import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user?.email) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      listings: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!user) return <div className="p-10 text-gray-500">User not found.</div>;

  return (
    <main className="max-w-6xl mx-auto px-6 py-12">
      {/* Profile Header */}
      <div className="bg-[#111] border border-[#1e2a4a] rounded-3xl p-8 mb-10">
        <div className="belt-gradient h-0.5 w-16 rounded-full mb-6 opacity-60" />
        <div className="flex items-center gap-5">
          {user.image ? (
            <Image
              src={user.image}
              alt={user.name ?? "Profile"}
              width={80}
              height={80}
              className="rounded-full ring-2 ring-blue-700"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-blue-950 border border-blue-800 flex items-center justify-center text-3xl text-blue-400">
              {user.name?.[0] ?? "?"}
            </div>
          )}

          <div>
            <h1 className="text-3xl font-black text-white">{user.name}</h1>
            <p className="text-gray-500 text-sm">{user.email}</p>
            <p className="text-xs text-blue-400 mt-1">{user.listings.length} listing{user.listings.length !== 1 ? "s" : ""}</p>
          </div>
        </div>
      </div>

      {/* My Listings */}
      <section className="mb-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-black text-white">My Listings</h2>
          <Link href="/listings/new" className="text-blue-400 hover:text-blue-300 text-sm transition">
            + New Listing
          </Link>
        </div>

        {user.listings.length === 0 ? (
          <div className="bg-[#111] border border-[#1e2a4a] rounded-3xl p-10 text-center">
            <p className="text-7xl mb-4 opacity-30">🥋</p>
            <p className="text-gray-500">You haven&apos;t listed any gis yet.</p>
            <Link href="/listings/new" className="mt-4 inline-block text-blue-400 hover:underline text-sm">
              Post your first gi →
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {user.listings.map((listing) => (
              <div
                key={listing.id}
                className="bg-[#111] border border-[#1e2a4a] rounded-3xl overflow-hidden hover:border-blue-700/50 transition"
              >
                {listing.images?.length > 0 && (
                  <div className="h-44 relative">
                    <Image
                      src={listing.images[0]}
                      alt={listing.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="p-5">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-white">{listing.title}</h3>
                    <span className="text-amber-400 font-black">${listing.price.toString()}</span>
                  </div>

                  <p className="text-gray-500 text-xs mb-1">{listing.brand} · {listing.size}</p>
                  <p className="text-gray-600 text-xs mb-3">Condition: {listing.condition}</p>

                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                    listing.isSold
                      ? "bg-red-950 text-red-400 border border-red-900"
                      : "bg-blue-950 text-blue-400 border border-blue-900"
                  }`}>
                    {listing.isSold ? "Sold" : "Active"}
                  </span>

                  <div className="flex gap-2 mt-4">
                    <button className="flex-1 py-2 text-xs font-medium bg-[#0d0d0d] border border-[#1e2a4a] hover:border-blue-600 text-gray-400 hover:text-blue-300 rounded-xl transition">
                      Edit
                    </button>
                    <button className="flex-1 py-2 text-xs font-medium bg-amber-950/50 border border-amber-900/50 hover:bg-amber-900/30 text-amber-400 rounded-xl transition">
                      Mark Sold
                    </button>
                    <button className="flex-1 py-2 text-xs font-medium bg-red-950/40 border border-red-900/40 hover:bg-red-900/30 text-red-400 rounded-xl transition">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Inbox */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-black text-white">Inbox</h2>
          <Link href="/profile/messages" className="text-purple-400 hover:text-purple-300 text-sm transition">
            View all messages →
          </Link>
        </div>

        <div className="bg-[#111] border border-[#1e2a4a] rounded-3xl p-8 text-center">
          <p className="text-gray-600 text-sm">Go to your inbox to read and reply to messages.</p>
        </div>
      </section>
    </main>
  );
}
