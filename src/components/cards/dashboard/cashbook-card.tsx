// "use client";

// import { DeleteConfirmationForm } from "@/components/form";
// import EditCashbookForm from "@/components/form/cashbook/edit-cashbook";
// import ModalLayout from "@/components/modals/modal-layout";
// import { Card, CardFooter } from "@/components/ui/card";
// import { DialogTitle } from "@/components/ui/dialog";
// import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
// import { useAuth } from "@/hooks";
// import { Cashbook } from "@/interface";
// import { formatDate, hasPermission } from "@/lib";
// import { cn } from "@/lib/utils";
// import { paths } from "@/routes/path";
// import {
//   useCashbookMemberRole,
//   useCompanyMemberRole,
// } from "@/services/check-role.service";
// import { useGetBookTotals } from "@/services/cashbook.service";
// import { useGetTransactionsByBook } from "@/services/transaction.service";
// import { Bookmark, Edit, Loader2, Trash2, FileText, List } from "lucide-react";
// import { useRouter } from "next/navigation";
// import { useState } from "react";

// export interface CashbookCardProps {
//   name: string;
//   businessId: string;
//   createdAt: string;
//   bookId: string;
//   netBalance: number;
//   totalIn: number;
//   totalOut: number;
//   totalTransactions?: number;
//   totalInTransactions?: number;
//   totalOutTransactions?: number;
  
//   onClick?: () => void;
//   onEdit?: () => void;
//   onDelete?: () => void;
//   book: Cashbook;
// }

// export default function CashbookCard({
//   businessId,
//   bookId,
//   name,
//   createdAt,
//   netBalance,
//   totalIn,
//   totalOut,
//   totalTransactions = 0,
//   totalInTransactions = 0,
//   totalOutTransactions = 0,
//   onClick,
//   onEdit,
//   onDelete,
//   book,
// }: CashbookCardProps) {
//   const { user } = useAuth();
//   const createdDate = formatDate(createdAt, "Do-MMM-YYYY");
//   const [open, setOpen] = useState(false);
//   const router = useRouter();
//   const {
//     data: userCashbookRole,
//     isLoading: isLoadingCashbookRole,
//     isError: isCashbookRoleError,
//     error: cashbookRoleError,
//   } = useCashbookMemberRole(book._id, user?._id || "");

//   const {
//     data: userRole,
//     isLoading: isLoadingRole,
//     isError: isRoleError,
//     error: roleError,
//   } = useCompanyMemberRole(businessId);

//   const {
//     bookTotals,
//     isBookTotalsPending,
//   } = useGetBookTotals(bookId);

//   const {
//     totalTransactions: totalTransactionsFromAPI,
//     isTransactionsPending,
//   } = useGetTransactionsByBook({
//     bookId,
//     pageNumber: 0,
//     pageSize: 0
//   });

//   const [isHandlingAction, setIsHandlingAction] = useState(false);
  
//   const handleCardClick = (e: React.MouseEvent) => {
//     const target = e.target as HTMLElement;
//     const isActionButton = target.closest("[data-action-button]");

//     if (!isActionButton) {
//       onClick?.();
//       router.push(paths.dashboard.business.cashbookDetail(businessId, bookId));
//     }
//   };

//   if (isLoadingRole) {
//     return (
//       <div className="flex items-center justify-center p-4 rounded-lg bg-background dark:bg-primary/40 border border-primary/40 shadow-md">
//         <Loader2 className="h-6 w-6 animate-spin" />
//       </div>
//     );
//   }

//   if (isRoleError) {
//     return (
//       <div className="p-4 rounded-lg bg-background dark:bg-primary/40 border border-red-500/40 shadow-md">
//         <p className="text-red-500">Error loading permissions</p>
//       </div>
//     );
//   }

//   const canDelete = hasPermission(
//     {
//       businessRole: userRole?.data.companyRole || "staff",
//       cashbookRole: userCashbookRole?.data?.BookRole || "viewer",
//     },
//     "crud_cashbook",
//     "D"
//   );

//   const canEdit = hasPermission(
//     {
//       businessRole: userRole?.data.companyRole || "staff",
//       cashbookRole: userCashbookRole?.data?.BookRole || "admin",
//     },
//     "crud_cashbook",
//     "U"
//   );

