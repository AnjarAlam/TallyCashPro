"use client";

import { CashbookSettingsScreen } from "@/components/cashbook/cashbook-settings-screen";
import { DashboardSubLayout } from "@/layout";
import { use } from "react";

export default function CashbookSettingPage({
  params,
}: {
  params: Promise<{ businessId: string; cashbookId: string }>;
}) {
  const { businessId, cashbookId } = use(params);

  return (
    <DashboardSubLayout
      headerTitle="Settings"
      showPreviousPage
      showTitle
    >
      <CashbookSettingsScreen
        businessId={businessId}
        cashbookId={cashbookId}
      />
    </DashboardSubLayout>
  );
}
