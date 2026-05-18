import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { SessionProvider } from "next-auth/react";
import "@uploadthing/react/styles.css";

export const metadata: Metadata = {
  title: "GiSwap | BJJ Gi Marketplace",
  description: "Buy and sell new & used BJJ gis",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen tatami-bg font-sans antialiased">
        <SessionProvider>
          <Navbar />
          <main className="min-h-[calc(100vh-64px)]">
            {children}
          </main>
          <footer className="bg-zinc-950 border-t border-zinc-800 text-gray-400 py-10 mt-12">
            <div className="max-w-7xl mx-auto px-6 text-center space-y-2">
              <p className="text-emerald-500 font-bold text-lg tracking-widest uppercase">
                GiSwap
              </p>
              <p className="text-sm">© 2026 GiSwap • Built for the BJJ Community</p>
              <p className="text-xs text-zinc-600 mt-2">
                OSS · No Ego · Keep Rolling
              </p>
            </div>
          </footer>
        </SessionProvider>
      </body>
    </html>
  );
}