//   const formatCurrency = (amount: number) =>
//     `₹${amount.toLocaleString("en-IN")}`;

//   const formatNumber = (amount: number) =>
//     amount.toLocaleString("en-IN");

//   // Calculate total transactions if not provided
//   const calculatedTotalTransactions = totalTransactionsFromAPI || 0;

//   return (
//     <div
//       className={cn(
//         "group relative flex flex-col sm:flex-row items-start sm:items-center rounded-lg bg-background dark:bg-primary/40 p-4 transition-all duration-75 border border-primary/40 shadow-md dark:hover:bg-white/5 shrink-0 hover:cursor-pointer",
//         { "border-red-700/65": netBalance < 0 }
//       )}
//       onClick={handleCardClick}
//     >
//       <div className="flex items-center w-full">
//         {/* Left Tag Icon */}
//         <div
//           className={cn(
//             "sm:flex-shrink-0 mr-4 mb-3 sm:mb-0 p-3 rounded-full bg-primary/10 dark:bg-white/10 h-min",
//             { "bg-red-600/10": netBalance < 0 }
//           )}
//         >
//           <Bookmark className="w-6 h-6 text-primary dark:text-white" />
//         </div>

//         {/* Main content - takes up available space */}
//         <div className="flex-1 flex flex-col space-y-1 min-w-0">
//           <div className="flex items-center justify-between w-full">
//             <div>
//               <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 truncate">
//                 {name}
//               </h3>

//               <div className="flex items-center mt-1">
//                 <span
//                   className={cn(
//                     "font-bold",
//                     netBalance >= 0 ? "text-green-600" : "text-red-600"
//                   )}
//                 >
//                   Balance: {formatCurrency(netBalance)}
//                 </span>
//               </div>
//             </div>

//             {/* Action buttons */}
//             <div
//               className="flex items-center gap-2 ml-4"
//               data-action-button
//               onClick={(e) => e.stopPropagation()}
//             >
//               {canEdit && (
//                 <Sheet open={open} onOpenChange={setOpen}>
//                   <SheetTrigger asChild>
//                     <button
//                       className="p-2 text-gray-500 hover:text-blue-600 transition-colors disabled:opacity-50 group-hover:cursor-pointer"
//                       aria-label="Edit"
//                       data-action-button
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         onEdit?.();
//                       }}
//                     >
//                       {isHandlingAction ? (
//                         <Loader2 className="h-4 w-4 animate-spin" />
//                       ) : (
//                         <Edit className="h-4 w-4" />
//                       )}
//                     </button>
//                   </SheetTrigger>
//                   <SheetContent
//                     side="right"
//                     className="overflow-y-scroll pb-4 w-full sm:min-w-1/2 lg:min-w-1/3 duration-75 transition-all"
//                   >
//                     <DialogTitle />
//                     <EditCashbookForm
//                       onClose={() => setOpen(false)}
//                       businessId={businessId}
//                       cashbook={book}
//                     />
//                   </SheetContent>
//                 </Sheet>
//               )}

//               {canDelete && (
//                 <ModalLayout
//                   trigger={
//                     <button
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         onEdit?.();
//                       }}
//                       disabled={isHandlingAction}
//                       className="p-2 text-gray-500 hover:text-red-600 transition-colors disabled:opacity-50 group-hover:cursor-pointer"
//                       aria-label="Delete"
//                       data-action-button
//                     >
//                       {isHandlingAction ? (
//                         <Loader2 className="h-4 w-4 animate-spin" />
//                       ) : (
//                         <Trash2 className="h-4 w-4" />
//                       )}
//                     </button>
//                   }
//                 >
//                   <Card className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
//                     <CardFooter className="w-full p-0">
//                       <DeleteConfirmationForm
//                         onClose={() => setOpen(false)}
//                         id={book._id}
//                         type="cashbook"
//                         companyId={businessId}
//                         itemName={"cashbook"}
//                       />
//                     </CardFooter>
//                   </Card>
//                 </ModalLayout>
//               )}
//             </div>
//           </div>

