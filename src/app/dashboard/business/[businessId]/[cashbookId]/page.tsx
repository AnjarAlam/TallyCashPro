// // ----3-------

// // app/dashboard/business/[businessId]/[cashbookId]/page.tsx
// "use client";
// import { AddTransactionCard, BookTotalsCard } from "@/components/cards";
// import { compConfigProps } from "@/components/navigation/dashboard/title-header";
// import { DashboardSubLayout } from "@/layout";
// import { Settings, Users, History, BarChart3, ChevronDown, Filter, Calendar, X, Loader2 } from "lucide-react";
// import Link from "next/link";
// import { use, useState, useEffect, useMemo, useCallback } from "react";
// import { TransactionsPage } from "./transaction-page";
// import { hasPermission } from "@/lib";
// import { useCashbookMemberRole, useCompanyMemberRole, useGetCategories } from "@/services";
// import { useAuth } from "@/hooks";
// import { ExportButton } from "@/components/buttons/export-button";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Button } from "@/components/ui/button";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import { Calendar as CalendarComponent } from "@/components/ui/calendar";
// import { Badge } from "@/components/ui/badge";
// import { format, subDays, startOfDay, endOfDay } from "date-fns";
// import { useGetPaymentModes } from "@/services/payment-mode.service";
// import { useGetTransactionsSummary } from "@/services/transaction.service";
// import { useGetTransactionsByBook } from "@/services/transaction.service";
// import { CurrencyCode, getCurrencyInfo, formatCurrencyAmount } from "@/constants/currency";

// // Define filter interfaces
// interface DateFilter {
//   type: 'all' | 'today' | 'week' | 'month' | 'custom';
//   startDate?: Date;
//   endDate?: Date;
// }

// interface QuickFilters {
//   dateFilter: DateFilter;
//   category: string;
//   paymentMode: string;
//   party: string;
//   user: string;
// }

// // Special constants for "all" selection
// const ALL_CATEGORIES = "all_categories";
// const ALL_PAYMENT_MODES = "all_payment_modes";
// const ALL_PARTIES = "all_parties";
// const ALL_USERS = "all_users";

// // Compact Filtered Summary Component
// interface CompactFilteredSummaryProps {
//   totalCashIn: number;
//   totalCashOut: number;
//   netBalance: number;
//   currency?: CurrencyCode;
//   isLoading?: boolean;
// }

// const CompactFilteredSummary = ({ 
//   totalCashIn, 
//   totalCashOut, 
//   netBalance, 
//   currency = "USD", 
//   isLoading = false
// }: CompactFilteredSummaryProps) => {
//   const formatAmount = useCallback((amount: number) => {
//     return formatCurrencyAmount(amount, currency);
//   }, [currency]);

//   if (isLoading) {
//     return (
//       <div className="mb-4 p-3 bg-blue-50 border border-blue-100 rounded-lg">
//         <div className="flex justify-between items-center">
//           <div className="flex items-center gap-2">
//             <div className="h-3 w-3 bg-blue-200 rounded-full animate-pulse"></div>
//             <div className="h-4 w-32 bg-blue-200 rounded animate-pulse"></div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="mb-4 p-3 bg-blue-50 border border-blue-100 rounded-lg">
//       <div className="flex items-center gap-2">
//         <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
//         <span className="text-sm font-medium text-gray-700">Filtered:</span>
//         <span className="text-sm text-gray-600">
//           In: <span className="font-medium text-green-600">{formatAmount(totalCashIn)}</span> 
//           {" "}Out: <span className="font-medium text-red-600">{formatAmount(totalCashOut)}</span>
//         </span>
//         <span className="text-sm text-gray-600 ml-2">
//           Net: <span className={`font-medium ${netBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
//             {netBalance >= 0 ? '+' : ''}{formatAmount(netBalance)}
//           </span>
//         </span>
//       </div>
//     </div>
//   );
// };

// export default function Page({
//   params,
// }: {
//   params: Promise<{ businessId: string; cashbookId: string }>;
// }) {
//   const { user } = useAuth();
//   const { businessId, cashbookId } = use(params);

//   const [showFilters, setShowFilters] = useState(false);
//   const [filters, setFilters] = useState<QuickFilters>({
//     dateFilter: { type: 'all' },
//     category: ALL_CATEGORIES,
//     paymentMode: ALL_PAYMENT_MODES,
//     party: ALL_PARTIES,
//     user: ALL_USERS,
//   });

//   // Add state for applied filters
//   const [appliedFilters, setAppliedFilters] = useState<Record<string, any>>({});

//   // States for custom date range
//   const [customDateRange, setCustomDateRange] = useState<{
//     from?: Date;
//     to?: Date;
//   }>({});

//   // Debounce state to prevent rapid API calls
//   const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);

//   // Fetch categories and payment modes
//   const {
//     categories,
//     isCategoriesPending,
//   } = useGetCategories({
//     businessId,
//   });

//   const {
//     data: paymentModesData,
//     isLoading: isPaymentModesLoading,
//   } = useGetPaymentModes(businessId, "active");

//   const {
//     data: userRole,
//     isLoading: isLoadingRole,
//   } = useCompanyMemberRole(businessId);

//   const {
//     data: userCashbookRole,
//     isLoading: isLoadingCashbookRole,
//   } = useCashbookMemberRole(cashbookId, user?._id || "");
  
//   const token = user?.accessToken || 
//     (typeof window !== 'undefined' ? localStorage.getItem('token') : null);

//   // Create a separate hook for fetching filtered totals
//   const { 
//     data: filteredTotalsData,
//     isLoading: isTotalsLoading,
//     refetch: refetchTotals 
//   } = useGetTransactionsSummary({
//     bookId: cashbookId,
//     ...appliedFilters,
//   });

//   // Use the main transactions hook to get currency from book details
//   const { 
//     currency: bookCurrency,
//     transactions,
//     isTransactionsPending,
//   } = useGetTransactionsByBook({
//     bookId: cashbookId,
//     pageSize: 1, // Only need one transaction to get currency
//     ...appliedFilters,
//   });

//   // Determine the currency to use
//   const currentCurrency = useMemo(() => {
//     // First try to get from filtered totals data if available
//     if (filteredTotalsData?.data?.currency) {
//       return filteredTotalsData.data.currency;
//     }
//     // Then try from bookCurrency from transactions hook
//     if (bookCurrency) {
//       return bookCurrency;
//     }
//     // Fallback to USD
//     return "USD" as CurrencyCode;
//   }, [filteredTotalsData, bookCurrency]);

//   // Format category options for Select - Use names as values since API expects category names
//   const categoryOptions = useMemo(() => {
//     if (isCategoriesPending) {
//       return [];
//     }
    
