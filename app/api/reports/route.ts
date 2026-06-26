import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { isAdmin } from "@/lib/admin";
import { rateLimitResponse } from "@/lib/rate-limit";

const VALID_REASONS = [
  "Counterfeit / fake gi",
  "Misleading description",
  "Wrong photos",
  "Spam or duplicate listing",
  "Offensive content",
  "Other",
];

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const limited = rateLimitResponse(`reports:${session.user.id}`, 10, 60_000);
  if (limited) return limited;

  const { listingId, reason, details } = await req.json();

  if (!listingId || !reason) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  if (!VALID_REASONS.includes(reason)) {
    return NextResponse.json({ error: "Invalid reason" }, { status: 400 });
  }

  const listing = await prisma.listing.findUnique({
    where: { id: listingId },
    select: { id: true },
  });
  if (!listing) {
    return NextResponse.json({ error: "Listing not found" }, { status: 404 });
  }

  const existing = await prisma.report.findFirst({
    where: { listingId, reporterId: session.user.id },
  });

  if (existing) {
    return NextResponse.json(
      { error: "You've already reported this listing" },
      { status: 409 }
    );
  }

  const report = await prisma.report.create({
    data: {
      listingId,
      reporterId: session.user.id,
      reason,
      details: details ? String(details).trim().slice(0, 2000) : null,
    },
  });

  return NextResponse.json({ success: true, report });
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isAdmin(session.user.email)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const reports = await prisma.report.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      reporter: { select: { id: true, name: true, email: true } },
      listing: { select: { id: true, title: true, brand: true, userId: true } },
    },
  });

  return NextResponse.json({ reports });
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isAdmin(session.user.email)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { reportId, status } = await req.json();

  if (!["pending", "reviewed", "dismissed"].includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const report = await prisma.report.update({
    where: { id: reportId },
    data: { status },
  });

  return NextResponse.json({ success: true, report });
}
