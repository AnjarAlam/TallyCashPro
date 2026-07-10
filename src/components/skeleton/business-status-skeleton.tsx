import { Skeleton } from "@/components/ui/skeleton"; // Assuming you have a Skeleton component
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";

interface BusinessStatusCardSkeletonProps {
  className?: string;
}

export function BusinessStatusCardSkeleton({
  className,
}: BusinessStatusCardSkeletonProps) {
  return (
    <Card
      className={cn(
        "bg-linear-to-br from-[#2563eb] via-primary to-primary/85 dark:bg-primary-foreground text-primary-foreground dark:text-white shadow-none border-primary h-full justify-between",
        className
      )}
    >
      {/* Card Header Skeleton */}
      <CardHeader>
        <CardTitle className="flex justify-start items-center gap-4">
          <Skeleton className="sm:h-12 h-14 sm:w-12 w-14 rounded-full" />
          <div className="flex sm:flex-row flex-col gap-2">
            <Skeleton className="sm:w-32 w-24 h-6" />
            <Skeleton className="w-16 h-5 rounded-full" />
          </div>
        </CardTitle>
      </CardHeader>

      {/* Card Content Skeleton */}
      <CardContent className="flex flex-row w-full">
        <div className="flex flex-col gap-3 w-full relative z-10">
          <div className="flex items-center gap-x-2">
            <Skeleton className="w-12 h-8" />
            <Skeleton className="w-20 h-5" />
          </div>
        </div>
      </CardContent>

      {/* Card Footer Skeleton */}
      <CardFooter className="w-full flex justify-between items-center gap-2">
        <Skeleton className="w-24 h-4" />
        <div className="flex gap-2">
          <Skeleton className="w-24 h-9 rounded-full" />
          <Skeleton className="w-20 h-9 rounded-full" />
        </div>
      </CardFooter>
    </Card>
  );
}
