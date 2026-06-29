export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="mb-8">
        <div className="belt-gradient h-0.5 w-24 rounded-full mb-6 opacity-70" />
        <div className="h-14 w-64 bg-[#1a1a2e] rounded-xl animate-pulse mb-3" />
      </div>

      <div className="space-y-4 mb-8">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 h-12 bg-[#1a1a2e] rounded-2xl animate-pulse" />
          <div className="flex gap-2">
            <div className="h-12 w-24 bg-[#1a1a2e] rounded-2xl animate-pulse" />
            <div className="h-12 w-24 bg-[#1a1a2e] rounded-2xl animate-pulse" />
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="h-9 w-12 bg-[#1a1a2e] rounded-xl animate-pulse" />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-[#111] border border-[#1e2a4a] rounded-2xl overflow-hidden animate-pulse">
            <div className="h-52 bg-[#1a1a2e]" />
            <div className="p-4 space-y-2">
              <div className="h-4 bg-[#1a1a2e] rounded w-3/4" />
              <div className="h-4 bg-[#1a1a2e] rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
