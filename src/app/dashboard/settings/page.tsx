"use client";

import { SettingsScreen } from "@/components/settings/settings-screen";
import { DashboardSubLayout } from "@/layout";

export default function SettingsPage() {
  return (
    <DashboardSubLayout showTitle={false} showPreviousPage={false}>
      <SettingsScreen />
    </DashboardSubLayout>
  );
}
