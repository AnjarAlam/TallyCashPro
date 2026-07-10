"use client"
import { AnchorButton } from "@/components/ui/anchor-button"
import { ExportButton } from "@/components/buttons/export-button"
import type { compConfigProps } from "@/components/navigation/dashboard/title-header"
import { DashboardSubLayout } from "@/layout"
import { Users, BarChart3, History } from "lucide-react"
import { use } from "react"
import { hasPermission } from "@/lib"
import { useCashbookMemberRole, useCompanyMemberRole } from "@/services"
import { useAuth } from "@/hooks"
import { safeLocalStorage } from "@/lib/safe-storage"

export default function DetailsPage({
  params,
}: {
  params: Promise<{ businessId: string; cashbookId: string }>
}) {
  const { user } = useAuth()
  const { businessId, cashbookId } = use(params)

  const { data: userRole } = useCompanyMemberRole(businessId)

  const { data: userCashbookRole } = useCashbookMemberRole(cashbookId, user?._id || "")

  const token = user?.accessToken || (typeof window !== "undefined" ? safeLocalStorage.getItem("token") : null)

  const NavComps: compConfigProps = []

  const canExport = hasPermission(
    {
      businessRole: userRole?.data.companyRole || "staff",
      cashbookRole: userCashbookRole?.data?.BookRole || "viewer",
    },
    "export_transaction",
    "R",
  )

  const canViewAuditLogs = hasPermission(
    {
      businessRole: userRole?.data.companyRole || "staff",
      cashbookRole: userCashbookRole?.data?.BookRole || "viewer",
    },
    "view_audit_logs",
    "R",
  )

  return (
    <DashboardSubLayout headerTitle="Cashbook Settings" showPreviousPage compList={NavComps}>
      <div className="w-full max-w-full overflow-hidden px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">Manage Cashbook</h2>

          {/* Settings Buttons Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {/* Members Button */}
            <AnchorButton
              href={`/dashboard/business/${businessId}/${cashbookId}/team`}
              className={`
                flex items-center justify-center gap-2 
                px-3 sm:px-4 py-3 sm:py-4
                text-sm sm:text-base font-semibold 
                rounded-lg border transition-all 
                bg-primary border-primary text-white 
                hover:shadow hover:shadow-red-10 
                hover:cursor-pointer hover:bg-transparent hover:text-primary 
                active:scale-95
              `}
            >
              <Users className="h-4 w-4 sm:h-5 sm:w-5" />
              <span>Members</span>
            </AnchorButton>

            {/* Analytics Button */}
            <AnchorButton
              href={`/dashboard/business/${businessId}/${cashbookId}/analytics`}
              className={`
                flex items-center justify-center gap-2 
                px-3 sm:px-4 py-3 sm:py-4
                text-sm sm:text-base font-semibold 
                rounded-lg border transition-all 
                bg-indigo-600 border-indigo-600 text-white 
                hover:shadow hover:shadow-indigo-10 
                hover:cursor-pointer hover:bg-transparent hover:text-indigo-600 
                active:scale-95
              `}
            >
              <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5" />
              <span>Analytics</span>
            </AnchorButton>

            {/* Export Button */}
            {canExport && token && <ExportButton bookId={cashbookId} businessId={businessId} token={token} />}

            {/* Audit Logs Button */}
            {canViewAuditLogs && (
              <AnchorButton
                href={`/dashboard/business/${businessId}/${cashbookId}/audit-logs`}
                className={`
                  flex items-center justify-center gap-2 
                  px-3 sm:px-4 py-3 sm:py-4
                  text-sm sm:text-base font-semibold 
                  rounded-lg border transition-all 
                  bg-gray-100 border-gray-300 text-gray-700 
                  hover:bg-gray-200 hover:border-gray-400 hover:text-gray-900
                  active:scale-95
                `}
              >
                <History className="h-4 w-4 sm:h-5 sm:w-5" />
                <span>Audit Logs</span>
              </AnchorButton>
            )}
          </div>
        </div>
      </div>
    </DashboardSubLayout>
  )
}
