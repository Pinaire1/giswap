import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

function sanitizeHandle(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  // Strip leading @ and whitespace, max 64 chars
  const cleaned = raw.trim().replace(/^@+/, "").slice(0, 64);
  return cleaned.length > 0 ? cleaned : null;
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  const paypalHandle = sanitizeHandle(body.paypalHandle);
  const venmoHandle = sanitizeHandle(body.venmoHandle);

  const user = await prisma.user.update({
    where: { id: session.user.id },
    data: { paypalHandle, venmoHandle },
    select: { paypalHandle: true, venmoHandle: true },
  });

  return NextResponse.json({ success: true, user });
}
