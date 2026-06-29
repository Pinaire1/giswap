import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { auth } from "@/auth";
import { HANDLING_TIMES, CARRIERS } from "@/lib/shipping";
import type { Carrier } from "@prisma/client";

async function canModifyListing(userId: string, isAdmin: boolean, listingId: string) {
  if (isAdmin) return true;
  const listing = await prisma.listing.findUnique({
    where: { id: listingId },
    select: { userId: true },
  });
  return listing?.userId === userId;
}

// PATCH /api/listings/[id]
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

  // Core fields
  if ("title"       in body) data.title       = String(body.title);
  if ("brand"       in body) data.brand       = String(body.brand);
  if ("size"        in body) data.size        = String(body.size);
  if ("condition"   in body) data.condition   = String(body.condition);
  if ("price"       in body) data.price       = parseFloat(String(body.price));
  if ("description" in body) data.description = String(body.description);
  if ("images"      in body) data.images      = body.images as string[];
  if ("isSold"      in body) data.isSold      = Boolean(body.isSold);
  if ("isHidden"    in body && isAdmin) data.isHidden = Boolean(body.isHidden);

  // Shipping fields
  if ("pickupAvailable"  in body) data.pickupAvailable  = Boolean(body.pickupAvailable);
  if ("shippingAvailable" in body) {
    const shippingAvailable = Boolean(body.shippingAvailable);
    data.shippingAvailable = shippingAvailable;

    if (shippingAvailable) {
      // Validate and assign sub-fields when enabling shipping
      const rawCost = body.shippingCost;
      if (rawCost !== null && rawCost !== undefined && rawCost !== "") {
        const cost = parseFloat(rawCost);
        if (!isFinite(cost) || cost < 0) {
          return NextResponse.json({ error: "Shipping cost cannot be negative" }, { status: 400 });
        }
        data.shippingCost = cost;
      } else {
        data.shippingCost = null;
      }

      if ("shipsFromCity"  in body) data.shipsFromCity  = String(body.shipsFromCity ?? "").trim().slice(0, 100) || null;
      if ("shipsFromState" in body) data.shipsFromState = String(body.shipsFromState ?? "").trim() || null;

      if ("handlingTime" in body) {
        const ht = String(body.handlingTime ?? "").trim();
        if (ht && !HANDLING_TIMES.includes(ht as typeof HANDLING_TIMES[number])) {
          return NextResponse.json({ error: "Invalid handling time" }, { status: 400 });
        }
        data.handlingTime = ht || null;
      }

      if ("preferredCarrier" in body) {
        const c = String(body.preferredCarrier ?? "").trim();
        if (c && !CARRIERS.includes(c as Carrier)) {
          return NextResponse.json({ error: "Invalid carrier" }, { status: 400 });
        }
        data.preferredCarrier = (c as Carrier) || null;
      }
    } else {
      // Shipping disabled — clear sub-fields
      data.shippingCost    = null;
      data.shipsFromCity   = null;
      data.shipsFromState  = null;
      data.handlingTime    = null;
      data.preferredCarrier = null;
    }
  } else {
    // shippingAvailable not in body — still update individual shipping sub-fields if present
    if ("shippingCost"     in body) {
      const cost = parseFloat(body.shippingCost);
      data.shippingCost = isFinite(cost) && cost >= 0 ? cost : null;
    }
    if ("shipsFromCity"    in body) data.shipsFromCity  = String(body.shipsFromCity ?? "").trim() || null;
    if ("shipsFromState"   in body) data.shipsFromState = String(body.shipsFromState ?? "").trim() || null;
    if ("handlingTime"     in body) data.handlingTime   = String(body.handlingTime ?? "").trim() || null;
    if ("preferredCarrier" in body) {
      const c = String(body.preferredCarrier ?? "").trim();
      data.preferredCarrier = CARRIERS.includes(c as Carrier) ? (c as Carrier) : null;
    }
  }

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
