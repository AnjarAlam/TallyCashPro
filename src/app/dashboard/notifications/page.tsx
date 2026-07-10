"use client";

import { NotificationsScreen } from "@/components/notifications/notifications-screen";
import { DashboardSubLayout } from "@/layout";

export default function NotificationsPage() {
  return (
    <DashboardSubLayout
      headerTitle="Notifications"
      showPreviousPage
      showTitle
    >
      <NotificationsScreen />
    </DashboardSubLayout>
  );
}