//           {/* Financial Summary */}
//           <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm mt-2">
//             <div className="flex items-center gap-1">
//               <span className="text-green-600 font-medium">
//                 IN: {formatCurrency(totalIn)}
//               </span>
//               {totalInTransactions > 0 && (
//                 <span className="text-xs text-green-500/80">
//                   ({formatNumber(totalInTransactions)})
//                 </span>
//               )}
//             </div>
//             <div className="flex items-center gap-1">
//               <span className="text-red-600 font-medium">
//                 OUT: {formatCurrency(totalOut)}
//               </span>
//               {totalOutTransactions > 0 && (
//                 <span className="text-xs text-red-500/80">
//                   ({formatNumber(totalOutTransactions)})
//                 </span>
//               )}
//             </div>
            
            
//           </div>

// {/* Timestamp */}
// <div className="mt-2 border-t border-dashed w-full pt-3 flex items-center justify-between text-xs text-gray-500">
//   <div className="flex items-center">
//     <span>Created {createdDate}</span>
//   </div>

//   {/* Transaction Count */}
//   {/* Transaction Count Badge */}
// <div className="flex items-center gap-1">
//   <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-blue-300 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium border border-blue-200 dark:border-blue-700">
//     <List className="h-3 w-3" />
//     <span>
//       {isTransactionsPending ? (
//         <Loader2 className="h-3 w-3 animate-spin" />
//       ) : (
//         `${formatNumber(calculatedTotalTransactions)} Transactions`
//       )}
//     </span>
//   </div>
// </div>
// </div>
//         </div>
//       </div>
//     </div>
//   );
// }



// -------------1

// src/components/cards/dashboard/cashbook-card.tsx
"use client"

import type React from "react"

import { DeleteConfirmationForm } from "@/components/form"
import EditCashbookForm from "@/components/form/cashbook/edit-cashbook"
import TransferCashbookForm from "@/components/form/cashbook/transfer-cashbook"
import { Card, CardFooter } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/hooks"
import type { Cashbook } from "@/interface"
import { formatDate, hasPermission } from "@/lib"
import { cn } from "@/lib/utils"
import { paths } from "@/routes/path"
import { useCashbookMemberRole, useCompanyMemberRole } from "@/services/check-role.service"
import { useGetBookTotals } from "@/services/cashbook.service"
import { useGetTransactionsByBook } from "@/services/transaction.service"
import { Bookmark, Edit, Loader2, Trash2, List, MoreVertical, ArrowBigDown } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import CurrencyIcon from "@/components/ui/currency-icon"
import { formatCurrencyAmount, getCurrencyInfo } from "@/constants/currency"

export interface CashbookCardProps {
  name: string
  businessId: string
  createdAt: string
  bookId: string
  netBalance: number
  totalIn: number
  totalOut: number
  totalTransactions?: number
  totalInTransactions?: number
  totalOutTransactions?: number
  currency?: string
  onClick?: () => void
  onEdit?: () => void
  onDelete?: () => void
  onTransfer?: () => void
  book: Cashbook
  /** When false, balance / IN / OUT show masked dots (default true). */
  showAmounts?: boolean
}

const MASKED_AMOUNT = "••••••"

