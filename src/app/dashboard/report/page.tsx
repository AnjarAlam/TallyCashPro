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

// Sub-component to fetch and display individual book details in a compact format
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
      className={`flex items-center justify-between p-2.5 rounded-lg border cursor-pointer transition-all duration-150 ${
        isActive
          ? "bg-blue-50/20 dark:bg-blue-950/10 border-blue-300 dark:border-blue-900 border-r-4 border-r-blue-500 shadow-2xs"
          : "bg-slate-50/50 dark:bg-slate-900/40 border-slate-100 dark:border-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800/30"
      }`}
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <p className="font-bold text-xs text-slate-900 dark:text-white truncate">
            {book.name}
          </p>
        </div>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className="bg-blue-50/80 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 text-[9px] font-bold px-1.5 py-0.5 rounded-full shrink-0">
            {isTransactionsPending ? "..." : `${totalTransactions || 0} Txns`}
          </span>
          <span className="text-[9px] text-slate-400">
            {book.createdAt ? format(new Date(book.createdAt), "MMM dd, yy") : "N/A"}
          </span>
        </div>
      </div>
      <ChevronRight className="h-3 w-3 text-slate-300 ml-1.5" />
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
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

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

  return (
    <DashboardSubLayout headerTitle="Reports" showTitle={false}>
      <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-4 items-start w-full">
        {/* Left Side Pane */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-base font-extrabold tracking-tight text-slate-900 dark:text-white">
                Reports
              </h1>
              <p className="text-[10px] text-slate-500 mt-0.5">Configure and download ledgers</p>
            </div>

            {/* Switch Business Button/Drawer */}
            {companyList && companyList.length > 1 && (
              <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                <DrawerTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300 font-semibold text-[10px] h-8 px-3 flex items-center gap-1.5 shadow-2xs cursor-pointer animate-pulse"
                  >
                    <ArrowLeftRight className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    <span>Switch Business</span>
                  </Button>
                </DrawerTrigger>
                <DrawerContent className="h-full ml-auto w-full max-w-md">
                  <div className="flex flex-col h-full bg-white dark:bg-gray-900">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                      <div>
                        <DrawerTitle className="text-xl font-bold text-gray-900 dark:text-white">
                          Switch Business
                        </DrawerTitle>
                        <DrawerDescription className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          Select a business to manage
                        </DrawerDescription>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsDrawerOpen(false)}
                        className="h-8 w-8 text-gray-500 hover:text-gray-700 dark:text-gray-450"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Business List */}
                    <div className="flex-1 overflow-y-auto p-6">
                      <div className="space-y-3">
                        {companyList.map((item: any) => {
                          const isCurrent = item.company._id === selectedBusinessId;
                          return (
                            <div
                              key={item.company._id}
                              className={`
                                group relative p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer
                                ${isCurrent
                                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-sm'
                                  : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md'
                                }
                              `}
                              onClick={() => {
                                updateBusinessInfo({
                                  id: item.company._id,
                                  name: item.company.name,
                                  category: item.company.category,
                                  description: item.company.description,
                                });
                                localStorage.setItem("currentBusiness", JSON.stringify({
                                  id: item.company._id,
                                  name: item.company.name,
                                  category: item.company.category,
                                  description: item.company.description,
                                }));
                                setSelectedBusinessId(item.company._id);
                                setIsDrawerOpen(false);
                              }}
                            >
                              {/* Current Business Indicator */}
                              {isCurrent && (
                                <div className="absolute -top-2 -left-2">
                                  <div className="bg-blue-500 text-white text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
                                    <Check className="w-3 h-3" />
                                    Current
                                  </div>
                                </div>
                              )}

                              <div className="flex items-center gap-4">
                                <div className={`h-12 w-12 rounded-full border-2 border-white shadow-sm flex items-center justify-center text-sm font-bold ${
                                  isCurrent
                                    ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300'
                                    : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                                }`}>
                                  {item.company.name.charAt(0).toUpperCase()}
                                </div>

                                <div className="flex-1 min-w-0">
                                  <h3 className={`font-semibold text-sm truncate ${isCurrent
                                      ? 'text-blue-900 dark:text-blue-100'
                                      : 'text-gray-900 dark:text-white'
                                    }`}>
                                    {item.company.name}
                                  </h3>
                                  <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5 truncate capitalize">
                                    {item.company.category?.replace(/_/g, " ") || "Retail Store"}
                                  </p>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </DrawerContent>
              </Drawer>
            )}
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <Input
              type="text"
              placeholder="Search Books"
              className="pl-9 pr-3 py-1.5 w-full bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-xl text-xs h-8.5"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-3 pl-1">
            {isCashbookListPending ? "Loading..." : `${filteredBooks.length} Books Found`}
          </p>

          <div className="space-y-2">
            {/* Business Reports Option */}
            <div
              onClick={() => setSelectedReportType("business")}
              className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all duration-200 ${
                selectedReportType === "business"
                  ? "bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900 border-r-4 border-r-blue-500 shadow-2xs"
                  : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800/80 hover:bg-slate-50/60 dark:hover:bg-slate-800/40"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className={`p-2 rounded-full ${
                    selectedReportType === "business"
                      ? "bg-blue-600 text-white"
                      : "bg-blue-50 dark:bg-blue-950/40 text-blue-600"
                  }`}
                >
                  <Briefcase className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p
                    className={`font-bold text-xs ${
                      selectedReportType === "business"
                        ? "text-blue-700 dark:text-blue-400"
                        : "text-slate-900 dark:text-white"
                    }`}
                  >
                    Business Reports
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">All Customer all transactions</p>
                </div>
              </div>
            </div>

            {/* Books Reports Header Option */}
            <div
              onClick={() => setSelectedReportType("book")}
              className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all duration-200 ${
                selectedReportType === "book"
                  ? "bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900 border-r-4 border-r-blue-500 shadow-2xs"
                  : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800/80 hover:bg-slate-50/60 dark:hover:bg-slate-800/40"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className={`p-2 rounded-full ${
                    selectedReportType === "book"
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 dark:bg-slate-850 text-slate-600 dark:text-slate-300"
                  }`}
                >
                  <BookOpen className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p
                    className={`font-bold text-xs ${
                      selectedReportType === "book"
                        ? "text-blue-700 dark:text-blue-400"
                        : "text-slate-900 dark:text-white"
                    }`}
                  >
                    Books Reports
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">All Customer all transactions</p>
                </div>
              </div>
            </div>

            {/* Indented/Sublist of Book Cards under Books Reports */}
            {selectedReportType === "book" && (
              <div className="space-y-1.5 pl-2.5 border-l border-slate-100 dark:border-slate-850 ml-5 mt-1">
                {isCashbookListPending ? (
                  <div className="flex items-center justify-center p-4">
                    <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
                  </div>
                ) : filteredBooks.length === 0 ? (
                  <p className="text-[10px] text-slate-400 p-2 italic">No books found</p>
                ) : (
                  filteredBooks.map((book) => (
                    <BookListItem
                      key={book._id}
                      book={book}
                      isActive={selectedBookId === book._id}
                      onClick={() => setSelectedBookId(book._id)}
                    />
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Side Details Pane */}
        <div className="lg:col-span-8 space-y-4">
          {/* Header Block */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-3.5 rounded-xl shadow-2xs">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-blue-600 text-white rounded-full">
                {selectedReportType === "business" ? (
                  <Briefcase className="h-4 w-4" />
                ) : (
                  <BookOpen className="h-4 w-4" />
                )}
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-white capitalize">
                  {selectedReportType === "business" ? activeBusinessName : activeBookName}
                </h2>
                <p className="text-[10px] text-slate-400 mt-0.5">All Customer all transactions</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                className="rounded-lg border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300 font-semibold text-[10px] px-3 h-8 flex items-center gap-1.5 shadow-2xs cursor-pointer"
                onClick={() => handleDownload("excel")}
                disabled={isExporting}
              >
                <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600" />
                <span>Download Excel</span>
              </Button>
              <Button
                variant="outline"
                className="rounded-lg border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300 font-semibold text-[10px] px-3 h-8 flex items-center gap-1.5 shadow-2xs cursor-pointer"
                onClick={() => handleDownload("pdf")}
                disabled={isExporting}
              >
                <FileText className="h-3.5 w-3.5 text-rose-500" />
                <span>Download PDF</span>
              </Button>
            </div>
          </div>

          {/* Filters Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-3.5 shadow-2xs space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Business Name */}
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider pl-0.5">
                  Business Name
                </label>
                {isCompanyListPending ? (
                  <div className="h-8.5 w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg flex items-center px-3">
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-slate-400" />
                  </div>
                ) : (
                  <Select value={selectedBusinessId} onValueChange={setSelectedBusinessId}>
                    <SelectTrigger className="w-full bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-lg h-8.5 text-xs font-semibold capitalize px-2.5">
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

              {/* Period */}
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider pl-0.5">
                  Period
                </label>
                <Select value={period} onValueChange={setPeriod}>
                  <SelectTrigger className="w-full bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-lg h-8.5 text-xs font-semibold px-2.5">
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

              {/* Date */}
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider pl-0.5">
                  Date
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-semibold bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-lg h-8.5 text-xs shadow-none px-2.5"
                    >
                      <CalendarIcon className="mr-1.5 h-3.5 w-3.5 text-slate-400" />
                      <span>
                        {startDate && endDate
                          ? `${format(startDate, "dd MMM yyyy")} - ${format(endDate, "dd MMM yyyy")}`
                          : "Select Date"}
                      </span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="end">
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

            {/* Advanced Ledger Filters Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 border-t border-slate-100 dark:border-slate-800/80 pt-3">
              {/* Transaction Type */}
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider pl-0.5">
                  Transaction Type
                </label>
                <Select value={transactionTypeFilter} onValueChange={setTransactionTypeFilter}>
                  <SelectTrigger className="w-full bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-lg h-8.5 text-xs font-semibold px-2.5">
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
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider pl-0.5">
                  Category
                </label>
                {isCategoriesPending ? (
                  <div className="h-8.5 w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg flex items-center px-3">
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-slate-400" />
                  </div>
                ) : (
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-full bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-lg h-8.5 text-xs font-semibold px-2.5 truncate">
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
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider pl-0.5">
                  Payment Mode
                </label>
                {isPaymentModesPending ? (
                  <div className="h-8.5 w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg flex items-center px-3">
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-slate-400" />
                  </div>
                ) : (
                  <Select value={paymentModeFilter} onValueChange={setPaymentModeFilter}>
                    <SelectTrigger className="w-full bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-lg h-8.5 text-xs font-semibold px-2.5 truncate">
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

          {/* Stats Summary Cards Section */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between pl-1">
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                {selectedReportType === "business"
                  ? `Total ${statsData.totalEntries} books`
                  : `Total ${statsData.totalEntries} entries`}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* You Gave Card */}
              <div className="rounded-xl border border-red-100 dark:border-red-950/20 bg-red-50/45 dark:bg-red-950/10 p-3.5 shadow-[0_2px_8px_-3px_rgba(239,68,68,0.06)]">
                <p className="text-base font-black text-red-600 dark:text-red-400">
                  ₹{formatAmount(statsData.youGave)}
                </p>
                <p className="text-[10px] font-semibold text-red-500/80 mt-0.5 pl-0.5">You Gave</p>
              </div>

              {/* You Got Card */}
              <div className="rounded-xl border border-emerald-100 dark:border-emerald-950/20 bg-emerald-50/45 dark:bg-emerald-950/10 p-3.5 shadow-[0_2px_8px_-3px_rgba(16,185,129,0.06)]">
                <p className="text-base font-black text-emerald-600 dark:text-emerald-400">
                  ₹{formatAmount(statsData.youGot)}
                </p>
                <p className="text-[10px] font-semibold text-emerald-500/80 mt-0.5 pl-0.5">You Got</p>
              </div>

              {/* Net Balance Card */}
              <div className="rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 p-3.5 shadow-[0_2px_8px_-3px_rgba(0,0,0,0.03)]">
                <p
                  className={`text-base font-black mt-0.5 ${
                    statsData.netBalance >= 0
                      ? "text-slate-900 dark:text-white"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  ₹{formatAmount(statsData.netBalance)}
                </p>
                <p className="text-[10px] font-semibold text-slate-500 mt-0.5 pl-0.5">Net Balance</p>
              </div>
            </div>
          </div>

          {/* Transactions Ledger List Section */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-3.5 shadow-2xs space-y-2.5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Transactions Ledger ({selectedReportType === "business" ? "Active Book" : activeBookName})
              </h3>
              <span className="text-[10px] text-slate-400 font-medium">
                {isTransactionsPending ? "Loading..." : `${filteredTransactions.length} entries found`}
              </span>
            </div>

            {isTransactionsPending ? (
              <div className="flex flex-col items-center justify-center py-10 space-y-2">
                <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
                <span className="text-[10px] text-slate-400">Loading transactions...</span>
              </div>
            ) : !filteredTransactions || filteredTransactions.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-400 italic bg-slate-50/50 dark:bg-slate-950/20 rounded-lg border border-dashed border-slate-200 dark:border-slate-800">
                No transactions found for the selected period.
              </div>
            ) : (
              <div className="overflow-x-auto select-none">
                <table className="w-full text-left border-collapse min-w-[500px]">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                      <th className="pb-1.5 font-bold">Date & Time</th>
                      <th className="pb-1.5 font-bold">Party</th>
                      <th className="pb-1.5 font-bold">Category</th>
                      <th className="pb-1.5 font-bold">Payment Mode</th>
                      <th className="pb-1.5 font-bold">Remark</th>
                      <th className="pb-1.5 font-bold text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 dark:divide-slate-800/40 text-[10px]">
                    {filteredTransactions.map((tx) => {
                      const isCashIn = tx.type === "cash_in";
                      const txDate = tx.date ? format(new Date(tx.date), "dd MMM yyyy") : "";
                      return (
                        <tr key={tx._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                          <td className="py-2 text-slate-500 whitespace-nowrap">
                            {txDate} {tx.time ? `• ${tx.time}` : ""}
                          </td>
                          <td className="py-2 font-bold text-slate-700 dark:text-slate-300">
                            {tx.partyName || tx.partyDetails?.name || tx.party || "-"}
                          </td>
                          <td className="py-2 text-slate-600 dark:text-slate-450">
                            <span className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-[9px] font-medium">
                              {tx.categoryName || tx.categoryDetails?.name || tx.category || "-"}
                            </span>
                          </td>
                          <td className="py-2 text-slate-600 dark:text-slate-450">
                            {tx.paymentModeName || tx.paymentModeDetails?.name || tx.paymentMode || "-"}
                          </td>
                          <td className="py-2 text-slate-400 truncate max-w-[120px]" title={tx.remark || tx.description}>
                            {tx.remark || tx.description || "-"}
                          </td>
                          <td className={`py-2 font-black text-right whitespace-nowrap text-xs ${isCashIn ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
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
      </div>
    </DashboardSubLayout>
  );
}
