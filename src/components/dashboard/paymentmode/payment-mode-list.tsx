"use client";

import { PaymentModeCard } from "@/components/cards";
import { useGetPaymentModes, useGetPaymentModesByBook } from "@/services/payment-mode.service";
import { Loader2 } from "lucide-react";

interface PaymentModeListProps {
  businessId: string;
  cashbookId?: string;
  statusFilter?: "active" | "inactive";
}

export function PaymentModeList({
  businessId,
  cashbookId,
  statusFilter,
}: PaymentModeListProps) {
  
  // Use book-based API if cashbookId is provided, otherwise use business-based
  const { data, isLoading, isError, error, refetch } = cashbookId 
    ? useGetPaymentModesByBook({ bookId: cashbookId, status: statusFilter })
    : useGetPaymentModes(businessId, statusFilter);

  const handleDeletePaymentMode = (paymentModeId: string) => {
    console.log("Deleting payment mode:", paymentModeId);
    // Implement actual delete logic here
    // After deletion, you might want to refetch:
    // refetch();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-8 text-red-500">
        Error loading payment modes: {error?.message}
        <button
          onClick={() => refetch()}
          className="ml-4 px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!data?.data?.length) {
    return (
      <div className="text-center py-8 text-gray-500">
        No payment modes found
        {statusFilter && <p className="mt-2">Try changing the status filter</p>}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {data.data
          .sort(
            (a, b) =>
              new Date(b.createdAt || "").getTime() -
              new Date(a.createdAt || "").getTime()
          )
          .map((paymentMode) => (
            <div key={paymentMode._id} className="col-span-2 sm:col-span-1">
              <PaymentModeCard
                paymentMode={paymentMode}
                onDelete={() => handleDeletePaymentMode(paymentMode._id)}
                onEdit={() => console.log("Edit", paymentMode._id)}
              />
            </div>
          ))}
      </div>
    </div>
  );
}
