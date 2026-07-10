// app/dashboard/business/[businessId]/[cashbookId]/analytics/page.tsx
"use client";

import { DashboardSubLayout } from "@/layout";
import { AnalyticsCard } from "@/components/cards/analytics-card";
import { compConfigProps } from "@/components/navigation/dashboard/title-header";
import { IconBox } from "@/components/buttons";
import { Settings, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { use, useMemo } from "react";
import { BookMemberSheet } from "@/components/sheets";
import { useGetCashbookList } from "@/services/cashbook.service";

export default function AnalyticsPage({
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

  // Get the book name with analytics suffix
  const headerTitle = currentBook?.name
    ? `${currentBook.name} - Analytics`
    : "Analytics";

  const NavComps: compConfigProps = [
    {
      comp: (
        <Link href={`/dashboard/business/${businessId}/${cashbookId}/fields`}>
          <IconBox
            icon={Settings}
            containerClass="bg-blue-100"
            iconClass="text-blue-800"
            className="h-8 w-8 sm:h-9 sm:w-9"
          />
        </Link>
      ),
      position: "left",
    },
    {
      comp: (
        <BookMemberSheet businessId={businessId} cashbookId={cashbookId} />
      ),
      position: "right",
    },
  ];

  return (
    <DashboardSubLayout
      headerTitle={headerTitle}
      showPreviousPage
    //   previousPageHref={`/dashboard/business/${businessId}/${cashbookId}`}
      compList={NavComps}
    >
      <div className="w-full max-w-full overflow-hidden px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            {/* <Link
              href={`/dashboard/business/${businessId}/${cashbookId}`}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Cashbook
            </Link> */}
          </div>
          
          {/* Analytics Card */}
          <AnalyticsCard bookId={cashbookId} businessId={businessId} token="" />
        </div>
      </div>
    </DashboardSubLayout>
  );
}