"use client";
import { DashboardSubLayout } from "@/layout";
import PaymentModesPage from "./payment-mode-page";
import { use, useMemo } from "react";
import { useGetCashbookList } from "@/services/cashbook.service";

export default function Page({
  params,
}: {
  params: Promise<{ businessId: string; cashbookId: string }>;
}) {
  const { businessId, cashbookId } = use(params);
  
  // Fetch cashbook list to get the current book's name
  const { cashbookList } = useGetCashbookList(businessId);

  // Find the current book from the list
  const currentBook = useMemo(() => {
    return cashbookList.find((book) => book._id === cashbookId);
  }, [cashbookList, cashbookId]);

  // Get the book name with payment mode suffix
  const headerTitle = currentBook?.name
    ? `${currentBook.name} - Payment Mode`
    : "Payment Mode Settings";
  
  return (
    <DashboardSubLayout
      headerTitle={headerTitle}
      showPreviousPage
      aside={
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <a href="#" className="text-blue-600 hover:underline">
                Reports
              </a>
            </li>
            <li>
              <a href="#" className="text-blue-600 hover:underline">
                Settings
              </a>
            </li>
            <li>
              <a href="#" className="text-blue-600 hover:underline">
                Help
              </a>
            </li>
          </ul>
        </div>
      }
    >
      <PaymentModesPage businessId={businessId} cashbookId={cashbookId} />
    </DashboardSubLayout>
  );
}
