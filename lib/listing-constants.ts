export const LISTING_SIZES = ["A0", "A1", "A2", "A3", "A4", "A5", "A6"] as const;
export const LISTING_CONDITIONS = ["New", "Like New", "Good", "Worn"] as const;
export const LISTING_BRANDS = [
  "Shoyoroll",
  "Tatami",
  "Kingz",
  "Scramble",
  "Hyperfly",
  "Fuji",
  "Venum",
  "Sanabul",
  "Flow",
  "Gameness",
] as const;

export const LISTINGS_PAGE_SIZE = 24;

export type ListingSize = (typeof LISTING_SIZES)[number];
export type ListingCondition = (typeof LISTING_CONDITIONS)[number];
export type ListingBrand = (typeof LISTING_BRANDS)[number];
