import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { REPORT_REASONS, REPORT_STATUSES } from "@/lib/constants";
import { reportWithRelationsInclude, type ReportStatus } from "@/lib/types";

function isReportStatus(value: unknown): value is ReportStatus {
  return typeof value === "string" && (REPORT_STATUSES as readonly string[]).includes(value);
}

function isReportReason(value: unknown): value is (typeof REPORT_REASONS)[number] {
  return typeof value === "string" && (REPORT_REASONS as readonly string[]).includes(value);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { listingId, reason, details } = await req.json();

  if (!listingId || !reason || !isReportReason(reason)) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
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
      details: details?.trim() || null,
    },
  });

  return NextResponse.json({ success: true, report });
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? "").split(",").map((e) => e.trim());
  if (!ADMIN_EMAILS.includes(session.user.email)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const reports = await prisma.report.findMany({
    orderBy: { createdAt: "desc" },
    include: reportWithRelationsInclude,
  });

  return NextResponse.json({ reports });
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? "").split(",").map((e) => e.trim());
  if (!ADMIN_EMAILS.includes(session.user.email)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { reportId, status } = await req.json();

  if (!isReportStatus(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const report = await prisma.report.update({
    where: { id: reportId },
    data: { status },
  });

  return NextResponse.json({ success: true, report });
}
