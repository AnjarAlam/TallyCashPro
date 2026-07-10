// // app/business/[businessId]/business-page.tsx
// "use client";

// import { BusinessSwitchCard } from "@/components/cards";
// import AddCashbookCard from "@/components/cards/dashboard/add-cashbook";
// import CashbookCard from "@/components/cards/dashboard/cashbook-card";
// import { CashbookSheet } from "@/components/sheets";
// import { CashbookCardSkeleton } from "@/components/skeleton";
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Skeleton } from "@/components/ui/skeleton";
// import DashboardSubLayout from "@/layout/dashboard-sublayout";
// import { hasPermission } from "@/lib";
// import { useBusiness } from "@/providers/business-cashbook-provider";
// import { useGetCompanyById } from "@/services";
// import { useGetCashbookList } from "@/services/cashbook.service";
// import { useCompanyMemberRole } from "@/services/check-role.service";
// import { Search, X } from "lucide-react";
// import { useState, useEffect, useRef, useCallback } from "react";

// interface BusinessPageProps {
//   businessId: string;
// }

// export function BusinessPage({ businessId }: BusinessPageProps) {
//   const { setCashbook } = useBusiness();
//   const [searchText, setSearchText] = useState("");
//   const [debouncedSearchText, setDebouncedSearchText] = useState("");
//   const searchInputRef = useRef<HTMLInputElement>(null);

//   // Define hooks first before using their values in effects
//   const {
//     data: userRole,
//     isLoading: isLoadingRole,
//     isError: isRoleError,
//     error: roleError,
//   } = useCompanyMemberRole(businessId);

//   const {
//     cashbookList,
//     isCashbookListPending,
//     isCashbookListError,
//     cashbookListError,
//     refetchCashbookList,
//   } = useGetCashbookList(businessId, debouncedSearchText || undefined);

//   const {
//     company,
//     isCompanyPending,
//     isCompanyError,
//     companyError,
//     refetchCompany,
//   } = useGetCompanyById(businessId);

//   // Simple debounce effect
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setDebouncedSearchText(searchText);
//     }, 300); // 300ms debounce

//     return () => clearTimeout(timer);
//   }, [searchText]);

//   // Keep focus on search input after re-renders
//   useEffect(() => {
//     if (searchInputRef.current && document.activeElement === searchInputRef.current) {
//       // If the search input had focus before re-render, restore it
//       searchInputRef.current.focus();
//       // Move cursor to end of text
//       const length = searchText.length;
//       searchInputRef.current.setSelectionRange(length, length);
//     }
//   }, [searchText, cashbookList, isCashbookListPending]); // Re-run when data changes

//   const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
//     setSearchText(e.target.value);
//   }, []);

//   const clearSearch = useCallback(() => {
//     setSearchText("");
//     setDebouncedSearchText("");
//     // Focus back on search input after clearing
//     setTimeout(() => {
//       searchInputRef.current?.focus();
//     }, 10);
//   }, []);

//   const isSearchActive = debouncedSearchText.trim().length > 0;

//   // Early return for critical errors
//   if (isCompanyError || isRoleError) {
//     return (
//       <DashboardSubLayout headerTitle="Business Cashbooks" showPreviousPage>
//         <div className="space-y-4 p-4">
//           {isCompanyError && (
//             <Alert variant="destructive">
//               <AlertTitle>Error loading company details</AlertTitle>
//               <AlertDescription>
//                 {companyError?.message || "Unknown error"}
//               </AlertDescription>
//               <Button
//                 variant="outline"
//                 className="mt-4"
//                 onClick={() => refetchCompany()}
//               >
//                 Retry
//               </Button>
//             </Alert>
//           )}

//           {isRoleError && (
//             <Alert variant="destructive">
//               <AlertTitle>Error loading user role</AlertTitle>
//               <AlertDescription>
//                 {roleError?.message || "Unknown error"}
//               </AlertDescription>
//             </Alert>
//           )}
//         </div>
//       </DashboardSubLayout>
//     );
//   }

