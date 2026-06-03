import { auth } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Image from "next/image";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
    include: {
      listings: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!user) {
    return <div>User not found.</div>;
  }

  return (
    <main className="max-w-6xl mx-auto p-6">
      {/* Profile Header */}
      <div className="bg-zinc-900 rounded-xl p-6 mb-8 border border-zinc-800">
        <div className="flex items-center gap-4">
          {user.image && (
            <Image
              src={user.image}
              alt={user.name ?? "Profile"}
              width={80}
              height={80}
              className="rounded-full"
            />
          )}

          <div>
            <h1 className="text-3xl font-bold text-white">
              {user.name}
            </h1>

            <p className="text-zinc-400">
              {user.email}
            </p>

            <p className="text-sm text-zinc-500 mt-1">
              Listings: {user.listings.length}
            </p>
          </div>
        </div>
      </div>

      {/* My Listings */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4 text-white">
          My Listings
        </h2>

        {user.listings.length === 0 ? (
          <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
            <p className="text-zinc-400">
              You havent listed any gis yet.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {user.listings.map((listing) => (
              <div
                key={listing.id}
                className="bg-zinc-900 border border-zinc-800 rounded-xl p-4"
              >
                <h3 className="font-semibold text-lg text-white">
                  {listing.title}
                </h3>

                <p className="text-zinc-400">
                  {listing.brand}
                </p>

                <p className="text-emerald-400 font-bold mt-2">
                  ${listing.price.toString()}
                </p>

                <p className="text-sm text-zinc-500 mt-2">
                  Condition: {listing.condition}
                </p>

                <div className="mt-4">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      listing.isSold
                        ? "bg-red-500/20 text-red-400"
                        : "bg-emerald-500/20 text-emerald-400"
                    }`}
                  >
                    {listing.isSold ? "Sold" : "Active"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Inbox Placeholder */}
      <section>
        <h2 className="text-2xl font-bold mb-4 text-white">
          Inbox
        </h2>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <p className="text-zinc-400">
            Messaging is coming soon.
          </p>

          <p className="text-sm text-zinc-500 mt-2">
            Buyers will be able to contact you about your listings here.
          </p>
        </div>
      </section>
    </main>
  );
}