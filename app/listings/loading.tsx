export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-12">
        <div className="belt-gradient h-0.5 w-24 rounded-full mb-6 opacity-70" />
        <div className="h-14 w-64 bg-[#1a1a2e] rounded-xl animate-pulse mb-3" />
        <div className="h-6 w-40 bg-[#1a1a2e] rounded-lg animate-pulse" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-[#111] border border-[#1e2a4a] rounded-2xl overflow-hidden animate-pulse">
            <div className="aspect-square bg-[#1a1a2e]" />
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
