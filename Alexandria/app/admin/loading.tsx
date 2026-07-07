export default function AdminLoading() {
  return (
    <div className="flex flex-col gap-6 p-8" aria-busy="true">
      <div className="h-8 w-64 animate-pulse rounded bg-white/10" />
      <div className="grid grid-cols-3 gap-4 max-lg:grid-cols-2 max-sm:grid-cols-1">
        {[0, 1, 2].map((item) => (
          <div
            key={item}
            className="h-28 animate-pulse rounded-[10px] border border-white/[0.07] bg-white/5"
          />
        ))}
      </div>
      <div className="h-80 animate-pulse rounded-[10px] border border-white/[0.07] bg-white/5" />
      <span className="sr-only">Loading admin data</span>
    </div>
  );
}
