"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { Shirt, LogOut, User, ShieldCheck, Menu, X } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

const NAV_LINKS = [
  { href: "/listings", label: "Browse Gis" },
  { href: "/listings/new", label: "Sell Your Gi" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/profile/messages", label: "Messages" },
];

export default function Navbar() {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/listings"
      ? pathname === "/listings" || (pathname.startsWith("/listings/") && !pathname.startsWith("/listings/new"))
      : pathname.startsWith(href);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const linkClass = (href: string) =>
    `whitespace-nowrap text-sm lg:text-base transition-colors ${
      isActive(href)
        ? "text-white font-semibold"
        : "text-gray-400 hover:text-white"
    }`;

  const mobileLinkClass = (href: string) =>
    `py-3 transition-colors ${
      isActive(href) ? "text-blue-400 font-semibold" : "text-gray-300 hover:text-blue-400"
    }`;

  return (
    <nav className="bg-[#0d0d0d] border-b border-[#1e2a4a] sticky top-0 z-50">
      {/* Belt stripe accent at top */}
      <div className="belt-gradient h-0.5 w-full opacity-70" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-2xl text-white">
            <Shirt className="w-8 h-8 text-blue-500" />
            <span className="belt-text font-black tracking-tight">GiSwap</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4 lg:gap-8">
            {NAV_LINKS.map(({ href, label }) => (
              <Link key={href} href={href} className={linkClass(href)}>
                {label}
                {isActive(href) && (
                  <span className="block h-0.5 bg-blue-500 rounded-full mt-0.5" />
                )}
              </Link>
            ))}
          </div>

          {/* Desktop Auth + Profile */}
          <div className="hidden md:flex items-center gap-2 lg:gap-4">
            {status === "loading" ? (
              <LoadingSpinner label="Loading account" size="sm" />
            ) : session ? (
              <div className="flex items-center gap-4">
                <Link href="/profile" className="flex items-center gap-3 hover:text-blue-400 transition text-white">
                  {session.user?.image ? (
                    <Image
                      src={session.user.image}
                      alt="Profile"
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

                {session.user?.isAdmin && (
                  <Link
                    href="/admin/reports"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-amber-400 hover:bg-amber-950/50 rounded-lg transition"
                  >
                    <ShieldCheck size={16} />
                    Admin
                  </Link>
                )}

                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-red-950/50 rounded-lg transition min-h-[44px]"
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
                  className="btn-primary px-6 py-2 text-sm rounded-xl"
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
            className="md:hidden text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg w-11 h-11 flex items-center justify-center"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          id="mobile-menu"
          className={`md:hidden overflow-hidden transition-all duration-300 ease-out ${
            isOpen ? "max-h-[480px] opacity-100 border-t border-[#1e2a4a]" : "max-h-0 opacity-0"
          }`}
        >
          <div className="py-4">
              {NAV_LINKS.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setIsOpen(false)}
                  className={`${mobileLinkClass(href)} min-h-[44px] flex items-center`}
                >
                  {label}
                </Link>
              ))}

              {session ? (
                <>
                  <Link href="/profile" onClick={() => setIsOpen(false)} className="py-3 flex items-center gap-3 text-gray-300 hover:text-blue-400 transition">
                    <User size={20} /> Profile
                  </Link>
                  {session.user?.isAdmin && (
                    <Link href="/admin/reports" onClick={() => setIsOpen(false)} className="py-3 flex items-center gap-3 text-amber-400 hover:text-amber-300 transition">
                      <ShieldCheck size={20} /> Admin
                    </Link>
                  )}
                  <button
                    onClick={() => { signOut({ callbackUrl: "/" }); setIsOpen(false); }}
                    className="py-3 flex items-center gap-3 text-red-400 text-left"
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
      </div>
    </nav>
  );
}
