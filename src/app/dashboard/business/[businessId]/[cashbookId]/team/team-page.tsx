"use client";
import { BookMemberListSection } from "@/components/dashboard";
import { BookMemberSheet } from "@/components/sheets";
import { DashboardSubLayout } from "@/layout";
import { useMemo } from "react";
import { useGetCashbookList } from "@/services/cashbook.service";

export default function BookMemberPage({
  businessId,
  cashbookId,
}: {
  businessId: string;
  cashbookId: string;
}) {
  // Fetch cashbook list to get the current book's name
  const { cashbookList } = useGetCashbookList(businessId);

  // Find the current book from the list
  const currentBook = useMemo(() => {
    return cashbookList.find((book) => book._id === cashbookId);
  }, [cashbookList, cashbookId]);

  // Get the book name with members suffix
  const headerTitle = currentBook?.name
    ? `${currentBook.name} - Members`
    : "Cashbook Members";
  
  return (
    <DashboardSubLayout
      headerTitle={headerTitle}
      showPreviousPage
      compList={[
        {
          comp: (
            <BookMemberSheet businessId={businessId} cashbookId={cashbookId} />
          ),
          position: "right",
        },
      ]}
    >
      <BookMemberListSection companyId={businessId} bookId={cashbookId} />
    </DashboardSubLayout>
  );
}
