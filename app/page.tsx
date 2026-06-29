import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[100svh] flex items-center justify-center">
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] bg-[size:50px_50px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-blue-950/20 via-transparent to-purple-950/20 pointer-events-none" />

        <Image
          src="/jiujitsu-hands.jpg"
          alt=""
          fill
          className="object-cover opacity-30"
          priority
          sizes="100vw"
        />

        <div className="relative z-10 text-center px-4 sm:px-6 max-w-5xl py-24">
          <div className="hero-badge inline-flex items-center gap-2 px-4 py-1.5 bg-blue-900/40 border border-blue-700/50 rounded-full text-blue-300 text-sm font-medium mb-6 sm:mb-8 tracking-wide">
            <span aria-hidden="true">🥋</span> The BJJ Gi Marketplace
          </div>

          <h1 className="hero-h1 text-4xl sm:text-7xl md:text-8xl font-black tracking-tighter text-white mb-3 sm:mb-4 leading-none">
            Roll Different.
          </h1>

          <p className="hero-tagline text-2xl sm:text-5xl md:text-6xl font-black mb-8 sm:mb-10 belt-text">
            Buy. Sell. Share.
          </p>

          <p className="hero-desc text-base sm:text-lg text-gray-400 mb-10 sm:mb-12 max-w-xl mx-auto leading-relaxed">
            Built by grapplers, for grapplers. Find your next gi or give yours a new home.
          </p>

          <div className="hero-cta flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center max-w-md sm:max-w-none mx-auto">
            <Link href="/listings" className="btn-primary px-10 py-4 text-base sm:text-lg rounded-2xl shadow-lg shadow-blue-900/40">
              Browse Gis
            </Link>
            <Link href="/listings/new" className="btn-secondary px-10 py-4 text-base sm:text-lg rounded-2xl">
              Sell Your Gi
            </Link>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 belt-gradient h-1 opacity-50" aria-hidden="true" />
      </section>

      {/* Belt progression section */}
      <section className="page-container max-w-5xl">
        <div className="text-center mb-10 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-black text-white mb-3">Every Roll Counts</h2>
          <p className="text-gray-500 text-sm sm:text-base">Your gi has a story. Pass it on.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {[
            { belt: "bg-blue-600", label: "Buy", desc: "Find quality gis at real grappler prices.", shadow: "shadow-blue-900/40" },
            { belt: "bg-purple-600", label: "Sell", desc: "List your gi and reach the community.", shadow: "shadow-purple-900/40" },
            { belt: "bg-amber-700", label: "Connect", desc: "Message sellers directly. No middleman.", shadow: "shadow-amber-900/40" },
          ].map(({ belt, label, desc, shadow }, i) => (
            <article
              key={label}
              className={`card card-hover p-6 sm:p-8 shadow-lg ${shadow} fade-up`}
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className={`w-12 h-2 ${belt} rounded-full mx-auto mb-5 sm:mb-6`} aria-hidden="true" />
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">{label}</h3>
              <p className="text-gray-500 text-sm sm:text-base leading-relaxed">{desc}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
