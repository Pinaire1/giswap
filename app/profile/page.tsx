import { auth } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

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
      listings: true,
    },
  });

  if (!user) {
    return <div>User not found.</div>;
  }

  return (
    <main className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          {user.name}
        </h1>

        <p className="text-gray-500">
          {user.email}
        </p>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">
          My Listings ({user.listings.length})
        </h2>

        <div className="space-y-4">
          {user.listings.map((listing) => (
            <div
              key={listing.id}
              className="border rounded-lg p-4"
            >
              <h3 className="font-semibold">
                {listing.title}
              </h3>

              <p>${listing.price.toString()}</p>

              <p>{listing.condition}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}