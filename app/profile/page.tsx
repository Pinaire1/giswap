import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
import Image from "next/image";
import Link from "next/link";
import ProfileListings from "@/components/ProfileListings";
import PaymentSettings from "@/components/PaymentSettings";

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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Profile Header */}
      <div className="bg-[#111] border border-[#1e2a4a] rounded-3xl p-5 sm:p-8 mb-10">
        <div className="belt-gradient h-0.5 w-16 rounded-full mb-6 opacity-60" />
        <div className="flex items-center gap-5">
          {user.image ? (
            <Image
              src={user.image}
              alt={user.name ? `${user.name}'s profile photo` : "Your profile photo"}
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

        <ProfileListings
          listings={user.listings.map((l) => ({
            id: l.id,
            title: l.title,
            brand: l.brand,
            size: l.size,
            condition: l.condition,
            price: l.price.toString(),
            isSold: l.isSold,
            images: l.images,
          }))}
        />
      </section>

      {/* Payment Methods */}
      <PaymentSettings
        initialPaypal={user.paypalHandle ?? null}
        initialVenmo={user.venmoHandle ?? null}
      />

      {/* Inbox */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-black text-white">Inbox</h2>
          <Link href="/profile/messages" className="text-purple-400 hover:text-purple-300 text-sm transition">
            View all messages →
          </Link>
        </div>

        <div className="bg-[#111] border border-[#1e2a4a] rounded-3xl p-8 text-center">
          <p className="text-gray-400 text-sm">Go to your inbox to read and reply to messages.</p>
        </div>
      </section>
    </div>
  );
}
