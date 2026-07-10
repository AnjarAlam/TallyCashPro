"use client";

import { DeletedTransactionsScreen } from "@/components/cashbook/deleted-transactions-screen";
import { DashboardSubLayout } from "@/layout";
import { use } from "react";

export default function RecycleBinPage({
  params,
}: {
  params: Promise<{ businessId: string; cashbookId: string }>;
}) {
  const { businessId, cashbookId } = use(params);

  return (
    <DashboardSubLayout headerTitle="Recycle bin" showPreviousPage showTitle>
      <DeletedTransactionsScreen
        businessId={businessId}
        cashbookId={cashbookId}
      />
    </DashboardSubLayout>
  );
}
