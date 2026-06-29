import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import AdminUsersClient from "./client";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  await requireAdmin();

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      isBanned: true,
      createdAt: true,
      _count: { select: { listings: true, sentMessages: true } },
    },
  });

  return <AdminUsersClient users={users} />;
}
