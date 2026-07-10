"use client";

import { PartyCard } from "@/components/cards";
import { useSheetControls } from "@/hooks";
import { useGetBookPartiesInfinite } from "@/services/party.service";
import { Loader2 } from "lucide-react";
import { useRef } from "react";

interface QuickPartyListSectionProps {
  bookId: string;
  searchQuery?: string;
  typeFilter?: "Customer" | "Supplier";
  statusFilter?: "active" | "inactive";
  onValueChange: (e: any) => void;
}

export function QuickPartyListSection({
  bookId,
  searchQuery,
  typeFilter,
  statusFilter,
  onValueChange,
}: QuickPartyListSectionProps) {
  const { setOpen } = useSheetControls();
  const {
    parties,
    isPartiesPending,
    isPartiesError,
    partiesError,
    hasNextPage,
    isFetchingNextPage,
    refetchParties,
  } = useGetBookPartiesInfinite(bookId, searchQuery, typeFilter, statusFilter);

  const loadMoreRef = useRef<HTMLDivElement>(null);

  if (!bookId) {
    return (
      <div className="text-center py-8 text-gray-500">
        No cashbook selected for parties.
      </div>
    );
  }

  if (isPartiesPending && !parties.length) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (isPartiesError) {
    return (
      <div className="text-center py-8 text-red-500">
        Error loading parties: {partiesError?.message}
        <button
          onClick={() => refetchParties()}
          className="ml-4 px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!parties.length) {
    return (
      <div className="text-center py-8 text-gray-500">
        No parties found
        {searchQuery && <p className="mt-2">Try a different search term</p>}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        {parties.map((party) => (
          <div key={party._id} className="col-span-2 sm:col-span-1">
            <PartyCard
              party={party}
              bookId={bookId}
              onClick={(e) => {
                setOpen(false);
                onValueChange(e);
              }}
              showActions={false}
              onDelete={() => refetchParties()}
              onEdit={() => console.log("Edit Party")}
            />
          </div>
        ))}
      </div>

      <div ref={loadMoreRef} className="h-1 w-full" />

      {isFetchingNextPage && (
        <div className="flex justify-center py-4">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      )}

      {!hasNextPage && parties.length > 0 && (
        <div className="text-center py-4 text-sm text-gray-500">
          You&apos;ve reached the end of the list
        </div>
      )}
    </div>
  );
}
