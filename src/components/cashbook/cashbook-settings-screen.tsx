"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  BarChart3,
  ChevronRight,
  History,
  Pencil,
  Recycle,
  Tag,
  Trash2,
  UserRoundSearch,
  Users,
  Wallet,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useGetCashbookById } from "@/services/cashbook.service";
import { useCashbookMemberRole, useCompanyMemberRole } from "@/services";
import { useAuth } from "@/hooks";
import { hasPermission } from "@/lib";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardFooter } from "@/components/ui/card";
import { DeleteConfirmationForm } from "@/components/form/delete-form";
import EditCashbookForm from "@/components/form/cashbook/edit-cashbook";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";

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

interface CashbookSettingsScreenProps {
  businessId: string;
  cashbookId: string;
}

export function CashbookSettingsScreen({
  businessId,
  cashbookId,
}: CashbookSettingsScreenProps) {
  const router = useRouter();
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openEditSheet, setOpenEditSheet] = useState(false);
  const { user } = useAuth();
  const { cashbook, isCashbookPending } = useGetCashbookById(
    businessId,
    cashbookId,
  );
  const { data: userRole } = useCompanyMemberRole(businessId);
  const { data: userCashbookRole } = useCashbookMemberRole(
    cashbookId,
    user?._id || "",
  );

  const canViewAuditLogs = hasPermission(
    {
      businessRole: userRole?.data.companyRole || "staff",
      cashbookRole: userCashbookRole?.data?.BookRole || "viewer",
    },
    "view_audit_logs",
    "R",
  );

  const canDelete = hasPermission(
    {
      businessRole: userRole?.data.companyRole || "staff",
      cashbookRole: userCashbookRole?.data?.BookRole || "viewer",
    },
    "crud_cashbook",
    "D",
  );

  const canEdit = hasPermission(
    {
      businessRole: userRole?.data.companyRole || "staff",
      cashbookRole: userCashbookRole?.data?.BookRole || "viewer",
    },
    "crud_cashbook",
    "U",
  );

  const displayName = cashbook?.name ?? "Cashbook";
  const initials = getInitials(displayName);
  const basePath = `/dashboard/business/${businessId}/${cashbookId}`;

  if (isCashbookPending) {
    return (
      <div className="w-full space-y-4">
        <Skeleton className="h-32 w-full rounded-xl" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="w-full space-y-4 pb-8">
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
                    {displayName}
                  </h2>
                  <p className="text-sm text-slate-500 mt-0.5">Cashbook settings</p>
                </div>
                {canEdit && cashbook ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="shrink-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                    aria-label="Edit cashbook"
                    onClick={() => setOpenEditSheet(true)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden divide-y divide-slate-100">
        <SettingsMenuRow
          icon={<Users className="h-5 w-5" />}
          title="Members"
          subtitle="Manage team members and roles for this cashbook"
          href={`${basePath}/team`}
        />
        <SettingsMenuRow
          icon={<BarChart3 className="h-5 w-5" />}
          iconClassName="bg-indigo-50 text-indigo-600"
          title="Analytics"
          subtitle="View cash in, cash out, and category breakdown"
          href={`${basePath}/analytics`}
        />
        {canViewAuditLogs ? (
          <SettingsMenuRow
            icon={<History className="h-5 w-5" />}
            iconClassName="bg-slate-100 text-slate-600"
            title="Audit Logs"
            subtitle="Track changes and activity history"
            href={`${basePath}/audit-logs`}
          />
        ) : null}
        <SettingsMenuRow
          icon={<Tag className="h-5 w-5" />}
          iconClassName="bg-emerald-50 text-emerald-600"
          title="Category"
          subtitle="Manage transaction categories"
          href={`${basePath}/fields/category`}
        />
        <SettingsMenuRow
          icon={<Wallet className="h-5 w-5" />}
          iconClassName="bg-amber-50 text-amber-600"
          title="Payment Mode"
          subtitle="Manage payment methods for transactions"
          href={`${basePath}/fields/payment-mode`}
        />
        <SettingsMenuRow
          icon={<UserRoundSearch className="h-5 w-5" />}
          iconClassName="bg-violet-50 text-violet-600"
          title="Parties"
          subtitle="Manage customers and suppliers for transactions"
          href={`${basePath}/fields/parties`}
        />
        <SettingsMenuRow
          icon={<Recycle className="h-5 w-5" />}
          iconClassName="bg-rose-50 text-rose-600"
          title="Recycle bin"
          subtitle="View and restore deleted transactions"
          href={`${basePath}/setting/recycle-bin`}
        />
        {canDelete ? (
          <SettingsMenuRow
            icon={<Trash2 className="h-5 w-5" />}
            iconClassName="bg-red-50 text-red-600"
            title="Delete book"
            subtitle="Move this cashbook to deleted books (restorable for 15 days)"
            destructive
            onClick={() => setOpenDeleteModal(true)}
          />
        ) : null}
      </div>

      {canDelete ? (
        <Dialog open={openDeleteModal} onOpenChange={setOpenDeleteModal}>
          <DialogContent className="max-w-md p-0 overflow-hidden border-none bg-transparent shadow-none">
            <DialogHeader className="sr-only">
              <DialogTitle>Move book to deleted books</DialogTitle>
            </DialogHeader>
            <Card className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
              <CardFooter className="w-full p-0">
                <DeleteConfirmationForm
                  onClose={() => setOpenDeleteModal(false)}
                  onSuccess={() => {
                    setOpenDeleteModal(false);
                    router.push(`/dashboard/business/${businessId}`);
                  }}
                  id={cashbookId}
                  type="cashbook"
                  companyId={businessId}
                  itemName={displayName}
                />
              </CardFooter>
            </Card>
          </DialogContent>
        </Dialog>
      ) : null}

      {canEdit && cashbook ? (
        <Sheet open={openEditSheet} onOpenChange={setOpenEditSheet}>
          <SheetContent
            side="right"
            className="overflow-y-auto pb-4 w-full sm:min-w-1/2 lg:min-w-1/3"
          >
            <DialogTitle className="sr-only">Edit cashbook</DialogTitle>
            <EditCashbookForm
              onClose={() => setOpenEditSheet(false)}
              businessId={businessId}
              cashbook={cashbook}
            />
          </SheetContent>
        </Sheet>
      ) : null}
    </div>
  );
}
