"use client";

import { BusinessSwitchCard } from "@/components/cards";
import AddCashbookForm from "@/components/form/cashbook/add-cashbook";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import DashboardSubLayout from "@/layout/dashboard-sublayout";
import { hasPermission } from "@/lib";
import { useBusiness } from "@/providers/business-cashbook-provider";
import { useGetCompanyById } from "@/services";
import { useAuth } from "@/hooks";
import { useGetCashbookList } from "@/services/cashbook.service";
import { useCompanyMemberRole } from "@/services/check-role.service";
import { CreateTransferForm } from "@/components/form/transfer/create-transfer-form";
import { ExportButton } from "@/components/buttons/export-button";
import { TransferActions } from "@/components/actions/transfer-actions";
import {
  useGetTransactionsByBook,
  useCreateTransaction,
  useGetTransaction,
  useUpdateTransaction,
  useDeleteTransaction,
  useVerifyTransaction,
} from "@/services/transaction.service";
import { useGetCategoriesByBook } from "@/services/category.service";
import { QuickPartiesPage } from "@/components/dashboard/party/quick-party-page";
import { AddTransactionForm } from "@/components/form/transaction/add-transaction";
import { EditTransactionForm } from "@/components/form/transaction/edit-transaction";
import { SheetLayoutComp } from "@/components/modals";
import { useGetPaymentModesByBook } from "@/services/payment-mode.service";
import { useGetBookPartiesInfinite } from "@/services/party.service";
import { useGetTransactionAuditLogs, formatTransactionAuditLog } from "@/services/audit-logs.service";
import { useUploadToS3 } from "@/services/file-upload.service";
import { TransactionFormProvider, useTransactionForm } from "@/hooks/use-transaction-hook";
import { fieldConfigurations } from "@/config";
import { FormFieldSettings } from "@/components/dashboard/setting";

import {
  Search,
  X,
  Plus,
  ChevronDown,
  Calendar as CalendarIcon,
  ArrowDownCircle,
  ArrowUpCircle,
  ArrowDown,
  ArrowUp,
  Printer,
  FileText,
  ChevronRight,
  Info,
  Clock,
  User,
  Paperclip,
  Upload,
  Loader2,
  Check,
  CheckCircle,
  Edit2,
  Trash2,
  AlertTriangle,
  ArrowLeftRight,
  RefreshCw,
  Eye,
  EyeOff,
  BookOpen,
  Settings,
} from "lucide-react";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { format, parseISO } from "date-fns";
import { toast } from "sonner";

