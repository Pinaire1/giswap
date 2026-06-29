import { auth } from "@/auth";
import { redirect } from "next/navigation";

export async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.isAdmin) redirect("/");
  return session;
}

export async function assertAdmin() {
  const session = await auth();
  return !!session?.user?.isAdmin;
}