export default function CashbookCard({
  businessId,
  bookId,
  name,
  createdAt,
  netBalance,
  totalIn,
  totalOut,
  totalTransactions = 0,
  totalInTransactions = 0,
  totalOutTransactions = 0,
  currency = "INR",
  onClick,
  onEdit,
  onDelete,
  onTransfer,
  book,
  showAmounts = true,
}: CashbookCardProps) {
  const { user } = useAuth()
  const createdDate = formatDate(createdAt, "Do-MMM-YYYY")
  const [editOpen, setEditOpen] = useState(false)
  const [transferOpen, setTransferOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const router = useRouter()
  
  const {
    data: userCashbookRole,
    isLoading: isLoadingCashbookRole,
    isError: isCashbookRoleError,
    error: cashbookRoleError,
  } = useCashbookMemberRole(book._id, user?._id || "")

  const {
    data: userRole,
    isLoading: isLoadingRole,
    isError: isRoleError,
    error: roleError,
  } = useCompanyMemberRole(businessId)

  const { bookTotals, isBookTotalsPending } = useGetBookTotals(bookId)

  const { totalTransactions: totalTransactionsFromAPI, isTransactionsPending } = useGetTransactionsByBook({
    bookId,
    pageSize: 1,
  })

  const [isHandlingAction, setIsHandlingAction] = useState(false)

  const handleCardClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement
    const isActionButton = target.closest("[data-action-button]")

    if (!isActionButton) {
      onClick?.()
      router.push(paths.dashboard.business.cashbookDetail(businessId, bookId))
    }
  }

  // Format currency based on the currency code
  const formatCurrency = (amount: number) => {
    return formatCurrencyAmount(amount, currency)
  }

  const formatAmountDisplay = (amount: number) =>
    showAmounts ? formatCurrency(amount) : MASKED_AMOUNT

  const formatNumber = (amount: number) => amount.toLocaleString("en-IN")

  // Calculate total transactions if not provided
  const calculatedTotalTransactions = totalTransactionsFromAPI || 0

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setEditOpen(true)
    setDropdownOpen(false)
    onEdit?.()
  }

  const handleTransferClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setTransferOpen(true)
    setDropdownOpen(false)
    onTransfer?.()
  }

  const handleTransferSuccess = () => {
    console.log("Transfer successful")
  }

  if (isLoadingRole) {
    return (
      <div className="flex items-center justify-center p-4 rounded-lg bg-background dark:bg-primary/40 border border-primary/40 shadow-md">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    )
  }

  if (isRoleError) {
    return (
      <div className="p-4 rounded-lg bg-background dark:bg-primary/40 border border-red-500/40 shadow-md">
        <p className="text-red-500">Error loading permissions</p>
      </div>
    )
  }

  const canDelete = hasPermission(
    {
      businessRole: userRole?.data.companyRole || "staff",
      cashbookRole: userCashbookRole?.data?.BookRole || "viewer",
    },
    "crud_cashbook",
    "D",
  )

  const canEdit = hasPermission(
    {
      businessRole: userRole?.data.companyRole || "staff",
      cashbookRole: userCashbookRole?.data?.BookRole || "admin",
    },
    "crud_cashbook",
    "U",
  )

  const canTransfer = hasPermission(
    {
      businessRole: userRole?.data.companyRole || "staff",
      cashbookRole: userCashbookRole?.data?.BookRole || "admin",
    },
    "crud_cashbook",
    "T",
  )

  return (
    <div
      className={cn(
        "group relative flex flex-col sm:flex-row items-start sm:items-center rounded-lg bg-background dark:bg-primary/40 p-4 transition-all duration-75 border border-primary/40 shadow-md dark:hover:bg-white/5 shrink-0 hover:cursor-pointer",
        { "border-red-700/65": netBalance < 0 },
      )}
      onClick={handleCardClick}
    >
      <div className="flex items-center w-full">
        {/* Currency Icon - Replaced Bookmark with CurrencyIcon */}
        <div
          className={cn(
            "sm:flex-shrink-0 mr-4 mb-3 sm:mb-0 p-3 rounded-full bg-primary/10 dark:bg-white/10 h-min flex items-center justify-center",
            { "bg-red-600/10": netBalance < 0 }
          )}
        >
          <CurrencyIcon 
            currencyCode={currency} 
            size={24}
            className={cn(
              netBalance < 0 ? "text-red-600 dark:text-red-400" : "text-primary dark:text-white"
            )}
          />
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col space-y-1 min-w-0">
          <div className="flex items-center justify-between w-full">
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 truncate">
                {name}
              </h3>

              <div className="flex items-center mt-1">
                <span className={cn("font-bold", netBalance >= 0 ? "text-green-600" : "text-red-600")}>
                  Balance: {formatAmountDisplay(netBalance)}
                </span>
              </div>
            </div>

            {/* Three-dot menu */}
            <div className="flex items-center gap-2 ml-4" data-action-button onClick={(e) => e.stopPropagation()}>
              <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
                <DropdownMenuTrigger asChild>
                  <button
                    className="p-2 text-gray-500 hover:text-blue-600 transition-colors disabled:opacity-50 group-hover:cursor-pointer"
                    aria-label="More options"
                    data-action-button
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg"
                  onClick={(e) => e.stopPropagation()}
                >
                  {canEdit && (
                    <DropdownMenuItem
                      onClick={handleEditClick}
                      className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                      data-action-button
                    >
                      <Edit className="h-4 w-4" />
                      <span>Edit</span>
                    </DropdownMenuItem>
                  )}

                  {canTransfer && (
                    <DropdownMenuItem
                      onClick={handleTransferClick}
                      className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                      data-action-button
                    >
                      <ArrowBigDown className="h-4 w-4" />
                      <span>Transfer Book</span>
                    </DropdownMenuItem>
                  )}

                  {canDelete && (
                    <>
                      <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700" />
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation()
                          setDeleteModalOpen(true)
                          setDropdownOpen(false)
                        }}
                        className="flex items-center gap-2 cursor-pointer text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                        data-action-button
                      >
                        <Trash2 className="h-4 w-4" />
                        <span>Delete</span>
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Edit Modal */}
              {canEdit && (
                <Sheet open={editOpen} onOpenChange={setEditOpen}>
                  <SheetContent
                    side="right"
                    className="overflow-y-scroll pb-4 w-full sm:min-w-1/2 lg:min-w-1/3 duration-75 transition-all"
                  >
                    <DialogTitle />
                    <EditCashbookForm onClose={() => setEditOpen(false)} businessId={businessId} cashbook={book} />
                  </SheetContent>
                </Sheet>
              )}

              {canTransfer && (
                <Sheet open={transferOpen} onOpenChange={setTransferOpen}>
                  <SheetContent
                    side="right"
                    className="overflow-y-scroll pb-4 w-full sm:min-w-1/2 lg:min-w-1/3 duration-75 transition-all"
                  >
                    <DialogTitle />
                    <TransferCashbookForm
                      bookId={bookId}
                      currentCompanyId={businessId}
                      bookName={name}
                      onClose={() => setTransferOpen(false)}
                      onSuccess={handleTransferSuccess}
                    />
                  </SheetContent>
                </Sheet>
              )}

              {/* Delete Modal */}
              {canDelete && (
                <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
                  <DialogContent className="max-w-md p-0 overflow-hidden border-none bg-transparent shadow-none">
                    <DialogHeader className="sr-only">
                      <DialogTitle>Move book to deleted books</DialogTitle>
                    </DialogHeader>
                    <Card className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                      <CardFooter className="w-full p-0">
                        <DeleteConfirmationForm
                          onClose={() => setDeleteModalOpen(false)}
                          id={book._id}
                          type="cashbook"
                          companyId={businessId}
                          itemName={name}
                        />
                      </CardFooter>
                    </Card>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>

          {/* Financial Summary */}
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm mt-2">
            <div className="flex items-center gap-1">
              <span className="text-green-600 font-medium">IN: {formatAmountDisplay(totalIn)}</span>
              {totalInTransactions > 0 && (
                <span className="text-xs text-green-500/80">({formatNumber(totalInTransactions)})</span>
              )}
            </div>
            <div className="flex items-center gap-1">
              <span className="text-red-600 font-medium">OUT: {formatAmountDisplay(totalOut)}</span>
              {totalOutTransactions > 0 && (
                <span className="text-xs text-red-500/80">({formatNumber(totalOutTransactions)})</span>
              )}
            </div>
          </div>

          {/* Timestamp and Currency */}
          <div className="mt-2 border-t border-dashed w-full pt-3 flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-3">
              <span>Created {createdDate}</span>
              <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                {/* <CurrencyIcon currencyCode={currency} size={12} /> */}
                {/* <span className="font-medium">{currency}</span> */}
              </div>
            </div>

            {/* Transaction Count Badge */}
            <div className="flex items-center gap-1">
              <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-blue-300 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium border border-blue-200 dark:border-blue-700">
                <List className="h-3 w-3" />
                <span>
                  {isTransactionsPending ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    `${formatNumber(calculatedTotalTransactions)} Transactions`
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}