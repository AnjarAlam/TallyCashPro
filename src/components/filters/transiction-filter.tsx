// // components/filters/transaction-filters.tsx
// "use client";

// import { useState, useEffect, useMemo } from "react";
// import { Filter, Calendar, X, Loader2 } from "lucide-react";
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
// import { useGetCategories } from "@/services";
// import { useGetPaymentModes } from "@/services/payment-mode.service";
// import { useAuth } from "@/hooks";

// // Define filter interfaces
// export interface DateFilter {
//   type: 'all' | 'today' | 'week' | 'month' | 'custom';
//   startDate?: Date;
//   endDate?: Date;
// }

// export interface QuickFilters {
//   dateFilter: DateFilter;
//   category: string;
//   paymentMode: string;
//   party: string;
//   user: string;
// }

// // Special constants for "all" selection
// export const ALL_CATEGORIES = "all_categories";
// export const ALL_PAYMENT_MODES = "all_payment_modes";
// export const ALL_PARTIES = "all_parties";
// export const ALL_USERS = "all_users";

// interface TransactionFiltersProps {
//   businessId: string;
//   cashbookId?: string;
//   onFilterChange: (filters: Record<string, any>) => void;
//   showFilters?: boolean;
//   onToggleFilters?: () => void;
// }

// // Filter Button Component
// export function FilterToggleButton({
//   onToggle,
//   activeFilterCount,
// }: {
//   onToggle: () => void;
//   activeFilterCount: number;
// }) {
//   return (
//     <Button
//       variant="outline"
//       onClick={onToggle}
//       className="flex items-center gap-2 w-full sm:w-auto border-gray-300 bg-white hover:bg-gray-50 h-10 sm:h-11"
//     >
//       <Filter className="h-4 w-4" />
//       <span>Quick Filters</span>
//       {activeFilterCount > 0 && (
//         <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 flex items-center justify-center">
//           {activeFilterCount}
//         </Badge>
//       )}
//     </Button>
//   );
// }

// // Filter Panel Component
// export function FilterPanel({
//   businessId,
//   cashbookId,
//   onFilterChange,
//   onClearFilters,
//   onApplyFilters,
//   onClose,
//   filters,
//   setFilters,
//   customDateRange,
//   setCustomDateRange,
// }: {
//   businessId: string;
//   cashbookId?: string;
//   onFilterChange: (filters: Record<string, any>) => void;
//   onClearFilters: () => void;
//   onApplyFilters: () => void;
//   onClose: () => void;
//   filters: QuickFilters;
//   setFilters: (filters: QuickFilters) => void;
//   customDateRange: { from?: Date; to?: Date };
//   setCustomDateRange: (range: { from?: Date; to?: Date }) => void;
// }) {
//   const { user } = useAuth();
  
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

//   // Format category options for Select
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

//   // Format payment mode options for Select
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

//   // Get date range display text
//   const getDateRangeDisplay = () => {
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
    
//     return filters.dateFilter.type.charAt(0).toUpperCase() + filters.dateFilter.type.slice(1);
//   };

//   // Get display name for filter value
//   const getFilterDisplayName = (type: 'category' | 'paymentMode' | 'user', value: string) => {
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
//   };

//   // Check if any filter is active
//   const hasActiveFilters = () => {
//     return (
//       filters.category !== ALL_CATEGORIES ||
//       filters.paymentMode !== ALL_PAYMENT_MODES ||
//       filters.party !== ALL_PARTIES ||
//       filters.user !== ALL_USERS ||
//       filters.dateFilter.type !== 'all'
//     );
//   };

//   // Get active filter count
//   const getActiveFilterCount = () => {
//     let count = 0;
//     if (filters.category !== ALL_CATEGORIES) count++;
//     if (filters.paymentMode !== ALL_PAYMENT_MODES) count++;
//     if (filters.party !== ALL_PARTIES) count++;
//     if (filters.user !== ALL_USERS) count++;
//     if (filters.dateFilter.type !== 'all') count++;
//     return count;
//   };

//   // Update date filter
//   const handleDateFilterChange = (type: DateFilter['type']) => {
//     if (type === 'custom') {
//       setFilters({
//         ...filters,
//         dateFilter: { type: 'custom', startDate: customDateRange.from, endDate: customDateRange.to }
//       });
//     } else {
//       setFilters({
//         ...filters,
//         dateFilter: { type }
//       });
//     }
//   };

//   // Update custom date range
//   const handleCustomDateRangeChange = (range: { from?: Date; to?: Date }) => {
//     setCustomDateRange(range);
//     if (filters.dateFilter.type === 'custom') {
//       setFilters({
//         ...filters,
//         dateFilter: { type: 'custom', startDate: range.from, endDate: range.to }
//       });
//     }
//   };

