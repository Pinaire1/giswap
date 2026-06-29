"use client";

import { useState } from "react";
import Image from "next/image";

type User = {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  isBanned: boolean;
  createdAt: Date | string;
  _count: { listings: number; sentMessages: number };
};

export default function AdminUsersClient({ users: initial }: { users: User[] }) {
  const [users, setUsers] = useState(initial);
  const [loading, setLoading] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const filtered = users.filter(
    (u) =>
      !search ||
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const toggleBan = async (userId: string, banned: boolean) => {
    setLoading(userId);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isBanned: !banned }),
      });
      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, isBanned: !banned } : u))
        );
      }
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="belt-gradient h-0.5 w-16 rounded-full mb-6 opacity-70" />
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-4xl font-black text-white">Users</h1>
        <span className="text-gray-500 text-sm">{users.length} total</span>
      </div>
      <p className="text-gray-500 text-sm mb-8">Manage accounts and access.</p>

      <input
        type="text"
        placeholder="Search by name or email…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full mb-6 bg-[#111] border border-[#1e2a4a] rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-700"
      />

      <div className="bg-[#111] border border-[#1e2a4a] rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#1e2a4a] text-gray-500 text-xs uppercase">
              <th className="text-left px-5 py-3">User</th>
              <th className="text-left px-5 py-3">Listings</th>
              <th className="text-left px-5 py-3">Messages</th>
              <th className="text-left px-5 py-3">Joined</th>
              <th className="text-left px-5 py-3">Status</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u.id} className="border-b border-[#1a1a1a] last:border-0 hover:bg-[#0d0d0d] transition">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    {u.image ? (
                      <Image src={u.image} alt="" width={28} height={28} className="rounded-full" />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-blue-950 flex items-center justify-center text-blue-400 text-xs font-bold">
                        {(u.name ?? u.email ?? "?")[0].toUpperCase()}
                      </div>
                    )}
                    <div>
                      <p className="text-white font-medium leading-none">{u.name ?? "—"}</p>
                      <p className="text-gray-500 text-xs mt-0.5">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3 text-gray-400">{u._count.listings}</td>
                <td className="px-5 py-3 text-gray-400">{u._count.sentMessages}</td>
                <td className="px-5 py-3 text-gray-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                <td className="px-5 py-3">
                  {u.isBanned ? (
                    <span className="text-xs font-medium text-red-400 bg-red-950 border border-red-900 px-2 py-0.5 rounded-full">
                      Banned
                    </span>
                  ) : (
                    <span className="text-xs font-medium text-emerald-400 bg-emerald-950 border border-emerald-900 px-2 py-0.5 rounded-full">
                      Active
                    </span>
                  )}
                </td>
                <td className="px-5 py-3 text-right">
                  <button
                    onClick={() => toggleBan(u.id, u.isBanned)}
                    disabled={loading === u.id}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition disabled:opacity-50 ${
                      u.isBanned
                        ? "bg-emerald-950 border border-emerald-900 text-emerald-400 hover:bg-emerald-900/50"
                        : "bg-red-950 border border-red-900 text-red-400 hover:bg-red-900/50"
                    }`}
                  >
                    {u.isBanned ? "Unban" : "Ban"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="text-gray-600 text-center py-12">No users found.</p>
        )}
      </div>
    </div>
  );
}