//   // Show loading state while role is being fetched
//   if (isLoadingRole || !userRole) {
//     return (
//       <DashboardSubLayout headerTitle="Business Cashbooks" showPreviousPage>
//         <div className="space-y-4 p-4">
//           <BusinessInfoCardSkeleton />
//           <SearchBarSkeleton />
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//             {[...Array(3)].map((_, index) => (
//               <CashbookCardSkeleton key={`skeleton-${index}`} />
//             ))}
//           </div>
//         </div>
//       </DashboardSubLayout>
//     );
//   }

//   const canCreateBook = hasPermission(
//     {
//       businessRole: userRole?.data?.companyRole || "staff",
//     },
//     "crud_cashbook",
//     "C"
//   );

//   // Memoize the AddCashbookCard to prevent unnecessary re-renders
//   const addCashbookCard = !isSearchActive && canCreateBook && (
//     <AddCashbookCard businessId={businessId} />
//   );

//   // Memoize cashbook cards to prevent unnecessary re-renders
//   const cashbookCards = cashbookList.length > 0 ? (
//     cashbookList.map((book) => (
//       <CashbookCard
//         onClick={() => setCashbook(book)}
//         key={book._id}
//         bookId={book._id}
//         businessId={businessId}
//         name={book.name}
//         createdAt={book.createdAt}
//         netBalance={book.totalIn - book.totalOut || 0}
//         totalIn={book.totalIn || 0}
//         totalOut={book.totalOut || 0}
//         currency={book.currency || "INR"}
//         book={book}
//       />
//     ))
//   ) : null;

//   return (
//     <DashboardSubLayout
//       showPreviousPage
//       headerTitlePosition={1}
//       compList={[
//         ...(canCreateBook
//           ? [
//               {
//                 comp: <CashbookSheet businessId={businessId} />,
//                 position: "right" as const,
//               },
//             ]
//           : []),
//         {
//           comp: isCompanyPending ? (
//             <Skeleton className="h-8 w-48" />
//           ) : (
//             <h1 className="text-lg font-semibold md:text-2xl flex items-center gap-2">
//               {company?.name
//                 ? `${company.name.charAt(0).toUpperCase()}${company.name
//                     .slice(1)
//                     .toLowerCase()}'s Books`
//                 : "Books"}
//             </h1>
//           ),
//           position: "left" as const,
//         },
//       ]}
//     >
//       {/* Company Info Section */}
//       {isCompanyPending ? (
//         <BusinessInfoCardSkeleton />
//       ) : company ? (
//         <div className="flex flex-col gap-5">
//           <BusinessSwitchCard
//             category={company.category}
//             id={company._id}
//             name={company.name}
//             description={company.description}
//             totalBooks={cashbookList?.length || 0}
//             isLoading={isCashbookListPending}
//           />
//         </div>
//       ) : null}

//       {/* Search Bar Section */}
//       <div className="mt-6 px-4 md:px-0">
//         <div className="relative max-w-md">
//           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
//           <Input
//             ref={searchInputRef}
//             type="text"
//             placeholder="Search books by name..."
//             value={searchText}
//             onChange={handleSearchChange}
//             className="pl-10 pr-10"
//             disabled={isCashbookListPending}
//             onKeyDown={(e) => {
//               // Prevent form submission on Enter
//               if (e.key === 'Enter') {
//                 e.preventDefault();
//               }
//             }}
//           />
//           {searchText && (
//             <button
//               onClick={clearSearch}
//               className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//               type="button"
//               aria-label="Clear search"
//               disabled={isCashbookListPending}
//               // Prevent this button from stealing focus
//               onMouseDown={(e) => e.preventDefault()}
//             >
//               {isCashbookListPending ? (
//                 <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400"></div>
//               ) : (
//                 <X className="h-4 w-4" />
//               )}
//             </button>
//           )}
//         </div>
        
