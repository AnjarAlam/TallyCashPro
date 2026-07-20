"use client";

import { ReactNode, useState, useEffect } from "react";
import {
  Download,
  FileSpreadsheet,
  FileText,
  Filter,
  ChevronDown,
  Landmark,
  CreditCard,
  Loader2,
  CalendarIcon,
  ArrowDownCircle,
  ArrowUpCircle,
  XCircle,
  CheckCircle,
  AlertCircle,
  Printer,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { exportService } from "@/services/export-service";
import { useGetCategories } from "@/services";
import { useGetPaymentModes } from "@/services/payment-mode.service";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";

interface ExportButtonProps {
  bookId: string;
  businessId: string;
  token: string;
  children?: ReactNode;
  variant?: string;
  className?: string;
  filters?: Record<string, any>;
  disabled?: boolean;
}

interface ExportFilters {
  startDate: Date;
  endDate: Date;
  transactionType: string;
  paymentMode: string;
  category: string;
  searchQuery: string;
  pageSize: number;
}

export function ExportButton({ bookId, businessId, token, disabled }: ExportButtonProps) {
  const { toast } = useToast();
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [exportType, setExportType] = useState<"pdf" | "excel" | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isMonthlyReportDialogOpen, setIsMonthlyReportDialogOpen] = useState(false);
  const [monthlyReportType, setMonthlyReportType] = useState<"pdf" | "excel" | null>(null);
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
  const [filters, setFilters] = useState<ExportFilters>({
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)), // Default to 1 month ago
    endDate: new Date(),
    transactionType: "all",
    paymentMode: "all",
    category: "all",
    searchQuery: "",
    pageSize: 100,
  });

  // Fetch categories and payment modes
  const {
    categories,
    isCategoriesPending,
    refetchCategories,
  } = useGetCategories({
    businessId,
  });

  const {
    data: paymentModesData,
    isLoading: isPaymentModesLoading,
  } = useGetPaymentModes(businessId, "active");

  // Refetch categories when transaction type changes
  useEffect(() => {
    if (filters.transactionType && filters.transactionType !== "all") {
      refetchCategories();
    }
  }, [filters.transactionType, refetchCategories]);

  const getFormattedDateRange = () => {
    if (filters.startDate && filters.endDate) {
      const formattedStart = format(filters.startDate, "MMM dd, yyyy");
      const formattedEnd = format(filters.endDate, "MMM dd, yyyy");
      return `${formattedStart} - ${formattedEnd}`;
    }
    return "";
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.transactionType !== "all") count++;
    if (filters.paymentMode !== "all") count++;
    if (filters.category !== "all") count++;
    if (filters.pageSize !== 100) count++;
    if (filters.searchQuery) count++;
    
    // Check if date range is not default (last month to today)
    const defaultStartDate = new Date(new Date().setMonth(new Date().getMonth() - 1));
    const defaultStartStr = format(defaultStartDate, "yyyy-MM-dd");
    const currentStartStr = format(filters.startDate, "yyyy-MM-dd");
    const currentEndStr = format(filters.endDate, "yyyy-MM-dd");
    const todayStr = format(new Date(), "yyyy-MM-dd");
    
    if (currentStartStr !== defaultStartStr || currentEndStr !== todayStr) count++;
    
    return count;
  };

  const handleExport = async (type: "pdf" | "excel") => {
    if (isExporting || !type) return;

    setIsExporting(true);
    try {
      // Prepare filters for the service
      const exportFilters = {
        startDate: format(filters.startDate, "yyyy-MM-dd"),
        endDate: format(filters.endDate, "yyyy-MM-dd"),
        transactionType: filters.transactionType === "all" ? "" : filters.transactionType,
        paymentMode: filters.paymentMode === "all" ? "" : filters.paymentMode.split("#")[1] || "",
        category: filters.category === "all" ? "" : filters.category.split("#")[1] || "",
        searchQuery: filters.searchQuery,
        pageSize: filters.pageSize,
        pageNumber: 1,
      };

      console.log(`Exporting ${type} with filters:`, exportFilters);

      // Download the export file
      const blob = await exportService.downloadExport({
        bookId,
        token,
        filters: exportFilters,
        type,
      });

      // Generate filename and trigger download
      const fileName = exportService.getFileName(bookId, type);
      exportService.triggerDownload(blob, fileName);

      // Show success toast
      const fileType = type === "pdf" ? "PDF" : "Excel";
      const dateRange = getFormattedDateRange();
      const filtersCount = getActiveFiltersCount();
      
      let description = `Your transactions have been successfully exported to ${fileType}.`;
      if (dateRange) {
        description += ` Date range: ${dateRange}`;
      }
      if (filtersCount > 0) {
        description += ` (${filtersCount} filter${filtersCount > 1 ? 's' : ''} applied)`;
      }

      toast({
        title: (
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="font-semibold">Export Successful</span>
          </div>
        ),
        description: (
          <div className="space-y-1">
            <p className="text-sm">{description}</p>
            <p className="text-xs text-gray-500">
              The file "{fileName}" has been downloaded to your device.
            </p>
          </div>
        ),
        duration: 5000,
      });

      // Close dialog and reset state
      setIsExportDialogOpen(false);
      setExportType(null);
    } catch (error) {
      console.error("Export error:", error);
      
      // Enhanced error handling with specific messages
      let errorTitle = "Export Failed";
      let errorDescription = "Failed to export transactions. Please try again.";
      
      if (error instanceof Error) {
        if (error.message.includes("network") || error.message.includes("Network")) {
          errorTitle = "Network Error";
          errorDescription = "Please check your internet connection and try again.";
        } else if (error.message.includes("timeout") || error.message.includes("Timeout")) {
          errorTitle = "Request Timeout";
          errorDescription = "The export request took too long. Please try with fewer records.";
        } else if (error.message.includes("auth") || error.message.includes("unauthorized")) {
          errorTitle = "Authentication Error";
          errorDescription = "Your session may have expired. Please refresh the page.";
        }
      }

      toast({
        title: (
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <span className="font-semibold">{errorTitle}</span>
          </div>
        ),
        description: errorDescription,
        duration: 7000,
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportClick = (type: "pdf" | "excel") => {
    setExportType(type);
    setIsExportDialogOpen(true);
  };

  const handleMonthlyReportClick = (type: "pdf" | "excel") => {
    setMonthlyReportType(type);
    setIsMonthlyReportDialogOpen(true);
  };

  const handleDownloadMonthlyReport = async () => {
    if (!monthlyReportType || !selectedYear || isExporting) return;

    setIsExporting(true);
    try {
      const blob = await exportService.downloadMonthlyReport({
        bookId,
        token,
        year: selectedYear,
        type: monthlyReportType,
      });

      const fileName = exportService.getMonthlyReportFileName(bookId, selectedYear, monthlyReportType);
      exportService.triggerDownload(blob, fileName);

      toast({
        title: (
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="font-semibold">Download Successful</span>
          </div>
        ),
        description: `Category-Month Report (${monthlyReportType.toUpperCase()}) for ${selectedYear} has been downloaded.`,
        duration: 3000,
      });

      // Close dialog and reset
      setIsMonthlyReportDialogOpen(false);
      setMonthlyReportType(null);
    } catch (error) {
      console.error('Monthly report download error:', error);
      toast({
        title: (
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <span className="font-semibold">Download Failed</span>
          </div>
        ),
        description: error instanceof Error ? error.message : "Failed to download monthly report",
        duration: 5000,
      });
    } finally {
      setIsExporting(false);
    }
  };

  // Generate year options (current year and past 10 years)
  const yearOptions = Array.from({ length: 11 }, (_, i) => {
    const year = new Date().getFullYear() - i;
    return year.toString();
  });

  const resetFilters = () => {
    setFilters({
      startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)),
      endDate: new Date(),
      transactionType: "all",
      paymentMode: "all",
      category: "all",
      searchQuery: "",
      pageSize: 100,
    });
    
    toast({
      title: "Filters Reset",
      description: "All export filters have been reset to default values.",
      duration: 3000,
    });
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild disabled={disabled}>
          <Button 
            variant="outline" 
            disabled={disabled}
            className={`flex items-center gap-2 border-[#3b82f6] bg-[#f0f4ff] hover:bg-[#e0ebff] text-[#3b82f6] w-full sm:w-auto text-xs px-5 py-2 h-9 font-semibold rounded-full shadow-sm transition-colors ${
              disabled 
                ? "opacity-50 cursor-not-allowed pointer-events-none" 
                : "cursor-pointer"
            }`}
          >
            <Printer className="h-4 w-4 text-[#3b82f6]" />
            <span>View report</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center" className="w-64">
          <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 uppercase">
            Transaction Reports
          </div>
          <DropdownMenuItem 
            onClick={() => handleExportClick("pdf")}
            className="flex items-center gap-2 py-3 text-sm cursor-pointer hover:bg-gray-50"
          >
            <FileText className="h-4 w-4 text-blue-600" />
            <span>Daily Report (PDF)</span>
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => handleExportClick("excel")}
            className="flex items-center gap-2 py-3 text-sm cursor-pointer hover:bg-gray-50"
          >
            <FileSpreadsheet className="h-4 w-4 text-green-600" />
            <span>Daily Report (Excel)</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 uppercase">
            Monthly Reports
          </div>
          <DropdownMenuItem 
            onClick={() => handleMonthlyReportClick("pdf")}
            className="flex items-center gap-2 py-3 text-sm cursor-pointer hover:bg-gray-50"
          >
            <FileText className="h-4 w-4 text-orange-600" />
            <span>Category-Month Report (PDF)</span>
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => handleMonthlyReportClick("excel")}
            className="flex items-center gap-2 py-3 text-sm cursor-pointer hover:bg-gray-50"
          >
            <FileSpreadsheet className="h-4 w-4 text-teal-600" />
            <span>Category-Month Report (Excel)</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
        <DialogContent className="w-[95vw] max-w-[600px] max-h-[90vh] overflow-y-auto p-0">
          <DialogHeader className="p-6 pb-4 border-b">
            <div className="flex items-start justify-between">
              <div>
                <DialogTitle className="flex items-center gap-2 text-xl">
                  <Download className="h-5 w-5" />
                  Export as {exportType?.toUpperCase()}
                </DialogTitle>
                <DialogDescription className="text-sm text-gray-600 mt-1">
                  Apply filters to customize your {exportType?.toUpperCase()} export
                </DialogDescription>
              </div>
              {activeFiltersCount > 0 && (
                <div className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">
                  <Filter className="h-3 w-3" />
                  <span>{activeFiltersCount} active filter{activeFiltersCount > 1 ? 's' : ''}</span>
                </div>
              )}
            </div>
          </DialogHeader>
          
          <div className="p-6 space-y-6">
            {/* Date Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3 border border-gray-300 bg-white p-4 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-md bg-blue-50">
                    <CalendarIcon className="h-4 w-4 text-blue-700" />
                  </div>
                  <Label className="text-sm font-medium text-gray-700">
                    Start Date
                  </Label>
                </div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal border-gray-300 hover:bg-gray-50",
                        !filters.startDate && "text-gray-500"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
                      {filters.startDate ? (
                        format(filters.startDate, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 border-gray-300 shadow-lg z-[99999]">
                    <Calendar
                      mode="single"
                      selected={filters.startDate}
                      onSelect={(date) => date && setFilters({...filters, startDate: date})}
                      disabled={(date) => date > new Date() || date > filters.endDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-3 border border-gray-300 bg-white p-4 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-md bg-blue-50">
                    <CalendarIcon className="h-4 w-4 text-blue-700" />
                  </div>
                  <Label className="text-sm font-medium text-gray-700">
                    End Date
                  </Label>
                </div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal border-gray-300 hover:bg-gray-50",
                        !filters.endDate && "text-gray-500"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
                      {filters.endDate ? (
                        format(filters.endDate, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 border-gray-300 shadow-lg z-[99999]">
                    <Calendar
                      mode="single"
                      selected={filters.endDate}
                      onSelect={(date) => date && setFilters({...filters, endDate: date})}
                      disabled={(date) => date > new Date() || date < filters.startDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Transaction Type */}
            <div className="space-y-3 border border-gray-300 bg-white p-4 rounded-lg">
              <div className="flex items-center gap-3">
                <Label className="text-sm font-medium text-gray-700">
                  Transaction Type
                </Label>
                {filters.transactionType !== "all" && (
                  <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                    Active
                  </span>
                )}
              </div>
              <div className="flex gap-3 flex-wrap">
                <button
                  type="button"
                  onClick={() => setFilters({...filters, transactionType: "all"})}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-colors hover:cursor-pointer ${
                    filters.transactionType === "all"
                      ? "bg-blue-100 border-blue-300 text-blue-800 shadow-sm"
                      : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <span>All Types</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFilters({...filters, transactionType: "cash_in"})}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-colors hover:cursor-pointer ${
                    filters.transactionType === "cash_in"
                      ? "bg-green-100 border-green-300 text-green-800 shadow-sm"
                      : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <ArrowDownCircle className="h-4 w-4" />
                  <span>Cash In</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFilters({...filters, transactionType: "cash_out"})}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-colors hover:cursor-pointer ${
                    filters.transactionType === "cash_out"
                      ? "bg-red-100 border-red-300 text-red-800 shadow-sm"
                      : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <ArrowUpCircle className="h-4 w-4" />
                  <span>Cash Out</span>
                </button>
              </div>
            </div>

            {/* Category */}
            <div className="space-y-3 border border-gray-300 bg-white p-4 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-md bg-purple-50">
                  <Landmark className="h-4 w-4 text-purple-700" />
                </div>
                <Label className="text-sm font-medium text-gray-700 flex-1">
                  Category
                </Label>
                {filters.category !== "all" && (
                  <span className="text-xs px-2 py-1 bg-purple-50 text-purple-600 rounded-full truncate max-w-[120px]">
                    {filters.category.split("#")[1]?.toLowerCase()}
                  </span>
                )}
              </div>
              <Select
                value={filters.category}
                onValueChange={(value) => setFilters({...filters, category: value})}
                disabled={isCategoriesPending}
              >
                <SelectTrigger className="border-gray-300 focus-visible:ring-1 focus-visible:ring-gray-400 w-full h-10">
                  <SelectValue
                    placeholder={
                      isCategoriesPending
                        ? "Loading categories..."
                        : "Select a category"
                    }
                  />
                </SelectTrigger>
                <SelectContent
                  align="center"
                  position="item-aligned"
                  className="z-[9999] border-gray-300 shadow-md max-h-60"
                >
                  {isCategoriesPending ? (
                    <div className="flex items-center justify-center p-4">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  ) : categories && categories.length > 0 ? (
                    <>
                      <SelectItem
                        value="all"
                        className="hover:bg-gray-100 text-gray-700"
                      >
                        All Categories
                      </SelectItem>
                      {categories.map((category) => (
                        <SelectItem
                          key={category._id}
                          value={`${category._id}#${category.name}`}
                          className="hover:bg-gray-100 capitalize"
                        >
                          {category.name.toLowerCase()}
                        </SelectItem>
                      ))}
                    </>
                  ) : (
                    <div className="p-2 text-sm text-gray-500">
                      No categories found
                    </div>
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Payment Mode */}
            <div className="space-y-3 border border-gray-300 bg-white p-4 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-md bg-amber-50">
                  <CreditCard className="h-4 w-4 text-amber-700" />
                </div>
                <Label className="text-sm font-medium text-gray-700 flex-1">
                  Payment Mode
                </Label>
                {filters.paymentMode !== "all" && (
                  <span className="text-xs px-2 py-1 bg-amber-50 text-amber-600 rounded-full truncate max-w-[120px]">
                    {filters.paymentMode.split("#")[1]?.toLowerCase()}
                  </span>
                )}
              </div>
              <Select
                value={filters.paymentMode}
                onValueChange={(value) => setFilters({...filters, paymentMode: value})}
                disabled={isPaymentModesLoading}
              >
                <SelectTrigger className="border-gray-300 focus-visible:ring-1 focus-visible:ring-gray-400 w-full h-10">
                  <SelectValue
                    placeholder={
                      isPaymentModesLoading
                        ? "Loading payment modes..."
                        : "Select payment mode"
                    }
                  />
                </SelectTrigger>
                <SelectContent
                  align="center"
                  position="item-aligned"
                  className="z-[9999] border-gray-300 shadow-md max-h-60"
                >
                  {isPaymentModesLoading ? (
                    <div className="flex items-center justify-center p-4">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  ) : paymentModesData?.data && paymentModesData.data.length > 0 ? (
                    <>
                      <SelectItem
                        value="all"
                        className="hover:bg-gray-100 text-gray-700"
                      >
                        All Payment Modes
                      </SelectItem>
                      {paymentModesData.data.map((mode) => (
                        <SelectItem
                          key={mode._id}
                          value={`${mode._id}#${mode.name}`}
                          className="hover:bg-gray-100 capitalize"
                        >
                          {mode.name.toLowerCase()}
                        </SelectItem>
                      ))}
                    </>
                  ) : (
                    <div className="p-2 text-sm text-gray-500">
                      No payment modes found
                    </div>
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Number of Records */}
       </div>    

          <div className="flex flex-col sm:flex-row justify-between gap-3 p-6 border-t bg-gray-50 rounded-b-lg">
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Button
                variant="outline"
                onClick={resetFilters}
                disabled={activeFiltersCount === 0}
                className="flex items-center justify-center gap-2 text-sm h-10 w-full sm:w-auto"
              >
                <XCircle className="h-4 w-4" />
                Reset Filters
                {activeFiltersCount > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 text-xs bg-gray-200 rounded-full">
                    {activeFiltersCount}
                  </span>
                )}
              </Button>
              
              <Button
                variant="outline"
                onClick={() => {
                  setIsExportDialogOpen(false);
                  setExportType(null);
                  toast({
                    title: "Export Cancelled",
                    description: "Your export has been cancelled. No files were downloaded.",
                    duration: 3000,
                  });
                }}
                disabled={isExporting}
                className="text-sm h-10 flex-1 sm:w-24"
              >
                Cancel
              </Button>
            </div>
            
            <Button
              onClick={() => exportType && handleExport(exportType)}
              disabled={isExporting}
              className="flex items-center justify-center gap-2 text-sm h-10 w-full sm:w-40 bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
            >
              {isExporting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Exporting {exportType?.toUpperCase()}...</span>
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  <span>Export {exportType?.toUpperCase()}</span>
                  {activeFiltersCount > 0 && (
                    <span className="ml-1 text-xs bg-blue-700 px-1.5 py-0.5 rounded-full">
                      {activeFiltersCount}
                    </span>
                  )}
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Monthly Report Dialog */}
      <Dialog open={isMonthlyReportDialogOpen} onOpenChange={setIsMonthlyReportDialogOpen}>
        <DialogContent className="w-[95vw] max-w-[450px] p-0">
          <DialogHeader className="p-6 pb-4 border-b">
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Download className="h-5 w-5" />
              Monthly Report - {monthlyReportType?.toUpperCase()}
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-600 mt-1">
              Select the year for your category-month report
            </DialogDescription>
          </DialogHeader>
          
          <div className="p-6 space-y-4">
            <div className="space-y-3 border border-gray-300 bg-white p-4 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-md bg-blue-50">
                  <CalendarIcon className="h-4 w-4 text-blue-700" />
                </div>
                <Label className="text-sm font-medium text-gray-700">
                  Select Year
                </Label>
              </div>
              <Select
                value={selectedYear}
                onValueChange={setSelectedYear}
              >
                <SelectTrigger className="border-gray-300 focus-visible:ring-1 focus-visible:ring-gray-400 w-full h-10">
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent
                  align="center"
                  position="item-aligned"
                  className="z-[9999] border-gray-300 shadow-md max-h-60"
                >
                  {yearOptions.map((year) => (
                    <SelectItem
                      key={year}
                      value={year}
                      className="hover:bg-gray-100"
                    >
                      {year}
                      {year === new Date().getFullYear().toString() && (
                        <span className="ml-2 text-xs text-gray-500">(Current)</span>
                      )}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-xs text-gray-600">
                <span className="font-semibold">Note:</span> This report will include all category-wise monthly transactions for the selected year.
              </p>
            </div>
          </div>

          <div className="flex gap-3 p-6 border-t bg-gray-50 rounded-b-lg">
            <Button
              variant="outline"
              onClick={() => {
                setIsMonthlyReportDialogOpen(false);
                setMonthlyReportType(null);
              }}
              disabled={isExporting}
              className="text-sm h-10 flex-1"
            >
              Cancel
            </Button>
            
            <Button
              onClick={handleDownloadMonthlyReport}
              disabled={isExporting || !selectedYear}
              className="flex items-center justify-center gap-2 text-sm h-10 flex-1 bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
            >
              {isExporting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Downloading...</span>
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  <span>Download {monthlyReportType?.toUpperCase()}</span>
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}