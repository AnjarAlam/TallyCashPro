"use client";

import { DeletedBooksScreen } from "@/components/business/deleted-books-screen";
import { DashboardSubLayout } from "@/layout";
import { use } from "react";

export default function DeletedBooksPage({
  params,
}: {
  params: Promise<{ businessId: string }>;
}) {
  const { businessId } = use(params);

  return (
    <DashboardSubLayout
      headerTitle="Deleted books"
      showPreviousPage
      showTitle
    >
      <DeletedBooksScreen businessId={businessId} />
    </DashboardSubLayout>
  );
}
