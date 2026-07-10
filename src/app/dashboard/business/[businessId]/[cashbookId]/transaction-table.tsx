// "use client";

// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import {
//   ColumnDef,
//   flexRender,
//   getCoreRowModel,
//   useReactTable,
//   getSortedRowModel,
//   SortingState,
// } from "@tanstack/react-table";
// import { Transaction } from "@/interface";
// import { useState, useEffect } from "react";
// import { Input } from "@/components/ui/input";
// import { cn } from "@/lib/utils";

// interface DataTableProps {
//   data: Transaction[];
//   columns: ColumnDef<Transaction>[];
//   sortBy?: string;
//   sortOrder?: "asc" | "desc";
//   onSortChange?: (sortBy: string, sortOrder: "asc" | "desc") => void;
//   onSearch?: (searchTerm: string) => void;
//   searchTerm?: string;
//   canDelete?: boolean;
//   canEdit?: boolean;
// }

// export function TransactionsDataTable({
//   data,
//   columns,
//   sortBy: initialSortBy = "date",
//   sortOrder: initialSortOrder = "desc",
//   onSortChange,
//   onSearch,
//   searchTerm: initialSearchTerm = "",
//   canDelete,
//   canEdit,
// }: DataTableProps) {
//   const [sorting, setSorting] = useState<SortingState>([
//     { id: initialSortBy, desc: initialSortOrder === "desc" },
//   ]);
//   const [searchTerm, setSearchTerm] = useState(initialSearchTerm);

//   // Filter columns based on canEdit and canDelete props
//   const filteredColumns = columns.filter((column) => {
//     if (column.id === "edit-transaction") return canEdit;
//     if (column.id === "delete") return canDelete;
//     return true;
//   });

//   const table = useReactTable({
//     data,
//     columns: filteredColumns,
//     state: {
//       sorting,
//     },
//     onSortingChange: (newSorting) => {
//       // Handle both the value and function updater cases
//       const resolvedSorting =
//         typeof newSorting === "function" ? newSorting(sorting) : newSorting;

//       if (resolvedSorting.length === 0) {
//         // When trying to clear sorting, maintain the current sort
//         return;
//       }

//       const newSort = resolvedSorting[0];
//       const currentSort = sorting[0];

//       // Only update if the sorting actually changed
//       if (
//         !currentSort ||
//         newSort.id !== currentSort.id ||
//         newSort.desc !== currentSort.desc
//       ) {
//         setSorting(resolvedSorting);
//         if (onSortChange) {
//           onSortChange(newSort.id, newSort.desc ? "desc" : "asc");
//         }
//       }
//     },
//     getCoreRowModel: getCoreRowModel(),
//     getSortedRowModel: getSortedRowModel(),
//   });

//   // Sync with parent when props change
//   useEffect(() => {
//     setSorting([{ id: initialSortBy, desc: initialSortOrder === "desc" }]);
//   }, [initialSortBy, initialSortOrder]);

