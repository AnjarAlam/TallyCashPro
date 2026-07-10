"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import {
  BadgeAlert,
  BadgeCheck,
  BadgeMinus,
  Book,
  Calendar,
  RefreshCw,
  User,
  Search,
  Activity,
  PlusCircle,
  X,
  Trash2,
  ChevronRight,
  Filter
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useGetBooksAuditLogs, useGetCompanyById } from "@/services/business.service";
import { useCompanyMemberRole } from "@/services/check-role.service";
import { getBusinessSettingsPermissions } from "@/lib/business-settings-permissions";
import { Input } from "@/components/ui/input";

function getChangeTypeIcon(changeType: string) {
  switch (changeType) {
    case "create":
      return <PlusCircle className="h-4 w-4" />;
    case "update":
      return <RefreshCw className="h-4 w-4" />;
    case "delete":
      return <Trash2 className="h-4 w-4" />;
    default:
      return <BadgeAlert className="h-4 w-4" />;
  }
}

function getMarkerStyle(changeType: string) {
  switch (changeType) {
    case "create":
      return "border-emerald-200 dark:border-emerald-950 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 group-hover:border-emerald-500 group-hover:bg-emerald-500 group-hover:text-white";
    case "update":
      return "border-blue-200 dark:border-blue-950 bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 group-hover:border-blue-500 group-hover:bg-blue-500 group-hover:text-white";
    case "delete":
      return "border-rose-200 dark:border-rose-950 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 group-hover:border-rose-500 group-hover:bg-rose-500 group-hover:text-white";
    default:
      return "border-amber-200 dark:border-amber-950 bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 group-hover:border-amber-500 group-hover:bg-amber-500 group-hover:text-white";
  }
}

function getChangeTypeBadge(changeType: string) {
  switch (changeType) {
    case "create":
      return (
        <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/10 border-0 text-[10px] font-bold px-2 py-0.5 rounded-full">
          Created
        </Badge>
      );
    case "update":
      return (
        <Badge className="bg-blue-500/10 text-blue-700 dark:text-blue-300 hover:bg-blue-500/10 border-0 text-[10px] font-bold px-2 py-0.5 rounded-full">
          Updated
        </Badge>
      );
    case "delete":
      return (
        <Badge className="bg-rose-500/10 text-rose-700 dark:text-rose-300 hover:bg-rose-500/10 border-0 text-[10px] font-bold px-2 py-0.5 rounded-full">
          Deleted
        </Badge>
      );
    default:
      return (
        <Badge className="bg-amber-500/10 text-amber-700 dark:text-amber-300 hover:bg-amber-500/10 border-0 text-[10px] font-bold px-2 py-0.5 rounded-full">
          Modified
        </Badge>
      );
  }
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return (parts[0]?.[0] ?? "U").toUpperCase();
}

interface BusinessActivityScreenProps {
  businessId: string;
  auditLogs: any[];
  isAuditLogsLoading: boolean;
  isAuditLogsError: boolean;
  refetchAuditLogs: () => void;
  userRole: any;
  isLoadingRole: boolean;
  company: any;
}

