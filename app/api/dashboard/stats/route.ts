import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

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

  return NextResponse.json({
    activeListings: activeCount,
    soldCount: soldListings.length,
    totalEarnings,
  });
}
