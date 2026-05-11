import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./components/Navbar";

export const metadata: Metadata = {
  title: "GiSwap | BJJ Gi Marketplace",
  description: "Buy and sell new & used BJJ gis in the Jiu-Jitsu community",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 font-sans antialiased">
        <Navbar />
        <main className="min-h-[calc(100vh-64px)]">
          {children}
        </main>
        
        <footer className="bg-gray-900 text-gray-400 py-8 mt-12">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <p>© 2026 GiSwap • Built by the BJJ Community</p>
          </div>
        </footer>
      </body>
    </html>
  );
}