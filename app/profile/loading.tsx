export default function ProfileLoading() {
  return (
    <main className="page-container max-w-6xl">
      <div className="card p-5 sm:p-8 mb-10">
        <div className="page-accent" />
        <div className="flex items-center gap-5">
          <div className="skeleton w-20 h-20 rounded-full shrink-0" />
          <div className="space-y-2 flex-1">
            <div className="skeleton h-8 w-40" />
            <div className="skeleton h-4 w-56 max-w-full" />
          </div>
        </div>
      </div>

      <div className="skeleton h-7 w-32 mb-6" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="card overflow-hidden">
            <div className="aspect-[4/3] skeleton rounded-none" />
            <div className="p-5 space-y-2">
              <div className="skeleton h-4 w-3/4" />
              <div className="skeleton h-8 w-full" />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