export function BusinessActivityScreen({
  businessId,
  auditLogs,
  isAuditLogsLoading,
  isAuditLogsError,
  refetchAuditLogs,
  userRole,
  isLoadingRole,
  company
}: BusinessActivityScreenProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<"all" | "create" | "update" | "delete">("all");

  const companyRole = userRole?.data?.companyRole || "staff";
  const { canViewAuditLogs } = getBusinessSettingsPermissions(companyRole);

  // Compute live statistics based on the loaded audit logs
  const stats = useMemo(() => {
    const counts = { total: 0, create: 0, update: 0, delete: 0 };
    if (!auditLogs) return counts;
    counts.total = auditLogs.length;
    auditLogs.forEach((log) => {
      if (log.changeType === "create") counts.create++;
      else if (log.changeType === "update") counts.update++;
      else if (log.changeType === "delete") counts.delete++;
    });
    return counts;
  }, [auditLogs]);

  // Filter logs by search term and filter type
  const filteredLogs = useMemo(() => {
    if (!auditLogs) return [];
    return auditLogs.filter((log) => {
      const matchesType = activeFilter === "all" || log.changeType === activeFilter;
      const cleanSearch = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !cleanSearch ||
        log.changeReason.toLowerCase().includes(cleanSearch) ||
        log.changedBy.name.toLowerCase().includes(cleanSearch);
      return matchesType && matchesSearch;
    });
  }, [auditLogs, searchTerm, activeFilter]);

  if (isLoadingRole) {
    return (
      <div className="space-y-4">
        {/* Skeleton Top Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-16 w-full rounded-2xl" />
          ))}
        </div>
        {/* Skeleton Search Section */}
        <Skeleton className="h-10 w-full max-w-md rounded-full mt-4" />
        {/* Skeleton Timeline logs */}
        <div className="space-y-4 mt-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-28 w-full rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!canViewAuditLogs) {
    return (
      <Alert className="rounded-2xl border-slate-200 bg-white p-6 shadow-sm">
        <AlertTitle className="text-base font-bold text-slate-900">Access denied</AlertTitle>
        <AlertDescription className="text-slate-500 mt-1">
          You do not have permission to view activity logs for this business.
        </AlertDescription>
        <Button variant="outline" className="mt-4 rounded-xl cursor-pointer" asChild>
          <Link href={`/dashboard/business/${businessId}/settings`}>
            Back to settings
          </Link>
        </Button>
      </Alert>
    );
  }

  if (isAuditLogsError) {
    return (
      <Alert variant="destructive" className="rounded-2xl p-6 shadow-sm">
        <AlertTitle className="text-base font-bold">Failed to load activity</AlertTitle>
        <AlertDescription className="mt-1">
          Could not load audit logs. Please check your network connection and try again.
        </AlertDescription>
        <Button
          variant="outline"
          className="mt-4 rounded-xl bg-white text-rose-600 hover:bg-rose-50 border-rose-200 cursor-pointer"
          onClick={() => refetchAuditLogs()}
        >
          Retry
        </Button>
      </Alert>
    );
  }

  return (
    <div className="w-full space-y-3">

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Stats Card */}
        <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-4 shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)] hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 shrink-0">
              <Activity className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Logs</p>
              <p className="text-xl font-extrabold text-slate-950 dark:text-white mt-0.5">{stats.total}</p>
            </div>
          </div>
        </div>

        {/* Creates Stats Card */}
        <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-4 shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)] hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 shrink-0">
              <PlusCircle className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Created</p>
              <p className="text-xl font-extrabold text-slate-950 dark:text-white mt-0.5">{stats.create}</p>
            </div>
          </div>
        </div>

        {/* Updates Stats Card */}
        <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-4 shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)] hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 shrink-0">
              <RefreshCw className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Updated</p>
              <p className="text-xl font-extrabold text-slate-950 dark:text-white mt-0.5">{stats.update}</p>
            </div>
          </div>
        </div>

        {/* Deletes Stats Card */}
        <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-4 shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)] hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10 text-rose-600 shrink-0">
              <Trash2 className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Deleted</p>
              <p className="text-xl font-extrabold text-slate-950 dark:text-white mt-0.5">{stats.delete}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between pt-2">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            type="text"
            placeholder="Search logs by description or user..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-9 h-10 rounded-full border-slate-200 bg-white hover:border-slate-300 focus:border-slate-400 focus:ring-4 focus:ring-slate-100 transition-all shadow-xs text-sm"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 active:scale-90 transition-all cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {(["all", "create", "update", "delete"] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`
                px-3 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer whitespace-nowrap
                ${activeFilter === filter
                  ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                  : "bg-white hover:bg-slate-50 text-slate-600 border-slate-200"
                }
              `}
            >
              {filter === "all" ? "All Activity" : filter === "create" ? "Created" : filter === "update" ? "Updated" : "Deleted"}
            </button>
          ))}
        </div>
      </div>

      {/* Activity Logs Content */}
      {isAuditLogsLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-28 w-full rounded-2xl" />
          ))}
        </div>
      ) : filteredLogs.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white/50 p-12 text-center shadow-xs">
          <Book className="h-10 w-10 mx-auto text-slate-300 mb-3" />
          <p className="font-semibold text-slate-700 dark:text-slate-300">No logs match your filter</p>
          <p className="text-xs text-slate-400 mt-1">
            Try adjusting your search criteria or filter type.
          </p>
          {(searchTerm || activeFilter !== "all") && (
            <Button
              variant="outline"
              size="sm"
              className="mt-4 rounded-xl cursor-pointer"
              onClick={() => {
                setSearchTerm("");
                setActiveFilter("all");
              }}
            >
              Reset Filters
            </Button>
          )}
        </div>
      ) : (
        <div className="relative border-l border-slate-100 dark:border-slate-800 ml-4 md:ml-6 pl-8 space-y-6 pt-2">
          {filteredLogs.map((log) => (
            <div key={log._id} className="relative group">
              {/* Timeline marker with glow and type-specific style */}
              <div className={`absolute -left-[48px] top-1 flex h-8 w-8 items-center justify-center rounded-full border shadow-sm transition-all duration-300 z-10 ${getMarkerStyle(log.changeType)}`}>
                {getChangeTypeIcon(log.changeType)}
              </div>

              {/* Log Entry Card */}
              <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-4 shadow-[0_2px_8px_-3px_rgba(0,0,0,0.04)] hover:shadow-md hover:border-slate-200/80 dark:hover:border-slate-750 transition-all duration-300">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-3.5">
                  <div className="flex flex-wrap items-center gap-2 min-w-0">
                    {getChangeTypeBadge(log.changeType)}
                    <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
                      {log.changeReason}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 dark:text-slate-500 whitespace-nowrap shrink-0 flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                    {formatDistanceToNow(new Date(log.changedAt), { addSuffix: true })}
                  </span>
                </div>

                <Separator className="my-3 bg-slate-100/80 dark:bg-slate-800" />

                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-2">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-600 dark:text-slate-300 shrink-0">
                      {getInitials(log.changedBy.name)}
                    </div>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{log.changedBy.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-extrabold tracking-wider px-1.5 py-0.5 rounded bg-slate-50 dark:bg-slate-800 text-slate-400 shrink-0">
                      Timestamp
                    </span>
                    <span className="font-medium text-slate-500">
                      {new Date(log.changedAt).toLocaleDateString()} at{" "}
                      {new Date(log.changedAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
