"use client";

import { BusinessList } from "@/components/dashboard";
import { DashboardSubLayout } from "@/layout";
import { BusinessProvider } from "@/providers/business-cashbook-provider";

export default function Page() {
  return (
    <BusinessProvider>
      <DashboardSubLayout showTitle={false}>
        <BusinessList layout="split" />
      </DashboardSubLayout>
    </BusinessProvider>
  );
}