//     const options = categories?.map(category => ({
//       id: category._id,
//       name: category.name,
//       value: category.name
//     })) || [];
    
//     return options;
//   }, [categories, isCategoriesPending]);

//   // Format payment mode options for Select - Use names as values
//   const paymentModeOptions = useMemo(() => {
//     if (isPaymentModesLoading) {
//       return [];
//     }
    
//     const options = paymentModesData?.data?.map(mode => ({
//       id: mode._id,
//       name: mode.name,
//       value: mode.name
//     })) || [];
    
//     return options;
//   }, [paymentModesData, isPaymentModesLoading]);

//   // Get date range from filter for API
//   const getAPIDateRange = useCallback((filter: DateFilter) => {
//     const now = new Date();
    
//     switch (filter.type) {
//       case 'all':
//         return {};
//       case 'today':
//         return {
//           dateFrom: format(startOfDay(now), 'yyyy-MM-dd'),
//           dateTo: format(endOfDay(now), 'yyyy-MM-dd')
//         };
//       case 'week':
//         const weekStart = subDays(now, 6);
//         return {
//           dateFrom: format(startOfDay(weekStart), 'yyyy-MM-dd'),
//           dateTo: format(endOfDay(now), 'yyyy-MM-dd')
//         };
//       case 'month':
//         const monthStart = subDays(now, 29);
//         return {
//           dateFrom: format(startOfDay(monthStart), 'yyyy-MM-dd'),
//           dateTo: format(endOfDay(now), 'yyyy-MM-dd')
//         };
//       case 'custom':
//         if (filter.startDate && filter.endDate) {
//           return {
//             dateFrom: format(startOfDay(filter.startDate), 'yyyy-MM-dd'),
//             dateTo: format(endOfDay(filter.endDate), 'yyyy-MM-dd')
//           };
//         }
//         return {};
//       default:
//         return {};
//     }
//   }, []);

//   // Prepare filters for TransactionsPage
//   const getTransactionsFilters = useCallback(() => {
//     const dateRange = getAPIDateRange(filters.dateFilter);
    
//     const apiFilters: Record<string, any> = {};
    
//     // Add date filters
//     if (dateRange.dateFrom) apiFilters.dateFrom = dateRange.dateFrom;
//     if (dateRange.dateTo) apiFilters.dateTo = dateRange.dateTo;
    
//     // Category filter - API expects category names
//     if (filters.category !== ALL_CATEGORIES && filters.category) {
//       apiFilters.category = filters.category;
//     }
    
//     // Payment mode filter - API expects payment mode names
//     if (filters.paymentMode !== ALL_PAYMENT_MODES && filters.paymentMode) {
//       apiFilters.paymentMode = filters.paymentMode;
//     }
    
//     // User filter
//     if (filters.user !== ALL_USERS && filters.user && user) {
//       apiFilters.user = filters.user;
//     }
    
//     return apiFilters;
//   }, [filters, getAPIDateRange, user]);

//   // Auto-apply filters when filter state changes (with debounce)
//   useEffect(() => {
//     // Clear existing timer
//     if (debounceTimer) {
//       clearTimeout(debounceTimer);
//     }
    
//     // Set new timer with 500ms debounce
//     const timer = setTimeout(() => {
//       const newAppliedFilters = getTransactionsFilters();
//       setAppliedFilters(newAppliedFilters);
//     }, 500);
    
//     setDebounceTimer(timer);
    
//     // Cleanup timer on unmount
//     return () => {
//       if (debounceTimer) {
//         clearTimeout(debounceTimer);
//       }
//     };
//   }, [filters]); // Only depend on filters

//   // Clear all filters
//   const clearFilters = useCallback(() => {
//     setFilters({
//       dateFilter: { type: 'all' },
//       category: ALL_CATEGORIES,
//       paymentMode: ALL_PAYMENT_MODES,
//       party: ALL_PARTIES,
//       user: ALL_USERS,
//     });
//     setCustomDateRange({});
//     // Don't clear appliedFilters immediately - let the debounce handle it
    
//     // Clear debounce timer
//     if (debounceTimer) {
//       clearTimeout(debounceTimer);
//     }
//   }, [debounceTimer]);

//   // Update date filter
//   const handleDateFilterChange = useCallback((type: DateFilter['type']) => {
//     if (type === 'custom') {
//       setFilters(prev => ({
//         ...prev,
//         dateFilter: { type: 'custom', startDate: customDateRange.from, endDate: customDateRange.to }
//       }));
//     } else {
//       setFilters(prev => ({
//         ...prev,
//         dateFilter: { type }
//       }));
//     }
//   }, [customDateRange]);

//   // Update custom date range
//   const handleCustomDateRangeChange = useCallback((range: { from?: Date; to?: Date }) => {
//     setCustomDateRange(range);
//     if (filters.dateFilter.type === 'custom') {
//       setFilters(prev => ({
//         ...prev,
//         dateFilter: { type: 'custom', startDate: range.from, endDate: range.to }
//       }));
//     }
//   }, [filters.dateFilter.type]);

//   // Handle filter changes
//   const handleFilterChange = useCallback((filterType: keyof QuickFilters, value: any) => {
//     setFilters(prev => ({
//       ...prev,
//       [filterType]: value
//     }));
//   }, []);

//   // Check if any filter is active
//   const hasActiveFilters = useMemo(() => {
//     return (
//       filters.category !== ALL_CATEGORIES ||
//       filters.paymentMode !== ALL_PAYMENT_MODES ||
//       filters.party !== ALL_PARTIES ||
//       filters.user !== ALL_USERS ||
//       filters.dateFilter.type !== 'all'
//     );
//   }, [filters]);

//   // Get active filter count
//   const getActiveFilterCount = useMemo(() => {
//     let count = 0;
//     if (filters.category !== ALL_CATEGORIES) count++;
//     if (filters.paymentMode !== ALL_PAYMENT_MODES) count++;
//     if (filters.party !== ALL_PARTIES) count++;
//     if (filters.user !== ALL_USERS) count++;
//     if (filters.dateFilter.type !== 'all') count++;
//     return count;
//   }, [filters]);

//   // Get date range display text
//   const getDateRangeDisplay = useCallback(() => {
//     if (filters.dateFilter.type === 'all') {
//       return "All Time";
//     }
    
//     if (filters.dateFilter.type === 'custom') {
//       if (customDateRange.from && customDateRange.to) {
//         return `${format(customDateRange.from, "dd MMM")} - ${format(customDateRange.to, "dd MMM yyyy")}`;
//       } else if (customDateRange.from) {
//         return format(customDateRange.from, "dd MMM yyyy");
//       }
//       return "Select date range";
//     }
    
