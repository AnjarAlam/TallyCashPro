"use client";
import { compConfigProps } from "@/components/navigation/dashboard/title-header";
import DashboardSubLayout from "@/layout/dashboard-sublayout";
import { use } from "react";
import FieldsSection from "./field-section";

const NavComps: compConfigProps = [];

export default function Page({
  params,
}: {
  params: Promise<{ businessId: string }>;
}) {
  const { businessId } = use(params);

  return (
    <DashboardSubLayout
      headerTitle="Field Settings"
      showPreviousPage
      compList={NavComps}
      aside={
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <a href="#" className="text-blue-600 hover:underline">
                Reports
              </a>
            </li>
            <li>
              <a href="#" className="text-blue-600 hover:underline">
                Settings
              </a>
            </li>
            <li>
              <a href="#" className="text-blue-600 hover:underline">
                Help
              </a>
            </li>
          </ul>
        </div>
      }
    >
      <FieldsSection />
    </DashboardSubLayout>
  );
}
