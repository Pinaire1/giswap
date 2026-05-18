import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-screen flex items-center justify-center overflow-hidden bg-black">
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff15_1px,transparent_1px)] bg-size-[40px_40px]"></div>
        
        <div className="relative z-10 text-center px-6 max-w-4xl">
          <h1 className="text-6xl md:text-7xl font-bold tracking-tighter mb-6 text-white">
            Roll Different.
          </h1>
          <p className="text-5xl md:text-6xl font-bold text-emerald-400 mb-8 tracking-tight">
            Buy. Sell. Share.
          </p>
          
          <p className="text-xl md:text-2xl text-gray-400 mb-10 max-w-2xl mx-auto">
            The marketplace built by grapplers, for grapplers.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/listings"
              className="px-10 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-lg font-medium transition-all active:scale-95"
            >
              Browse Gis
            </Link>
            <Link
              href="/listings/new"
              className="px-10 py-4 border-2 border-white text-white rounded-2xl text-lg font-medium hover:bg-white hover:text-black transition-all active:scale-95"
            >
              Sell Your Gi
            </Link>
          </div>
        </div>

        {/* Background Image - Using one of your photos */}
        <Image
          src="/damaged-hands.jpg"                    // Change this if you want to use another one
          alt="BJJ Grappler Hands"
          fill
          className="object-cover opacity-30"
          priority
        />
      </div>

      {/* Trust Bar */}
      <div className="py-8 bg-zinc-950 text-center text-sm text-gray-400 border-t border-gray-800">
        No middlemen • Direct from owner to owner • Real Jiu-Jitsu community
      </div>
    </div>
  );
}