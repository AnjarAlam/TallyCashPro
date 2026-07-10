"use client";

import { BusinessSettingsScreen } from "@/components/business/business-settings-screen";
import { DashboardSubLayout } from "@/layout";
import { use } from "react";

export default function BusinessSettingsPage({
  params,
}: {
  params: Promise<{ businessId: string }>;
}) {
  const { businessId } = use(params);

  return (
    <DashboardSubLayout
      headerTitle="Business Settings"
      showPreviousPage
      showTitle
    >
      <BusinessSettingsScreen businessId={businessId} />
    </DashboardSubLayout>
  );
}
