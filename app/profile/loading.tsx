export default function Loading() {
  return (
    <main className="max-w-6xl mx-auto px-6 py-12">
      <div className="bg-[#111] border border-[#1e2a4a] rounded-3xl p-8 mb-10 animate-pulse">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-full bg-[#1a1a2e]" />
          <div className="space-y-2">
            <div className="h-8 w-40 bg-[#1a1a2e] rounded-lg" />
            <div className="h-4 w-56 bg-[#1a1a2e] rounded" />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-[#111] border border-[#1e2a4a] rounded-2xl overflow-hidden animate-pulse h-48" />
        ))}
      </div>
    </main>
  );
}
