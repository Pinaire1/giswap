import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Providers from "./providers";
import { Analytics } from "@vercel/analytics/next";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://giswap.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: { default: "GiSwap | BJJ Gi Marketplace", template: "%s | GiSwap" },
  description: "Buy and sell new & used BJJ gis. The marketplace built by grapplers, for grapplers.",
  openGraph: {
    siteName: "GiSwap",
    title: "GiSwap | BJJ Gi Marketplace",
    description: "Buy and sell new & used BJJ gis. The marketplace built by grapplers, for grapplers.",
    url: BASE_URL,
    type: "website",
    images: [{ url: "/og-default.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "GiSwap | BJJ Gi Marketplace",
    description: "Buy and sell new & used BJJ gis.",
    images: ["/og-default.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#0a0a0a] font-sans antialiased flex flex-col">
        <Providers>
            <a href="#main-content" className="skip-link">
              Skip to content
            </a>
            <Navbar />
            <main id="main-content" className="flex-1">
              {children}
            </main>

            <Analytics />
            <footer className="bg-[#0d0d0d] border-t border-[#1e2a4a] text-gray-500 py-8 sm:py-10 mt-auto">
              <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 text-center sm:text-left">
                  <div>
                    <div className="belt-gradient h-0.5 w-16 sm:w-24 rounded-full opacity-60 mb-3 mx-auto sm:mx-0" />
                    <p className="text-blue-400 font-bold text-base sm:text-lg tracking-widest uppercase">
                      GiSwap
                    </p>
                    <p className="text-xs sm:text-sm mt-1">© 2026 GiSwap · Built for the BJJ Community</p>
                  </div>
                  <nav aria-label="Footer" className="flex flex-wrap justify-center sm:justify-end gap-x-6 gap-y-2 text-sm">
                    <Link href="/listings" className="hover:text-blue-400 transition-colors">Browse Gis</Link>
                    <Link href="/listings/new" className="hover:text-blue-400 transition-colors">Sell Your Gi</Link>
                    <Link href="/dashboard" className="hover:text-blue-400 transition-colors">Dashboard</Link>
                  </nav>
                </div>
                <p className="text-xs text-zinc-700 mt-6 text-center sm:text-left">
                  OSS · No Ego · Keep Rolling
                </p>
              </div>
            </footer>
        </Providers>
      </body>
    </html>
  );
}