//   // Handle search input changes with debounce
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       if (onSearch) {
//         onSearch(searchTerm);
//       }
//     }, 500);

//     return () => clearTimeout(timer);
//   }, [searchTerm, onSearch]);

//   return (
//     <div className="space-y-4">
//       <div className="flex items-center justify-between">
//         {/* <Input
//           placeholder="Search description, remarks, or category..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="max-w-sm"
//         /> */}
//       </div>
//       <div className="rounded-md border">
//         <Table>
//           <TableHeader>
//             {table.getHeaderGroups().map((headerGroup) => (
//               <TableRow key={headerGroup.id}>
//                 {headerGroup.headers.map((header) => {
//                   return (
//                     <TableHead key={header.id}>
//                       {header.isPlaceholder ? null : (
//                         <div
//                           className={cn(
//                             "flex items-center justify-start gap-4",
//                             {
//                               "cursor-pointer select-none":
//                                 header.column.getCanSort(),
//                             }
//                           )}
//                           onClick={() => {
//                             if (header.column.getCanSort()) {
//                               const column = header.column;
//                               const isSorted = column.getIsSorted();

//                               // Determine new sort order
//                               let newSortOrder: "asc" | "desc" = "desc";
//                               if (isSorted === "asc") {
//                                 newSortOrder = "desc";
//                               } else if (isSorted === "desc") {
//                                 newSortOrder = "asc";
//                               } else {
//                                 newSortOrder = initialSortOrder;
//                               }

//                               // Manually set the sorting
//                               const newSorting = [
//                                 {
//                                   id: column.id,
//                                   desc: newSortOrder === "desc",
//                                 },
//                               ];

//                               setSorting(newSorting);
//                               if (onSortChange) {
//                                 onSortChange(column.id, newSortOrder);
//                               }
//                             }
//                           }}
//                         >
//                           {flexRender(
//                             header.column.columnDef.header,
//                             header.getContext()
//                           )}
//                           {{
//                             asc: " ↑",
//                             desc: " ↓",
//                           }[header.column.getIsSorted() as string] ?? null}
//                         </div>
//                       )}
//                     </TableHead>
//                   );
//                 })}
//               </TableRow>
//             ))}
//           </TableHeader>
//           <TableBody>
//             {table.getRowModel().rows?.length ? (
//               table.getRowModel().rows.map((row) => (
//                 <TableRow
//                   key={row.id}
//                   data-state={row.getIsSelected() && "selected"}
//                 >
//                   {row.getVisibleCells().map((cell) => (
//                     <TableCell key={cell.id}>
//                       {flexRender(
//                         cell.column.columnDef.cell,
//                         cell.getContext()
//                       )}
//                     </TableCell>
//                   ))}
//                 </TableRow>
//               ))
//             ) : (
//               <TableRow>
//                 <TableCell
//                   colSpan={filteredColumns.length}
//                   className="h-24 text-center"
//                 >
//                   No results.
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       </div>
//     </div>
//   );
// }


// ----2----

// app/dashboard/business/[businessId]/[cashbookId]/transaction-table.tsx
"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
  CellContext,
} from "@tanstack/react-table";
import { Transaction } from "@/interface";
import { useState, useEffect, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { TransferStatusBadge } from "@/components/badges/transfer-status-badge";
import { TransferActions } from "@/components/actions/transfer-actions";
import { Button } from "@/components/ui/button";
import { BadgeCheck } from "lucide-react";
import { useVerifyTransaction } from "@/services/transaction.service";
import { getTransactionUserName } from "@/lib/transaction-verify";
import { TransactionTableActions } from "@/components/transactions/transaction-table-actions";

interface DataTableProps {
  data: Transaction[];
  columns: ColumnDef<Transaction>[];
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  onSortChange?: (sortBy: string, sortOrder: "asc" | "desc") => void;
  onSearch?: (searchTerm: string) => void;
  searchTerm?: string;
  canDelete?: boolean;
  canEdit?: boolean;
  canVerify?: boolean;
  canManageTransfers?: boolean;
  currency?: string;
}

export function TransactionsDataTable({
  data,
  columns,
  sortBy: initialSortBy = "date",
  sortOrder: initialSortOrder = "desc",
  onSortChange,
  onSearch,
  searchTerm: initialSearchTerm = "",
  canDelete,
  canEdit,
  canVerify = false,
  canManageTransfers = false,
  currency = "USD",
}: DataTableProps) {
  const { verifyTransaction, isVerifyingTransaction } = useVerifyTransaction();
  const [sorting, setSorting] = useState<SortingState>([
    { id: initialSortBy, desc: initialSortOrder === "desc" },
  ]);
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);

  // Format date to show only date without time
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Modify columns: date cell + verified indicator
  const modifiedColumns = useMemo(() => {
    return columns.map(col => {
      if (col.id === "date" || ("accessorKey" in col && col.accessorKey === "date")) {
        return {
          ...col,
          cell: ({ row }: CellContext<Transaction, unknown>) => {
            const dateValue = row.original.date;
            if (!dateValue) return null;
            const verifier = getTransactionUserName(row.original.verifiedBy);
            return (
              <div className="flex flex-col gap-1 px-1">
                <span>{formatDate(dateValue)}</span>
                {row.original.isVerified && verifier && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700">
                    <BadgeCheck className="h-3 w-3" />
                    {verifier}
                  </span>
                )}
              </div>
            );
          },
        };
      }
      return col;
    });
  }, [columns]);

  // Create enhanced columns with transfer functionality
  const enhancedColumns = useMemo(() => {
    // Remove legacy action columns and transfer columns
    let baseColumns = modifiedColumns.filter((column) => {
      if (["edit-transaction", "view-details", "delete"].includes(column.id || "")) {
        return false;
      }
      return !["transfer-status", "transfer-actions"].includes(column.id || "");
    });

    const newColumns = [...baseColumns];

    newColumns.push({
      id: "actions",
      enableSorting: false,
      header: "Action",
      cell: ({ row }) => {
        const transaction = row.original;
        const isPendingTransfer =
          transaction.subType === "transfer" && transaction.status === "pending";

        return (
          <TransactionTableActions
            transaction={transaction}
            canEdit={canEdit}
            canDelete={canDelete}
            showEditDelete={!isPendingTransfer}
          />
        );
      },
    });

    if (canVerify) {
      newColumns.push({
        id: "verify-transaction",
        header: "Verify",
        cell: ({ row }) => {
          const tx = row.original;
          if (tx.isVerified) {
            return (
              <span className="text-xs text-emerald-600 font-medium">Verified</span>
            );
          }
          return (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 text-emerald-700 border-emerald-200 hover:bg-emerald-50"
              disabled={isVerifyingTransaction}
              onClick={() => verifyTransaction(tx._id)}
            >
              <BadgeCheck className="h-3.5 w-3.5 mr-1" />
              Verify
            </Button>
          );
        },
      });
    }

    // Add transfer status column
    const amountIndex = newColumns.findIndex(col => 
      col.id === "amount" || col.header === "Amount"
    );
    
    if (amountIndex !== -1) {
      newColumns.splice(amountIndex + 1, 0, {
        id: "transfer-status",
        header: "Status",
        cell: ({ row }) => {
          const transaction = row.original;
          
          if (transaction.subType === "transfer") {
            return (
              <TransferStatusBadge 
                status={transaction.status as "pending" | "approved" | "rejected"} 
                size="sm"
              />
            );
          }
          
          return <span className="text-gray-400 text-sm">—</span>;
        },
      });
    }

    return newColumns;
  }, [modifiedColumns, canEdit, canDelete, canVerify, canManageTransfers, currency, isVerifyingTransaction, verifyTransaction]);

  const table = useReactTable({
    data,
    columns: enhancedColumns,
    state: {
      sorting,
    },
    onSortingChange: (newSorting) => {
      const resolvedSorting =
        typeof newSorting === "function" ? newSorting(sorting) : newSorting;

      if (resolvedSorting.length === 0) {
        return;
      }

      const newSort = resolvedSorting[0];
      const currentSort = sorting[0];

      if (
        !currentSort ||
        newSort.id !== currentSort.id ||
        newSort.desc !== currentSort.desc
      ) {
        setSorting(resolvedSorting);
        if (onSortChange) {
          onSortChange(newSort.id, newSort.desc ? "desc" : "asc");
        }
      }
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  useEffect(() => {
    setSorting([{ id: initialSortBy, desc: initialSortOrder === "desc" }]);
  }, [initialSortBy, initialSortOrder]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (onSearch) {
        onSearch(searchTerm);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, onSearch]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="w-full sm:w-auto">
          {/* <Input
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          /> */}
        </div>
      </div>

      <div className="rounded-md border overflow-hidden min-w-0 max-w-full">
          <Table>
            <TableHeader className="bg-gray-50">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    // Skip rendering header for empty headers (like transfer-actions)
                    if (header.isPlaceholder || !header.column.columnDef.header) {
                      return (
                        <TableHead key={header.id} className="whitespace-nowrap w-0 p-0">
                          {/* Empty header cell */}
                        </TableHead>
                      );
                    }
                    
                    return (
                      <TableHead key={header.id} className="whitespace-nowrap">
                        <div
                          className={cn(
                            "flex items-center justify-start gap-1",
                            {
                              "cursor-pointer select-none":
                                header.column.getCanSort(),
                            }
                          )}
                          onClick={() => {
                            if (header.column.getCanSort()) {
                              const column = header.column;
                              const isSorted = column.getIsSorted();

                              let newSortOrder: "asc" | "desc" = "desc";
                              if (isSorted === "asc") {
                                newSortOrder = "desc";
                              } else if (isSorted === "desc") {
                                newSortOrder = "asc";
                              } else {
                                newSortOrder = initialSortOrder;
                              }

                              const newSorting = [
                                {
                                  id: column.id,
                                  desc: newSortOrder === "desc",
                                },
                              ];

                              setSorting(newSorting);
                              if (onSortChange) {
                                onSortChange(column.id, newSortOrder);
                              }
                            }
                          }}
                        >
                          <span className="font-medium text-gray-700">
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                          </span>
                          {{
                            asc: " ↑",
                            desc: " ↓",
                          }[header.column.getIsSorted() as string] ?? null}
                        </div>
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => {
                  const transaction = row.original;
                  const isTransfer = transaction.subType === "transfer";
                  const isPending = isTransfer && transaction.status === "pending";
                  const isTargetBook = transaction.type === "cash_in";
                  const showActions = isTransfer && isPending && isTargetBook && canManageTransfers;
                  const isResolved = isTransfer && (transaction.status === "approved" || transaction.status === "rejected");
                  
                  return (
                    <React.Fragment key={row.id}>
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                        className={cn(
                          isTransfer ? "bg-gray-50/50 hover:bg-gray-100" : "",
                          isPending ? "border-l-4 border-l-amber-400" : "",
                          isResolved ? (transaction.status === "approved" ? "border-l-4 border-l-green-400" : "border-l-4 border-l-red-400") : "",
                          showActions ? "border-b-0" : ""
                        )}
                      >
                        {row.getVisibleCells().map((cell) => {
                          return (
                            <TableCell key={cell.id} className="py-3">
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                      
                      {/* Actions row for pending transfers */}
                      {showActions && (
                        <TableRow 
                          key={`${row.id}-actions`}
                          className="bg-gray-50/30 hover:bg-gray-50/50"
                        >
                          <TableCell colSpan={enhancedColumns.length} className="py-2 px-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <span className="font-medium">Transfer Action Required:</span>
                                <span>Approve or reject this transfer request</span>
                                <span className="text-xs text-gray-500 ml-2">
                                  (Edit/Delete will be available after approval/rejection)
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <TransferActions
                                  transferId={transaction._id}
                                  status={transaction.status as "pending" | "approved" | "rejected"}
                                  sourceBookId={transaction.book}
                                  targetBookId={transaction.targetBookId || ""}
                                  amount={transaction.amount}
                                  currency={currency}
                                  canApprove={isTargetBook}
                                  canReject={isTargetBook}
                                />
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                      
                      {/* Information row for resolved transfers */}
                      {isTransfer && isResolved && (
                        <TableRow 
                          key={`${row.id}-resolved-info`}
                          className="bg-gray-50/30 hover:bg-gray-50/50"
                        >
                          <TableCell colSpan={enhancedColumns.length} className="py-2 px-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2 text-sm">
                                {transaction.status === "approved" ? (
                                  <span className="text-green-600 font-medium">
                                    ✓ Transfer approved. Edit/Delete options are now available.
                                  </span>
                                ) : (
                                  <span className="text-red-600 font-medium">
                                    ✗ Transfer rejected. Edit/Delete options are now available.
                                  </span>
                                )}
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={enhancedColumns.length}
                    className="h-24 text-center"
                  >
                    <div className="text-center py-8">
                      <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                      </svg>
                      <h3 className="mt-4 text-sm font-medium text-gray-900">No transactions</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Get started by creating a new transaction.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
      </div>
    </div>
  );
}