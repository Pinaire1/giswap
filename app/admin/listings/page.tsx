import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import AdminListingsClient from "./client";

export const dynamic = "force-dynamic";

export default async function AdminListingsPage() {
  await requireAdmin();

  const listings = await prisma.listing.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      brand: true,
      size: true,
      condition: true,
      price: true,
      isSold: true,
      isHidden: true,
      createdAt: true,
      user: { select: { id: true, name: true, email: true } },
      _count: { select: { reports: true } },
    },
  });

  return <AdminListingsClient listings={listings} />;
}
