"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ChevronRight,
  History,
  Pencil,
  Trash2,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  formatCompanyRole,
  getBusinessSettingsPermissions,
} from "@/lib/business-settings-permissions";
import { useGetCompanyById } from "@/services";
import { useGetCashbookList } from "@/services/cashbook.service";
import { useCompanyMemberRole } from "@/services/check-role.service";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Card, CardFooter } from "@/components/ui/card";
import { DeleteConfirmationForm, EditBusinessForm } from "@/components/form";
import ModalLayout from "@/components/modals/modal-layout";

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return (parts[0]?.[0] ?? "B").toUpperCase();
}

interface SettingsMenuRowProps {
  icon: React.ReactNode;
  iconClassName?: string;
  title: string;
  subtitle: string;
  href?: string;
  onClick?: () => void;
  destructive?: boolean;
}

function SettingsMenuRow({
  icon,
  iconClassName,
  title,
  subtitle,
  href,
  onClick,
  destructive,
}: SettingsMenuRowProps) {
  const inner = (
    <>
      <div
        className={cn(
          "flex h-11 w-11 shrink-0 items-center justify-center rounded-full",
          iconClassName ?? "bg-blue-50 text-blue-600",
        )}
      >
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "text-sm font-semibold",
            destructive ? "text-red-600" : "text-slate-900",
          )}
        >
          {title}
        </p>
        <p className="text-xs text-slate-500 mt-0.5 leading-snug">{subtitle}</p>
      </div>
      <ChevronRight
        className={cn(
          "h-4 w-4 shrink-0",
          destructive ? "text-red-300" : "text-slate-400",
        )}
      />
    </>
  );

  const rowClass =
    "flex w-full items-center gap-3 px-4 py-4 text-left transition-colors hover:bg-slate-50/90";

  if (href) {
    return (
      <Link href={href} className={rowClass}>
        {inner}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={rowClass}>
      {inner}
    </button>
  );
}

interface BusinessSettingsScreenProps {
  businessId: string;
}

export function BusinessSettingsScreen({ businessId }: BusinessSettingsScreenProps) {
  const [openEditSheet, setOpenEditSheet] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const { data: userRole, isLoading: isLoadingRole } =
    useCompanyMemberRole(businessId);
  const { company, isCompanyPending } = useGetCompanyById(businessId);
  const { cashbookList, isCashbookListPending } = useGetCashbookList(businessId);

  const companyRole = userRole?.data?.companyRole || "staff";
  const permissions = getBusinessSettingsPermissions(companyRole);

  const bookCount = cashbookList?.length ?? 0;
  const displayName = company?.name ?? "Business";
  const initials = getInitials(displayName);
  const statusLabel = company?.isActive !== false ? "Active" : "Inactive";

  if (isLoadingRole || isCompanyPending) {
    return (
      <div className="w-full space-y-4">
        <Skeleton className="h-32 w-full rounded-xl" />
        <Skeleton className="h-48 w-full rounded-xl" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  if (!permissions.hasSettingsAccess) {
    return (
      <div className="w-full rounded-xl border border-slate-200 bg-white p-8 text-center">
        <p className="font-medium text-slate-700">No settings available</p>
        <p className="text-sm text-slate-500 mt-2">
          You do not have permission to manage this business.
        </p>
        <Button variant="outline" className="mt-4" asChild>
          <Link href={`/dashboard/business/${businessId}`}>Back to books</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4 pb-8">
      {/* Business summary card */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-blue-600 text-lg font-semibold text-white">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h2 className="text-lg font-bold text-slate-900 truncate capitalize">
                    {displayName.toLowerCase()}
                  </h2>
                  <div className="text-sm text-slate-500 mt-0.5">
                    {isCashbookListPending ? (
                      <Skeleton className="h-4 w-20" />
                    ) : (
                      `${bookCount} Book${bookCount !== 1 ? "s" : ""}`
                    )}
                  </div>
                </div>
                {permissions.canEdit && company ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="shrink-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                    aria-label="Edit business"
                    onClick={() => setOpenEditSheet(true)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                ) : null}
              </div>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-2 sm:gap-4 border-t border-slate-100 pt-4">
            <div className="text-center sm:text-left">
              <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-slate-400">
                Status
              </p>
              <p
                className={cn(
                  "text-sm font-semibold mt-0.5",
                  company?.isActive !== false ? "text-emerald-600" : "text-slate-500",
                )}
              >
                {statusLabel}
              </p>
            </div>
            <div className="text-center sm:text-left border-x border-slate-100 px-2">
              <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-slate-400">
                Your role
              </p>
              <p className="text-sm font-semibold text-slate-900 mt-0.5">
                {formatCompanyRole(companyRole)}
              </p>
            </div>
            <div className="text-center sm:text-left">
              <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-slate-400">
                Category
              </p>
              <p className="text-sm font-semibold text-slate-900 mt-0.5 capitalize truncate">
                {company?.category ?? "—"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Settings menu */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden divide-y divide-slate-100">
        {permissions.canViewAuditLogs ? (
          <SettingsMenuRow
            icon={<History className="h-5 w-5" />}
            title="Activity & Logs"
            subtitle="Track all changes, activities and transaction history"
            href={`/dashboard/business/${businessId}/activity`}
          />
        ) : null}

        {permissions.canManageTeam ? (
          <SettingsMenuRow
            icon={<Users className="h-5 w-5" />}
            title="Team Management"
            subtitle="Invite members and manage roles for this business"
            href={`/dashboard/business/${businessId}/team`}
          />
        ) : null}

        <SettingsMenuRow
          icon={<Trash2 className="h-5 w-5" />}
          title="Deleted books"
          subtitle="Restore books removed from this business (15 days)"
          href={`/dashboard/business/${businessId}/settings/deleted-books`}
        />

        {permissions.canDelete && company ? (
          <SettingsMenuRow
            icon={<Trash2 className="h-5 w-5" />}
            iconClassName="bg-red-50 text-red-600"
            title="Delete business"
            subtitle="Permanently remove this business and all data (owner only)"
            destructive
            onClick={() => setOpenDeleteModal(true)}
          />
        ) : null}
      </div>

      {permissions.canEdit && company ? (
        <Dialog open={openEditSheet} onOpenChange={setOpenEditSheet}>
          <DialogContent className="w-[92%] sm:min-w-[536px] max-h-[90vh] overflow-y-auto p-5 bg-white rounded-2xl border border-slate-200/50 shadow-2xl scrollbar-none">
            <DialogTitle className="sr-only">Edit business</DialogTitle>
            <EditBusinessForm
              onClose={() => setOpenEditSheet(false)}
              business={company}
            />
          </DialogContent>
        </Dialog>
      ) : null}

      {permissions.canDelete && company ? (
        <ModalLayout
          open={openDeleteModal}
          onOpenChange={setOpenDeleteModal}
          trigger={<div className="hidden" />}
        >
          <Card className="bg-white p-4 rounded-lg shadow-md">
            <CardFooter className="w-full p-0">
              <DeleteConfirmationForm
                onClose={() => setOpenDeleteModal(false)}
                id={company._id}
                type="business"
                itemName="Business"
              />
            </CardFooter>
          </Card>
        </ModalLayout>
      ) : null}
    </div>
  );
}
