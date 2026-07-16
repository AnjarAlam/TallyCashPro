"use client";

import { BusinessActivityScreen } from "@/components/business/business-activity-screen";
import { DashboardSubLayout } from "@/layout";
import { use, useState } from "react";
import { BusinessSwitchButton } from "@/components/cards";
import { useGetBooksAuditLogs, useGetCompanyById } from "@/services/business.service";
import { useCompanyMemberRole } from "@/services/check-role.service";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

export default function BusinessActivityPage({
  params,
}: {
  params: Promise<{ businessId: string }>;
}) {
  const { businessId } = use(params);
  const [page] = useState(1);

  const { data: userRole, isLoading: isLoadingRole } =
    useCompanyMemberRole(businessId);
  const { company } = useGetCompanyById(businessId);
  const {
    auditLogs,
    isAuditLogsLoading,
    isAuditLogsError,
    refetchAuditLogs,
  } = useGetBooksAuditLogs(businessId, page, 20);

  return (
    <DashboardSubLayout
      headerTitle="Activity & Logs"
      showPreviousPage
      showTitle
      titleClassName="text-sm md:text-base font-bold"
      compList={[
        {
          comp: (
            <div className="flex items-center gap-2">
              <BusinessSwitchButton />
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-1.5 rounded-full border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-sm cursor-pointer h-9 px-4 font-semibold text-xs transition-all duration-200 active:scale-95"
                onClick={() => refetchAuditLogs()}
                disabled={isAuditLogsLoading}
              >
                <RefreshCw
                  className={`h-3.5 w-3.5 text-slate-500 ${isAuditLogsLoading ? "animate-spin" : ""}`}
                />
                <span>Refresh</span>
              </Button>
            </div>
          ),
          position: "right",
        },
      ]}
    >
      <BusinessActivityScreen
        businessId={businessId}
        auditLogs={auditLogs || []}
        isAuditLogsLoading={isAuditLogsLoading}
        isAuditLogsError={isAuditLogsError}
        refetchAuditLogs={refetchAuditLogs}
        userRole={userRole}
        isLoadingRole={isLoadingRole}
        company={company}
      />
    </DashboardSubLayout>
  );
}
