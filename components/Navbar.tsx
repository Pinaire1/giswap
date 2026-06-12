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
    <nav className="bg-zinc-950 border-b border-zinc-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-2xl text-white">
            <Shirt className="w-8 h-8 text-emerald-500" />
            <span>GiSwap</span>
          </Link>

          {/* Desktop Navigation */}
          <div className=" md:flex items-center gap-8 text-white">
            <Link href="/listings" className="hover:text-emerald-400 transition-colors">Browse Gis</Link>
            <Link href="/listings/new" className="hover:text-emerald-400 transition-colors">Sell Your Gi</Link>
            <Link href="/dashboard" className="hover:text-emerald-400 transition-colors">Dashboard</Link>
            <Link href="/profile/messages">
  Messages
</Link>
          </div>

          {/* Desktop Auth + Profile */}
          <div className=" md:flex items-center gap-4">
            {status === "loading" ? (
              <div className="text-white">Loading...</div>
            ) : session ? (
              <div className="flex items-center gap-4">
                <Link href="/profile" className="flex items-center gap-3 hover:text-emerald-400 transition">
                  {session.user?.image ? (
                    <Image src={session.user.image} alt="Profile" width={32} height={32} className="rounded-full" />
                  ) : (
                    <User className="w-8 h-8" />
                  )}
                  <span className="text-sm font-medium">{session.user?.name?.split(" ")[0]}</span>
                </Link>

                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-red-950 rounded-md transition"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={() => signIn("google")}
                  className="px-5 py-2 text-white hover:bg-zinc-800 rounded-md transition"
                >
                  Log in
                </button>
                <button
                  onClick={() => signIn("google")}
                  className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium transition"
                >
                  Sign up
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="md text-white text-3xl focus:outline-none"
          >
            {isOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md py-8 border-t border-zinc-800 bg-zinc-950">
            <div className="flex flex-col gap-6 text-lg text-white">
              <Link href="/listings" onClick={() => setIsOpen(false)}>Browse Gis</Link>
              <Link href="/listings/new" onClick={() => setIsOpen(false)}>Sell Your Gi</Link>
              <Link href="/dashboard" onClick={() => setIsOpen(false)}>Dashboard</Link>

              {session ? (
                <>
                  <Link href="/profile" onClick={() => setIsOpen(false)} className="flex items-center gap-3">
                    <User size={24} /> Profile
                  </Link>
                  <button
                    onClick={() => {
                      signOut({ callbackUrl: "/" });
                      setIsOpen(false);
                    }}
                    className="flex items-center gap-3 text-red-400"
                  >
                    <LogOut size={24} /> Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={() => signIn("google")}
                  className="text-left py-3 hover:text-emerald-400"
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