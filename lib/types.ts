import { Prisma } from "@prisma/client";
import { GI_SIZES, GI_CONDITIONS, REPORT_STATUSES } from "@/lib/constants";

export type GiSize = (typeof GI_SIZES)[number];
export type GiCondition = (typeof GI_CONDITIONS)[number]["label"];
export type ReportStatus = (typeof REPORT_STATUSES)[number];

export const listingWithUserInclude = {
  user: { select: { id: true, name: true, email: true } },
} as const satisfies Prisma.ListingInclude;

export type ListingWithUser = Prisma.ListingGetPayload<{
  include: typeof listingWithUserInclude;
}>;

export type ListingGridItem = Omit<ListingWithUser, "price"> & { price: string };

export type ProfileListingItem = Pick<
  ListingWithUser,
  "id" | "title" | "brand" | "size" | "condition" | "images" | "isSold"
> & { price: string };

export type EditListingData = {
  id: string;
  brand: string;
  size: string;
  condition: string;
  price: string;
  description: string;
  images: string[];
};

export const threadChatInclude = {
  listing: { select: { id: true, title: true, images: true } },
  buyer: { select: { id: true, name: true, image: true } },
  seller: { select: { id: true, name: true, image: true } },
  messages: {
    include: { from: true },
    orderBy: { createdAt: "asc" as const },
  },
} as const satisfies Prisma.MessageThreadInclude;

export type ChatThread = Prisma.MessageThreadGetPayload<{
  include: typeof threadChatInclude;
}>;

export type ChatMessage = ChatThread["messages"][number];

/** Optimistic message shown before the server confirms send. */
export type PendingChatMessage = {
  id: string;
  content: string;
  fromId: string;
  createdAt: string | Date;
  from?: { id: string; name?: string | null; image?: string | null };
};

export type DisplayChatMessage = ChatMessage | PendingChatMessage;

export const threadListInclude = {
  listing: { select: { id: true, title: true, images: true } },
  buyer: { select: { id: true, name: true, image: true } },
  seller: { select: { id: true, name: true, image: true } },
  messages: { orderBy: { createdAt: "desc" as const }, take: 1 },
} as const satisfies Prisma.MessageThreadInclude;

export type ThreadListItem = Prisma.MessageThreadGetPayload<{
  include: typeof threadListInclude;
}>;

export const reportWithRelationsInclude = {
  reporter: { select: { id: true, name: true, email: true } },
  listing: { select: { id: true, title: true, brand: true, userId: true } },
} as const satisfies Prisma.ReportInclude;

export type ReportWithRelations = Prisma.ReportGetPayload<{
  include: typeof reportWithRelationsInclude;
}>;

export type DashboardStats = {
  activeListings: number;
  soldCount: number;
  totalEarnings: number;
};

export type SendMessageResponse = {
  success?: boolean;
  thread?: { id: string };
  message?: ChatMessage;
  error?: string;
};

export function parseStringArray(value: unknown, maxLength?: number): string[] {
  if (!Array.isArray(value)) return [];
  const filtered = value.filter((item): item is string => typeof item === "string");
  return maxLength !== undefined ? filtered.slice(0, maxLength) : filtered;
}

export function serializeListingPrice<T extends { price: { toString(): string } }>(
  listing: T
): Omit<T, "price"> & { price: string } {
  return { ...listing, price: listing.price.toString() };
}
