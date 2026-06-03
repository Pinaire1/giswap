"use client";

import Link from "next/link";
import { useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { Shirt, LogOut } from "lucide-react";
import Image from "next/image";

export default function Navbar() {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-zinc-950 border-b border-zinc-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-2xl text-white"
          >
            <Shirt className="w-8 h-8 text-emerald-500" />
            <span>GiSwap</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8 text-white">
            <Link href="/listings" className="hover:text-emerald-400 transition-colors">
              Browse Gis
            </Link>

            <Link href="/listings/new" className="hover:text-emerald-400 transition-colors">
              Sell Your Gi
            </Link>

            {session && (
              <Link href="/profile" className="hover:text-emerald-400 transition-colors">
                Profile
              </Link>
            )}
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-4">
            {status === "loading" ? (
              <div className="text-white text-sm">Loading...</div>
            ) : session ? (
              <div className="flex items-center gap-4">
                {session.user?.image && (
                  <Image
                    src={session.user.image}
                    alt="Profile"
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                )}

                <span className="text-white text-sm font-medium">
                  {session.user?.name}
                </span>

                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-red-950 rounded-md transition"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => signIn("google")}
                  className="px-4 py-2 text-sm text-white hover:bg-zinc-800 rounded-md transition"
                >
                  Log in
                </button>

                <button
                  onClick={() => signIn("google")}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-medium transition"
                >
                  Sign up
                </button>
              </div>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white text-3xl focus:outline-none"
          >
            {isOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-8 border-t border-zinc-800 bg-zinc-950">
            <div className="flex flex-col gap-6 text-lg text-white">

              <Link
                href="/listings"
                onClick={() => setIsOpen(false)}
                className="hover:text-emerald-400"
              >
                Browse Gis
              </Link>

              <Link
                href="/listings/new"
                onClick={() => setIsOpen(false)}
                className="hover:text-emerald-400"
              >
                Sell Your Gi
              </Link>

              {session && (
                <Link
                  href="/profile"
                  onClick={() => setIsOpen(false)}
                  className="hover:text-emerald-400"
                >
                  Profile
                </Link>
              )}

              <div className="pt-6 border-t border-zinc-800">
                {status === "loading" ? (
                  <div className="text-white text-sm">Loading...</div>
                ) : session ? (
                  <button
                    onClick={() => {
                      signOut({ callbackUrl: "/" });
                      setIsOpen(false);
                    }}
                    className="flex items-center gap-3 text-red-400 hover:text-red-500"
                  >
                    <LogOut size={22} />
                    Logout
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      signIn("google");
                      setIsOpen(false);
                    }}
                    className="w-full text-left py-3 hover:text-emerald-400"
                  >
                    Sign in with Google
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}