//     const dateRange = getAPIDateRange(filters.dateFilter);
//     if (dateRange.dateFrom && dateRange.dateTo) {
//       const fromDate = new Date(dateRange.dateFrom);
//       const toDate = new Date(dateRange.dateTo);
//       return `${format(fromDate, "dd MMM")} - ${format(toDate, "dd MMM yyyy")}`;
//     }
    
//     return filters.dateFilter.type.charAt(0).toUpperCase() + filters.dateFilter.type.slice(1);
//   }, [filters, customDateRange, getAPIDateRange]);

//   // Get display name for filter value
//   const getFilterDisplayName = useCallback((type: 'category' | 'paymentMode' | 'user', value: string) => {
//     if (value === ALL_CATEGORIES || value === ALL_PAYMENT_MODES || value === ALL_USERS) {
//       return '';
//     }
    
//     switch (type) {
//       case 'category':
//         return value;
//       case 'paymentMode':
//         return value;
//       case 'user':
//         return user?.name || user?.email || value;
//       default:
//         return value;
//     }
//   }, [user]);

//   // Clear specific filter
//   const clearFilter = useCallback((filterType: 'category' | 'paymentMode' | 'party' | 'user' | 'date') => {
//     if (filterType === 'date') {
//       setFilters(prev => ({
//         ...prev,
//         dateFilter: { type: 'all' }
//       }));
//     } else {
//       setFilters(prev => ({
//         ...prev,
//         [filterType]: 
//           filterType === 'category' ? ALL_CATEGORIES :
//           filterType === 'paymentMode' ? ALL_PAYMENT_MODES :
//           filterType === 'party' ? ALL_PARTIES :
//           ALL_USERS
//       }));
//     }
//   }, []);

//   // Settings Dropdown Component
//   const SettingsDropdown = () => (
//     <DropdownMenu>
//       <DropdownMenuTrigger asChild>
//         <button className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-full border transition-all bg-gray-100 border-gray300 text-gray-700 hover:bg-gray-200 hover:border-gray-400 hover:text-gray-900 active:scale-95 h-10 sm:h-11">
//           <Settings className="h-4 w-4" />
//           <span>Settings</span>
//           <ChevronDown className="h-3 w-3 ml-1" />
//         </button>
//       </DropdownMenuTrigger>
//       <DropdownMenuContent align="end" className="w-56">
//         <DropdownMenuItem asChild>
//           <Link 
//             href={`/dashboard/business/${businessId}/${cashbookId}/team`}
//             className="flex items-center gap-3 cursor-pointer"
//           >
//             <Users className="h-4 w-4 text-gray-600" />
//             <span>Members</span>
//           </Link>
//         </DropdownMenuItem>
//         <DropdownMenuItem asChild>
//           <Link 
//             href={`/dashboard/business/${businessId}/${cashbookId}/analytics`}
//             className="flex items-center gap-3 cursor-pointer"
//           >
//             <BarChart3 className="h-4 w-4 text-gray-600" />
//             <span>Analytics</span>
//           </Link>
//         </DropdownMenuItem>
//         <DropdownMenuItem asChild>
//           <Link 
//             href={`/dashboard/business/${businessId}/${cashbookId}/audit-logs`}
//             className="flex items-center gap-3 cursor-pointer"
//           >
//             <History className="h-4 w-4 text-gray-600" />
//             <span>Audit Logs</span>
//           </Link>
//         </DropdownMenuItem>
//       </DropdownMenuContent>
//     </DropdownMenu>
//   );

//   const NavComps: compConfigProps = [
//     {
//       comp: <SettingsDropdown />,
//       position: "right",
//     },
//   ];

//   const canAddTransaction = hasPermission(
//     {
//       businessRole: userRole?.data.companyRole || "owner",
//       cashbookRole: userCashbookRole?.data?.BookRole || "viewer",
//     },
//     "crud_transaction",
//     "C"
//   );

//   const canEditTransaction = hasPermission(
//     {
//       businessRole: userRole?.data.companyRole || "staff",
//       cashbookRole: userCashbookRole?.data?.BookRole || "viewer",
//     },
//     "crud_transaction",
//     "U"
//   );

//   const canDeleteTransaction = hasPermission(
//     {
//       businessRole: userRole?.data.companyRole || "staff",
//       cashbookRole: userCashbookRole?.data?.BookRole || "viewer",
//     },
//     "crud_transaction",
//     "D"
//   );

//   const canExport = hasPermission(
//     {
//       businessRole: userRole?.data.companyRole || "staff",
//       cashbookRole: userCashbookRole?.data?.BookRole || "viewer",
//     },
//     "crud_transaction",
//     "R"
//   );

//   return (
//     <DashboardSubLayout
//       headerTitle="Cashbook Detail"
//       showPreviousPage
//       compList={NavComps}
//     >
//       <div className="w-full max-w-full overflow-hidden px-3 sm:px-4 md:px-6 lg:px-8">
//         {/* Book Totals Section */}
//         <div className="mb-4 sm:mb-6">
//           <BookTotalsCard bookId={cashbookId} />
//         </div>

//         {/* Action Buttons Section */}
//         <div className="mb-4 sm:mb-6">
//           <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center">
//             {/* Quick Filters Button */}
//             <div className="w-full sm:w-auto order-first sm:order-none">
//               <Button
//                 variant="outline"
//                 onClick={() => setShowFilters(!showFilters)}
//                 className="flex items-center gap-2 w-full sm:w-auto border-gray-300 bg-white hover:bg-gray-50 h-10 sm:h-11"
//               >
//                 <Filter className="h-4 w-4" />
//                 <span>Quick Filters</span>
//                 {hasActiveFilters && (
//                   <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 flex items-center justify-center">
//                     {getActiveFilterCount}
//                   </Badge>
//                 )}
//               </Button>
//             </div>

//             {/* Add Transaction Button (if allowed) */}
//             {canAddTransaction && (
//               <div className="w-full sm:w-auto">
//                 <AddTransactionCard 
//                   cashbookId={cashbookId} 
//                   businessId={businessId} 
//                   className="w-full h-10 sm:h-11"
//                 />
//               </div>
//             )}

//             {/* Export Button (if allowed) */}          
//             {canExport && token && (
//               <div className="w-full sm:w-auto">
//                 <ExportButton
//                   bookId={cashbookId}
//                   businessId={businessId}
//                   token={token}
//                 />
//               </div>
//             )}

//             {/* Settings Dropdown Button - Always visible */}
//             <div className="w-full sm:w-auto items-stretch sm:items-center">
//               <SettingsButton />
//             </div>
//           </div>
//         </div>

