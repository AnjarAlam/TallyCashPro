"use client";

import { LoggedInDevicesScreen } from "@/components/settings/logged-in-devices-screen";
import { DashboardSubLayout } from "@/layout";

export default function LoggedInDevicesPage() {
  return (
    <DashboardSubLayout
      headerTitle="Logged-in Devices"
      showPreviousPage
      showTitle
    >
      <LoggedInDevicesScreen />
    </DashboardSubLayout>
  );
}
