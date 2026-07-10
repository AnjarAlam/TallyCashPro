import { compConfigProps } from "@/components/navigation/dashboard/title-header";
import { Button } from "@/components/ui/button";
import { DashboardSubLayout } from "@/layout";
import PaymentModesPage from "./payment-mode-page";
import { use } from "react";

export default function Page({
  params,
}: {
  params: Promise<{ businessId: string }>;
}) {
  const { businessId } = use(params);
  const NavComps: compConfigProps = [
    { comp: <Button>Add Business</Button>, position: "right" },
  ];
  return (
    <DashboardSubLayout
      headerTitle="Payment Mode Settings"
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
      <PaymentModesPage businessId={businessId} />
    </DashboardSubLayout>
  );
}
