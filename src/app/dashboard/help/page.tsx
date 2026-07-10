"use client";
import FAQScreen from "@/components/faq/faq-screen";
import { DashboardSubLayout } from "@/layout";

export default function Page() {
  return (
    <DashboardSubLayout headerTitle="FAQ & Help">
      <FAQScreen />
    </DashboardSubLayout>
  );
}