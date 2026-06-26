import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { isAdmin } from "@/lib/admin";
import { validateListingPatch } from "@/lib/listing-validation";
import { rateLimitResponse } from "@/lib/rate-limit";

async function canModifyListing(userId: string, userEmail: string | null | undefined, listingId: string) {
  if (isAdmin(userEmail)) return true;
  const listing = await prisma.listing.findUnique({
    where: { id: listingId },
    select: { userId: true },
  });
  return listing?.userId === userId;
}

// PATCH /api/listings/[id] — edit fields or mark as sold
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const limited = rateLimitResponse(`listings-patch:${session.user.id}`, 20, 60_000);
  if (limited) return limited;

  const { id } = await params;

  if (!(await canModifyListing(session.user.id, session.user.email, id))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const existing = await prisma.listing.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await req.json();
  const validated = validateListingPatch(body, existing);

  if ("error" in validated) {
    return NextResponse.json({ error: validated.error }, { status: 400 });
  }

  if (Object.keys(validated.data).length === 0) {
    return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
  }

  const listing = await prisma.listing.update({ where: { id }, data: validated.data });
  return NextResponse.json({ success: true, listing });
}

// DELETE /api/listings/[id]
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  if (!(await canModifyListing(session.user.id, session.user.email, id))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.listing.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
