"use client";

import { Skeleton } from "@/components/ui/skeleton";

// -------------------- MyProfileSkeleton --------------------
export const MyProfileCardSkeleton = () => {
  return (
    <div className="bg-gradient-to-br from-blue-700 to-blue-400 text-white rounded-xl shadow-xl p-6 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="flex items-center gap-6">
          <Skeleton className="w-20 h-20 rounded-full bg-blue-600" />
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Skeleton className="h-7 w-48 bg-blue-600" />
              <Skeleton className="h-5 w-20 bg-blue-500" />
            </div>
            <Skeleton className="h-4 w-64 bg-blue-500" />
            <Skeleton className="h-4 w-56 bg-blue-500" />
          </div>
        </div>
      </div>
    </div>
  );
};

// -------------------- PersonalInfoSkeleton --------------------
export const PersonalInfoSkeleton = () => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
      <div className="flex justify-between items-center mb-4 border-b pb-2">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-10 w-24" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="space-y-1">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-5 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
};

// -------------------- AddressInfoSkeleton --------------------
export const AddressInfoSkeleton = () => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
      <div className="flex justify-between items-center mb-4 border-b pb-2">
        <Skeleton className="h-7 w-32" />
        <Skeleton className="h-10 w-24" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="space-y-1">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-5 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
};

// -------------------- ProfileSkeleton --------------------
export const ProfileCardSkeleton = () => {
  return (
    <div className="space-y-6">
      <MyProfileCardSkeleton />
      <PersonalInfoSkeleton />
      <AddressInfoSkeleton />
    </div>
  );
};