//   // Clear specific filter
//   const clearFilter = (filterType: 'category' | 'paymentMode' | 'party' | 'user' | 'date') => {
//     if (filterType === 'date') {
//       setFilters({
//         ...filters,
//         dateFilter: { type: 'all' }
//       });
//     } else {
//       setFilters({
//         ...filters,
//         [filterType]: 
//           filterType === 'category' ? ALL_CATEGORIES :
//           filterType === 'paymentMode' ? ALL_PAYMENT_MODES :
//           filterType === 'party' ? ALL_PARTIES :
//           ALL_USERS
//       });
//     }
//   };

//   return (
//     <div className="mb-4 sm:mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
//       <div className="flex justify-between items-center mb-4">
//         <h3 className="text-sm font-semibold text-gray-700">Quick Filters</h3>
//         <div className="flex gap-2">
//           <Button
//             variant="ghost"
//             size="sm"
//             onClick={onClearFilters}
//             className="h-8 text-gray-600 hover:text-gray-900"
//           >
//             <X className="h-3 w-3 mr-1" />
//             Clear All
//           </Button>
//           <Button
//             size="sm"
//             onClick={onApplyFilters}
//             className="h-8 bg-gray-800 hover:bg-gray-700 text-white"
//           >
//             Apply Filters
//           </Button>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//         {/* Date Filter */}
//         <div className="space-y-2">
//           <label className="text-xs font-medium text-gray-600">View By</label>
//           <div className="flex flex-wrap gap-2">
//             {(['all', 'today', 'week', 'month', 'custom'] as const).map((type) => (
//               <button
//                 key={type}
//                 type="button"
//                 onClick={() => handleDateFilterChange(type)}
//                 className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${
//                   filters.dateFilter.type === type
//                     ? 'bg-gray-800 text-white border-gray-800'
//                     : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
//                 }`}
//               >
//                 {type === 'all' ? 'All Time' : type.charAt(0).toUpperCase() + type.slice(1)}
//               </button>
//             ))}
//           </div>
          
//           {filters.dateFilter.type === 'custom' && (
//             <div className="mt-2">
//               <Popover>
//                 <PopoverTrigger asChild>
//                   <Button
//                     variant="outline"
//                     className="w-full justify-start text-left text-xs h-8"
//                   >
//                     <Calendar className="mr-2 h-3 w-3" />
//                     {getDateRangeDisplay()}
//                   </Button>
//                 </PopoverTrigger>
//                 <PopoverContent className="w-auto p-0" align="start">
//                   <CalendarComponent
//                     initialFocus
//                     mode="range"
//                     defaultMonth={customDateRange.from}
//                     selected={{
//                       from: customDateRange.from,
//                       to: customDateRange.to,
//                     }}
//                     onSelect={(range) => handleCustomDateRangeChange({
//                       from: range?.from,
//                       to: range?.to,
//                     })}
//                     numberOfMonths={2}
//                   />
//                 </PopoverContent>
//               </Popover>
//             </div>
//           )}
//         </div>

//         {/* Category Filter */}
//         <div className="space-y-2">
//           <label className="text-xs font-medium text-gray-600">Category</label>
//           <Select
//             value={filters.category}
//             onValueChange={(value) => setFilters({...filters, category: value})}
//             disabled={isCategoriesPending}
//           >
//             <SelectTrigger className="w-full text-xs h-8">
//               <SelectValue placeholder="All categories" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value={ALL_CATEGORIES}>All categories</SelectItem>
//               {isCategoriesPending ? (
//                 <div className="flex items-center justify-center p-2">
//                   <Loader2 className="h-3 w-3 animate-spin mr-2" />
//                   <span className="text-xs">Loading...</span>
//                 </div>
//               ) : (
//                 categoryOptions.map((category) => (
//                   <SelectItem key={category.id} value={category.value}>
//                     {category.name}
//                   </SelectItem>
//                 ))
//               )}
//             </SelectContent>
//           </Select>
//         </div>

//         {/* Payment Mode Filter */}
//         <div className="space-y-2">
//           <label className="text-xs font-medium text-gray-600">Payment Mode</label>
//           <Select
//             value={filters.paymentMode}
//             onValueChange={(value) => setFilters({...filters, paymentMode: value})}
//             disabled={isPaymentModesLoading}
//           >
//             <SelectTrigger className="w-full text-xs h-8">
//               <SelectValue placeholder="All payment modes" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value={ALL_PAYMENT_MODES}>All payment modes</SelectItem>
//               {isPaymentModesLoading ? (
//                 <div className="flex items-center justify-center p-2">
//                   <Loader2 className="h-3 w-3 animate-spin mr-2" />
//                   <span className="text-xs">Loading...</span>
//                 </div>
//               ) : (
//                 paymentModeOptions.map((mode) => (
//                   <SelectItem key={mode.id} value={mode.value}>
//                     {mode.name}
//                   </SelectItem>
//                 ))
//               )}
//             </SelectContent>
//           </Select>
//         </div>

