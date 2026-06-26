import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { SessionProvider } from "next-auth/react";
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
  },
  twitter: {
    card: "summary_large_image",
    title: "GiSwap | BJJ Gi Marketplace",
    description: "Buy and sell new & used BJJ gis.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#0a0a0a] font-sans antialiased">
        <Providers>
          <SessionProvider>
            <Navbar />
            <main>
              {children}
            </main>

            <Analytics />
            <footer className="bg-[#0d0d0d] border-t border-[#1e2a4a] text-gray-500 py-10 mt-12">
              <div className="max-w-7xl mx-auto px-6 text-center space-y-3">
                {/* Belt stripe bar */}
                <div className="belt-gradient h-0.5 w-32 mx-auto rounded-full opacity-60 mb-4" />
                <p className="text-blue-400 font-bold text-lg tracking-widest uppercase">
                  GiSwap
                </p>
                <p className="text-sm">© 2026 GiSwap • Built for the BJJ Community</p>
                <p className="text-xs text-zinc-700 mt-2">
                  OSS · No Ego · Keep Rolling
                </p>
              </div>
            </footer>
          </SessionProvider>
        </Providers>
      </body>
    </html>
  );
}
