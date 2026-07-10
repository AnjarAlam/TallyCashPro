"use client";

import { Skeleton } from "@/components/ui/skeleton"; // Assuming you have a Skeleton component

// Skeleton version of the BusinessCard
export default function BusinessCardSkeleton() {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center rounded-lg bg-background dark:bg-primary/40 p-4 border border-primary/40 shadow-md">
      <div className="flex items-center w-full">
        {/* Left Tag Icon Skeleton */}
        <div className="sm:flex-shrink-0 mr-4 mb-3 sm:mb-0 p-3 rounded-full bg-primary/10 dark:bg-white/10 h-min">
          <Skeleton className="w-6 h-6 rounded-full" />
        </div>

        {/* Main content skeleton */}
        <div className="flex-1 flex flex-col space-y-2 min-w-0">
          <Skeleton className="h-6 w-3/4 rounded-md" />
          <Skeleton className="h-4 w-full rounded-md" />
          <Skeleton className="h-4 w-2/3 rounded-md" />

          {/* Timestamps skeleton */}
          <div className="mt-2 border-t border-dashed w-full pt-3 flex flex-wrap items-center gap-x-4 gap-y-1">
            <Skeleton className="h-3 w-24 rounded-md" />
            <Skeleton className="h-3 w-24 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
}
