import { requireAdmin } from "@/lib/admin";
import Link from "next/link";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();

  return (
    <div className="min-h-screen">
      <div className="bg-[#0d0d0d] border-b border-[#1e2a4a] px-6 py-3 flex items-center gap-6">
        <span className="text-xs font-bold text-red-500 uppercase tracking-widest border border-red-900 px-2 py-0.5 rounded">
          Admin
        </span>
        <nav className="flex gap-4 text-sm">
          <Link href="/admin" className="text-gray-400 hover:text-white transition">Overview</Link>
          <Link href="/admin/users" className="text-gray-400 hover:text-white transition">Users</Link>
          <Link href="/admin/listings" className="text-gray-400 hover:text-white transition">Listings</Link>
          <Link href="/admin/reports" className="text-gray-400 hover:text-white transition">Reports</Link>
        </nav>
      </div>
      {children}
    </div>
  );
}
