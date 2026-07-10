import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function UserCardSkeleton() {
  return (
    <Card className="group bg-gradient-to-br from-[#2563eb] via-primary to-primary/85 dark:bg-primary-foreground shadow-none border-primary">
      {/* Header Section Skeleton */}
      <CardHeader>
        <CardTitle className="flex justify-start items-center gap-4">
          <Skeleton className="h-14 w-14 rounded-full" />
          <div className="flex sm:flex-row flex-col gap-2">
            <Skeleton className="h-7 w-40 rounded-md" />
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
        </CardTitle>
      </CardHeader>

      {/* Content Section Skeleton */}
      <CardContent className="flex flex-row w-full">
        <div className="flex flex-col gap-3 w-full md:w-2/3 relative z-10">
          {/* Email Skeleton */}
          <div className="flex items-center gap-x-2">
            <Skeleton className="h-5 w-5 rounded-full" />
            <Skeleton className="h-5 w-48 rounded-md" />
          </div>

          {/* Contact Skeleton */}
          <div className="flex items-center gap-x-2">
            <Skeleton className="h-5 w-5 rounded-full" />
            <Skeleton className="h-5 w-40 rounded-md" />
          </div>

          {/* Address Skeleton */}
          <div className="flex items-center gap-x-2">
            <Skeleton className="h-5 w-5 rounded-full" />
            <Skeleton className="h-5 w-56 rounded-md" />
          </div>
        </div>
      </CardContent>

      {/* Footer Section Skeleton */}
      <CardFooter className="w-full flex justify-between">
        <Skeleton className="h-4 w-32 rounded-md" />
        <Skeleton className="h-10 w-24 rounded-full" />
      </CardFooter>
    </Card>
  );
}
