import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  await requireAdmin();

  const [userCount, listingCount, messageCount, reportCount, pendingReports, soldCount, hiddenCount, bannedCount] =
    await Promise.all([
      prisma.user.count(),
      prisma.listing.count(),
      prisma.message.count(),
      prisma.report.count(),
      prisma.report.count({ where: { status: "pending" } }),
      prisma.listing.count({ where: { isSold: true } }),
      prisma.listing.count({ where: { isHidden: true } }),
      prisma.user.count({ where: { isBanned: true } }),
    ]);

  const recentUsers = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    select: { id: true, name: true, email: true, createdAt: true },
  });

  const stats = [
    { label: "Total Users", value: userCount, href: "/admin/users", accent: "blue" },
    { label: "Total Listings", value: listingCount, href: "/admin/listings", accent: "blue" },
    { label: "Active Listings", value: listingCount - soldCount - hiddenCount, href: "/admin/listings", accent: "green" },
    { label: "Messages Sent", value: messageCount, href: null, accent: "blue" },
    { label: "Pending Reports", value: pendingReports, href: "/admin/reports", accent: pendingReports > 0 ? "red" : "blue" },
    { label: "Banned Users", value: bannedCount, href: "/admin/users", accent: bannedCount > 0 ? "amber" : "blue" },
    { label: "Hidden Listings", value: hiddenCount, href: "/admin/listings", accent: "blue" },
    { label: "Total Reports", value: reportCount, href: "/admin/reports", accent: "blue" },
  ];

  const accentClasses: Record<string, string> = {
    blue: "text-blue-400",
    green: "text-emerald-400",
    red: "text-red-400",
    amber: "text-amber-400",
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="belt-gradient h-0.5 w-16 rounded-full mb-6 opacity-70" />
      <h1 className="text-4xl font-black text-white mb-2">Admin Overview</h1>
      <p className="text-gray-500 text-sm mb-10">Marketplace health at a glance.</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">
        {stats.map((s) => {
          const card = (
            <div className="bg-[#111] border border-[#1e2a4a] rounded-2xl p-5 hover:border-blue-900 transition">
              <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">{s.label}</p>
              <p className={`text-3xl font-black ${accentClasses[s.accent]}`}>{s.value}</p>
            </div>
          );
          return s.href ? (
            <Link key={s.label} href={s.href}>{card}</Link>
          ) : (
            <div key={s.label}>{card}</div>
          );
        })}
      </div>

      <h2 className="text-lg font-bold text-white mb-4">Recent Sign-ups</h2>
      <div className="bg-[#111] border border-[#1e2a4a] rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#1e2a4a] text-gray-500 text-xs uppercase">
              <th className="text-left px-5 py-3">Name</th>
              <th className="text-left px-5 py-3">Email</th>
              <th className="text-left px-5 py-3">Joined</th>
            </tr>
          </thead>
          <tbody>
            {recentUsers.map((u) => (
              <tr key={u.id} className="border-b border-[#1a1a1a] last:border-0 hover:bg-[#0d0d0d] transition">
                <td className="px-5 py-3 text-white font-medium">{u.name ?? "—"}</td>
                <td className="px-5 py-3 text-gray-400">{u.email}</td>
                <td className="px-5 py-3 text-gray-500">{new Date(u.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
