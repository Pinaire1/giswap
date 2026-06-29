export default function ListingsLoading() {
  return (
    <div className="page-container">
      <header className="page-header">
        <div className="page-accent" />
        <div className="skeleton h-14 w-64 max-w-full mb-3" />
      </header>

      <div className="space-y-4 mb-8">
        <div className="skeleton h-12 w-full" />
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="skeleton h-9 w-12" />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="card overflow-hidden">
            <div className="aspect-[4/3] skeleton rounded-none" />
            <div className="p-4 space-y-3">
              <div className="skeleton h-4 w-3/4" />
              <div className="skeleton h-3 w-1/2" />
              <div className="skeleton h-10 w-full mt-2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
