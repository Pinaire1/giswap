"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Shirt } from "lucide-react";

export default function Navbar() {
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

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-medium hover:bg-gray-100 rounded-md transition"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="px-5 py-2 text-sm font-medium bg-orange-600 text-white rounded-md hover:bg-orange-700 transition"
            >
              Sign up
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 border-t flex flex-col gap-4">
            <Link href="/listings" className="py-2">Browse Gis</Link>
            <Link href="/listings/new" className="py-2">Sell Your Gi</Link>
            <Link href="/dashboard" className="py-2">Dashboard</Link>
            <div className="pt-4 border-t flex flex-col gap-3">
              <Link href="/login" className="py-2">Log in</Link>
              <Link href="/register" className="py-2 bg-orange-600 text-white text-center rounded-md">
                Sign up
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}