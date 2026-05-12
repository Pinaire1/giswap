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
    <nav className="bg-white border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <Shirt className="w-8 h-8 text-orange-600" />
            <span>GiSwap</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/listings" className="hover:text-orange-600 transition-colors">
              Browse Gis
            </Link>
            <Link href="/listings/new" className="hover:text-orange-600 transition-colors">
              Sell Your Gi
            </Link>
            <Link href="/dashboard" className="hover:text-orange-600 transition-colors">
              Dashboard
            </Link>
          </div>

          {/* Auth Section */}
          <div className="hidden md:flex items-center gap-4">
            {status === "loading" && <div>Loading...</div>}

            {session ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  {session.user?.image ? (
                    <Image
                      src={session.user.image}
                      alt="Profile"
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gray-300 rounded-full" />
                  )}
                  <span className="text-sm font-medium">{session.user?.name}</span>
                </div>

                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={() => signIn("google")}
                  className="px-4 py-2 text-sm font-medium hover:bg-gray-100 rounded-md transition"
                >
                  Log in
                </button>
                <button
                  onClick={() => signIn("google")}
                  className="px-5 py-2 text-sm font-medium bg-orange-600 text-white rounded-md hover:bg-orange-700 transition"
                >
                  Sign up
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-2xl"
          >
            {isOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 border-t flex flex-col gap-4">
            <Link href="/listings" className="py-2">Browse Gis</Link>
            <Link href="/listings/new" className="py-2">Sell Your Gi</Link>
            <Link href="/dashboard" className="py-2">Dashboard</Link>
            
            {session ? (
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="py-2 text-red-600 text-left"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={() => signIn("google")}
                className="py-2 text-left"
              >
                Sign in
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}