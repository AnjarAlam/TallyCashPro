"use client";

import { TeamManagementSidebar } from "@/components/business/team-management";
import { DashboardSubLayout } from "@/layout";
import { useGetCompanyById } from "@/services";
import { Loader2 } from "lucide-react";

export default function TeamMemberPage({ businessId }: { businessId: string }) {
  const { company, isCompanyPending, isCompanyError, refetchCompany } =
    useGetCompanyById(businessId);

  return (
    <DashboardSubLayout headerTitle="Team Management" showPreviousPage>
      {isCompanyPending ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : isCompanyError ? (
        <div className="text-center py-8 text-red-500">
          Failed to load business details.
          <button
            type="button"
            className="ml-4 underline"
            onClick={() => refetchCompany()}
          >
            Retry
          </button>
        </div>
      ) : company ? (
        <TeamManagementSidebar
          variant="page"
          companyId={businessId}
          companyName={company.name}
        />
      ) : null}
    </DashboardSubLayout>
  );
}
