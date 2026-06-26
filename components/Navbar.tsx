"use client";

import Link from "next/link";
import { useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { Shirt, LogOut, User } from "lucide-react";
import Image from "next/image";

export default function Navbar() {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-[#0d0d0d] border-b border-[#1e2a4a] sticky top-0 z-50">
      {/* Belt stripe accent at top */}
      <div className="belt-gradient h-0.5 w-full opacity-70" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-2xl text-white">
            <Shirt className="w-8 h-8 text-blue-500" />
            <span className="belt-text font-black tracking-tight">GiSwap</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8 text-gray-300">
            <Link href="/listings" className="nav-link hover:text-white transition-colors">Browse Gis</Link>
            <Link href="/listings/new" className="nav-link hover:text-white transition-colors">Sell Your Gi</Link>
            <Link href="/dashboard" className="nav-link hover:text-white transition-colors">Dashboard</Link>
            <Link href="/profile/messages" className="nav-link hover:text-white transition-colors">Messages</Link>
          </div>

          {/* Desktop Auth + Profile */}
          <div className="hidden md:flex items-center gap-4">
            {status === "loading" ? (
              <div className="text-gray-500 text-sm">Loading...</div>
            ) : session ? (
              <div className="flex items-center gap-4">
                <Link href="/profile" className="flex items-center gap-3 hover:text-blue-400 transition text-white">
                  {session.user?.image ? (
                    <Image
                      src={session.user.image}
                      alt={session.user.name ? `${session.user.name}'s profile photo` : "Your profile photo"}
                      width={32}
                      height={32}
                      className="rounded-full ring-2 ring-blue-700"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-blue-900 border border-blue-700 flex items-center justify-center">
                      <User className="w-4 h-4 text-blue-400" />
                    </div>
                  )}
                  <span className="text-sm font-medium">{session.user?.name?.split(" ")[0]}</span>
                </Link>

                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-red-950/50 rounded-lg transition"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={() => signIn("google")}
                  className="px-5 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition text-sm"
                >
                  Log in
                </button>
                <button
                  onClick={() => signIn("google")}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition text-sm"
                >
                  Sign up
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            className="md:hidden text-white text-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
          >
            {isOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div id="mobile-menu" className="md:hidden py-6 border-t border-[#1e2a4a]">
            <div className="flex flex-col gap-5 text-base text-gray-300">
              <Link href="/listings" onClick={() => setIsOpen(false)} className="hover:text-blue-400 transition">Browse Gis</Link>
              <Link href="/listings/new" onClick={() => setIsOpen(false)} className="hover:text-blue-400 transition">Sell Your Gi</Link>
              <Link href="/dashboard" onClick={() => setIsOpen(false)} className="hover:text-blue-400 transition">Dashboard</Link>
              <Link href="/profile/messages" onClick={() => setIsOpen(false)} className="hover:text-blue-400 transition">Messages</Link>

              {session ? (
                <>
                  <Link href="/profile" onClick={() => setIsOpen(false)} className="flex items-center gap-3 hover:text-blue-400 transition">
                    <User size={20} /> Profile
                  </Link>
                  <button
                    onClick={() => { signOut({ callbackUrl: "/" }); setIsOpen(false); }}
                    className="flex items-center gap-3 text-red-400 text-left"
                  >
                    <LogOut size={20} /> Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={() => signIn("google")}
                  className="text-left py-3 text-blue-400 hover:text-blue-300 transition font-medium"
                >
                  Sign in with Google
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