//         {/* Quick Filters Panel */}
//         {showFilters && (
//           <div className="mb-4 sm:mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-sm font-semibold text-gray-700">Quick Filters</h3>
//               <div className="flex gap-2">
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   onClick={() => setShowFilters(false)}
//                   className="h-8 text-gray-600 hover:text-gray-900"
//                 >
//                   <X className="h-3 w-3 mr-1" />
//                   Close
//                 </Button>
//               </div>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//               {/* Date Filter */}
//               <div className="space-y-2">
//                 <label className="text-xs font-medium text-gray-600">View By</label>
//                 <div className="flex flex-wrap gap-2">
//                   {(['all', 'today', 'week', 'month', 'custom'] as const).map((type) => (
//                     <button
//                       key={type}
//                       type="button"
//                       onClick={() => handleDateFilterChange(type)}
//                       className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${
//                         filters.dateFilter.type === type
//                           ? 'bg-gray-800 text-white border-gray-800'
//                           : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
//                       }`}
//                     >
//                       {type === 'all' ? 'All Time' : type.charAt(0).toUpperCase() + type.slice(1)}
//                     </button>
//                   ))}
//                 </div>
                
//                 {filters.dateFilter.type === 'custom' && (
//                   <div className="mt-2">
//                     <Popover>
//                       <PopoverTrigger asChild>
//                         <Button
//                           variant="outline"
//                           className="w-full justify-start text-left text-xs h-8"
//                         >
//                           <Calendar className="mr-2 h-3 w-3" />
//                           {getDateRangeDisplay()}
//                         </Button>
//                       </PopoverTrigger>
//                       <PopoverContent className="w-auto p-0" align="start">
//                         <CalendarComponent
//                           initialFocus
//                           mode="range"
//                           defaultMonth={customDateRange.from}
//                           selected={{
//                             from: customDateRange.from,
//                             to: customDateRange.to,
//                           }}
//                           onSelect={(range) => handleCustomDateRangeChange({
//                             from: range?.from,
//                             to: range?.to,
//                           })}
//                           numberOfMonths={2}
//                         />
//                       </PopoverContent>
//                     </Popover>
//                   </div>
//                 )}
//               </div>

//               {/* Category Filter */}
//               <div className="space-y-2">
//                 <label className="text-xs font-medium text-gray-600">Category</label>
//                 <Select
//                   value={filters.category}
//                   onValueChange={(value) => handleFilterChange('category', value)}
//                   disabled={isCategoriesPending}
//                 >
//                   <SelectTrigger className="w-full text-xs h-8">
//                     <SelectValue placeholder="All categories" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value={ALL_CATEGORIES}>All categories</SelectItem>
//                     {isCategoriesPending ? (
//                       <div className="flex items-center justify-center p-2">
//                         <Loader2 className="h-3 w-3 animate-spin mr-2" />
//                         <span className="text-xs">Loading...</span>
//                       </div>
//                     ) : (
//                       categoryOptions.map((category) => (
//                         <SelectItem key={category.id} value={category.value}>
//                           {category.name}
//                         </SelectItem>
//                       ))
//                     )}
//                   </SelectContent>
//                 </Select>
//               </div>

//               {/* Payment Mode Filter */}
//               <div className="space-y-2">
//                 <label className="text-xs font-medium text-gray-600">Payment Mode</label>
//                 <Select
//                   value={filters.paymentMode}
//                   onValueChange={(value) => handleFilterChange('paymentMode', value)}
//                   disabled={isPaymentModesLoading}
//                 >
//                   <SelectTrigger className="w-full text-xs h-8">
//                     <SelectValue placeholder="All payment modes" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value={ALL_PAYMENT_MODES}>All payment modes</SelectItem>
//                     {isPaymentModesLoading ? (
//                       <div className="flex items-center justify-center p-2">
//                         <Loader2 className="h-3 w-3 animate-spin mr-2" />
//                         <span className="text-xs">Loading...</span>
//                       </div>
//                     ) : (
//                       paymentModeOptions.map((mode) => (
//                         <SelectItem key={mode.id} value={mode.value}>
//                           {mode.name}
//                         </SelectItem>
//                       ))
//                     )}
//                   </SelectContent>
//                 </Select>
//               </div>

//               {/* User Filter */}
//               <div className="space-y-2">
//                 <label className="text-xs font-medium text-gray-600">User</label>
//                 <Select
//                   value={filters.user}
//                   onValueChange={(value) => handleFilterChange('user', value)}
//                 >
//                   <SelectTrigger className="w-full text-xs h-8">
//                     <SelectValue placeholder="All users" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value={ALL_USERS}>All users</SelectItem>
//                     {user && (
//                       <SelectItem value={user._id}>
//                         {user.name || user.email}
//                       </SelectItem>
//                     )}
//                   </SelectContent>
//                 </Select>
//               </div>
//             </div>

//             {/* Clear All Filters Button (only in Quick Filters panel) */}
//             {hasActiveFilters && (
//               <div className="mt-4 pt-4 border-t border-gray-200">
//                 <div className="flex items-center gap-2">
//                   <span className="text-xs text-gray-600">
//                     {getActiveFilterCount} filter{getActiveFilterCount > 1 ? 's' : ''} applied
//                   </span>
//                   <Button
//                     variant="ghost"
//                     size="sm"
//                     onClick={clearFilters}
//                     className="h-7 px-2 text-xs text-gray-600 hover:text-gray-900"
//                   >
//                     <X className="h-3 w-3 mr-1" />
//                     Clear {getActiveFilterCount} filter{getActiveFilterCount > 1 ? 's' : ''}
//                   </Button>
//                 </div>
//               </div>
//             )}
//           </div>
//         )}

//         {/* Filtered Summary - Just above the table */}
//         {hasActiveFilters && (
//           <CompactFilteredSummary
//             totalCashIn={filteredTotalsData?.data?.totalCashIn || 0}
//             totalCashOut={filteredTotalsData?.data?.totalCashOut || 0}
//             netBalance={filteredTotalsData?.data?.netBalance || 0}
//             currency={currentCurrency}
//             isLoading={isTotalsLoading}
//           />
//         )}

//         {/* Transactions Table Section */}
//         <div className="w-full overflow-x-auto rounded-lg border bg-card shadow-sm">
//           <TransactionsPage
//             bookId={cashbookId}
//             canDelete={canDeleteTransaction}
//             canEdit={canEditTransaction}
//             filters={effectiveFilters}
//             currency={currentCurrency}
//           />
//         </div>

//         {/* Mobile Floating Action Button for Add Transaction */}
//         {canAddTransaction && (
//           <div className="fixed bottom-6 right-6 sm:hidden z-50">
//             <AddTransactionCard 
//               cashbookId={cashbookId} 
//               businessId={businessId}
//               variant="floating"
//               size="lg"
//             />
//           </div>
//         )}
//       </div>
//     </DashboardSubLayout>
//   );
// }


// ----3-------

