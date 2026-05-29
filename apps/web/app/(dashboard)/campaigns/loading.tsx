import { Skeleton } from "@/components/ui/Skeleton";

export default function CampaignsLoading() {
  return (
    <div className="p-6 space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-7 w-40" />
          <Skeleton className="h-4 w-60" />
        </div>
        <Skeleton className="h-9 w-36 rounded-xl" />
      </div>

      {/* Campaign rows */}
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="bg-[#111111] border border-white/5 rounded-2xl p-5 flex items-center gap-4">
            <Skeleton className="w-10 h-10 rounded-xl flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-52" />
              <Skeleton className="h-3 w-80" />
            </div>
            <div className="flex items-center gap-3">
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
