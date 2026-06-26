import type { Prisma } from "@prisma/client";

export const VALID_SIZES = ["A0", "A1", "A2", "A3", "A4", "A5", "A6"] as const;
export const VALID_CONDITIONS = ["New", "Like New", "Good", "Worn"] as const;

const ALLOWED_IMAGE_HOSTS = ["utfs.io", "uploadthing.com", "lh3.googleusercontent.com"];

function isAllowedImageUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" && ALLOWED_IMAGE_HOSTS.includes(parsed.hostname);
  } catch {
    return false;
  }
}

export function validateListingCreate(body: Record<string, unknown>) {
  const brand = String(body.brand ?? "").trim().slice(0, 100);
  const size = String(body.size ?? "").trim();
  const condition = String(body.condition ?? "").trim();
  const price = parseFloat(String(body.price));
  const description = String(body.description ?? "").trim().slice(0, 2000);
  const images: string[] = Array.isArray(body.images)
    ? body.images
        .slice(0, 5)
        .filter((u): u is string => typeof u === "string" && isAllowedImageUrl(u))
    : [];

  if (!brand) return { error: "Brand is required" as const };
  if (!VALID_SIZES.includes(size as (typeof VALID_SIZES)[number])) {
    return { error: "Invalid size" as const };
  }
  if (!VALID_CONDITIONS.includes(condition as (typeof VALID_CONDITIONS)[number])) {
    return { error: "Invalid condition" as const };
  }
  if (!isFinite(price) || price < 1 || price > 10000) {
    return { error: "Price must be between $1 and $10,000" as const };
  }

  return {
    data: {
      title: `${brand} ${size}`,
      brand,
      size,
      condition,
      price,
      description,
      images,
    },
  };
}

export function validateListingPatch(
  body: Record<string, unknown>,
  existing: { brand: string; size: string; condition: string; price: unknown; description: string | null; images: string[] }
) {
  const data: Prisma.ListingUpdateInput = {};

  const brand = "brand" in body ? String(body.brand).trim().slice(0, 100) : existing.brand;
  const size = "size" in body ? String(body.size).trim() : existing.size;
  const condition = "condition" in body ? String(body.condition).trim() : existing.condition;

  if ("brand" in body && !brand) return { error: "Brand is required" as const };
  if ("size" in body && !VALID_SIZES.includes(size as (typeof VALID_SIZES)[number])) {
    return { error: "Invalid size" as const };
  }
  if ("condition" in body && !VALID_CONDITIONS.includes(condition as (typeof VALID_CONDITIONS)[number])) {
    return { error: "Invalid condition" as const };
  }

  if ("brand" in body) data.brand = brand;
  if ("size" in body) data.size = size;
  if ("condition" in body) data.condition = condition;

  if ("brand" in body || "size" in body) {
    data.title = `${brand} ${size}`;
  } else if ("title" in body) {
    data.title = String(body.title).trim().slice(0, 200);
  }

  if ("price" in body) {
    const price = parseFloat(String(body.price));
    if (!isFinite(price) || price < 1 || price > 10000) {
      return { error: "Price must be between $1 and $10,000" as const };
    }
    data.price = price;
  }

  if ("description" in body) {
    data.description = String(body.description).trim().slice(0, 2000);
  }

  if ("images" in body) {
    if (!Array.isArray(body.images)) return { error: "Invalid images" as const };
    const images = body.images
      .slice(0, 5)
      .filter((u): u is string => typeof u === "string" && isAllowedImageUrl(u));
    data.images = images;
  }

  if ("isSold" in body) {
    data.isSold = Boolean(body.isSold);
  }

  return { data };
}