export default function BookPage() {
  const params = useParams();
  const businessId = params.businessId as string;
  const { setCashbook } = useBusiness();
  const { user } = useAuth();
  const token = user?.accessToken || "";
  const { verifyTransaction, isVerifyingTransaction } = useVerifyTransaction();

  // Active book state
  const [activeBookId, setActiveBookId] = useState<string>("");
  const [showPrices, setShowPrices] = useState<boolean>(false);

  // Search & Filter State
  const [searchText, setSearchText] = useState("");
  const [dateFilterType, setDateFilterType] = useState<"all" | "today" | "yesterday" | "week" | "month" | "custom">("all");
  const [customDateRange, setCustomDateRange] = useState<{ from: string; to: string }>({ from: "", to: "" });
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedPaymentMode, setSelectedPaymentMode] = useState<string>("all");
  const [selectedUser, setSelectedUser] = useState<string>("all");

  // Dialog & Panel States
  const [activePanelType, setActivePanelType] = useState<"placeholder" | "details" | "add_transaction" | "edit_transaction" | "transfer" | "add_book">("placeholder");
  const [selectedTransactionId, setSelectedTransactionId] = useState<string | null>(null);
  const [addTransactionMode, setAddTransactionMode] = useState<"cash_in" | "cash_out">("cash_in");
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Mobile Back Button Interceptor for drawers
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handlePopState = (event: PopStateEvent) => {
      if (isMobileOpen) {
        setIsMobileOpen(false);
        setActivePanelType("placeholder");
        setSelectedTransactionId(null);
      }
    };

    if (isMobileOpen) {
      window.history.pushState({ drawerOpen: true }, "");
      window.addEventListener("popstate", handlePopState);
    }

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [isMobileOpen]);

  // Clean up history state if drawer is closed manually
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!isMobileOpen && window.history.state?.drawerOpen) {
      window.history.back();
    }
  }, [isMobileOpen]);


  // Load Book List
  const {
    cashbookList = [],
    isCashbookListPending,
    isCashbookListError,
    cashbookListError,
    refetchCashbookList,
  } = useGetCashbookList(businessId);

  // Load Company & Role
  const {
    company,
    isCompanyPending,
  } = useGetCompanyById(businessId);

  const {
    data: userRole,
    isLoading: isLoadingRole,
  } = useCompanyMemberRole(businessId);

  // Automatically select first book
  useEffect(() => {
    if (cashbookList.length > 0 && !activeBookId) {
      const firstBook = cashbookList[0];
      setActiveBookId(firstBook._id);
      setCashbook(firstBook);
    }
  }, [cashbookList, activeBookId, setCashbook]);

  const activeBook = useMemo(() => {
    return cashbookList.find((b) => b._id === activeBookId);
  }, [cashbookList, activeBookId]);

  // Sync selected book with context provider
  const handleBookChange = (book: any) => {
    setActiveBookId(book._id);
    setCashbook(book);
    setSelectedTransactionId(null);
    setActivePanelType("placeholder");
  };

  // Memoized date filter range
  const dateRange = useMemo(() => {
    if (dateFilterType === "all") return { from: undefined, to: undefined };
    const today = new Date();
    if (dateFilterType === "today") {
      const formatted = format(today, "yyyy-MM-dd");
      return { from: formatted, to: formatted };
    }
    if (dateFilterType === "yesterday") {
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      const formatted = format(yesterday, "yyyy-MM-dd");
      return { from: formatted, to: formatted };
    }
    if (dateFilterType === "week") {
      const weekAgo = new Date(today);
      weekAgo.setDate(today.getDate() - 7);
      return { from: format(weekAgo, "yyyy-MM-dd"), to: format(today, "yyyy-MM-dd") };
    }
    if (dateFilterType === "month") {
      const monthAgo = new Date(today);
      monthAgo.setDate(today.getDate() - 30);
      return { from: format(monthAgo, "yyyy-MM-dd"), to: format(today, "yyyy-MM-dd") };
    }
    if (dateFilterType === "custom" && customDateRange.from && customDateRange.to) {
      return { from: customDateRange.from, to: customDateRange.to };
    }
    return { from: undefined, to: undefined };
  }, [dateFilterType, customDateRange]);

  // Fetch transactions
  const {
    transactions = [],
    globalAnalytics,
    currency = "INR",
    isTransactionsPending,
    refetchTransactions,
  } = useGetTransactionsByBook({
    bookId: activeBookId || "",
    pageSize: 200,
    dateFrom: dateRange.from,
    dateTo: dateRange.to,
    category: selectedCategory !== "all" ? selectedCategory : undefined,
    paymentMode: selectedPaymentMode !== "all" ? selectedPaymentMode : undefined,
  });

  const calculatedNetBalance = (globalAnalytics?.totalCashIn || 0) - (globalAnalytics?.totalCashOut || 0);

  // Client side search filtering
  const filteredTransactions = useMemo(() => {
    if (!transactions) return [];
    return transactions.filter((tx) => {
      const searchLower = searchText.toLowerCase();
      return (
        !searchText.trim() ||
        (tx.party && tx.party.toLowerCase().includes(searchLower)) ||
        (tx.categoryDetails?.name && tx.categoryDetails.name.toLowerCase().includes(searchLower)) ||
        (tx.category && tx.category.toLowerCase().includes(searchLower)) ||
        (tx.remark && tx.remark.toLowerCase().includes(searchLower)) ||
        (tx.description && tx.description.toLowerCase().includes(searchLower)) ||
        (tx.paymentModeDetails?.name && tx.paymentModeDetails.name.toLowerCase().includes(searchLower)) ||
        (tx.paymentMode && tx.paymentMode.toLowerCase().includes(searchLower)) ||
        tx.amount.toString().includes(searchLower)
      );
    });
  }, [transactions, searchText]);

  // Category and Payment options
  const { categories = [] } = useGetCategoriesByBook({ bookId: activeBookId });
  const { data: paymentModesResponse } = useGetPaymentModesByBook({ bookId: activeBookId, status: "active" });
  const paymentModes = paymentModesResponse?.data || [];

  const { parties = [] } = useGetBookPartiesInfinite(activeBookId);

  // Permission Check
  const canCreateBook = hasPermission(
    { businessRole: userRole?.data?.companyRole || "staff" },
    "crud_cashbook",
    "C"
  );

  const formatAmount = (val: number) => {
    if (!showPrices) {
      const formattedZero = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: currency || "INR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(0);
      const symbol = formattedZero.replace(/\d/g, "").trim();
      return `${symbol} ••••`;
    }
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currency || "INR",
      minimumFractionDigits: 2,
    }).format(val);
  };

  // Print/Export transactions
  const handlePrint = () => {
    window.print();
  };

  const handleOpenAddTransaction = (mode: "cash_in" | "cash_out") => {
    setAddTransactionMode(mode);
    setActivePanelType("add_transaction");
    setSelectedTransactionId(null);
    if (window.innerWidth < 768) {
      setIsMobileOpen(true);
    }
  };

  const handleSelectTransaction = (id: string) => {
    if (selectedTransactionId === id) {
      setSelectedTransactionId(null);
      setActivePanelType("placeholder");
      if (window.innerWidth < 768) {
        setIsMobileOpen(false);
      }
    } else {
      setSelectedTransactionId(id);
      setActivePanelType("details");
      if (window.innerWidth < 768) {
        setIsMobileOpen(true);
      }
    }
  };

  // Helper to render right pane content
  const renderRightPanel = () => {
    if (activePanelType === "add_book") {
      return (
        <div className="flex flex-col h-full bg-white relative">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-3 border-b border-gray-100 shrink-0">
            <h3 className="text-lg font-bold text-gray-900">Create Book</h3>
            <button
              onClick={() => {
                setActivePanelType("placeholder");
                setIsMobileOpen(false);
              }}
              className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 cursor-pointer transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-2 scrollbar-none">
            <AddCashbookForm
              businessId={businessId}
              showHeader={false}
              onClose={() => {
                setActivePanelType("placeholder");
                if (window.innerWidth < 768) setIsMobileOpen(false);
                refetchCashbookList();
              }}
            />
          </div>
        </div>
      );
    }

    if (activePanelType === "add_transaction") {
      return (
        <TransactionFormProvider defaultVisibleFields={defaultVisibleFields}>
          <div className="flex flex-col h-full bg-white relative">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-3 border-b border-gray-100 shrink-0">
              <h3 className="text-base font-bold text-gray-900">
                {addTransactionMode === "cash_in" ? "Add Cash In Entry" : "Add Cash Out Entry"}
              </h3>
              <button
                onClick={() => {
                  setActivePanelType("placeholder");
                  setIsMobileOpen(false);
                }}
                className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-none">
              <AddTransactionForm
                businessId={businessId}
                type={addTransactionMode}
                bookId={activeBookId}
                onSubmitSuccess={() => {
                  refetchTransactions();
                  refetchCashbookList();
                  setActivePanelType("placeholder");
                  setIsMobileOpen(false);
                }}
              />
            </div>
          </div>
        </TransactionFormProvider>
      );
    }

    if (activePanelType === "edit_transaction" && selectedTransactionId) {
      return (
        <TransactionFormProvider defaultVisibleFields={defaultVisibleFields}>
          <div className="flex flex-col h-full bg-white relative">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
              <h3 className="text-base font-bold text-gray-900">
                Edit Transaction
              </h3>
              <button
                onClick={() => {
                  setActivePanelType("details");
                }}
                className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 scrollbar-none">
              <EditTransactionWrapper
                transactionId={selectedTransactionId}
                bookId={activeBookId}
                businessId={businessId}
                onSuccess={() => {
                  refetchTransactions();
                  refetchCashbookList();
                  setActivePanelType("details");
                  setIsMobileOpen(false);
                }}
              />
            </div>
          </div>
        </TransactionFormProvider>
      );
    }

    if (activePanelType === "transfer") {
      return (
        <div className="flex flex-col h-full bg-white relative">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
            <h3 className="text-base font-bold text-gray-900">Transfer Funds Between Books</h3>
            <button
              onClick={() => {
                setActivePanelType("placeholder");
                setIsMobileOpen(false);
              }}
              className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-2 sm:px-6 py-2">
            <CreateTransferForm
              businessId={businessId}
              cashbookId={activeBookId}
              currentCurrency={currency}
              currentCashbookName={activeBook?.name || ""}
              onCancel={() => {
                setActivePanelType("placeholder");
                setIsMobileOpen(false);
              }}
              onSuccess={() => {
                refetchTransactions();
                refetchCashbookList();
                setActivePanelType("placeholder");
                setIsMobileOpen(false);
              }}
            />
          </div>
        </div>
      );
    }

    if (activePanelType === "details" && selectedTransactionId) {
      return (
        <TransactionDetailsPane
          transactionId={selectedTransactionId}
          onClose={() => {
            setActivePanelType("placeholder");
            setSelectedTransactionId(null);
            setIsMobileOpen(false);
          }}
          onEdit={() => setActivePanelType("edit_transaction")}
          onDeleteSuccess={() => {
            refetchTransactions();
            refetchCashbookList();
            setActivePanelType("placeholder");
            setSelectedTransactionId(null);
            setIsMobileOpen(false);
          }}
          currency={currency}
          bookName={activeBook?.name}
          showPrices={showPrices}
          onToggleShowPrices={() => setShowPrices((prev) => !prev)}
        />
      );
    }

    // Default Placeholder
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-white">
        <img
          src="/no_book.png"
          alt="No Books Selected"
          className="w-72 h-72 object-contain select-none pointer-events-none"
        />
      </div>
    );
  };

  return (
    <DashboardSubLayout showTitle={false}>
      <div className="grid grid-cols-1 md:grid-cols-5 h-[calc(100dvh-72px)] md:h-[calc(100vh-22px)] mx-[-10px] md:mx-[-24px] mt-[-10px]">

        {/* LEFT PANEL: Console and List */}
        <div className="flex flex-col col-span-1 md:col-span-3 h-full min-w-0 bg-white border-r border-gray-100">

          {/* Header row inside LEFT PANEL */}
          <div className="flex items-center justify-between py-3 px-4 sm:px-6 pb-3 bg-white shrink-0 border-b">
            <h2 className="text-sm sm:text-base font-extrabold text-gray-900 uppercase tracking-wide truncate mr-2">
              {company?.name
                ? `${company.name.slice(0, 35)}${company.name.length > 35 ? "..." : ""}`
                : "Books Entries"}
            </h2>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPrices((prev) => !prev)}
                className="h-7 border-gray-200 hover:bg-gray-50 flex items-center justify-center text-gray-700 rounded-lg shrink-0 cursor-pointer p-0 w-7 sm:w-auto sm:px-2 gap-1.5"
                title={showPrices ? "Hide Balance" : "Show Balance"}
              >
                {showPrices ? (
                  <Eye className="w-3.5 h-3.5 text-blue-600" />
                ) : (
                  <EyeOff className="w-3.5 h-3.5 text-gray-400" />
                )}
                <span className="hidden sm:inline text-xs font-semibold">{showPrices ? "Hide" : "Show"}</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-7 border-gray-200 hover:bg-gray-50 hover:border-gray-300 flex items-center justify-center text-gray-700 rounded-lg shrink-0 cursor-pointer transition-colors p-0 w-7 sm:w-auto sm:px-2 gap-1"
                title="Book Settings"
                asChild
              >
                <Link href={`/dashboard/business/${businessId}/${activeBookId}/setting`}>
                  <Settings className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline text-xs font-semibold">Settings</span>
                </Link>
              </Button>
              {canCreateBook && (
                <Button
                  size="sm"
                  onClick={() => {
                    setActivePanelType("add_book");
                    if (window.innerWidth < 768) {
                      setIsMobileOpen(true);
                    }
                  }}
                  className="bg-[#4D80E0] hover:bg-[#3b6ecc] text-white rounded-lg h-7 flex items-center justify-center shadow-sm transition-all duration-200 active:scale-95 shrink-0 cursor-pointer p-0 w-7 sm:w-auto sm:px-3 gap-1"
                  title="New Book"
                >
                  <Plus className="w-3.5 h-3.5 text-white" />
                  <span className="hidden sm:inline text-xs font-semibold text-white">New Book</span>
                </Button>
              )}
            </div>
          </div>

          {/* Book Tabs Navigation */}
          <div className="flex items-center justify-between px-4 sm:px-6 border-b border-gray-100 bg-white shrink-0 h-10">
            <div className="flex items-center gap-4 overflow-x-auto scrollbar-none">
              {cashbookList.map((book) => {
                const isActive = book._id === activeBookId;
                return (
                  <button
                    key={book._id}
                    onClick={() => handleBookChange(book)}
                    className={`relative pb-2 text-xs md:text-sm font-semibold whitespace-nowrap transition-all duration-200 ${isActive
                      ? "text-blue-600 font-bold"
                      : "text-gray-500 hover:text-gray-800"
                      }`}
                  >
                    <span>{book.name}</span>
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Search bar */}
          <div className="px-4 sm:px-6 mt-2 bg-white shrink-0">
            <div className="relative w-full group">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within:text-blue-600 transition-colors" />
              <Input
                type="text"
                placeholder="Search Transactions..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="h-10 pl-10 pr-8 bg-gray-50 border-gray-200 focus-visible:bg-white focus-visible:border-blue-600 focus-visible:ring-2 focus-visible:ring-blue-100 rounded-xl transition-all placeholder:text-gray-600 text-sm font-medium"
              />
              {searchText && (
                <button
                  onClick={() => setSearchText("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-gray-200 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Filters Row */}
          <div className="flex items-center gap-2 px-4 sm:px-6 py-2.5 overflow-x-auto scrollbar-none border-b border-gray-100 bg-gray-50/20 shrink-0">

            {/* View By (Date) Popover */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 rounded-full border-gray-200 text-xs font-semibold bg-white text-gray-700 flex items-center gap-1.5 hover:bg-gray-50 hover:border-gray-300 shrink-0">
                  <CalendarIcon className="w-3.5 h-3.5 text-gray-500" />
                  <span>
                    {dateFilterType === "all" ? "View By" : `Date: ${dateFilterType}`}
                  </span>
                  <ChevronDown className="w-3 h-3 text-gray-400" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-1.5 z-[9999]" align="start">
                <div className="grid gap-0.5">
                  {[
                    { label: "All Time", value: "all" },
                    { label: "Today", value: "today" },
                    { label: "Yesterday", value: "yesterday" },
                    { label: "Last 7 Days", value: "week" },
                    { label: "Last 30 Days", value: "month" },
                    { label: "Custom Date Range", value: "custom" },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setDateFilterType(opt.value as any)}
                      className={`flex items-center justify-between w-full px-3 py-2 text-xs font-semibold rounded-lg text-left transition-colors ${dateFilterType === opt.value
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-700 hover:bg-gray-50"
                        }`}
                    >
                      <span>{opt.label}</span>
                      {dateFilterType === opt.value && <Check className="w-3.5 h-3.5 text-blue-600" />}
                    </button>
                  ))}
                  {dateFilterType === "custom" && (
                    <div className="p-2 border-t mt-1.5 space-y-2">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase">From</label>
                        <Input
                          type="date"
                          value={customDateRange.from}
                          onChange={(e) => setCustomDateRange((prev) => ({ ...prev, from: e.target.value }))}
                          className="h-8 text-xs px-2"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase">To</label>
                        <Input
                          type="date"
                          value={customDateRange.to}
                          onChange={(e) => setCustomDateRange((prev) => ({ ...prev, to: e.target.value }))}
                          className="h-8 text-xs px-2"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </PopoverContent>
            </Popover>

            {/* Category Popover */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 rounded-full border-gray-200 text-xs font-semibold bg-white text-gray-700 flex items-center gap-1.5 hover:bg-gray-50 hover:border-gray-300 shrink-0">
                  <span>
                    {selectedCategory === "all" ? "Category" : `Cat: ${selectedCategory}`}
                  </span>
                  <ChevronDown className="w-3 h-3 text-gray-400" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-1.5 max-h-60 overflow-y-auto z-[9999]" align="start">
                <div className="grid gap-0.5">
                  <button
                    onClick={() => setSelectedCategory("all")}
                    className={`flex items-center justify-between w-full px-3 py-2 text-xs font-semibold rounded-lg text-left transition-colors ${selectedCategory === "all" ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-50"
                      }`}
                  >
                    <span>All Categories</span>
                    {selectedCategory === "all" && <Check className="w-3.5 h-3.5 text-blue-600" />}
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat._id}
                      onClick={() => setSelectedCategory(cat.name)}
                      className={`flex items-center justify-between w-full px-3 py-2 text-xs font-semibold rounded-lg text-left transition-colors ${selectedCategory === cat.name ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-50"
                        }`}
                    >
                      <span>{cat.name}</span>
                      {selectedCategory === cat.name && <Check className="w-3.5 h-3.5 text-blue-600" />}
                    </button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            {/* Payment Mode Popover */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 rounded-full border-gray-200 text-xs font-semibold bg-white text-gray-700 flex items-center gap-1.5 hover:bg-gray-50 hover:border-gray-300 shrink-0">
                  <span>
                    {selectedPaymentMode === "all" ? "Payment Mode" : `Mode: ${selectedPaymentMode}`}
                  </span>
                  <ChevronDown className="w-3 h-3 text-gray-400" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-1.5 max-h-60 overflow-y-auto z-[9999]" align="start">
                <div className="grid gap-0.5">
                  <button
                    onClick={() => setSelectedPaymentMode("all")}
                    className={`flex items-center justify-between w-full px-3 py-2 text-xs font-semibold rounded-lg text-left transition-colors ${selectedPaymentMode === "all" ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-50"
                      }`}
                  >
                    <span>All Modes</span>
                    {selectedPaymentMode === "all" && <Check className="w-3.5 h-3.5 text-blue-600" />}
                  </button>
                  {paymentModes.map((mode) => (
                    <button
                      key={mode._id}
                      onClick={() => setSelectedPaymentMode(mode.name)}
                      className={`flex items-center justify-between w-full px-3 py-2 text-xs font-semibold rounded-lg text-left transition-colors ${selectedPaymentMode === mode.name ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-50"
                        }`}
                    >
                      <span>{mode.name}</span>
                      {selectedPaymentMode === mode.name && <Check className="w-3.5 h-3.5 text-blue-600" />}
                    </button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            {/* Clear Filters Option */}
            {(dateFilterType !== "all" || selectedCategory !== "all" || selectedPaymentMode !== "all") && (
              <button
                onClick={() => {
                  setDateFilterType("all");
                  setSelectedCategory("all");
                  setSelectedPaymentMode("all");
                }}
                className="text-xs font-bold text-red-500 hover:text-red-700 ml-1.5 transition-colors shrink-0"
              >
                Clear Filters
              </button>
            )}
          </div>

          {/* Financial Summary Card */}
          <div className="px-4 sm:px-6 py-3 bg-white border-b border-gray-100 shrink-0 ml-0 sm:ml-6">
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-4 items-center w-full">
              {/* Cash In */}
              <div>
                <div className="text-sm sm:text-lg font-bold text-[#43AF51] truncate">
                  {formatAmount(globalAnalytics?.totalCashIn || 0)}
                </div>
                <span className="text-[10px] sm:text-[11px] font-semibold text-gray-500 block">
                  Cash In
                </span>
              </div>

              {/* Cash Out */}
              <div className="border-l border-gray-100 pl-3 sm:pl-4">
                <div className="text-sm sm:text-lg font-bold text-[#C54E4E] truncate">
                  {formatAmount(globalAnalytics?.totalCashOut || 0)}
                </div>
                <span className="text-[10px] sm:text-[11px] font-semibold text-gray-500 block">
                  Cash Out
                </span>
              </div>

              {/* Current Balance */}
              <div className="border-l border-gray-100 pl-3 sm:pl-4">
                <div
                  className={`text-sm sm:text-lg font-bold truncate ${(globalAnalytics?.totalCashIn || 0) -
                    (globalAnalytics?.totalCashOut || 0) >=
                    0
                    ? "text-green-600"
                    : "text-red-600"
                    }`}
                >
                  {formatAmount(
                    (globalAnalytics?.totalCashIn || 0) -
                    (globalAnalytics?.totalCashOut || 0)
                  )}
                </div>
                <span className="text-[10px] sm:text-[11px] font-semibold text-gray-500 block">
                  Balance
                </span>
              </div>

              {/* Grid 4: Empty */}
              <div className="hidden sm:block"></div>

              {/* Grid 5: Export / View Report Button */}
              <div className="col-span-3 sm:col-span-1 flex justify-start sm:justify-end mt-2 sm:mt-0 w-full sm:w-auto">
                <ExportButton
                  bookId={activeBookId}
                  businessId={businessId}
                  token={token}
                />
              </div>
            </div>
          </div>

          {/* Ledger Table Headers */}
          <div className="grid grid-cols-10 pl-4 pr-4 sm:pl-6 sm:pr-[30px] py-2 bg-gray-50 border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wide shrink-0 ml-0 sm:ml-6">
            <div className="col-span-4 sm:col-span-4 ml-0 sm:ml-6">Entity</div>
            <div className="col-span-2 sm:col-span-2 text-right">Cash In / Out</div>
            <div className="col-span-2 sm:col-span-2 text-right">Balance</div>
            <div className="col-span-2 sm:col-span-2 text-right">Verify</div>
          </div>

          {/* Transaction List Entries */}
          <div className="flex-1 max-h-[360px] overflow-y-auto px-4 py-3 space-y-2 bg-gray-50/20 scrollbar-none ml-0 sm:ml-5">
            {isTransactionsPending ? (
              // Loading Skeleton
              [...Array(10)].map((_, i) => (
                <div key={i} className="grid grid-cols-10 items-center p-3 bg-white border border-gray-100 rounded-xl animate-pulse">
                  <div className="col-span-4 sm:col-span-4 space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                  <div className="col-span-2 sm:col-span-2 flex justify-end pr-3 sm:pr-5">
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <div className="col-span-2 sm:col-span-2 flex justify-end pr-3 sm:pr-5">
                    <Skeleton className="h-4 w-12" />
                  </div>
                  <div className="col-span-2 sm:col-span-2 flex justify-center">
                    <Skeleton className="h-6 w-12 rounded" />
                  </div>
                </div>
              ))
            ) : filteredTransactions.length === 0 ? (
              <>
                {[...Array(3)].map((_, i) => (
                  <div
                    key={`empty-${i}`}
                    className="grid grid-cols-10 items-stretch border border-dashed border-gray-100 rounded-xl h-[82px] bg-white/20"
                  >
                    {i === 0 ? (
                      <div className="flex flex-col items-center justify-center text-center col-span-10 h-full">
                        <span className="font-bold text-xs text-gray-400">No transactions recorded</span>
                        <span className="text-[10px] text-gray-300 font-normal mt-0.5">Entries will appear here</span>
                      </div>
                    ) : null}
                  </div>
                ))}
              </>
            ) : (
              <>
                {filteredTransactions.map((tx) => {
                  const isSelected = tx._id === selectedTransactionId;
                  const formattedDate = format(parseISO(tx.date), "dd MMM yy");
                  const formattedTime = tx.time || "";
                  const isCashIn = tx.type === "cash_in";

                  return (
                    <div
                      key={tx._id}
                      onClick={() => handleSelectTransaction(tx._id)}
                      className={`grid grid-cols-10 items-stretch border rounded-xl cursor-pointer hover:shadow-sm transition-all duration-150 overflow-hidden bg-white ${isSelected
                        ? "ring-2 ring-blue-500 border-blue-500"
                        : "border-gray-200"
                        }`}
                    >
                      {/* Column 1: Entity */}
                      <div className="col-span-4 sm:col-span-4 p-2 pl-3 sm:pl-4 flex flex-col justify-center gap-1 bg-white">
                        <span className="text-[11px] font-semibold text-slate-500">
                          {formattedDate} {formattedTime && `• ${formattedTime}`}
                        </span>
                        {tx.runningBalance !== undefined && (
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded-[4px] bg-[#eef5ff] text-[#1b66ff] inline-block w-fit">
                            Bal. {formatAmount(tx.runningBalance)}
                          </span>
                        )}
                        <span className="text-xs font-semibold text-slate-500 truncate max-w-full">
                          {tx.paymentModeDetails?.name || tx.paymentMode || "Cash"} • {tx.party || tx.remark || tx.description || "Self"}
                        </span>
                      </div>

                      {/* Column 2: Cash In / Out */}
                      <div className="col-span-2 sm:col-span-2 flex items-center justify-end border-l border-gray-100 bg-gray-50/10 p-2 pr-3 sm:pr-5 bg-gray-400/20">
                        <span className={`text-xs sm:text-[14px] font-bold tracking-tight ${isCashIn ? "text-[#00a854]" : "text-[#e60000]"}`}>
                          {isCashIn ? "+ " : "- "}{formatAmount(tx.amount)}
                        </span>
                      </div>

                      {/* Column 3: Balance */}
                      <div className="col-span-2 sm:col-span-2 flex items-center justify-end border-l border-gray-100 bg-gray-50/10 p-2 pr-3 sm:pr-5">
                        <span className="text-xs sm:text-[14px] font-bold text-slate-600">
                          {tx.runningBalance !== undefined ? formatAmount(tx.runningBalance) : "-"}
                        </span>
                      </div>

                      {/* Column 4: Verify */}
                      <div className="col-span-2 sm:col-span-2 flex items-center justify-center border-l border-gray-100 bg-gray-50/10 p-2">
                        {tx.isVerified ? (
                          <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                            Verified
                          </span>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={isVerifyingTransaction}
                            onClick={(e) => {
                              e.stopPropagation();
                              verifyTransaction(tx._id);
                            }}
                            className="h-6 px-2 text-[10px] font-bold text-blue-600 border-blue-200 bg-blue-50 hover:bg-blue-100 cursor-pointer"
                          >
                            {isVerifyingTransaction ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              "Verify"
                            )}
                          </Button>
                        )}
                      </div>

                      {/* Row 2: Transfer Actions (only if pending transfer) */}
                      {tx.subType === "transfer" &&
                       tx.status === "pending" &&
                       tx.type === "cash_in" && (
                        <div
                          onClick={(e) => e.stopPropagation()}
                          className="col-span-10 p-2 bg-amber-50 border-t border-amber-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-left"
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-amber-900 shrink-0">Transfer Action Required:</span>
                            <span className="text-xs text-amber-800">Approve or reject this transfer request</span>
                          </div>
                          <TransferActions
                            transferId={tx._id}
                            status={tx.status as "pending" | "approved" | "rejected"}
                            sourceBookId={tx.book}
                            targetBookId={tx.targetBookId || ""}
                            amount={tx.amount}
                            currency={currency || "INR"}
                            canApprove={true}
                            canReject={true}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </>
            )}
          </div>

          {/* Sticky Bottom Actions inside list */}
          <div suppressHydrationWarning className="mt-auto grid grid-cols-3 gap-1.5 sm:gap-2 px-4 sm:px-6 border-t border-gray-100 bg-white shrink-0 h-[52px] items-center">
            <button
              onClick={() => handleOpenAddTransaction("cash_in")}
              className="flex items-center justify-center gap-1 sm:gap-1.5 h-9 bg-[#43AF51] active:scale-95 text-white font-bold text-[10px] sm:text-[11px] rounded-lg transition-all shadow-sm cursor-pointer px-1 sm:px-2.5"
            >
              <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-white flex items-center justify-center text-[#43AF51] shrink-0">
                <ArrowDown className="w-2.5 h-2.5 sm:w-3 sm:h-3" strokeWidth={3} />
              </div>
              <span>Cash In</span>
            </button>
            <button
              onClick={() => handleOpenAddTransaction("cash_out")}
              className="flex items-center justify-center gap-1 sm:gap-1.5 h-9 bg-[#C54E4E] active:scale-95 text-white font-bold text-[10px] sm:text-[11px] rounded-lg transition-all shadow-sm cursor-pointer px-1 sm:px-2.5"
            >
              <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-white flex items-center justify-center text-[#C54E4E] shrink-0">
                <ArrowUp className="w-2.5 h-2.5 sm:w-3 sm:h-3" strokeWidth={3} />
              </div>
              <span>Cash Out</span>
            </button>
            <button
              onClick={() => {
                setActivePanelType("transfer");
                setSelectedTransactionId(null);
                if (window.innerWidth < 768) {
                  setIsMobileOpen(true);
                }
              }}
              className="flex items-center justify-center gap-1 sm:gap-1.5 h-9 bg-[#1b66ff] active:scale-95 text-white font-bold text-[10px] sm:text-[11px] rounded-lg transition-all shadow-sm cursor-pointer px-1 sm:px-2.5"
            >
              <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-white flex items-center justify-center text-[#1b66ff] shrink-0">
                <ArrowLeftRight className="w-2.5 h-2.5 sm:w-3 sm:h-3" strokeWidth={3} />
              </div>
              <span>Transfer</span>
            </button>
          </div>

        </div>

        {/* RIGHT PANEL: Details/Forms (Desktop Side Pane) */}
        <div className="hidden md:flex flex-col md:col-span-2 bg-white h-full overflow-hidden scrollbar-none">
          {renderRightPanel()}
        </div>

        {/* Drawer for Mobile layout */}
        <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
          <SheetContent side="right" className="w-full sm:max-w-[450px] p-0 overflow-y-auto [&>button]:hidden">
            {renderRightPanel()}
          </SheetContent>
        </Sheet>

      </div>
    </DashboardSubLayout>
  );
}

/* ==========================================
   ADD & EDIT COMMON TYPES
   ========================================== */
interface Attachment {
  url: string;
  key: string;
  fileType: string;
  mimeType: string;
  size: number;
}

interface UploadedFile {
  file: File;
  previewUrl: string;
  isImage: boolean;
  uploaded?: boolean;
  attachment?: Attachment;
}

type FormErrors = {
  amount?: string;
  category?: string;
  paymentMode?: string;
  date?: string;
};

const defaultVisibleFields = {
  category: {
    visible: true,
    config: fieldConfigurations.category,
  },
  partyName: {
    visible: true,
    config: fieldConfigurations.partyNAme,
  },
  otherDetail: {
    visible: true,
    config: fieldConfigurations.otherDetail,
  },
  paymentMode: {
    visible: true,
    config: fieldConfigurations.category,
  },
  date: {
    visible: true,
    config: fieldConfigurations.category,
  },
  remark: {
    visible: true,
    config: fieldConfigurations.category,
  },
  attachments: {
    visible: true,
    config: fieldConfigurations.category,
  },
};

/* ==========================================
   EDIT TRANSACTION WRAPPER COMPONENT
   ========================================== */
function EditTransactionWrapper({
  transactionId,
  bookId,
  businessId,
  onSuccess,
}: {
  transactionId: string;
  bookId: string;
  businessId: string;
  onSuccess: () => void;
}) {
  const { transactionData, isTransactionPending } = useGetTransaction(transactionId);

  if (isTransactionPending || !transactionData) {
    return (
      <div className="p-4 space-y-4 animate-pulse">
        <div className="h-10 bg-gray-100 rounded w-full" />
        <div className="h-10 bg-gray-100 rounded w-full" />
        <div className="h-20 bg-gray-100 rounded w-full" />
      </div>
    );
  }

  return (
    <EditTransactionForm
      businessId={businessId}
      bookId={bookId}
      transaction={transactionData}
      onSubmitSuccess={onSuccess}
    />
  );
}

/* ==========================================
   TRANSACTION DETAILS PANEL COMPONENT
   ========================================== */
interface TransactionDetailsPaneProps {
  transactionId: string;
  onClose: () => void;
  onEdit: () => void;
  onDeleteSuccess: () => void;
  currency: string;
  bookName?: string;
  showPrices: boolean;
  onToggleShowPrices?: () => void;
}

function TransactionDetailsPane({
  transactionId,
  onClose,
  onEdit,
  onDeleteSuccess,
  currency,
  bookName,
  showPrices,
  onToggleShowPrices,
}: TransactionDetailsPaneProps) {
  const { transactionData, isTransactionPending, refetchTransaction } = useGetTransaction(transactionId);
  const { transactionAuditLogs = [], isTransactionAuditLogsPending } = useGetTransactionAuditLogs(transactionId);
  const { deleteTransaction, isDeletingTransaction } = useDeleteTransaction();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<"details" | "logs">("details");
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isMobileScreen, setIsMobileScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileScreen(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Mobile Back Button Interceptor for Delete Confirmation Dialog
  useEffect(() => {
    if (typeof window === "undefined" || !isMobileScreen) return;

    const handlePopState = (event: PopStateEvent) => {
      if (isDeleteConfirmOpen) {
        setIsDeleteConfirmOpen(false);
      }
    };

    if (isDeleteConfirmOpen) {
      window.history.pushState({ deleteConfirmOpen: true }, "");
      window.addEventListener("popstate", handlePopState);
    }

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [isDeleteConfirmOpen, isMobileScreen]);

  // Clean up history state if delete dialog is closed manually
  useEffect(() => {
    if (typeof window === "undefined" || !isMobileScreen) return;
    if (!isDeleteConfirmOpen && window.history.state?.deleteConfirmOpen) {
      window.history.back();
    }
  }, [isDeleteConfirmOpen, isMobileScreen]);

  const formatAmount = (val: number) => {
    if (!showPrices) {
      const formattedZero = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: currency || "INR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(0);
      const symbol = formattedZero.replace(/\d/g, "").trim();
      return `${symbol} ••••`;
    }
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currency || "INR",
      minimumFractionDigits: 2,
    }).format(val);
  };

  const handleDelete = () => {
    deleteTransaction(transactionId, {
      onSuccess: () => {
        toast.success("Transaction moved to Recycle Bin");
        setIsDeleteConfirmOpen(false);
        onDeleteSuccess();
      },
      onError: (err) => {
        toast.error("Failed to delete transaction: " + err.message);
      },
    });
  };

  if (isTransactionPending || !transactionData) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-3 bg-white">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="text-xs font-semibold text-gray-400">Loading details...</span>
      </div>
    );
  }

  const isCashIn = transactionData.type === "cash_in";
  const formattedDate = format(parseISO(transactionData.date), "MMMM dd, yyyy");
  const formattedTime = transactionData.time || "";

  const renderDetailsBody = () => (
    <>
      {/* Banner Summary matching screenshot */}
      <div className={`p-3 rounded-[18px] border text-left relative overflow-hidden ${isCashIn
        ? "bg-[#e8f8f0] border-[#c3e6cb] text-[#2e7d32]"
        : "bg-[#fde8e8] border-[#f5c6cb] text-[#c62828]"
        }`}>
        <div className="flex items-center gap-1.5 mb-2.5">
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${isCashIn
            ? "border-[#a3e2ab] text-[#2e7d32] bg-[#ebf7ec]"
            : "border-[#f5c6cb] text-[#c62828] bg-[#fde8e8]"
            }`}>
            {isCashIn ? "Money In" : "Money Out"}
          </span>
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${isCashIn
            ? "border-[#a3e2ab] text-[#2e7d32] bg-[#ebf7ec]"
            : "border-[#f5c6cb] text-[#c62828] bg-[#fde8e8]"
            }`}>
            Confirmed
          </span>
        </div>
        <div className={`text-[20px] md:text-[22px] font-bold tracking-tight leading-none my-1 ${isCashIn ? "text-[#2e7d32]" : "text-[#c62828]"}`}>
          {isCashIn ? "" : "-"}
          {formatAmount(transactionData.amount)}
        </div>
        <p className="text-[11px] text-gray-400 font-normal mt-1.5">
          on {formattedDate} at {formattedTime}
        </p>
      </div>

      {/* Running Balance row matching screenshot */}
      {transactionData.runningBalance !== undefined && (
        <div className="flex items-center justify-between py-2 px-3.5 rounded-lg bg-[#43a047] text-white font-semibold text-[11px] shadow-sm">
          <span>Running Balance</span>
          <span>{formatAmount(transactionData.runningBalance)}</span>
        </div>
      )}

      {/* Details Grid Table matching screenshot */}
      <div className="bg-[#f5f6fa] rounded-xl p-4 space-y-3.5">
        <div className="flex items-center justify-between border-b border-gray-200/50 pb-2.5">
          <span className="text-[11px] font-medium text-gray-700">Payment Mode</span>
          <span className="text-[11px] font-medium text-[#3f66e5]">
            {transactionData.paymentModeDetails?.name || transactionData.paymentMode || "Cash"}
          </span>
        </div>

        <div className="flex items-center justify-between border-b border-gray-200/50 pb-2.5">
          <span className="text-[11px] font-medium text-gray-700">Category</span>
          <span className="text-[11px] font-medium text-[#3f66e5]">
            {transactionData.categoryDetails?.name || transactionData.category || "General"}
          </span>
        </div>

        <div className="flex items-center justify-between border-b border-gray-200/50 pb-2.5">
          <span className="text-[11px] font-medium text-gray-700">Book</span>
          <span className="text-[11px] font-medium text-[#3f66e5]">
            {bookName || "GH3"}
          </span>
        </div>

        <div className="flex items-center justify-between border-b border-gray-200/50 pb-2.5">
          <span className="text-[11px] font-medium text-gray-700">Created by</span>
          <span className="text-[11px] font-medium text-[#3f66e5]">
            {typeof transactionData.createdBy === "object" ? transactionData.createdBy?.name : "Admin"}
          </span>
        </div>

        <div className="flex items-center justify-between pb-0.5">
          <span className="text-[11px] font-medium text-gray-700">Updated by</span>
          <span className="text-[11px] font-medium text-[#3f66e5]">
            {typeof transactionData.createdBy === "object" ? transactionData.createdBy?.name : "Admin"}
          </span>
        </div>
      </div>

      {/* Attachments Section */}
      {transactionData.attachments && transactionData.attachments.length > 0 && (
        <div className="space-y-2 shrink-0">
          <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Attachments</h4>
          <div className="grid gap-2">
            {transactionData.attachments.map((att) => (
              <a
                key={att._id}
                href={att.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 border border-gray-100 rounded-xl transition-all group"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <FileText className="w-4.5 h-4.5 text-blue-500 group-hover:scale-110 transition-transform shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold text-gray-700 truncate">{att.key}</p>
                    <p className="text-[9px] text-gray-400">{(att.size / 1024).toFixed(1)} KB • {att.fileType}</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-0.5 transition-transform" />
              </a>
            ))}
          </div>
        </div>
      )}
    </>
  );

  const renderLogsBody = () => (
    <>
      {isTransactionAuditLogsPending ? (
        <div className="flex items-center justify-center py-6">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
        </div>
      ) : transactionAuditLogs.length === 0 ? (
        <p className="text-xs font-semibold text-center text-gray-400 py-4">No activity logs recorded.</p>
      ) : (
        <div className="space-y-4 divide-y divide-gray-100">
          {transactionAuditLogs.map((log, idx) => {
            const logDate = new Date(log.changedAt);
            const formattedLogDateTime = (() => {
              try {
                return format(logDate, "dd MMM yy '•' hh:mm a");
              } catch (e) {
                return log.changedAt;
              }
            })();

            const isCurrentUser = user?._id === log.changedBy?._id;
            const authorDisplay = `${isCurrentUser ? "You" : (log.changedBy?.name || "User")} • ${log.changedBy?.email || ""}`;

            return (
              <div key={log._id} className={`text-xs space-y-1.5 text-left ${idx > 0 ? "pt-4" : ""}`}>
                <div className="text-[11px] text-gray-400 font-medium">
                  {formattedLogDateTime}
                </div>
                <div>
                  <span className="inline-block text-[#3b82f6] bg-[#eef2ff] border border-[#dbeafe] px-2.5 py-0.5 rounded-[4px] text-[11px] font-semibold">
                    Transaction {log.changeType === "create" ? "Created" : log.changeType === "update" ? "Updated" : "Deleted"} by User
                  </span>
                </div>
                <p className="text-[11px] text-gray-500 font-medium">
                  {authorDisplay}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </>
  );

  const renderFooterControls = () => (
    <div className="grid grid-cols-2 gap-3 px-6 py-4 border-t border-gray-100 bg-white shrink-0 shadow-[0_-4px_12px_rgba(0,0,0,0.02)]">
      <Button
        onClick={onEdit}
        variant="outline"
        className="h-10 border-gray-200 hover:bg-gray-50 rounded-xl text-xs font-bold text-gray-700 flex items-center justify-center gap-1.5 cursor-pointer"
      >
        <Edit2 className="w-3.5 h-3.5" />
        <span>Edit Entry</span>
      </Button>
      <Button
        onClick={() => setIsDeleteConfirmOpen(true)}
        variant="destructive"
        className="h-10 bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 border border-red-100 hover:border-red-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
      >
        <Trash2 className="w-3.5 h-3.5" />
        <span>Delete Entry</span>
      </Button>
    </div>
  );

  const renderDeleteDialog = () => (
    <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
      <DialogContent className="sm:max-w-[400px] p-6 z-[99999]">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="p-3 bg-red-50 text-red-600 rounded-full">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Delete Entry?</h3>
            <p className="text-xs font-medium text-gray-500 mt-1.5">
              This transaction will be moved to the Recycle Bin. You can restore it later if needed.
            </p>
          </div>
          <div className="flex gap-3 w-full mt-4">
            <Button
              variant="outline"
              onClick={() => setIsDeleteConfirmOpen(false)}
              className="flex-1 h-10 border-gray-200 rounded-xl text-xs font-bold text-gray-700 cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              disabled={isDeletingTransaction}
              className="flex-1 h-10 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1 cursor-pointer"
            >
              {isDeletingTransaction && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>Delete</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  if (isMobileScreen) {
    return (
      <div className="flex flex-col h-full bg-white relative">
        {/* Header matching other panels */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-gray-100 shrink-0 bg-white">
          <h3 className="text-base font-bold text-gray-900">Transaction Details</h3>
          <div className="flex items-center gap-1">
            {onToggleShowPrices && (
              <button
                onClick={onToggleShowPrices}
                className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 cursor-pointer transition-colors"
                title={showPrices ? "Hide Balance" : "Show Balance"}
              >
                {showPrices ? (
                  <Eye className="w-5 h-5 text-blue-600" />
                ) : (
                  <EyeOff className="w-5 h-5 text-gray-400" />
                )}
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 cursor-pointer transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-gray-100 bg-gray-50/50 p-1 gap-1 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab("details")}
            className={`flex-1 py-1.5 text-center text-xs font-semibold rounded-lg transition-all cursor-pointer ${activeTab === "details"
                ? "bg-white text-blue-600 shadow-xs border border-gray-150"
                : "text-gray-500 hover:text-gray-900"
              }`}
          >
            Details
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("logs")}
            className={`flex-1 py-1.5 text-center text-xs font-semibold rounded-lg transition-all cursor-pointer ${activeTab === "logs"
                ? "bg-white text-blue-600 shadow-xs border border-gray-150"
                : "text-gray-500 hover:text-gray-900"
              }`}
          >
            Activity Logs
          </button>
        </div>

        {/* Transaction Details Body */}
        {activeTab === "details" && (
          <div className="flex-1 overflow-y-auto p-5 space-y-4.5 scrollbar-none border-b border-gray-100 bg-white mr-0">
            {renderDetailsBody()}
          </div>
        )}

        {/* Activity Logs Body */}
        {activeTab === "logs" && (
          <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-none bg-white border-b border-gray-100">
            {renderLogsBody()}
          </div>
        )}

        {/* Footer Controls */}
        {renderFooterControls()}

        {/* Delete Confirmation Dialog */}
        {renderDeleteDialog()}
      </div>
    );
  }

  // Desktop Accordion Layout
  return (
    <div className="flex flex-col h-full bg-white relative">
      <button
        type="button"
        onClick={() => setActiveTab(activeTab === "details" ? "logs" : "details")}
        className="flex items-center justify-between w-full px-5 py-4 border-b border-gray-100 shrink-0 hover:bg-gray-50 transition-colors cursor-pointer text-left"
      >
        <span className="text-sm font-bold text-gray-900">Transaction Details</span>
        <ChevronRight className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${activeTab === "details" ? "rotate-90" : ""}`} />
      </button>

      {/* Transaction Details Body */}
      {activeTab === "details" && (
        <div className="flex-1 overflow-y-auto p-5 space-y-4.5 scrollbar-none border-b border-gray-100 bg-white mr-4">
          {renderDetailsBody()}
        </div>
      )}

      {/* Activity Logs Header */}
      <button
        type="button"
        onClick={() => setActiveTab(activeTab === "logs" ? "details" : "logs")}
        className="flex items-center justify-between w-full px-5 py-4 border-b border-gray-100 shrink-0 hover:bg-gray-50 transition-colors cursor-pointer text-left"
      >
        <span className="text-sm font-bold text-gray-900">Activity Logs</span>
        <ChevronRight className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${activeTab === "logs" ? "rotate-90" : ""}`} />
      </button>

      {/* Activity Logs Body */}
      {activeTab === "logs" && (
        <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-none bg-white border-b border-gray-100">
          {renderLogsBody()}
        </div>
      )}

      {/* Footer Controls */}
      {renderFooterControls()}

      {/* Delete Confirmation Dialog */}
      {renderDeleteDialog()}
    </div>
  );
}