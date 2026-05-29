import { Skeleton } from "@/components/ui/Skeleton";

export default function AnalyticsLoading() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-7 w-36" />
        <Skeleton className="h-4 w-56" />
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-[#111111] border border-white/5 rounded-2xl p-5 space-y-3">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-3 w-20" />
          </div>
        ))}
      </div>

      {/* Chart placeholders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="bg-[#111111] border border-white/5 rounded-2xl p-5 space-y-4">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-56 w-full rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  );
}
