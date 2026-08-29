import React from "react";

export function SkeletonCard() {
  return (
    <div className="flex flex-col rounded-2xl bg-[#131b2a]/60 border border-[#1e2c40] overflow-hidden animate-pulse">
      <div className="aspect-[3/4] w-full bg-[#1a2538]" />
      <div className="p-3 space-y-2">
        <div className="h-4 bg-[#1a2538] rounded-md w-3/4" />
        <div className="h-3 bg-[#1a2538] rounded-md w-1/2" />
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 10 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