//         {/* User Filter */}
//         <div className="space-y-2">
//           <label className="text-xs font-medium text-gray-600">User</label>
//           <Select
//             value={filters.user}
//             onValueChange={(value) => setFilters({...filters, user: value})}
//           >
//             <SelectTrigger className="w-full text-xs h-8">
//               <SelectValue placeholder="All users" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value={ALL_USERS}>All users</SelectItem>
//               {user && (
//                 <SelectItem value={user._id}>
//                   {user.name || user.email}
//                 </SelectItem>
//               )}
//             </SelectContent>
//           </Select>
//         </div>
//       </div>

//       {/* Active Filters Display */}
//       {hasActiveFilters() && (
//         <div className="mt-4 pt-4 border-t border-gray-200">
//           <div className="flex items-center gap-2 mb-2">
//             <span className="text-xs font-medium text-gray-600">Active Filters:</span>
//           </div>
//           <div className="flex flex-wrap gap-2">
//             {filters.dateFilter.type !== 'all' && (
//               <Badge variant="secondary" className="text-xs">
//                 Date: {getDateRangeDisplay()}
//                 <button
//                   onClick={() => clearFilter('date')}
//                   className="ml-1 text-gray-500 hover:text-gray-700"
//                 >
//                   <X className="h-3 w-3" />
//                 </button>
//               </Badge>
//             )}
//             {filters.category !== ALL_CATEGORIES && (
//               <Badge variant="secondary" className="text-xs">
//                 Category: {getFilterDisplayName('category', filters.category)}
//                 <button
//                   onClick={() => clearFilter('category')}
//                   className="ml-1 text-gray-500 hover:text-gray-700"
//                 >
//                   <X className="h-3 w-3" />
//                 </button>
//               </Badge>
//             )}
//             {filters.paymentMode !== ALL_PAYMENT_MODES && (
//               <Badge variant="secondary" className="text-xs">
//                 Payment: {getFilterDisplayName('paymentMode', filters.paymentMode)}
//                 <button
//                   onClick={() => clearFilter('paymentMode')}
//                   className="ml-1 text-gray-500 hover:text-gray-700"
//                 >
//                   <X className="h-3 w-3" />
//                 </button>
//               </Badge>
//             )}
//             {filters.user !== ALL_USERS && (
//               <Badge variant="secondary" className="text-xs">
//                 User: {getFilterDisplayName('user', filters.user)}
//                 <button
//                   onClick={() => clearFilter('user')}
//                   className="ml-1 text-gray-500 hover:text-gray-700"
//                 >
//                   <X className="h-3 w-3" />
//                 </button>
//               </Badge>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// // Main Filter Hook
// export function useTransactionFilters(businessId: string) {
//   const { user } = useAuth();
//   const [filters, setFilters] = useState<QuickFilters>({
//     dateFilter: { type: 'all' },
//     category: ALL_CATEGORIES,
//     paymentMode: ALL_PAYMENT_MODES,
//     party: ALL_PARTIES,
//     user: ALL_USERS,
//   });

//   const [customDateRange, setCustomDateRange] = useState<{
//     from?: Date;
//     to?: Date;
//   }>({});

//   // Get date range from filter for API
//   const getAPIDateRange = (filter: DateFilter) => {
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
//   };

//   // Prepare filters for API
//   const getTransactionsFilters = () => {
//     const dateRange = getAPIDateRange(filters.dateFilter);
    
//     const apiFilters: Record<string, any> = {};
    
//     // Add date filters
//     if (dateRange.dateFrom) apiFilters.dateFrom = dateRange.dateFrom;
//     if (dateRange.dateTo) apiFilters.dateTo = dateRange.dateTo;
    
//     // Category filter
//     if (filters.category !== ALL_CATEGORIES && filters.category) {
//       apiFilters.category = filters.category;
//     }
    
//     // Payment mode filter
//     if (filters.paymentMode !== ALL_PAYMENT_MODES && filters.paymentMode) {
//       apiFilters.paymentMode = filters.paymentMode;
//     }
    
//     // User filter
//     if (filters.user !== ALL_USERS && filters.user && user) {
//       apiFilters.user = filters.user;
//     }
    
//     return apiFilters;
//   };

//   // Get active filter count
//   const getActiveFilterCount = () => {
//     let count = 0;
//     if (filters.category !== ALL_CATEGORIES) count++;
//     if (filters.paymentMode !== ALL_PAYMENT_MODES) count++;
//     if (filters.party !== ALL_PARTIES) count++;
//     if (filters.user !== ALL_USERS) count++;
//     if (filters.dateFilter.type !== 'all') count++;
//     return count;
//   };

//   // Clear all filters
//   const clearFilters = () => {
//     setFilters({
//       dateFilter: { type: 'all' },
//       category: ALL_CATEGORIES,
//       paymentMode: ALL_PAYMENT_MODES,
//       party: ALL_PARTIES,
//       user: ALL_USERS,
//     });
//     setCustomDateRange({});
//   };

//   return {
//     filters,
//     setFilters,
//     customDateRange,
//     setCustomDateRange,
//     getTransactionsFilters,
//     getActiveFilterCount,
//     clearFilters,
//   };
// }

