// app/transactions/[transactionID]/page.tsx

import { DashboardSubLayout } from "@/layout";
import TransactionDetail from "./transaction-detail";
import { use } from "react";

export default function TransactionDetailPage({
  params,
}: {
  params: Promise<{
    transactionId: string;
    businessId: string;
    cashbookId: string;
  }>;
}) {
  const { transactionId, businessId, cashbookId } = use(params);
  return (
    <DashboardSubLayout headerTitle={`Transaction Details`} showPreviousPage>
      <main className="container mx-auto py-6">
        <TransactionDetail
          cashbookId={cashbookId}
          transactionID={transactionId}
          businessId={businessId}
        />
      </main>
    </DashboardSubLayout>
  );
}
