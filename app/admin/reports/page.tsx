import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/admin";
import { redirect } from "next/navigation";
import AdminReportsClient from "./client";

export const dynamic = "force-dynamic";

export default async function AdminReportsPage() {
  const session = await auth();

  if (!session?.user?.email || !isAdmin(session.user.email)) {
    redirect("/");
  }

  const reports = await prisma.report.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      reporter: { select: { id: true, name: true, email: true } },
      listing: { select: { id: true, title: true, brand: true, userId: true } },
    },
  });

  return <AdminReportsClient reports={reports} />;
}
