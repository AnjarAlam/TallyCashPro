import { Skeleton } from "../ui/skeleton";

export default function CashbookCardSkeleton() {
  return (
    <div className="group relative flex flex-col sm:flex-row items-start sm:items-center rounded-lg bg-background dark:bg-primary/40 p-4 border border-primary/40 shadow-md shrink-0">
      <div className="flex items-center w-full">
        {/* Left Tag Icon Skeleton */}
        <div className="sm:flex-shrink-0 mr-4 mb-3 sm:mb-0 p-3 rounded-full bg-primary/10 dark:bg-white/10 h-min">
          <Skeleton className="w-6 h-6 rounded-full" />
        </div>

        {/* Main content skeleton */}
        <div className="flex-1 flex flex-col space-y-2 min-w-0">
          <Skeleton className="h-6 w-3/4 rounded-md" />
          <Skeleton className="h-5 w-1/2 rounded-md" />

          {/* Financial Summary skeleton */}
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            <Skeleton className="h-4 w-20 rounded-md" />
            <Skeleton className="h-4 w-20 rounded-md" />
          </div>

          {/* Timestamp skeleton */}
          <div className="mt-2 border-t border-dashed w-full pt-3">
            <Skeleton className="h-3 w-24 rounded-md" />
          </div>
        </div>

        {/* More actions button skeleton */}
        <div className="ml-2">
          <Skeleton className="w-5 h-5 rounded-full" />
        </div>
      </div>
    </div>
  );
}
