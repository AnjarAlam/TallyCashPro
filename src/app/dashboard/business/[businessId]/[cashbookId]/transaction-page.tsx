// // "use client";
// // import { useGetTransactionsByBook } from "@/services";
// // import { TransactionsDataTable } from "./transaction-table";
// // import { columns } from "./coloumns";
// // import { useState } from "react";

// // export function TransactionsPage({
// //   bookId,
// //   canDelete,
// //   canEdit,
// // }: {
// //   bookId: string;
// //   canDelete?: boolean;
// //   canEdit?: boolean;
// // }) {
// //   const [sortBy, setSortBy] = useState("date");
// //   const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
// //   const [searchTerm, setSearchTerm] = useState("");

// //   const { transactions, isTransactionsPending, refetchTransactions } =
// //     useGetTransactionsByBook({
// //       bookId: bookId,
// //       pageNumber: 1,
// //       pageSize: 100,
// //       sortBy,
// //       sortOrder,
// //       // searchTerm: searchTerm || undefined, // Only send if not empty
// //     });

// //   const handleSortChange = (
// //     newSortBy: string,
// //     newSortOrder: "asc" | "desc"
// //   ) => {
// //     // Only update if the sorting actually changed
// //     if (sortBy !== newSortBy || sortOrder !== newSortOrder) {
// //       setSortBy(newSortBy);
// //       setSortOrder(newSortOrder);
// //     }
// //   };

// //   const handleSearch = (term: string) => {
// //     setSearchTerm(term);
// //   };

// //   if (isTransactionsPending) return <div>Loading...</div>;

// //   return (
// //     <div className="container mx-auto py-4">
// //       <TransactionsDataTable
// //         canDelete={canDelete}
// //         canEdit={canEdit}
// //         data={transactions || []}
// //         columns={columns}
// //         sortBy={sortBy}
// //         sortOrder={sortOrder}
// //         onSortChange={handleSortChange}
// //         onSearch={handleSearch}
// //         searchTerm={searchTerm}
// //       />
// //     </div>
// //   );
// // }




// // ---1---

// // app/dashboard/business/[businessId]/[cashbookId]/transaction-page.tsx
// "use client";
// import { useGetTransactionsByBook } from "@/services";
// import { TransactionsDataTable } from "./transaction-table";
// import { columns } from "./coloumns";
// import { useState } from "react";

// interface TransactionsPageProps {
//   bookId: string;
//   canDelete?: boolean;
//   canEdit?: boolean;
//   currency?: string;
//   filters?: {
//     dateFrom?: string;
//     dateTo?: string;
//     category?: string;
//     paymentMode?: string;
//     user?: string;
//   };
// }

// export function TransactionsPage({
//   bookId,
//   canDelete,
//   canEdit,
//   filters,
// }: TransactionsPageProps) {
//   const [sortBy, setSortBy] = useState("date");
//   const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
//   const [searchTerm, setSearchTerm] = useState("");

//   const { transactions, isTransactionsPending, refetchTransactions } =
//     useGetTransactionsByBook({
//       bookId: bookId,
//       pageNumber: 1,
//       pageSize: 100,
//       sortBy,
//       sortOrder,
//       // Pass filter parameters to the hook
//       ...filters,
//     });

//   const handleSortChange = (
//     newSortBy: string,
//     newSortOrder: "asc" | "desc"
//   ) => {
//     // Only update if the sorting actually changed
//     if (sortBy !== newSortBy || sortOrder !== newSortOrder) {
//       setSortBy(newSortBy);
//       setSortOrder(newSortOrder);
//     }
//   };

//   const handleSearch = (term: string) => {
//     setSearchTerm(term);
//     // Note: If you want to add search to API, you'll need to update the hook
//   };

//   if (isTransactionsPending) return (
//     <div className="flex items-center justify-center p-8">
//       <div className="text-center">
//         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
//         <p className="mt-2 text-sm text-gray-600">Loading transactions...</p>
//       </div>
//     </div>
//   );

//   return (
//     <div className="container mx-auto py-4">
//       <TransactionsDataTable
//         canDelete={canDelete}
//         canEdit={canEdit}
//         data={transactions || []}
//         columns={columns}
//         sortBy={sortBy}
//         sortOrder={sortOrder}
//         onSortChange={handleSortChange}
//         onSearch={handleSearch}
//         searchTerm={searchTerm}
//       />
      
