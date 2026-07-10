import { AuthGuard } from "@/layout";
import DashboardLayout from "@/layout/dashboard-layout";
import { BusinessProvider } from "@/providers/business-provider";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <BusinessProvider>
        <DashboardLayout>{children}</DashboardLayout>
      </BusinessProvider>
    </AuthGuard>
  );
}
