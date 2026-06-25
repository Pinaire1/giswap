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
      <div className="mb-12">
        <div className="belt-gradient h-0.5 w-24 rounded-full mb-6 opacity-70" />
        <h1 className="text-6xl font-black text-white tracking-tighter leading-none mb-3">
          ON THE MAT
        </h1>
        <p className="text-blue-400 text-xl font-medium">Find your next roll</p>
      </div>

      <ListingsGrid listings={serialized} />
    </div>
  );
}
