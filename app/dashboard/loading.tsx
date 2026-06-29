export default function DashboardLoading() {
  return (
    <div className="page-container max-w-6xl">
      <div className="page-accent skeleton h-0.5 w-16 mb-8" />
      <div className="skeleton h-10 w-72 max-w-full mb-3" />
      <div className="skeleton h-5 w-48 mb-12" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="card p-8 space-y-3">
            <div className="skeleton h-4 w-24" />
            <div className="skeleton h-14 w-20" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="card p-8">
            <div className="skeleton h-6 w-32 mb-6" />
            <div className="skeleton h-24 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
