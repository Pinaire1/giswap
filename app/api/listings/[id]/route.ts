import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { auth } from "@/auth";

async function ownsListing(userId: string, listingId: string) {
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

  if (!(await ownsListing(session.user.id, id))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();

  const data: Prisma.ListingUpdateInput = {
    ...("title" in body && { title: String(body.title) }),
    ...("brand" in body && { brand: String(body.brand) }),
    ...("size" in body && { size: String(body.size) }),
    ...("condition" in body && { condition: String(body.condition) }),
    ...("price" in body && { price: parseFloat(String(body.price)) }),
    ...("description" in body && { description: String(body.description) }),
    ...("images" in body && { images: body.images as string[] }),
    ...("isSold" in body && { isSold: Boolean(body.isSold) }),
  };

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

  if (!(await ownsListing(session.user.id, id))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.listing.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