//         {/* Search Status - Memoized to prevent re-renders */}
//         {isSearchActive && (
//           <div className="mt-2 text-sm text-gray-500">
//             {isCashbookListPending ? (
//               <span className="flex items-center gap-2">
//                 <span className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-400"></span>
//                 Searching books...
//               </span>
//             ) : cashbookList.length > 0 ? (
//               <span>
//                 Found {cashbookList.length} book{cashbookList.length !== 1 ? 's' : ''} for "{debouncedSearchText}"
//               </span>
//             ) : (
//               <span>No books found for "{debouncedSearchText}"</span>
//             )}
//           </div>
//         )}
//       </div>

//       {/* Error Alert */}
//       {isCashbookListError && (
//         <div className="mt-4 px-4 md:px-0">
//           <Alert variant="destructive">
//             <AlertTitle>
//               {isSearchActive ? "Search Error" : "Error loading books"}
//             </AlertTitle>
//             <AlertDescription>
//               {cashbookListError?.message || "Unknown error"}
//             </AlertDescription>
//             <Button
//               variant="outline"
//               className="mt-2"
//               onClick={() => refetchCashbookList()}
//               // Prevent button from stealing focus
//               onMouseDown={(e) => e.preventDefault()}
//             >
//               {isSearchActive ? "Retry Search" : "Retry"}
//             </Button>
//           </Alert>
//         </div>
//       )}

//       {/* Cashbooks Section */}
//       <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5 md:p-4">
//         {isCashbookListPending ? (
//           // Show skeleton cards while loading
//           [...Array(3)].map((_, index) => (
//             <CashbookCardSkeleton key={`skeleton-${index}`} />
//           ))
//         ) : (
//           <>
//             {/* Only show AddCashbookCard when not searching */}
//             {addCashbookCard}
            
//             {/* Show cashbook cards */}
//             {cashbookCards}
            
//             {/* Show AddCashbookCard when no books exist (not searching) */}
//             {!isSearchActive && canCreateBook && cashbookList.length === 0 && (
//               <AddCashbookCard businessId={businessId} />
//             )}
//           </>
//         )}
//       </div>

//       {/* No Results Message for search */}
//       {!isCashbookListPending && 
//        !isCashbookListError && 
//        isSearchActive && 
//        cashbookList.length === 0 && (
//         <div className="text-center py-10 px-4">
//           <div className="text-gray-400 mb-2">
//             <Search className="h-12 w-12 mx-auto opacity-50" />
//           </div>
//           <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-1">
//             No books found
//           </h3>
//           <p className="text-gray-500 dark:text-gray-400">
//             No books match "{debouncedSearchText}". Try a different search term.
//           </p>
//           <Button
//             variant="outline"
//             className="mt-4"
//             onClick={clearSearch}
//             // Prevent button from stealing focus
//             onMouseDown={(e) => e.preventDefault()}
//           >
//             Clear Search
//           </Button>
//         </div>
//       )}

//       {/* Empty state when no books exist (not searching) */}
//       {!isCashbookListPending && 
//        !isCashbookListError && 
//        !isSearchActive && 
//        cashbookList.length === 0 && 
//        !canCreateBook && (
//         <div className="text-center py-10 px-4">
//           <div className="text-gray-400 mb-2">
//             <Search className="h-12 w-12 mx-auto opacity-50" />
//           </div>
//           <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-1">
//             No books available
//           </h3>
//           <p className="text-gray-500 dark:text-gray-400">
//             There are no books in this business yet.
//           </p>
//         </div>
//       )}
//     </DashboardSubLayout>
//   );
// }

// export function BusinessInfoCardSkeleton() {
//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>
//           <Skeleton className="h-6 w-48" />
//         </CardTitle>
//       </CardHeader>
//       <CardContent className="grid gap-4">
//         <Skeleton className="h-[100px] w-full" />
//         <div className="grid gap-4 md:grid-cols-2">
//           <Skeleton className="h-[100px] w-full" />
//           <Skeleton className="h-[100px] w-full" />
//         </div>
//       </CardContent>
//     </Card>
//   );
// }

// function SearchBarSkeleton() {
//   return (
//     <div className="mt-6 px-4 md:px-0">
//       <Skeleton className="h-10 w-full max-w-md" />
//     </div>
//   );
// }


