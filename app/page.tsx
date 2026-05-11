import Link from "next/link";

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
          The Marketplace for<br />
          <span className="text-orange-600">BJJ Gis</span>
        </h1>
        
        <p className="text-xl text-gray-600 mb-10">
          Buy, sell, and trade new & gently used Jiu-Jitsu gis. 
          Built by the community, for the community.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/listings"
            className="px-8 py-4 bg-orange-600 text-white rounded-xl font-medium text-lg hover:bg-orange-700 transition"
          >
            Browse Listings
          </Link>
          <Link
            href="/listings/new"
            className="px-8 py-4 border-2 border-gray-900 rounded-xl font-medium text-lg hover:bg-gray-100 transition"
          >
            Sell Your Gi
          </Link>
        </div>
      </div>

      {/* Simple Trust Signals */}
      <div className="mt-20 text-center text-sm text-gray-500">
        Trusted by hundreds of grapplers • No middleman fees • Direct seller communication
      </div>
    </div>
  );
}