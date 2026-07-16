"use client";

import { useState, useEffect, useMemo } from "react";
import { format } from "date-fns";
import {
  Search,
  Briefcase,
  BookOpen,
  FileSpreadsheet,
  FileText,
  CalendarIcon,
  ChevronRight,
  Loader2,
  ArrowLeftRight,
  X,
  Check,
  CalendarDays,
  BriefcaseBusiness,
} from "lucide-react";
import { toast } from "sonner";

import { DashboardSubLayout } from "@/layout";
import { useBusiness } from "@/hooks";
import { useGetCompanyList } from "@/services/business.service";
import { useGetCashbookList, useGetBookTotals } from "@/services/cashbook.service";
import { useGetTransactionsByBook } from "@/services/transaction.service";
import { useGetCategoriesByBook } from "@/services/category.service";
import { useGetPaymentModesByBook } from "@/services/payment-mode.service";
import { exportService } from "@/services/export-service";
import { getStoredToken } from "@/hooks/jwt/utils";
import { Cashbook } from "@/interface";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Drawer, DrawerContent, DrawerTrigger, DrawerTitle, DrawerDescription } from "@/components/ui/drawer";
import { Sheet, SheetContent } from "@/components/ui/sheet";

function BookListItem({
  book,
  isActive,
  onClick,
}: {
  book: Cashbook;
  isActive: boolean;
  onClick: () => void;
}) {
  const { totalTransactions, isTransactionsPending } = useGetTransactionsByBook({
    bookId: book._id,
    pageSize: 1,
  });

  return (
    <div
      onClick={onClick}
      className={`group relative flex items-center justify-between p-2 rounded-lg cursor-pointer transition-all duration-150 ${isActive
        ? "bg-[#EEF3FF] text-[#3B82F6]"
        : "hover:bg-slate-50 dark:hover:bg-slate-800/30"
        }`}
    >
      <div className="min-w-0 flex-1 flex items-center gap-2">
        <div className={`p-1 rounded-md shrink-0 ${isActive ? "bg-white text-[#3B82F6]" : "bg-slate-100 dark:bg-slate-800 text-slate-500"}`}>
          <BookOpen className="h-3 w-3" />
        </div>
        <div className="min-w-0">
          <p className="font-bold text-[11px] text-slate-800 dark:text-slate-200 truncate leading-tight">
            {book.name}
          </p>
          <div className="flex items-center gap-1 mt-0.5">
            <span className="text-[9px] font-bold text-slate-400">
              {isTransactionsPending ? "..." : `${totalTransactions || 0} Txns`}
            </span>
          </div>
        </div>
      </div>
      <ChevronRight className={`h-3 w-3 ${isActive ? "text-[#3B82F6]" : "text-slate-300"} group-hover:translate-x-0.5 transition-transform`} />
      {isActive && (
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-[#3B82F6] rounded-l-full" />
      )}
    </div>
  );
}

export default function ReportsPage() {
  const { businessInfo, updateBusinessInfo } = useBusiness();

  // Selected report type: "business" or "book"
  const [selectedReportType, setSelectedReportType] = useState<"business" | "book">("business");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBusinessId, setSelectedBusinessId] = useState<string>("");
  const [selectedBookId, setSelectedBookId] = useState<string>("");
  const [period, setPeriod] = useState<string>("this_month");
  const [isExporting, setIsExporting] = useState(false);
  const [isMobileBookListOpen, setIsMobileBookListOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    setIsMobileBookListOpen(false);
  }, [selectedBookId, selectedBusinessId, selectedReportType]);

  // New Filters states
  const [transactionTypeFilter, setTransactionTypeFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [paymentModeFilter, setPaymentModeFilter] = useState<string>("all");

  // Date states
  const [startDate, setStartDate] = useState<Date>(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1); // 1st of current month
  });
  const [endDate, setEndDate] = useState<Date>(() => new Date());

  // Fetch businesses
  const { companyList, isCompanyListPending } = useGetCompanyList();

  // Set default business from context or list
  useEffect(() => {
    if (businessInfo?.id) {
      setSelectedBusinessId(businessInfo.id);
    } else if (companyList && companyList.length > 0) {
      setSelectedBusinessId(companyList[0].company._id);
    }
  }, [businessInfo?.id, companyList]);

  // Fetch cashbooks for selected business
  const { cashbookList, isCashbookListPending } = useGetCashbookList(selectedBusinessId);

  // Set default book from cashbook list
  useEffect(() => {
    if (cashbookList && cashbookList.length > 0) {
      setSelectedBookId(cashbookList[0]._id);
    } else {
      setSelectedBookId("");
    }
  }, [cashbookList]);

  // Fetch categories and payment modes for the selected book
  const { categories: categoriesList, isCategoriesPending } = useGetCategoriesByBook({
    bookId: selectedBookId,
  });

  const { data: paymentModesData, isLoading: isPaymentModesPending } = useGetPaymentModesByBook({
    bookId: selectedBookId,
    status: "active",
  });

  const paymentModesList = useMemo(() => paymentModesData?.data || [], [paymentModesData]);

  // Reset book-specific filters when selected book changes
  useEffect(() => {
    setCategoryFilter("all");
    setPaymentModeFilter("all");
    setTransactionTypeFilter("all");
  }, [selectedBookId]);

  // Fetch transactions list for the selected book (with category/payment mode server-side filtering)
  const { transactions, isTransactionsPending } = useGetTransactionsByBook({
    bookId: selectedBookId,
    pageSize: 100,
    sortBy: "date",
    sortOrder: "desc",
    category: categoryFilter === "all" ? undefined : categoryFilter,
    paymentMode: paymentModeFilter === "all" ? undefined : paymentModeFilter,
    dateFrom: period === "custom" || period === "this_month" || period === "last_month" || period === "this_year"
      ? format(startDate, "yyyy-MM-dd")
      : undefined,
    dateTo: period === "custom" || period === "this_month" || period === "last_month" || period === "this_year"
      ? format(endDate, "yyyy-MM-dd")
      : undefined,
  });

  // Client-side filter for Transaction Type
  const filteredTransactions = useMemo(() => {
    if (!transactions) return [];
    return transactions.filter((tx) => {
      if (transactionTypeFilter === "all") return true;
      return tx.type === transactionTypeFilter;
    });
  }, [transactions, transactionTypeFilter]);

  // Handle preset date ranges when period selection changes
  useEffect(() => {
    const now = new Date();
    if (period === "this_month") {
      setStartDate(new Date(now.getFullYear(), now.getMonth(), 1));
      setEndDate(now);
    } else if (period === "last_month") {
      setStartDate(new Date(now.getFullYear(), now.getMonth() - 1, 1));
      setEndDate(new Date(now.getFullYear(), now.getMonth(), 0));
    } else if (period === "this_year") {
      setStartDate(new Date(now.getFullYear(), 0, 1));
      setEndDate(now);
    }
  }, [period]);

  // Calculate statistics (Gave/Got/Net Balance/Entries)
  const statsData = useMemo(() => {
    if (selectedReportType === "business") {
      let youGave = 0;
      let youGot = 0;

      cashbookList?.forEach((book) => {
        youGave += book.totalOut || 0;
        youGot += book.totalIn || 0;
      });

      return {
        youGave,
        youGot,
        netBalance: youGot - youGave,
        totalEntries: cashbookList?.length || 0,
      };
    } else {
      // Calculate dynamically from the filtered list of transactions
      let youGave = 0;
      let youGot = 0;

      filteredTransactions.forEach((tx) => {
        if (tx.type === "cash_in") {
          youGot += tx.amount || 0;
        } else {
          youGave += tx.amount || 0;
        }
      });

      return {
        youGave,
        youGot,
        netBalance: youGot - youGave,
        totalEntries: filteredTransactions.length,
      };
    }
  }, [selectedReportType, cashbookList, filteredTransactions]);

  // Filter book list based on search term
  const filteredBooks = useMemo(() => {
    if (!cashbookList) return [];
    return cashbookList.filter((book) =>
      book.name.toLowerCase().includes(searchTerm.toLowerCase().trim())
    );
  }, [cashbookList, searchTerm]);

  // Trigger report download (Excel or PDF)
  const handleDownload = async (type: "pdf" | "excel") => {
    const token = getStoredToken();
    if (isExporting || !token) {
      toast.error("Please login to download reports.");
      return;
    }

    const activeBookId =
      selectedReportType === "book" ? selectedBookId : selectedBookId || cashbookList?.[0]?._id;

    if (!activeBookId) {
      toast.error("No books available in this business to export.");
      return;
    }

    setIsExporting(true);
    const loadingToastId = toast.loading(`Generating your ${type.toUpperCase()} report...`);
    try {
      const exportFilters = {
        startDate: format(startDate, "yyyy-MM-dd"),
        endDate: format(endDate, "yyyy-MM-dd"),
        transactionType: transactionTypeFilter === "all" ? "" : transactionTypeFilter,
        paymentMode: paymentModeFilter === "all" ? "" : paymentModeFilter,
        category: categoryFilter === "all" ? "" : categoryFilter,
        searchQuery: "",
        pageSize: 100,
        pageNumber: 1,
      };

      const blob = await exportService.downloadExport({
        bookId: activeBookId,
        token,
        filters: exportFilters,
        type,
      });

      const fileName = exportService.getFileName(activeBookId, type);
      exportService.triggerDownload(blob, fileName);

      toast.success(`${type.toUpperCase()} Report downloaded successfully!`, {
        id: loadingToastId,
      });
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to generate report. Please try again.", {
        id: loadingToastId,
      });
    } finally {
      setIsExporting(false);
    }
  };

  const formatAmount = (val: number) => {
    return val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const activeBusinessName =
    companyList?.find((item) => item.company._id === selectedBusinessId)?.company.name ||
    "Business Reports";

  const activeBookName =
    cashbookList?.find((b) => b._id === selectedBookId)?.name || "Book Reports";

  const leftPaneContent = (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
        <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
          Reports
        </h1>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
        <Input
          type="text"
          placeholder="Search Books"
          className="pl-9 pr-3 py-1 w-full bg-[#F1F3F9] dark:bg-slate-900 border-none rounded-full text-[11px] h-8 placeholder-slate-400 text-slate-800 dark:text-slate-200 focus-visible:ring-1 focus-visible:ring-blue-500/30"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="text-[13px] font-bold text-slate-600 dark:text-slate-400 tracking-wide mt-3.5">
        {isCashbookListPending ? "Loading..." : `${filteredBooks.length} Books Found`}
      </div>

      <div className="divide-y divide-slate-100 dark:divide-slate-850 border-b border-slate-100 dark:border-slate-850">
        <div
          onClick={() => {
            setSelectedReportType("business");
            setIsMobileBookListOpen(false);
          }}
          className="group relative flex items-center justify-between py-2.5 cursor-pointer transition-all duration-200"
        >
          <div className="flex items-center gap-2.5">
            <div
              className={`p-3 rounded-full flex items-center justify-center transition-all ${selectedReportType === "business"
                ? "bg-[#3B82F6] text-white shadow-sm"
                : "bg-[#F3F4F6] dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                }`}
            >
              <BriefcaseBusiness className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <p
                className={`text-[13px] font-bold ${selectedReportType === "business"
                  ? "text-slate-900 dark:text-white"
                  : "text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                  }`}
              >
                Business Reports
              </p>
              <p className="text-[9px] text-slate-400 mt-0.5">All Customer all transactions</p>
            </div>
          </div>
          {selectedReportType === "business" && (
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-[#3B82F6] rounded-l-full" />
          )}
        </div>

        <div className="py-1 space-y-1">
          <div
            onClick={() => {
              setSelectedReportType("book");
            }}
            className="group relative flex items-center justify-between py-2.5 cursor-pointer transition-all duration-200"
          >
            <div className="flex items-center gap-2.5">
              <div
                className={`p-3 rounded-full flex items-center justify-center transition-all ${selectedReportType === "book"
                  ? "bg-[#3B82F6] text-white shadow-sm"
                  : "bg-[#F3F4F6] dark:bg-slate-800 text-slate-655 dark:text-slate-300"
                  }`}
              >
                <BookOpen className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p
                  className={`text-[13px] font-bold ${selectedReportType === "book"
                    ? "text-slate-900 dark:text-white"
                    : "text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                    }`}
                >
                  Books Reports
                </p>
                <p className="text-[9px] text-slate-400 mt-0.5">All Customer all transactions</p>
              </div>
            </div>
            {selectedReportType === "book" && (
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-[#3B82F6] rounded-l-full" />
            )}
          </div>

          {selectedReportType === "book" && (
            <div className="space-y-0.5 pl-2 border-l border-slate-100 dark:border-slate-800 ml-4 mt-0.5">
              {isCashbookListPending ? (
                <div className="flex items-center justify-center p-3">
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-slate-400" />
                </div>
              ) : filteredBooks.length === 0 ? (
                <p className="text-[9px] text-slate-400 p-1.5 italic">No books found</p>
              ) : (
                filteredBooks.map((book) => (
                  <BookListItem
                    key={book._id}
                    book={book}
                    isActive={selectedBookId === book._id}
                    onClick={() => {
                      setSelectedBookId(book._id);
                      setIsMobileBookListOpen(false);
                    }}
                  />
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <DashboardSubLayout headerTitle="Reports" showTitle={false}>
      <div className="grid grid-cols-1 lg:grid-cols-12 w-full min-h-[calc(100vh-32px)] bg-white dark:bg-slate-900 rounded-2xl relative">
        {/* Desktop Left Side Pane */}
        <div className="hidden lg:block lg:col-span-3 space-y-4 lg:border-r border-slate-100 dark:border-slate-800 p-4">
          {leftPaneContent}
        </div>

        {/* Mobile Left Side Pane Drawer/Sheet */}
        <Sheet open={isMobileBookListOpen} onOpenChange={setIsMobileBookListOpen}>
          <SheetContent side="left" className="w-[300px] sm:w-[350px] p-4 overflow-y-auto [&>button]:hidden dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 mb-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Select Book / Report</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileBookListOpen(false)}
                className="h-8 w-8 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            {leftPaneContent}
          </SheetContent>
        </Sheet>

        <div className="col-span-12 lg:col-span-9 p-4 sm:p-6 space-y-6">
          {/* Mobile Selector Trigger */}
          <div className="lg:hidden">
            <Button
              onClick={() => setIsMobileBookListOpen(true)}
              variant="outline"
              className="w-full flex items-center justify-center gap-2 h-9 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/20 dark:hover:bg-blue-950/30 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900 rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer"
            >
              <BookOpen className="h-4 w-4" />
              <span>Select Book / Report Type</span>
            </Button>
          </div>

          {selectedReportType === "book" && !selectedBookId ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 bg-white dark:bg-slate-900 rounded-xl border border-dashed border-slate-200 dark:border-slate-850">
              <img
                src="/no_book.png"
                alt="No Book Selected"
                className="w-48 h-48 object-contain select-none pointer-events-none mb-4 opacity-80"
              />
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">No Book Selected</h4>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 max-w-[220px] text-center">
                Select a book from the left panel to view and download its transaction reports.
              </p>
            </div>
          ) : (
            <>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
            <div className="flex items-center gap-2.5">
              <div className="p-3 bg-[#3B82F6] text-white rounded-full flex items-center justify-center shadow-xs">
                {selectedReportType === "business" ? (
                  <BriefcaseBusiness className="h-5 w-5" />
                ) : (
                  <BookOpen className="h-5 w-5" />
                )}
              </div>
              <div>
                <h2 className="text-xs font-bold text-slate-800 dark:text-white capitalize">
                  {selectedReportType === "business" ? activeBusinessName : activeBookName}
                </h2>
                <p className="text-[11px] text-slate-400 mt-0.5">All Customer all transactions</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <Button
                variant="ghost"
                className="bg-[#F3F4F6] hover:bg-[#E5E7EB] dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-[12px] px-3 h-8 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                onClick={() => handleDownload("excel")}
                disabled={isExporting}
              >
                <FileSpreadsheet className="h-3.5 w-3.5 text-slate-800 dark:text-slate-200" />
                <span>Download Excel</span>
              </Button>
              <Button
                variant="ghost"
                className="bg-[#F3F4F6] hover:bg-[#E5E7EB] dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-[12px] px-3 h-8 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                onClick={() => handleDownload("pdf")}
                disabled={isExporting}
              >
                <FileText className="h-3.5 w-3.5 text-slate-800 dark:text-slate-200" />
                <span>Download PDF</span>
              </Button>
            </div>
          </div>

          <div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-2xs space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">

                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-700 dark:text-slate-350 uppercase tracking-wider pl-0.5">
                    Business Name
                  </label>
                  {isCompanyListPending ? (
                    <div className="h-8 w-full bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center px-2">
                      <Loader2 className="h-3.5 w-3.5 animate-spin text-slate-400" />
                    </div>
                  ) : (
                    <Select value={selectedBusinessId} onValueChange={setSelectedBusinessId}>
                      <SelectTrigger className="w-full bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-xl h-8 text-[11px] font-semibold text-slate-700 dark:text-slate-200 px-2 capitalize focus:ring-1 focus:ring-blue-500/30">
                        <SelectValue placeholder="Select business" />
                      </SelectTrigger>
                      <SelectContent className="border-slate-200 dark:border-slate-800">
                        {companyList?.map((item) => (
                          <SelectItem
                            key={item.company._id}
                            value={item.company._id}
                            className="capitalize font-medium text-xs"
                          >
                            {item.company.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>


                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-700 dark:text-slate-355 uppercase tracking-wider pl-0.5">
                    Period
                  </label>
                  <Select value={period} onValueChange={setPeriod}>
                    <SelectTrigger className="w-full bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-xl h-8 text-[11px] font-semibold text-slate-700 dark:text-slate-200 px-2 focus:ring-1 focus:ring-blue-500/30">
                      <SelectValue placeholder="Select period" />
                    </SelectTrigger>
                    <SelectContent className="border-slate-200 dark:border-slate-800">
                      <SelectItem value="this_month" className="font-medium text-xs">
                        This month
                      </SelectItem>
                      <SelectItem value="last_month" className="font-medium text-xs">
                        Last month
                      </SelectItem>
                      <SelectItem value="this_year" className="font-medium text-xs">
                        This year
                      </SelectItem>
                      <SelectItem value="custom" className="font-medium text-xs">
                        Custom range
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>


                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-700 dark:text-slate-355 uppercase tracking-wider pl-0.5">
                    Date
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-xl h-8 text-[11px] font-semibold text-slate-700 dark:text-slate-200 shadow-none px-2 hover:bg-slate-50 focus:ring-1 focus:ring-blue-500/30 flex items-center"
                      >
                        <CalendarDays className="mr-1 h-3 w-3 text-slate-400" />
                        <span className="text-slate-400 font-medium whitespace-nowrap">Select Date</span>
                        <div className="h-3 w-[1px] bg-slate-200 mx-2 shrink-0" />
                        <span className="text-slate-700 dark:text-slate-200 truncate">
                          {startDate && endDate
                            ? `${format(startDate, "dd MMM yyyy")} - ${format(endDate, "dd MMM yyyy")}`
                            : "Select Date"}
                        </span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 border-slate-200" align="end">
                      <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={startDate}
                        selected={{ from: startDate, to: endDate }}
                        onSelect={(range) => {
                          if (range?.from) setStartDate(range.from);
                          if (range?.to) setEndDate(range.to);
                          setPeriod("custom");
                        }}
                        numberOfMonths={1}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>


              <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 border-t border-slate-100 dark:border-slate-800/80 pt-3">

                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-700 dark:text-slate-355 uppercase tracking-wider pl-0.5">
                    Transaction Type
                  </label>
                  <Select value={transactionTypeFilter} onValueChange={setTransactionTypeFilter}>
                    <SelectTrigger className="w-full bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-xl h-8 text-[11px] font-semibold text-slate-700 dark:text-slate-200 px-2 focus:ring-1 focus:ring-blue-500/30">
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent className="border-slate-200 dark:border-slate-800">
                      <SelectItem value="all" className="font-medium text-xs">
                        All Types
                      </SelectItem>
                      <SelectItem value="cash_in" className="font-medium text-xs text-emerald-600 dark:text-emerald-400">
                        Cash In
                      </SelectItem>
                      <SelectItem value="cash_out" className="font-medium text-xs text-red-600 dark:text-red-400">
                        Cash Out
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Category */}
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-700 dark:text-slate-355 uppercase tracking-wider pl-0.5">
                    Category
                  </label>
                  {isCategoriesPending ? (
                    <div className="h-8 w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center px-2">
                      <Loader2 className="h-3.5 w-3.5 animate-spin text-slate-400" />
                    </div>
                  ) : (
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                      <SelectTrigger className="w-full bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-xl h-8 text-[11px] font-semibold text-slate-700 dark:text-slate-200 px-2 truncate focus:ring-1 focus:ring-blue-500/30">
                        <SelectValue placeholder="All Categories" />
                      </SelectTrigger>
                      <SelectContent className="border-slate-200 dark:border-slate-800">
                        <SelectItem value="all" className="font-medium text-xs">
                           All Categories
                        </SelectItem>
                        {categoriesList?.map((cat) => (
                          <SelectItem
                            key={cat._id}
                            value={cat._id}
                            className="font-medium text-xs"
                          >
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>

                {/* Payment Mode */}
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-700 dark:text-slate-355 uppercase tracking-wider pl-0.5">
                    Payment Mode
                  </label>
                  {isPaymentModesPending ? (
                    <div className="h-8 w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center px-2">
                      <Loader2 className="h-3.5 w-3.5 animate-spin text-slate-400" />
                    </div>
                  ) : (
                    <Select value={paymentModeFilter} onValueChange={setPaymentModeFilter}>
                      <SelectTrigger className="w-full bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-xl h-8 text-[11px] font-semibold text-slate-700 dark:text-slate-250 px-2 truncate focus:ring-1 focus:ring-blue-500/30">
                        <SelectValue placeholder="All Payment Modes" />
                      </SelectTrigger>
                      <SelectContent className="border-slate-200 dark:border-slate-800">
                        <SelectItem value="all" className="font-medium text-xs">
                          All Payment Modes
                        </SelectItem>
                        {paymentModesList?.map((pm) => (
                          <SelectItem
                            key={pm._id}
                            value={pm._id}
                            className="font-medium text-xs"
                          >
                            {pm.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Stats Summary Cards Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between pl-1">
              <p className="text-[10px] font-bold text-slate-800 dark:text-slate-200">
                {selectedReportType === "business"
                  ? `Total ${statsData.totalEntries} books`
                  : `Total ${statsData.totalEntries} entries`}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {/* You Gave Card */}
              <div className="rounded-xl border border-[#FDE8E8] dark:border-red-950/20 bg-[#FDF2F2] dark:bg-red-950/10 p-2 sm:p-3.5 shadow-xs">
                <p className="text-[11px] sm:text-xl font-black text-[#C81E1E] tracking-tight">
                  ₹{formatAmount(statsData.youGave)}
                </p>
                <p className="text-[8px] sm:text-[9px] font-bold text-slate-500 mt-0.5 pl-0.5">You Gave</p>
              </div>

              {/* You Got Card */}
              <div className="rounded-xl border border-[#DEF7EC] dark:border-emerald-950/20 bg-[#F3F9F5] dark:bg-emerald-950/10 p-2 sm:p-3.5 shadow-xs">
                <p className="text-[11px] sm:text-xl font-black text-[#03543F] tracking-tight">
                  ₹{formatAmount(statsData.youGot)}
                </p>
                <p className="text-[8px] sm:text-[9px] font-bold text-slate-500 mt-0.5 pl-0.5">You Got</p>
              </div>

              {/* Net Balance Card */}
              <div className="rounded-xl border border-[#E5E7EB] dark:border-slate-800 bg-[#F3F4F6] dark:bg-slate-900/60 p-2 sm:p-3.5 shadow-xs">
                <p
                  className={`text-[11px] sm:text-xl font-black tracking-tight ${statsData.netBalance >= 0
                    ? "text-[#1F2937] dark:text-white"
                    : "text-[#C81E1E]"
                    }`}
                >
                  {statsData.netBalance < 0 ? "-" : ""}₹{formatAmount(Math.abs(statsData.netBalance))}
                </p>
                <p className="text-[8px] sm:text-[9px] font-bold text-slate-500 mt-0.5 pl-0.5">Net Balance</p>
              </div>
            </div>
          </div>

          {/* Transactions Ledger List Section */}
          <div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <h3 className="text-[11px] font-bold text-slate-800 dark:text-slate-200">
                  Transactions Ledger ({selectedReportType === "business" ? "Active Book" : activeBookName})
                </h3>
                <span className="text-[9px] text-slate-400 font-medium">
                  {isTransactionsPending ? "Loading..." : `${filteredTransactions.length} entries found`}
                </span>
              </div>

              {isTransactionsPending ? (
                <div className="flex flex-col items-center justify-center py-6 space-y-2">
                  <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                  <span className="text-[9px] text-slate-400">Loading transactions...</span>
                </div>
              ) : !filteredTransactions || filteredTransactions.length === 0 ? (
                <div className="text-center py-6 text-[11px] text-slate-400 italic bg-slate-50/50 dark:bg-slate-950/20 rounded-lg border border-dashed border-slate-200 dark:border-slate-800">
                  No transactions found for the selected period.
                </div>
              ) : (
                <div className="overflow-x-auto select-none">
                  <table className="w-full text-left border-collapse min-w-[500px]">
                    <thead>
                      <tr className="border-b border-slate-150 dark:border-slate-800 text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                        <th className="pb-2 font-bold">Date & Time</th>
                        <th className="pb-2 font-bold">Party</th>
                        <th className="pb-2 font-bold">Category</th>
                        <th className="pb-2 font-bold">Payment Mode</th>
                        <th className="pb-2 font-bold">Remark</th>
                        <th className="pb-2 font-bold text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40 text-[10px]">
                      {filteredTransactions.map((tx) => {
                        const isCashIn = tx.type === "cash_in";
                        const txDate = tx.date ? format(new Date(tx.date), "dd MMM yyyy") : "";
                        return (
                          <tr key={tx._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                            <td className="py-2 text-slate-500 whitespace-nowrap">
                              {txDate} {tx.time ? `• ${tx.time}` : ""}
                            </td>
                            <td className="py-2 font-semibold text-slate-700 dark:text-slate-355">
                              {tx.partyName || tx.partyDetails?.name || tx.party || "-"}
                            </td>
                            <td className="py-2 text-slate-600 dark:text-slate-450">
                              <span className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-[9px] font-medium text-slate-600 dark:text-[#A7F3D0]">
                                {tx.categoryName || tx.categoryDetails?.name || tx.category || "-"}
                              </span>
                            </td>
                            <td className="py-2 text-slate-600 dark:text-slate-455">
                              {tx.paymentModeName || tx.paymentModeDetails?.name || tx.paymentMode || "-"}
                            </td>
                            <td className="py-2 text-slate-450 truncate max-w-[120px]" title={tx.remark || tx.description}>
                              {tx.remark || tx.description || "-"}
                            </td>
                            <td className={`py-2 font-bold text-right whitespace-nowrap text-[11px] ${isCashIn ? "text-[#0E6245] dark:text-[#34D399]" : "text-[#C81E1E] dark:text-[#F87171]"}`}>
                              {isCashIn ? "+" : "-"}₹{formatAmount(tx.amount)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
          </>
          )}
        </div>
      </div>
    </DashboardSubLayout>
  );
}