// ----------1-------------


// app/business/[businessId]/business-page.tsx
"use client";

import { BusinessSwitchCard } from "@/components/cards";
import AddCashbookCard from "@/components/cards/dashboard/add-cashbook";
import CashbookCard from "@/components/cards/dashboard/cashbook-card";
import { CashbookSheet } from "@/components/sheets";
import { CashbookCardSkeleton } from "@/components/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import DashboardSubLayout from "@/layout/dashboard-sublayout";
import { hasPermission } from "@/lib";
import { useBusiness } from "@/providers/business-cashbook-provider";
import { useGetCompanyById } from "@/services";
import { useGetCashbookList } from "@/services/cashbook.service";
import { useCompanyMemberRole } from "@/services/check-role.service";
import { useReorderBooks } from "@/services/company.member.books.service";
import { Cashbook } from "@/interface";
import { SortableItem } from "@/components/dnd/sortable-item";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Search, X, Move, Check, Eye, EyeOff, Settings } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useRef, useCallback } from "react";
import { getBusinessSettingsPermissions } from "@/lib/business-settings-permissions";

interface BusinessPageProps {
  businessId: string;
}

export function BusinessPage({ businessId }: BusinessPageProps) {
  const { setCashbook } = useBusiness();
  const [searchText, setSearchText] = useState("");
  const [debouncedSearchText, setDebouncedSearchText] = useState("");
  const [isLocalLoading, setIsLocalLoading] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const isTypingRef = useRef(false);
  const wasFocusedRef = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Define hooks first before using their values in effects
  const {
    data: userRole,
    isLoading: isLoadingRole,
    isError: isRoleError,
    error: roleError,
  } = useCompanyMemberRole(businessId);

  const {
    cashbookList,
    isCashbookListPending,
    isCashbookListError,
    cashbookListError,
    refetchCashbookList,
  } = useGetCashbookList(businessId, debouncedSearchText || undefined);

  const {
    company,
    isCompanyPending,
    isCompanyError,
    companyError,
    refetchCompany,
  } = useGetCompanyById(businessId);

  const [isReordering, setIsReordering] = useState(false);
  const [reorderedBooks, setReorderedBooks] = useState<Cashbook[]>([]);
  const [showBookAmounts, setShowBookAmounts] = useState(false);
  const { reorderBooks, isReorderingBooks } = useReorderBooks();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor),
  );

  useEffect(() => {
    if (cashbookList.length > 0) {
      setReorderedBooks(cashbookList);
    }
  }, [cashbookList]);

  const handleDragEnd = (event: { active: { id: string | number }; over: { id: string | number } | null }) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setReorderedBooks((items) => {
      const oldIndex = items.findIndex((item) => item._id === active.id);
      const newIndex = items.findIndex((item) => item._id === over.id);
      return arrayMove(items, oldIndex, newIndex);
    });
  };

  const handleSaveBookOrder = () => {
    if (!reorderedBooks.length) return;

    reorderBooks(
      {
        companyId: businessId,
        books: reorderedBooks.map((book, index) => ({
          bookId: book._id,
          order: index,
        })),
      },
      {
        onSuccess: () => {
          setIsReordering(false);
        },
      },
    );
  };

  const handleCancelReorder = () => {
    setReorderedBooks(cashbookList);
    setIsReordering(false);
  };

  const handleReorderClick = () => {
    setReorderedBooks(cashbookList);
    setIsReordering(true);
  };

  // Track if input is focused
  const handleInputFocus = useCallback(() => {
    wasFocusedRef.current = true;
  }, []);

  const handleInputBlur = useCallback(() => {
    wasFocusedRef.current = false;
  }, []);

  // Simple debounce effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchText(searchText);
      // Show local loading when search starts
      if (searchText.trim()) {
        setIsLocalLoading(true);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timer);
  }, [searchText]);

  // Hide local loading when search completes
  useEffect(() => {
    if (!isCashbookListPending && debouncedSearchText) {
      setIsLocalLoading(false);
    }
  }, [isCashbookListPending, debouncedSearchText]);

  // Restore focus after data loads
  useEffect(() => {
    // Only restore focus if user was typing recently and input should have focus
    if (wasFocusedRef.current && searchInputRef.current) {
      // Use setTimeout to ensure focus happens after React completes its render
      setTimeout(() => {
        if (searchInputRef.current) {
          searchInputRef.current.focus();
          // Move cursor to end
          const length = searchText.length;
          searchInputRef.current.setSelectionRange(length, length);
        }
      }, 0);
    }
  }, [isCashbookListPending, searchText]);

  // Handle search change with focus tracking
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchText(value);
    isTypingRef.current = true;
    wasFocusedRef.current = true;
    
    // Immediately focus the input when typing starts
    if (searchInputRef.current && document.activeElement !== searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  const clearSearch = useCallback(() => {
    setSearchText("");
    setDebouncedSearchText("");
    setIsLocalLoading(false);
    // Focus back on search input after clearing
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 10);
  }, []);

  // Reset typing flag after debounce
  useEffect(() => {
    if (searchText && !isCashbookListPending) {
      const timer = setTimeout(() => {
        isTypingRef.current = false;
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [searchText, isCashbookListPending]);

  const isSearchActive = debouncedSearchText.trim().length > 0;
  const showLoading = isLocalLoading || (isSearchActive && isCashbookListPending);

  useEffect(() => {
    if (isSearchActive && isReordering) {
      setIsReordering(false);
    }
  }, [isSearchActive, isReordering]);

  // Early return for critical errors
  if (isCompanyError || isRoleError) {
    return (
      <DashboardSubLayout headerTitle="Business Cashbooks" showPreviousPage>
        <div className="space-y-4 p-4">
          {isCompanyError && (
            <Alert variant="destructive">
              <AlertTitle>Error loading company details</AlertTitle>
              <AlertDescription>
                {companyError?.message || "Unknown error"}
              </AlertDescription>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => refetchCompany()}
              >
                Retry
              </Button>
            </Alert>
          )}

          {isRoleError && (
            <Alert variant="destructive">
              <AlertTitle>Error loading user role</AlertTitle>
              <AlertDescription>
                {roleError?.message || "Unknown error"}
              </AlertDescription>
            </Alert>
          )}
        </div>
      </DashboardSubLayout>
    );
  }

  // Show loading state while role is being fetched
  if (isLoadingRole || !userRole) {
    return (
      <DashboardSubLayout headerTitle="Business Cashbooks" showPreviousPage>
        <div className="space-y-4 p-4">
          <BusinessInfoCardSkeleton />
          <SearchBarSkeleton />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[...Array(3)].map((_, index) => (
              <CashbookCardSkeleton key={`skeleton-${index}`} />
            ))}
          </div>
        </div>
      </DashboardSubLayout>
    );
  }

  const companyRole = userRole?.data?.companyRole || "staff";

  const canCreateBook = hasPermission(
    {
      businessRole: companyRole,
    },
    "crud_cashbook",
    "C",
  );

  const { hasSettingsAccess } = getBusinessSettingsPermissions(companyRole);

  return (
    <DashboardSubLayout
      showPreviousPage
      headerTitlePosition={1}
      compList={[
        {
          comp: (
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-10 w-10 shrink-0"
                aria-label={showBookAmounts ? "Hide amounts" : "Show amounts"}
                onClick={() => setShowBookAmounts((prev) => !prev)}
              >
                {showBookAmounts ? (
                  <Eye className="h-5 w-5" />
                ) : (
                  <EyeOff className="h-5 w-5" />
                )}
              </Button>
              {hasSettingsAccess ? (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 shrink-0"
                  aria-label="Business settings"
                  asChild
                >
                  <Link href={`/dashboard/business/${businessId}/settings`}>
                    <Settings className="h-5 w-5" />
                  </Link>
                </Button>
              ) : null}
              {canCreateBook ? <CashbookSheet businessId={businessId} /> : null}
            </div>
          ),
          position: "right" as const,
        },
        {
          comp: isCompanyPending ? (
            <Skeleton className="h-8 w-48" />
          ) : (
            <h1 className="text-lg font-semibold md:text-2xl flex items-center gap-2">
              {company?.name
                ? `${company.name.charAt(0).toUpperCase()}${company.name
                    .slice(1)
                    .toLowerCase()}'s Books`
                : "Books"}
            </h1>
          ),
          position: "left" as const,
        },
      ]}
    >
      {/* Company Info Section */}
      {isCompanyPending ? (
        <BusinessInfoCardSkeleton />
      ) : company ? (
        <div className="flex flex-col gap-5">
          <BusinessSwitchCard
            category={company.category}
            id={company._id}
            name={company.name}
            description={company.description}
            totalBooks={cashbookList?.length || 0}
            isLoading={isCashbookListPending}
          />
        </div>
      ) : null}

      {/* Search + reorder toolbar (same row) */}
      <div
        key="search-bar"
        className="mt-6 px-4 md:px-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
      >
        <div className="w-full min-w-0 sm:max-w-md sm:flex-1">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 transition-colors group-focus-within:text-indigo-500" />
            <Input
              ref={searchInputRef}
              type="text"
              placeholder="Search books by name…"
              value={searchText}
              onChange={handleSearchChange}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              onKeyDown={(e) => {
                if (e.key === "Enter") e.preventDefault();
              }}
              className="h-11 w-full pl-11 pr-10 rounded-full bg-white/90 border border-gray-200 text-sm placeholder:text-gray-400 shadow-sm transition-all duration-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 hover:border-gray-300"
            />
            {searchText && (
              <button
                type="button"
                aria-label="Clear search"
                onClick={clearSearch}
                onMouseDown={(e) => {
                  e.preventDefault();
                  setTimeout(clearSearch, 0);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center h-7 w-7 rounded-full text-gray-400 transition-all hover:bg-gray-100 hover:text-gray-600 active:scale-90"
              >
                {showLoading ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-indigo-500" />
                ) : (
                  <X className="h-4 w-4" />
                )}
              </button>
            )}
          </div>
          {isSearchActive && (
            <div className="mt-2 text-xs text-gray-500 animate-fade-in">
              {showLoading ? (
                <span className="flex items-center gap-2">
                  <span className="h-3 w-3 animate-spin rounded-full border-2 border-gray-300 border-t-indigo-500" />
                  Searching books…
                </span>
              ) : cashbookList.length > 0 ? (
                <span>
                  Found <span className="font-medium text-gray-700">{cashbookList.length}</span>{" "}
                  book{cashbookList.length !== 1 ? "s" : ""} for “{debouncedSearchText}”
                </span>
              ) : (
                <span>No books found for “{debouncedSearchText}”</span>
              )}
            </div>
          )}
        </div>

        {!isSearchActive && cashbookList.length > 1 && (
          <div className="flex shrink-0 items-center gap-2 sm:justify-end">
            {isReordering && (
              <div className="hidden items-center gap-2 text-sm text-blue-600 lg:flex">
                <Move className="h-4 w-4 animate-pulse" />
                <span>Drag to reorder</span>
              </div>
            )}
            {!isReordering ? (
              <Button
                variant="outline"
                size="sm"
                onClick={handleReorderClick}
                className="flex items-center gap-2"
              >
                <Move className="h-4 w-4" />
                Reorder Books
              </Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCancelReorder}
                  disabled={isReorderingBooks}
                  className="flex items-center gap-2"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleSaveBookOrder}
                  disabled={isReorderingBooks}
                  className="flex items-center gap-2"
                >
                  {isReorderingBooks ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    <Check className="h-4 w-4" />
                  )}
                  Save Order
                </Button>
              </>
            )}
          </div>
        )}
      </div>


      {/* Error Alert */}
      {isCashbookListError && (
        <div className="mt-4 px-4 md:px-0">
          <Alert variant="destructive">
            <AlertTitle>
              {isSearchActive ? "Search Error" : "Error loading books"}
            </AlertTitle>
            <AlertDescription>
              {cashbookListError?.message || "Unknown error"}
            </AlertDescription>
            <Button
              variant="outline"
              className="mt-2"
              onClick={() => refetchCashbookList()}
              // Prevent focus stealing
              onMouseDown={(e) => e.preventDefault()}
            >
              {isSearchActive ? "Retry Search" : "Retry"}
            </Button>
          </Alert>
        </div>
      )}

      {isReordering && !isSearchActive && cashbookList.length > 1 && (
        <p className="px-4 md:px-5 -mt-1 flex items-center gap-2 text-sm text-blue-600 lg:hidden">
          <Move className="h-4 w-4 animate-pulse" />
          Drag to reorder books
        </p>
      )}

      {/* Cashbooks Section - Show loading skeletons only when we have no previous data */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5 md:p-4">
        {showLoading && cashbookList.length === 0 ? (
          // Show skeleton cards only when loading AND we have no previous results
          [...Array(3)].map((_, index) => (
            <CashbookCardSkeleton key={`skeleton-${index}`} />
          ))
        ) : (
          <>
            {/* Only show AddCashbookCard when not searching or reordering */}
            {!isSearchActive && !isReordering && canCreateBook && (
              <AddCashbookCard businessId={businessId} />
            )}

            {isReordering && reorderedBooks.length > 0 ? (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={reorderedBooks.map((b) => b._id)}
                  strategy={verticalListSortingStrategy}
                >
                  {reorderedBooks.map((book) => (
                    <SortableItem key={book._id} id={book._id}>
                      <CashbookCard
                        bookId={book._id}
                        businessId={businessId}
                        name={book.name}
                        createdAt={book.createdAt}
                        netBalance={book.totalIn - book.totalOut || 0}
                        totalIn={book.totalIn || 0}
                        totalOut={book.totalOut || 0}
                        currency={book.currency || "INR"}
                        book={book}
                        showAmounts={showBookAmounts}
                      />
                    </SortableItem>
                  ))}
                </SortableContext>
              </DndContext>
            ) : cashbookList.length > 0 ? (
              cashbookList.map((book) => (
                <CashbookCard
                  onClick={() => setCashbook(book)}
                  key={book._id}
                  bookId={book._id}
                  businessId={businessId}
                  name={book.name}
                  createdAt={book.createdAt}
                  netBalance={book.totalIn - book.totalOut || 0}
                  totalIn={book.totalIn || 0}
                  totalOut={book.totalOut || 0}
                  currency={book.currency || "INR"}
                  book={book}
                  showAmounts={showBookAmounts}
                />
              ))
            ) : null}
          </>
        )}
      </div>

      {/* No Results Message for search */}
      {!showLoading && 
       !isCashbookListError && 
       isSearchActive && 
       cashbookList.length === 0 && (
        <div className="text-center py-10 px-4">
          <div className="text-gray-400 mb-2">
            <Search className="h-12 w-12 mx-auto opacity-50" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-1">
            No books found
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            No books match "{debouncedSearchText}". Try a different search term.
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={clearSearch}
            // Prevent focus stealing
            onMouseDown={(e) => e.preventDefault()}
          >
            Clear Search
          </Button>
        </div>
      )}

      {/* Empty state when no books exist (not searching) */}
      {!isCashbookListPending && 
       !isCashbookListError && 
       !isSearchActive && 
       cashbookList.length === 0 && 
       !canCreateBook && (
        <div className="text-center py-10 px-4">
          <div className="text-gray-400 mb-2">
            <Search className="h-12 w-12 mx-auto opacity-50" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-1">
            No books available
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            There are no books in this business yet.
          </p>
        </div>
      )}
    </DashboardSubLayout>
  );
}

export function BusinessInfoCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-6 w-48" />
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <Skeleton className="h-[100px] w-full" />
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-[100px] w-full" />
          <Skeleton className="h-[100px] w-full" />
        </div>
      </CardContent>
    </Card>
  );
}

function SearchBarSkeleton() {
  return (
    <div className="mt-6 px-4 md:px-0">
      <Skeleton className="h-10 w-full max-w-md" />
    </div>
  );
}