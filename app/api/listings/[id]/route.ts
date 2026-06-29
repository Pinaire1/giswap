import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { auth } from "@/auth";

async function canModifyListing(userId: string, isAdmin: boolean, listingId: string) {
  if (isAdmin) return true;
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

  const { id } = await params;
  const isAdmin = !!session.user.isAdmin;

  if (!(await canModifyListing(session.user.id, isAdmin, id))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();

  const data: Prisma.ListingUpdateInput = {};
  if ("title"       in body) data.title       = String(body.title);
  if ("brand"       in body) data.brand       = String(body.brand);
  if ("size"        in body) data.size        = String(body.size);
  if ("condition"   in body) data.condition   = String(body.condition);
  if ("price"       in body) data.price       = parseFloat(String(body.price));
  if ("description" in body) data.description = String(body.description);
  if ("images"      in body) data.images      = body.images as string[];
  if ("isSold"      in body) data.isSold      = Boolean(body.isSold);
  if ("isHidden"    in body && isAdmin) data.isHidden = Boolean(body.isHidden);

  const listing = await prisma.listing.update({ where: { id }, data });
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

  if (!(await canModifyListing(session.user.id, !!session.user.isAdmin, id))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.listing.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
