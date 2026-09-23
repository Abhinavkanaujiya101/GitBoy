export default function LoadingSkeleton() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-pulse">
      {/* Profile Header Skeleton */}
      <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-slate-800 flex flex-col md:flex-row gap-6 items-start justify-between">
        <div className="flex flex-col sm:flex-row gap-6 items-start w-full">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-slate-800 shrink-0" />
          <div className="space-y-3 w-full max-w-lg">
            <div className="h-7 w-48 bg-slate-800 rounded-lg" />
            <div className="h-4 w-32 bg-slate-800/60 rounded" />
            <div className="h-4 w-full bg-slate-800/40 rounded" />
            <div className="flex gap-4 pt-2">
              <div className="h-4 w-24 bg-slate-800/50 rounded" />
              <div className="h-4 w-28 bg-slate-800/50 rounded" />
            </div>
          </div>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <div className="h-10 w-36 bg-slate-800 rounded-xl" />
          <div className="h-10 w-28 bg-slate-800 rounded-xl" />
        </div>
      </div>

      {/* 4 Stat Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex justify-between items-center">
              <div className="h-3 w-24 bg-slate-800 rounded" />
              <div className="w-8 h-8 rounded-xl bg-slate-800" />
            </div>
            <div className="h-8 w-20 bg-slate-800 rounded-lg" />
            <div className="h-3 w-36 bg-slate-800/40 rounded" />
          </div>
        ))}
      </div>

      {/* Impact Score Card Skeleton */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex gap-3 items-center">
            <div className="w-10 h-10 rounded-xl bg-slate-800" />
            <div className="space-y-2">
              <div className="h-5 w-32 bg-slate-800 rounded" />
              <div className="h-3 w-48 bg-slate-800/50 rounded" />
            </div>
          </div>
          <div className="h-10 w-24 bg-slate-800 rounded-xl" />
        </div>
        <div className="h-3 w-full bg-slate-800 rounded-full" />
      </div>

      {/* Heatmap & Language Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-12 glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
          <div className="h-5 w-40 bg-slate-800 rounded" />
          <div className="h-28 w-full bg-slate-800/40 rounded-xl" />
        </div>

        <div className="lg:col-span-6 glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
          <div className="h-5 w-36 bg-slate-800 rounded" />
          <div className="h-44 w-full bg-slate-800/40 rounded-xl" />
        </div>

        <div className="lg:col-span-6 glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
          <div className="h-5 w-36 bg-slate-800 rounded" />
          <div className="space-y-2.5">
            <div className="h-16 w-full bg-slate-800/40 rounded-xl" />
            <div className="h-16 w-full bg-slate-800/40 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