//       {/* Empty State */}
//       {transactions?.length === 0 && (
//         <div className="text-center py-12">
//           <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
//             <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
//             </svg>
//           </div>
//           <h3 className="text-lg font-medium text-gray-900 mb-2">
//             {filters ? 'No transactions match your filters' : 'No transactions yet'}
//           </h3>
//           <p className="text-gray-500 mb-6 max-w-md mx-auto">
//             {filters 
//               ? 'Try adjusting your filter criteria to see more results.'
//               : 'Get started by adding your first transaction to this cashbook.'}
//           </p>
//         </div>
//       )}
//     </div>
//   );
// }


// ---2---

// app/dashboard/business/[businessId]/[cashbookId]/transaction-page.tsx
"use client";
import { useGetTransactionsByBook } from "@/services";
import { TransactionsDataTable } from "./transaction-table";
import { columns } from "./coloumns";
import { useState, useMemo } from "react";
import { TransactionMobileList } from "@/components/transactions/transaction-mobile-list";

interface TransactionsPageProps {
  bookId: string;
  canDelete?: boolean;
  canEdit?: boolean;
  canVerify?: boolean;
  canManageTransfers?: boolean;
  currency?: string;
  filters?: {
    dateFrom?: string;
    dateTo?: string;
    category?: string;
    paymentMode?: string;
    user?: string;
  };
}

export function TransactionsPage({
  bookId,
  canDelete,
  canEdit,
  canVerify = false,
  canManageTransfers = false,
  filters,
  currency = "USD",
}: TransactionsPageProps) {
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [searchTerm, setSearchTerm] = useState("");

  const { transactions, isTransactionsPending, refetchTransactions } =
    useGetTransactionsByBook({
      bookId: bookId,
      pageNumber: 1,
      pageSize: 100,
      sortBy,
      sortOrder,
      ...filters,
    });

  const handleSortChange = (
    newSortBy: string,
    newSortOrder: "asc" | "desc"
  ) => {
    if (sortBy !== newSortBy || sortOrder !== newSortOrder) {
      setSortBy(newSortBy);
      setSortOrder(newSortOrder);
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  // Count pending transfers for the info banner
  const pendingTransferCount = useMemo(() => {
    return transactions?.filter(
      t => t.subType === "transfer" && t.status === "pending"
    ).length || 0;
  }, [transactions]);

  if (isTransactionsPending) return (
    <div className="flex items-center justify-center p-8">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-2 text-sm text-gray-600">Loading transactions...</p>
      </div>
    </div>
  );

  return (
    <div className="w-full min-w-0 max-w-full py-4">
      {/* Transfer Info Banner - Always show if there are pending transfers */}
      {/* {pendingTransferCount > 0 && (
        <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center">
                <svg className="h-4 w-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-medium text-amber-800">
                {pendingTransferCount} Pending Transfer{pendingTransferCount > 1 ? 's' : ''}
              </h4>
              <p className="text-sm text-amber-700 mt-1">
                You have pending transfer requests that need approval. Use the Accept/Reject buttons to manage them.
              </p>
            </div>
          </div>
        </div>
      )} */}

      <TransactionMobileList
        transactions={transactions || []}
        currency={currency}
        canVerify={canVerify}
        canEdit={canEdit}
        canDelete={canDelete}
      />

      <div className="hidden md:block">
        <TransactionsDataTable
          canDelete={canDelete}
          canEdit={canEdit}
          canVerify={canVerify}
          canManageTransfers={canManageTransfers}
          data={transactions || []}
          columns={columns}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortChange={handleSortChange}
          onSearch={handleSearch}
          searchTerm={searchTerm}
          currency={currency}
        />
      </div>
      
      {/* Empty State */}
      {transactions?.length === 0 && (
        <div className="text-center py-12">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {filters ? 'No transactions match your filters' : 'No transactions yet'}
          </h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            {filters 
              ? 'Try adjusting your filter criteria to see more results.'
              : 'Get started by adding your first transaction to this cashbook.'}
          </p>
        </div>
      )}
    </div>
  );
}