import { BusinessSwitchCard } from "@/components/cards";
import { BusinessList } from "@/components/dashboard";
import { compConfigProps } from "@/components/navigation/dashboard/title-header";
import { DashboardSubLayout } from "@/layout";

export default function Page() {
  return (
    <DashboardSubLayout showTitle={false}>
      <BusinessList layout="split" />
    </DashboardSubLayout>
  );
}
