import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import type { DashboardStats } from "@/lib/types";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  const [activeCount, soldListings] = await Promise.all([
    prisma.listing.count({ where: { userId, isSold: false } }),
    prisma.listing.findMany({
      where: { userId, isSold: true },
      select: { price: true },
    }),
  ]);

  const totalEarnings = soldListings.reduce(
    (sum, l) => sum + Number(l.price),
    0
  );

  const stats: DashboardStats = {
    activeListings: activeCount,
    soldCount: soldListings.length,
    totalEarnings,
  };

  return NextResponse.json(stats);
}
