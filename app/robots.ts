import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "https://giswap.vercel.app";
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/admin/", "/profile/"] },
    sitemap: `${base}/sitemap.xml`,
  };
}
