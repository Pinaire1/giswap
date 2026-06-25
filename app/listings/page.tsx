import { prisma } from "@/lib/prisma";
import ListingsGrid from "@/components/ListingsGrid";

export default async function ListingsPage() {
  const listings = await prisma.listing.findMany({
    where: { isSold: false },
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  const serialized = listings.map(l => ({
    ...l,
    price: l.price.toString(),
  }));

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-6xl font-black text-white mb-4 tracking-tighter">
        ON THE MAT
      </h1>
      <p className="text-emerald-400 text-2xl mb-12">Find your next roll</p>

      <ListingsGrid listings={serialized} />
    </div>
  );
}
