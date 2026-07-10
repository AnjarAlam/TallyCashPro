"use client";

import { DashboardSubLayout } from "@/layout";
import { CreateTransferForm } from "@/components/form/transfer/create-transfer-form";
import { useGetCashbookList } from "@/services/cashbook.service";
import { use, useMemo } from "react";
import { useRouter } from "next/navigation";

export default function TransferPage({
  params,
}: {
  params: Promise<{ businessId: string; cashbookId: string }>;
}) {
  const { businessId, cashbookId } = use(params);
  const router = useRouter();

  const { cashbookList } = useGetCashbookList(businessId);

  const currentBook = useMemo(() => {
    return cashbookList.find((book) => book._id === cashbookId);
  }, [cashbookList, cashbookId]);

  const headerTitle = currentBook?.name
    ? `${currentBook.name} - Transfer`
    : "Transfer";

  const cashbookUrl = `/dashboard/business/${businessId}/${cashbookId}`;

  return (
    <DashboardSubLayout headerTitle={headerTitle} showPreviousPage>
      <div className="w-full max-w-3xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 pb-8">
        <CreateTransferForm
          businessId={businessId}
          cashbookId={cashbookId}
          currentCurrency={currentBook?.currency || "USD"}
          currentCashbookName={currentBook?.name || "Cashbook"}
          onCancel={() => router.push(cashbookUrl)}
          onSuccess={() => router.push(cashbookUrl)}
        />
      </div>
    </DashboardSubLayout>
  );
}
