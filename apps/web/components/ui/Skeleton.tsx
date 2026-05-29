import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "bg-[#1a1a1a] animate-pulse rounded-lg",
        className
      )}
    />
  );
}
