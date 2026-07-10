"use client";

import { useState, useMemo } from "react";
import { use } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  User, 
  FileText, 
  Calendar, 
  Clock, 
  Plus, 
  Edit, 
  Trash2,
  Download,
  ChevronLeft,
  ChevronRight,
  Activity,
  Filter,
  X,
  Search,
  BarChart3
} from "lucide-react";
import { DashboardSubLayout } from "@/layout";
import { 
  useGetAuditLogs, 
  useGetAuditLogStats,
  useExportAuditLogs,
  formatAuditLogForDisplay,
  FilterAuditLogsParams
} from "@/services/audit-logs.service";
import { format } from "date-fns";
import { IconBox } from "@/components/buttons";
import { useAuth } from "@/hooks";
import { AnchorButton } from "@/components/ui/anchor-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { DatePicker } from "@/components/ui/date-picker";
import { Badge } from "@/components/ui/badge";
import { useGetCashbookList } from "@/services/cashbook.service";

export default function AuditLogsPage({
  params,
}: {
  params: Promise<{ businessId: string; cashbookId: string }>;
}) {
  const { user } = useAuth();
  const { businessId, cashbookId } = use(params);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterAuditLogsParams>({});
  const [searchTerm, setSearchTerm] = useState("");
  
  // Fetch cashbook list to get the current book's name
  const { cashbookList } = useGetCashbookList(businessId);

  // Find the current book from the list
  const currentBook = useMemo(() => {
    return cashbookList.find((book) => book._id === cashbookId);
  }, [cashbookList, cashbookId]);

  // Get the book name with audit logs suffix
  const headerTitle = currentBook?.name
    ? `${currentBook.name} - Audit Logs`
    : "Audit Logs";

  // Fetch audit logs with filters
  const {
    auditLogs,
    totalLogs,
    currentPage,
    totalPages,
    isAuditLogsPending,
    isAuditLogsError,
    auditLogsError,
    refetchAuditLogs,
  } = useGetAuditLogs(cashbookId, page, limit, filters);

  // Fetch audit log statistics
  const {
    stats,
    isStatsPending,
  } = useGetAuditLogStats(cashbookId);

  // Export hook
  const { exportAuditLogs, isExportingAuditLogs } = useExportAuditLogs();

  const handleExport = () => {
    exportAuditLogs({
      bookId: cashbookId,
      businessId,
      format: 'csv',
      filters,
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters(prev => ({
      ...prev,
      search: searchTerm,
    }));
    setPage(1);
  };

  const handleClearFilters = () => {
    setFilters({});
    setSearchTerm("");
    setPage(1);
  };

  const handleFilterChange = (key: keyof FilterAuditLogsParams, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
    setPage(1);
  };

  const hasActiveFilters = Object.keys(filters).length > 0;

  const NavComps = [
    {
      comp: (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowFilters(!showFilters)}
            className="h-8 w-8 sm:h-9 sm:w-9"
          >
            <Filter className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleExport}
            disabled={isExportingAuditLogs}
            className="h-8 w-8 sm:h-9 sm:w-9"
          >
            {isExportingAuditLogs ? (
              <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-current" />
            ) : (
              <Download className="h-4 w-4" />
            )}
          </Button>
        </div>
      ),
      position: "right",
    },
  ];

  return (
    <DashboardSubLayout
      headerTitle={headerTitle}
      showPreviousPage

    >
      <div className="w-full max-w-full overflow-hidden px-3 sm:px-4 md:px-6 lg:px-8">
        {/* Header with Stats */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Audit Logs</h1>
              <p className="text-gray-600 mt-1">
                Track all changes made to transactions in this cashbook
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              {/* {!isStatsPending && (
                <div className="hidden sm:flex items-center gap-3">
                  <Badge variant="outline" className="flex items-center gap-1">
                    <BarChart3 className="h-3 w-3" />
                    {stats.total} total logs
                  </Badge>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    +{stats.byChangeType.create}
                  </Badge>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    ~{stats.byChangeType.update}
                  </Badge>
                  <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                    -{stats.byChangeType.delete}
                  </Badge>
                </div>
              )} */}
            </div>
          </div>

          {/* Search Bar */}
          {/* <form onSubmit={handleSearch} className="mt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by reason, user, or amount..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-10"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm("");
                    handleFilterChange('search', undefined);
                  }}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>
          </form> */}

          {/* Filters Panel */}

        </div>

        {/* Audit Logs Table */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          {/* Table Header */}
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-gray-700">Activity Log</h3>
              <div className="text-sm text-gray-500">
                Showing {(page - 1) * limit + 1} - {Math.min(page * limit, totalLogs)} of {totalLogs}
              </div>
            </div>
          </div>

          {isAuditLogsPending ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="mt-2 text-gray-500">Loading audit logs...</p>
            </div>
          ) : isAuditLogsError ? (
            <div className="p-8 text-center">
              <div className="text-red-500 mb-2">
                <Activity className="h-12 w-12 mx-auto opacity-50" />
              </div>
              <p className="text-gray-700">Failed to load audit logs</p>
              <p className="text-sm text-gray-500 mt-1">
                {auditLogsError?.message || "Please try again"}
              </p>
              <Button
                variant="outline"
                onClick={() => refetchAuditLogs()}
                className="mt-4"
              >
                Retry
              </Button>
            </div>
          ) : auditLogs.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-gray-400 mb-2">
                <Activity className="h-12 w-12 mx-auto" />
              </div>
              <p className="text-gray-700">No audit logs found</p>
              <p className="text-sm text-gray-500 mt-1">
                {hasActiveFilters 
                  ? "Try adjusting your filters" 
                  : "Changes made to transactions will appear here"
                }
              </p>
              {hasActiveFilters && (
                <Button
                  variant="outline"
                  onClick={handleClearFilters}
                  className="mt-4"
                >
                  Clear Filters
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Transaction
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Changed By
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Reason
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date & Time
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {auditLogs.map((log) => {
                    const formattedLog = formatAuditLogForDisplay(log);
                    
                    return (
                      <tr key={log._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className={`p-1.5 rounded-full ${formattedLog.displayChangeType.color === 'green' ? 'bg-green-100' : formattedLog.displayChangeType.color === 'blue' ? 'bg-blue-100' : 'bg-red-100'}`}>
                              {formattedLog.displayChangeType.icon === 'plus' && <Plus className="h-3.5 w-3.5 text-green-600" />}
                              {formattedLog.displayChangeType.icon === 'edit' && <Edit className="h-3.5 w-3.5 text-blue-600" />}
                              {formattedLog.displayChangeType.icon === 'trash' && <Trash2 className="h-3.5 w-3.5 text-red-600" />}
                            </div>
                            <span className="ml-2 text-sm font-medium text-gray-900">
                              {formattedLog.displayChangeType.label}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className={`p-1.5 rounded-full ${formattedLog.displayTransactionType.color === 'green' ? 'bg-green-100' : 'bg-red-100'}`}>
                              <FileText className={`h-3.5 w-3.5 ${formattedLog.displayTransactionType.color === 'green' ? 'text-green-600' : 'text-red-600'}`} />
                            </div>
                            <div className="ml-2">
                              <div className="font-medium text-gray-900">
                                {formattedLog.displayTransactionType.label}
                              </div>
                              <div className="text-sm text-gray-600">
                                {formattedLog.amountFormatted}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="p-1.5 rounded-full bg-gray-100">
                              <User className="h-3.5 w-3.5 text-gray-600" />
                            </div>
                            <div className="ml-2">
                              <div className="font-medium text-gray-900">
                                {log.changedBy.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {log.changedBy.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="max-w-xs">
                            <div className="text-sm text-gray-900">
                              {log.changeReason}
                            </div>
                            {log.oldValues && (
                              <Badge variant="outline" className="mt-1 text-xs">
                                Updated Fields
                              </Badge>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="p-1.5 rounded-full bg-gray-100">
                              <Calendar className="h-3.5 w-3.5 text-gray-600" />
                            </div>
                            <div className="ml-2">
                              <div className="text-sm text-gray-900">
                                {formattedLog.formattedDate}
                              </div>
                              <div className="text-xs text-gray-500">
                                {formattedLog.formattedTime}
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm text-gray-700">
                  Page <span className="font-medium">{currentPage}</span> of{" "}
                  <span className="font-medium">{totalPages}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                    disabled={page === 1}
                    size="sm"
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </Button>
                  <div className="hidden sm:flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (page <= 3) {
                        pageNum = i + 1;
                      } else if (page >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = page - 2 + i;
                      }
                      
                      return (
                        <Button
                          key={pageNum}
                          variant={page === pageNum ? "default" : "outline"}
                          onClick={() => setPage(pageNum)}
                          size="sm"
                          className="min-w-9"
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={page === totalPages}
                    size="sm"
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Back Button */}
        <div className="mt-6">
          <Link
            href={`/dashboard/business/${businessId}/${cashbookId}`}
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Cashbook
          </Link>
        </div>
      </div>
    </DashboardSubLayout>
  );
}