// app/dashboard/business/[businessId]/[cashbookId]/page.tsx
"use client";
import { AddTransactionCard, BookTotalsCard } from "@/components/cards";
import { TransferButton } from "@/components/buttons/transfer-button";
import { compConfigProps } from "@/components/navigation/dashboard/title-header";
import { DashboardSubLayout } from "@/layout";
import { Settings, Filter, Calendar, X, Loader2, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { use, useState, useEffect, useMemo, useCallback, useRef } from "react";
import { TransactionsPage } from "./transaction-page";
import { hasPermission } from "@/lib";
import { useCashbookMemberRole, useCompanyMemberRole, useGetCategories } from "@/services";
import { useAuth } from "@/hooks";
import { ExportButton } from "@/components/buttons/export-button";
import { Button } from "@/components/ui/button";
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
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { format, subDays, startOfDay, endOfDay } from "date-fns";
import { useGetPaymentModes } from "@/services/payment-mode.service";
import { useGetTransactionsSummary } from "@/services/transaction.service";
import { useGetTransactionsByBook } from "@/services/transaction.service";
import { CurrencyCode, getCurrencyInfo, formatCurrencyAmount } from "@/constants/currency";
import { useGetCashbookList } from "@/services/cashbook.service";
import { canVerifyTransactions } from "@/lib/transaction-verify";

// Define filter interfaces
interface DateFilter {
  type: 'all' | 'today' | 'week' | 'month' | 'custom';
  startDate?: Date;
  endDate?: Date;
}

interface QuickFilters {
  dateFilter: DateFilter;
  category: string;
  paymentMode: string;
  party: string;
  user: string;
}

// Special constants for "all" selection
const ALL_CATEGORIES = "all_categories";
const ALL_PAYMENT_MODES = "all_payment_modes";
const ALL_PARTIES = "all_parties";
const ALL_USERS = "all_users";

// Compact Filtered Summary Component
interface CompactFilteredSummaryProps {
  totalCashIn: number;
  totalCashOut: number;
  netBalance: number;
  currency?: CurrencyCode;
  isLoading?: boolean;
}

const CompactFilteredSummary = ({ 
  totalCashIn, 
  totalCashOut, 
  netBalance, 
  currency = "USD", 
  isLoading = false
}: CompactFilteredSummaryProps) => {
  const formatAmount = useCallback((amount: number) => {
    return formatCurrencyAmount(amount, currency);
  }, [currency]);

  if (isLoading) {
    return (
      <div className="mb-4 p-3 bg-blue-50 border border-blue-100 rounded-lg">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 bg-blue-200 rounded-full animate-pulse"></div>
            <div className="h-4 w-32 bg-blue-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-4 p-3 bg-blue-50 border border-blue-100 rounded-lg overflow-hidden">
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
        <div className="h-2 w-2 bg-blue-500 rounded-full shrink-0"></div>
        <span className="text-sm font-medium text-gray-700">Filtered:</span>
        <span className="text-sm text-gray-600">
          In: <span className="font-medium text-green-600">{formatAmount(totalCashIn)}</span>{" "}
          Out: <span className="font-medium text-red-600">{formatAmount(totalCashOut)}</span>
        </span>
        <span className="text-sm text-gray-600">
          Net: <span className={`font-medium ${netBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {netBalance >= 0 ? '+' : ''}{formatAmount(netBalance)}
          </span>
        </span>
      </div>
    </div>
  );
};

export default function Page({
  params,
}: {
  params: Promise<{ businessId: string; cashbookId: string }>;
}) {
  const { user } = useAuth();
  const { businessId, cashbookId } = use(params);
  const searchParams = useSearchParams();
  const categoryFromUrlApplied = useRef(false);

  const [showFilters, setShowFilters] = useState(false);
  const [showSummaryAmounts, setShowSummaryAmounts] = useState(false);
  const [filters, setFilters] = useState<QuickFilters>({
    dateFilter: { type: 'all' },
    category: ALL_CATEGORIES,
    paymentMode: ALL_PAYMENT_MODES,
    party: ALL_PARTIES,
    user: ALL_USERS,
  });

  // Add state for applied filters
  const [appliedFilters, setAppliedFilters] = useState<Record<string, any>>({});

  // States for custom date range
  const [customDateRange, setCustomDateRange] = useState<{
    from?: Date;
    to?: Date;
  }>({});

  // Debounce state to prevent rapid API calls
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);

  // Fetch categories and payment modes
  const {
    categories,
    isCategoriesPending,
  } = useGetCategories({
    businessId,
  });

  const {
    data: paymentModesData,
    isLoading: isPaymentModesLoading,
  } = useGetPaymentModes(businessId, "active");

  const {
    data: userRole,
    isLoading: isLoadingRole,
  } = useCompanyMemberRole(businessId);

  const {
    data: userCashbookRole,
    isLoading: isLoadingCashbookRole,
  } = useCashbookMemberRole(cashbookId, user?._id || "");
  
  // Fetch cashbook list to get the current book's name
  const {
    cashbookList,
    isCashbookListPending,
  } = useGetCashbookList(businessId);

  // Find the current book from the list
  const currentBook = useMemo(() => {
    return cashbookList.find((book) => book._id === cashbookId);
  }, [cashbookList, cashbookId]);

  // Get the book name, fallback to "Cashbook Detail" if not found
  const bookName = currentBook?.name || "Cashbook Detail";
  
  const token = user?.accessToken || 
    (typeof window !== 'undefined' ? localStorage.getItem('token') : null);

  // When role is accountant, enforce date range from dataAccessDurationDays (from today, last N days).
  const effectiveFilters = useMemo(() => {
    const roleData = userCashbookRole?.data as { BookRole?: string; bookRole?: string; dataAccessDurationDays?: number } | undefined;
    if (!roleData) return appliedFilters;
    const bookRole = roleData.BookRole ?? roleData.bookRole;
    const isAccountant = bookRole === "accountant";
    const days = roleData.dataAccessDurationDays;
    if (isAccountant && typeof days === "number" && days >= 1) {
      const now = new Date();
      const dateTo = format(endOfDay(now), "yyyy-MM-dd");
      const dateFrom = format(startOfDay(subDays(now, days - 1)), "yyyy-MM-dd");
      return {
        ...appliedFilters,
        dateFrom,
        dateTo,
      };
    }
    return appliedFilters;
  }, [appliedFilters, userCashbookRole?.data]);

  const isAccountantRole = useMemo(() => {
    const roleData = userCashbookRole?.data as { BookRole?: string; bookRole?: string } | undefined;
    if (!roleData) return false;
    const bookRole = roleData.BookRole ?? roleData.bookRole;
    return bookRole === "accountant";
  }, [userCashbookRole?.data]);

  // Create a separate hook for fetching filtered totals (use effectiveFilters for accountant date range)
  const { 
    data: filteredTotalsData,
    isLoading: isTotalsLoading,
    refetch: refetchTotals 
  } = useGetTransactionsSummary({
    bookId: cashbookId,
    ...effectiveFilters,
  });

  // Use the main transactions hook to get currency from book details
  const { 
    currency: bookCurrency,
    transactions,
    isTransactionsPending,
  } = useGetTransactionsByBook({
    bookId: cashbookId,
    pageSize: 1, // Only need one transaction to get currency
    ...effectiveFilters,
  });

  // Determine the currency to use
  const currentCurrency = useMemo(() => {
    // First try to get from filtered totals data if available
    if (filteredTotalsData?.data?.currency) {
      return filteredTotalsData.data.currency;
    }
    // Then try from bookCurrency from transactions hook
    if (bookCurrency) {
      return bookCurrency;
    }
    // Fallback to USD
    return "USD" as CurrencyCode;
  }, [filteredTotalsData, bookCurrency]);

  // Format category options for Select - Use names as values since API expects category names
  const categoryOptions = useMemo(() => {
    if (isCategoriesPending) {
      return [];
    }
    
    const options = categories?.map(category => ({
      id: category._id,
      name: category.name,
      value: category.name
    })) || [];
    
    return options;
  }, [categories, isCategoriesPending]);

  const selectedCategoryLabel = useMemo(() => {
    if (filters.category === ALL_CATEGORIES) return null;
    const match = categoryOptions.find(
      (c) =>
        c.value === filters.category ||
        c.id === filters.category ||
        c.name.toLowerCase() === filters.category.toLowerCase()
    );
    return match?.name ?? filters.category;
  }, [filters.category, categoryOptions]);

  // Format payment mode options for Select - Use names as values
  const paymentModeOptions = useMemo(() => {
    if (isPaymentModesLoading) {
      return [];
    }
    
    const options = paymentModesData?.data?.map(mode => ({
      id: mode._id,
      name: mode.name,
      value: mode.name
    })) || [];
    
    return options;
  }, [paymentModesData, isPaymentModesLoading]);

  // Get date range from filter for API
  const getAPIDateRange = useCallback((filter: DateFilter) => {
    const now = new Date();
    
    switch (filter.type) {
      case 'all':
        return {};
      case 'today':
        return {
          dateFrom: format(startOfDay(now), 'yyyy-MM-dd'),
          dateTo: format(endOfDay(now), 'yyyy-MM-dd')
        };
      case 'week':
        const weekStart = subDays(now, 6);
        return {
          dateFrom: format(startOfDay(weekStart), 'yyyy-MM-dd'),
          dateTo: format(endOfDay(now), 'yyyy-MM-dd')
        };
      case 'month':
        const monthStart = subDays(now, 29);
        return {
          dateFrom: format(startOfDay(monthStart), 'yyyy-MM-dd'),
          dateTo: format(endOfDay(now), 'yyyy-MM-dd')
        };
      case 'custom':
        if (filter.startDate && filter.endDate) {
          return {
            dateFrom: format(startOfDay(filter.startDate), 'yyyy-MM-dd'),
            dateTo: format(endOfDay(filter.endDate), 'yyyy-MM-dd')
          };
        }
        return {};
      default:
        return {};
    }
  }, []);

  // Prepare filters for TransactionsPage
  const getTransactionsFilters = useCallback(() => {
    const dateRange = getAPIDateRange(filters.dateFilter);
    
    const apiFilters: Record<string, any> = {};
    
    // Add date filters
    if (dateRange.dateFrom) apiFilters.dateFrom = dateRange.dateFrom;
    if (dateRange.dateTo) apiFilters.dateTo = dateRange.dateTo;
    
    // Category filter - API expects category names
    if (filters.category !== ALL_CATEGORIES && filters.category) {
      apiFilters.category = filters.category;
    }
    
    // Payment mode filter - API expects payment mode names
    if (filters.paymentMode !== ALL_PAYMENT_MODES && filters.paymentMode) {
      apiFilters.paymentMode = filters.paymentMode;
    }
    
    // User filter
    if (filters.user !== ALL_USERS && filters.user && user) {
      apiFilters.user = filters.user;
    }
    
    return apiFilters;
  }, [filters, getAPIDateRange, user]);

  // Apply category filter from URL once (e.g. when navigating from analytics)
  useEffect(() => {
    const categoryParam = searchParams.get("category");
    if (!categoryParam || categoryFromUrlApplied.current) {
      return;
    }

    categoryFromUrlApplied.current = true;
    const decoded = decodeURIComponent(categoryParam).trim();

    setFilters((prev) => ({
      ...prev,
      category: decoded,
    }));
    setShowFilters(true);
  }, [searchParams]);

  // Match URL category to loaded options so the Select shows the correct label
  useEffect(() => {
    if (filters.category === ALL_CATEGORIES || isCategoriesPending) {
      return;
    }

    const matched = categoryOptions.find(
      (c) =>
        c.value.toLowerCase() === filters.category.toLowerCase() ||
        c.id === filters.category ||
        c.name.toLowerCase() === filters.category.toLowerCase()
    );

    if (matched && matched.value !== filters.category) {
      setFilters((prev) => ({
        ...prev,
        category: matched.value,
      }));
    }
  }, [filters.category, isCategoriesPending, categoryOptions]);

  // Auto-apply filters when filter state changes (with debounce)
  useEffect(() => {
    // Clear existing timer
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    
    // Set new timer with 500ms debounce
    const timer = setTimeout(() => {
      const newAppliedFilters = getTransactionsFilters();
      setAppliedFilters(newAppliedFilters);
    }, 500);
    
    setDebounceTimer(timer);
    
    // Cleanup timer on unmount
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, [filters]); // Only depend on filters

  // Clear all filters
  const clearFilters = useCallback(() => {
    setFilters({
      dateFilter: { type: 'all' },
      category: ALL_CATEGORIES,
      paymentMode: ALL_PAYMENT_MODES,
      party: ALL_PARTIES,
      user: ALL_USERS,
    });
    setCustomDateRange({});
    // Don't clear appliedFilters immediately - let the debounce handle it
    
    // Clear debounce timer
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
  }, [debounceTimer]);

  // Update date filter
  const handleDateFilterChange = useCallback((type: DateFilter['type']) => {
    if (type === 'custom') {
      setFilters(prev => ({
        ...prev,
        dateFilter: { type: 'custom', startDate: customDateRange.from, endDate: customDateRange.to }
      }));
    } else {
      setFilters(prev => ({
        ...prev,
        dateFilter: { type }
      }));
    }
  }, [customDateRange]);

  // Update custom date range
  const handleCustomDateRangeChange = useCallback((range: { from?: Date; to?: Date }) => {
    setCustomDateRange(range);
    if (filters.dateFilter.type === 'custom') {
      setFilters(prev => ({
        ...prev,
        dateFilter: { type: 'custom', startDate: range.from, endDate: range.to }
      }));
    }
  }, [filters.dateFilter.type]);

  // Handle filter changes
  const handleFilterChange = useCallback((filterType: keyof QuickFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  }, []);

  // Check if any filter is active
  const hasActiveFilters = useMemo(() => {
    return (
      filters.category !== ALL_CATEGORIES ||
      filters.paymentMode !== ALL_PAYMENT_MODES ||
      filters.party !== ALL_PARTIES ||
      filters.user !== ALL_USERS ||
      filters.dateFilter.type !== 'all'
    );
  }, [filters]);

  // Get active filter count
  const getActiveFilterCount = useMemo(() => {
    let count = 0;
    if (filters.category !== ALL_CATEGORIES) count++;
    if (filters.paymentMode !== ALL_PAYMENT_MODES) count++;
    if (filters.party !== ALL_PARTIES) count++;
    if (filters.user !== ALL_USERS) count++;
    if (filters.dateFilter.type !== 'all') count++;
    return count;
  }, [filters]);

  // Get date range display text
  const getDateRangeDisplay = useCallback(() => {
    if (filters.dateFilter.type === 'all') {
      return "All Time";
    }
    
    if (filters.dateFilter.type === 'custom') {
      if (customDateRange.from && customDateRange.to) {
        return `${format(customDateRange.from, "dd MMM")} - ${format(customDateRange.to, "dd MMM yyyy")}`;
      } else if (customDateRange.from) {
        return format(customDateRange.from, "dd MMM yyyy");
      }
      return "Select date range";
    }
    
    const dateRange = getAPIDateRange(filters.dateFilter);
    if (dateRange.dateFrom && dateRange.dateTo) {
      const fromDate = new Date(dateRange.dateFrom);
      const toDate = new Date(dateRange.dateTo);
      return `${format(fromDate, "dd MMM")} - ${format(toDate, "dd MMM yyyy")}`;
    }
    
    return filters.dateFilter.type.charAt(0).toUpperCase() + filters.dateFilter.type.slice(1);
  }, [filters, customDateRange, getAPIDateRange]);

  // Get display name for filter value
  const getFilterDisplayName = useCallback((type: 'category' | 'paymentMode' | 'user', value: string) => {
    if (value === ALL_CATEGORIES || value === ALL_PAYMENT_MODES || value === ALL_USERS) {
      return '';
    }
    
    switch (type) {
      case 'category':
        return value;
      case 'paymentMode':
        return value;
      case 'user':
        return user?.name || user?.email || value;
      default:
        return value;
    }
  }, [user]);

  // Clear specific filter
  const clearFilter = useCallback((filterType: 'category' | 'paymentMode' | 'party' | 'user' | 'date') => {
    if (filterType === 'date') {
      setFilters(prev => ({
        ...prev,
        dateFilter: { type: 'all' }
      }));
    } else {
      setFilters(prev => ({
        ...prev,
        [filterType]: 
          filterType === 'category' ? ALL_CATEGORIES :
          filterType === 'paymentMode' ? ALL_PAYMENT_MODES :
          filterType === 'party' ? ALL_PARTIES :
          ALL_USERS
      }));
    }
  }, []);

  const SettingsButton = () => (
    <Link
      href={`/dashboard/business/${businessId}/${cashbookId}/setting`}
      className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-full border transition-all bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200 hover:border-gray-400 hover:text-gray-900 active:scale-95 h-10 sm:h-11"
    >
      <Settings className="h-4 w-4" />
      <span>Settings</span>
    </Link>
  );

  const AmountVisibilityToggle = () => (
    <Button
      type="button"
      variant="outline"
      size="icon"
      className="h-10 w-10 shrink-0 sm:h-11 sm:w-11"
      aria-label={showSummaryAmounts ? "Hide amounts" : "Show amounts"}
      onClick={() => setShowSummaryAmounts((prev) => !prev)}
    >
      {showSummaryAmounts ? (
        <Eye className="h-5 w-5" />
      ) : (
        <EyeOff className="h-5 w-5" />
      )}
    </Button>
  );

  const NavComps: compConfigProps = [
    {
      comp: (
        <div className="flex items-center gap-2">
          <AmountVisibilityToggle />
          <SettingsButton />
        </div>
      ),
      position: "right",
    },
  ];

  const canAddTransaction = hasPermission(
    {
      businessRole: userRole?.data.companyRole || "owner",
      cashbookRole: userCashbookRole?.data?.BookRole || "viewer",
    },
    "crud_transaction",
    "C"
  );

  const canEditTransaction = hasPermission(
    {
      businessRole: userRole?.data.companyRole || "staff",
      cashbookRole: userCashbookRole?.data?.BookRole || "viewer",
    },
    "crud_transaction",
    "U"
  );

  const canDeleteTransaction = hasPermission(
    {
      businessRole: userRole?.data.companyRole || "staff",
      cashbookRole: userCashbookRole?.data?.BookRole || "viewer",
    },
    "crud_transaction",
    "D"
  );

  const canExport = hasPermission(
    {
      businessRole: userRole?.data.companyRole || "staff",
      cashbookRole: userCashbookRole?.data?.BookRole || "viewer",
    },
    "export_transaction",
    "R"
  );

  // Check if user can manage transfers (approve/reject)
  const canManageTransfers = hasPermission(
    {
      businessRole: userRole?.data.companyRole || "staff",
      cashbookRole: userCashbookRole?.data?.BookRole || "viewer",
    },
    "manage_transfers",
    "M"
  );

  const canVerify = canVerifyTransactions({
    businessRole: userRole?.data.companyRole || "staff",
    cashbookRole: userCashbookRole?.data?.BookRole || "viewer",
  });

  return (
    <DashboardSubLayout
      headerTitle={bookName}
      showPreviousPage
      compList={NavComps}
    >
      <div className="w-full min-w-0 max-w-full overflow-x-hidden px-3 sm:px-4 md:px-6 lg:px-8">
        {/* Book Totals Section */}
        <div className="mb-4 sm:mb-6">
          <BookTotalsCard bookId={cashbookId} showAmounts={showSummaryAmounts} />
        </div>

        {/* Action Buttons Section */}
        <div className="mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 items-stretch sm:items-center">
            {/* Quick Filters Button */}
            <div className="w-full sm:w-auto order-first sm:order-none">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 w-full sm:w-auto border-gray-300 bg-white hover:bg-gray-50 h-10 sm:h-11"
              >
                <Filter className="h-4 w-4" />
                <span>Quick Filters</span>
                {hasActiveFilters && (
                  <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 flex items-center justify-center">
                    {getActiveFilterCount}
                  </Badge>
                )}
              </Button>
            </div>




            {/* Add Transaction Button (if allowed) */}
            {canAddTransaction && (
              <div className="w-full sm:w-auto">
                <AddTransactionCard 
                  cashbookId={cashbookId} 
                  businessId={businessId} 
                  className="w-full h-10 sm:h-11"
                />
              </div>
            )}

            {/* Export Button (if allowed) */}          
            {canExport && token && (
              <div className="w-full sm:w-auto">
                <ExportButton
                  bookId={cashbookId}
                  businessId={businessId}
                  token={token}
                />
              </div>
            )}

                        {/* Transfer Button - hidden for accountant role */}
            {canAddTransaction && !isAccountantRole && (
              <div className="w-full sm:w-auto">
                <TransferButton
                  businessId={businessId}
                  cashbookId={cashbookId}
                  currency={currentCurrency}
                  className="w-full h-10 sm:h-11 bg-white text-blue-600 border border-blue-600 hover:bg-blue-50"
                />
              </div>
            )}

          </div>
        </div>

        {/* Quick Filters Panel */}
        {showFilters && (
          <div className="mb-4 sm:mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-semibold text-gray-700">Quick Filters</h3>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFilters(false)}
                  className="h-8 text-gray-600 hover:text-gray-900"
                >
                  <X className="h-3 w-3 mr-1" />
                  Close
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Date Filter - hidden for accountant (their range is fixed by dataAccessDurationDays) */}
              {!isAccountantRole && (
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-600">View By</label>
                  <div className="flex flex-wrap gap-2">
                    {(['all', 'today', 'week', 'month', 'custom'] as const).map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => handleDateFilterChange(type)}
                        className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${
                          filters.dateFilter.type === type
                            ? 'bg-gray-800 text-white border-gray-800'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                        }`}
                      >
                        {type === 'all' ? 'All Time' : type.charAt(0).toUpperCase() + type.slice(1)}
                      </button>
                    ))}
                  </div>
                  
                  {filters.dateFilter.type === 'custom' && (
                    <div className="mt-2">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left text-xs h-8"
                          >
                            <Calendar className="mr-2 h-3 w-3" />
                            {getDateRangeDisplay()}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <CalendarComponent
                            initialFocus
                            mode="range"
                            defaultMonth={customDateRange.from}
                            selected={{
                              from: customDateRange.from,
                              to: customDateRange.to,
                            }}
                            onSelect={(range) => handleCustomDateRangeChange({
                              from: range?.from,
                              to: range?.to,
                            })}
                            numberOfMonths={2}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  )}
                </div>
              )}

              {/* Category Filter */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-600">Category</label>
                <Select
                  value={filters.category}
                  onValueChange={(value) => handleFilterChange('category', value)}
                  disabled={isCategoriesPending}
                >
                  <SelectTrigger className="w-full text-xs h-8">
                    <SelectValue placeholder="All categories">
                      {filters.category !== ALL_CATEGORIES
                        ? selectedCategoryLabel
                        : undefined}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ALL_CATEGORIES}>All categories</SelectItem>
                    {isCategoriesPending ? (
                      <div className="flex items-center justify-center p-2">
                        <Loader2 className="h-3 w-3 animate-spin mr-2" />
                        <span className="text-xs">Loading...</span>
                      </div>
                    ) : (
                      <>
                        {categoryOptions.map((category) => (
                          <SelectItem key={category.id} value={category.value}>
                            {category.name}
                          </SelectItem>
                        ))}
                        {filters.category !== ALL_CATEGORIES &&
                          !categoryOptions.some((c) => c.value === filters.category) && (
                            <SelectItem value={filters.category}>
                              {filters.category}
                            </SelectItem>
                          )}
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Payment Mode Filter */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-600">Payment Mode</label>
                <Select
                  value={filters.paymentMode}
                  onValueChange={(value) => handleFilterChange('paymentMode', value)}
                  disabled={isPaymentModesLoading}
                >
                  <SelectTrigger className="w-full text-xs h-8">
                    <SelectValue placeholder="All payment modes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ALL_PAYMENT_MODES}>All payment modes</SelectItem>
                    {isPaymentModesLoading ? (
                      <div className="flex items-center justify-center p-2">
                        <Loader2 className="h-3 w-3 animate-spin mr-2" />
                        <span className="text-xs">Loading...</span>
                      </div>
                    ) : (
                      paymentModeOptions.map((mode) => (
                        <SelectItem key={mode.id} value={mode.value}>
                          {mode.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* User Filter */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-600">User</label>
                <Select
                  value={filters.user}
                  onValueChange={(value) => handleFilterChange('user', value)}
                >
                  <SelectTrigger className="w-full text-xs h-8">
                    <SelectValue placeholder="All users" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ALL_USERS}>All users</SelectItem>
                    {user && (
                      <SelectItem value={user._id}>
                        {user.name || user.email}
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Clear All Filters Button (only in Quick Filters panel) */}
            {hasActiveFilters && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-600">
                    {getActiveFilterCount} filter{getActiveFilterCount > 1 ? 's' : ''} applied
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="h-7 px-2 text-xs text-gray-600 hover:text-gray-900"
                  >
                    <X className="h-3 w-3 mr-1" />
                    Clear {getActiveFilterCount} filter{getActiveFilterCount > 1 ? 's' : ''}
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Filtered Summary - Just above the table */}
        {hasActiveFilters && (
          <CompactFilteredSummary
            totalCashIn={filteredTotalsData?.data?.totalCashIn || 0}
            totalCashOut={filteredTotalsData?.data?.totalCashOut || 0}
            netBalance={filteredTotalsData?.data?.netBalance || 0}
            currency={currentCurrency}
            isLoading={isTotalsLoading}
          />
        )}

        {/* Transactions Table Section */}
        <div className="w-full min-w-0 max-w-full overflow-hidden rounded-lg border bg-card shadow-sm">
          <TransactionsPage
            bookId={cashbookId}
            canDelete={canDeleteTransaction}
            canEdit={canEditTransaction}
            canVerify={canVerify}
            canManageTransfers={canManageTransfers}
            filters={effectiveFilters}
            currency={currentCurrency}
          />
        </div>

        {/* Mobile Floating Action Buttons */}
        <div className="fixed bottom-6 right-6 sm:hidden z-50 flex flex-col gap-3">
          {canAddTransaction && (
            <>
              {!isAccountantRole && (
                <TransferButton
                  businessId={businessId}
                  cashbookId={cashbookId}
                  currency={currentCurrency}
                  variant="floating"
                  size="lg"
                />
              )}
              <AddTransactionCard 
                cashbookId={cashbookId} 
                businessId={businessId}
                variant="floating"
                size="lg"
              />
            </>
          )}
        </div>
      </div>
    </DashboardSubLayout>
  );
}