import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "https://giswap.vercel.app";

  const listings = await prisma.listing.findMany({
    where: { isSold: false, isHidden: false },
    select: { id: true, updatedAt: true },
    orderBy: { createdAt: "desc" },
    take: 1000,
  });

  const listingUrls: MetadataRoute.Sitemap = listings.map((l) => ({
    url: `${base}/listings/${l.id}`,
    lastModified: l.updatedAt,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [
    { url: base, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${base}/listings`, lastModified: new Date(), changeFrequency: "hourly", priority: 0.9 },
    ...listingUrls,
  ];
}
