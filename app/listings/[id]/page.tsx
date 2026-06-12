import { prisma } from "@/lib/prisma";
import MessageSeller from "@/components/messageseller";

export default async function ListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const listing = await prisma.listing.findUnique({
    where: { id },
    include: {
      user: true,
    },
  });

  if (!listing) {
    return <div>Listing not found</div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-8">
      <h1 className="text-4xl font-bold">
        {listing.title}
      </h1>

      <p className="text-emerald-400 text-2xl">
        ${listing.price.toString()}
      </p>

      <p className="mt-4">
        {listing.description}
      </p>

      <MessageSeller
        sellerId={listing.userId}
        listingId={listing.id}
        sellerName={listing.user.name ?? "Seller"}
      />
    </div>
  );
}