import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios"; // Adjust import path as needed
import { toast } from "sonner"; // or your preferred toast library
import { APIS } from "@/constants/api";
import { CreateTransactionDto, CreateTransactionResponse, GetTransactionsParams, Transaction, TransactionsByBookResponse, UpdateTransactionDto, UpdateTransactionResponse } from "@/interface";
import { isCashTransactionType, playTransactionSound } from "@/lib/transaction-sound";



export const useCreateTransaction = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, isError, error } = useMutation<
    CreateTransactionResponse,
    Error,
    CreateTransactionDto
  >({
    mutationKey: [APIS.transaction.new.Id],
    mutationFn: async (payload: CreateTransactionDto) => {
      const res = await axiosInstance.post(
        APIS.transaction.new.Url,
        payload
      );
      return res.data;
    },
    onSuccess: (res, variables) => {
      if (isCashTransactionType(variables.type)) {
        playTransactionSound();
      }

      queryClient.invalidateQueries({
        queryKey: [APIS.Cashbook.listByBusiness.Id], // If you need to update cashbook balances
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: [APIS.transaction.list.Id], // If you need to update cashbook balances
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: [APIS.Cashbook.transactionCounts.Id], // If you need to update cashbook balances
        exact: false,
      });
      toast.success(res.message);
      if (typeof window !== "undefined") {
        window.location.reload();
      }
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create transaction");
    },
  });

  return {
    createTransaction: mutate,
    isCreatingTransaction: isPending,
    isCreateTransactionError: isError,
    createTransactionError: error,
  };
};


// export const useGetTransactionsByBook = (
//     params: GetTransactionsParams
// ) => {
//     const {
//         bookId,
//         pageSize = 10,
//         sortBy = "date",
//         sortOrder = "desc",
//     } = params;

//     const {
//         data,
//         isLoading,
//         isError,
//         error,
//         fetchNextPage,
//         hasNextPage,
//         isFetchingNextPage,
//         refetch,
//         isRefetching,
//     } = useInfiniteQuery<TransactionsByBookResponse, Error>({
//         queryKey: [
//             APIS.transaction.list.Id,
//             bookId,
//             pageSize,
//             sortBy,
//             sortOrder,
//         ],
//         queryFn: async ({ pageParam = 1 }) => {
//             const response = await axiosInstance.get(
//                 APIS.transaction.list.Url(bookId),
//                 {
//                     params: {
//                         pageNumber: pageParam,
//                         pageSize,
//                         sortBy,
//                         sortOrder,
//                     },
//                 }
//             );

//             if (!response?.data) {
//                 throw new Error("Failed to fetch transactions");
//             }
//             return response.data;
//         },
//         initialPageParam: 1,
//         getNextPageParam: (lastPage) => {
//             const { pageNumber, totalPages } = lastPage.data;
//             return pageNumber < totalPages ? pageNumber + 1 : undefined;
//         },
//         enabled: !!bookId,
//         retry: false,
//     });

//     const transactions = data?.pages.flatMap((page) => page.data.transactions) || [];

//     return {
//         transactions,
//         isTransactionsPending: isLoading || isRefetching,
//         isTransactionsError: isError,
//         transactionsError: error,
//         refetchTransactions: refetch,
//         fetchNextPage,
//         hasNextPage,
//         isFetchingNextPage,
//         totalTransactions: data?.pages[0]?.data.totalTransactions || 0,
//         totalPages: data?.pages[0]?.data.totalPages || 0,
//         currentSort: { sortBy, sortOrder }, // Return current sorting for UI reference
//     };
// };

// services/cashbook.service.ts - Updated version

export const useGetTransactionsByBook = (
  params: GetTransactionsParams
) => {
  const {
    bookId,
    pageSize = 10,
    sortBy = "date",
    sortOrder = "desc",
    // Filter parameters
    dateFrom,
    dateTo,
    category,
    paymentMode,
    user,
  } = params;

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isRefetching,
  } = useInfiniteQuery<TransactionsByBookResponse, Error>({
    queryKey: [
      APIS.transaction.list.Id,
      bookId,
      pageSize,
      sortBy,
      sortOrder,
      // Include filters in query key for cache management
      dateFrom,
      dateTo,
      category,
      paymentMode,
      user,
    ],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await axiosInstance.get(
        APIS.transaction.list.Url(bookId),
        {
          params: {
            pageNumber: pageParam,
            pageSize,
            sortBy,
            sortOrder,
            // Pass filter parameters to API
            ...(dateFrom && { dateFrom }),
            ...(dateTo && { dateTo }),
            ...(category && { category }),
            ...(paymentMode && { paymentMode }),
            ...(user && { user }),
          },
        }
      );

      if (!response?.data) {
        throw new Error("Failed to fetch transactions");
      }
      return response.data;
    },

    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { pageNumber, totalPages } = lastPage.data;
      return pageNumber < totalPages ? pageNumber + 1 : undefined;
    },
    enabled: !!bookId,
    retry: false,
  });

  const transactions = data?.pages.flatMap((page) => page.data.transactions) || [];

  // Extract global analytics from first page
  const globalAnalytics = data?.pages[0]?.data.globalAnalytics || {
    totalCashIn: 0,
    totalCashOut: 0,
    netBalance: 0,
    currentBalance: 0,
  };

  // Get currency from first transaction if available
  const currency = transactions[0]?.bookDetails?.currency || "USD";

  return {
    transactions,
    globalAnalytics,
    currency,
    isTransactionsPending: isLoading || isRefetching,
    isTransactionsError: isError,
    transactionsError: error,
    refetchTransactions: refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    totalTransactions: data?.pages[0]?.data.totalTransactions || 0,
    totalPages: data?.pages[0]?.data.totalPages || 0,
    currentSort: { sortBy, sortOrder },
  };
};


export const useGetTransaction = (id: string) => {
  const {
    isError,
    error,
    data,
    isLoading,
    refetch,
    isRefetching,
  } = useQuery<Transaction, Error>({
    queryKey: [APIS.transaction.view.Id, id],
    queryFn: async () => {


      const response = await axiosInstance.get(APIS.transaction.view.Url(id));

      if (response?.data?.data) return response.data.data;
      else throw new Error(response.data.message || "Failed to fetch transaction");
    },
    retry: false,
    enabled: !!id, // Only run the query if id exists
  });

  return {
    refetchTransaction: refetch,
    transactionData: data,
    isTransactionPending: isLoading || isRefetching,
    isTransactionError: isError,
    transactionError: error,
  };
};

interface VerifyTransactionResponse {
  message: string;
  data: { updatedCount: number };
}

export const useVerifyTransaction = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, isError, error } = useMutation<
    VerifyTransactionResponse,
    Error,
    string
  >({
    mutationKey: [APIS.transaction.verify.Id],
    mutationFn: async (transactionId: string) => {
      const res = await axiosInstance.post(
        APIS.transaction.verify.Url(transactionId)
      );
      return res.data;
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === APIS.transaction.list.Id,
      });
      queryClient.invalidateQueries({
        queryKey: [APIS.Cashbook.transactionCounts.Id],
        exact: false,
      });
      const count = res.data?.updatedCount ?? 0;
      toast.success(
        count > 0
          ? `${count} transaction${count === 1 ? "" : "s"} verified`
          : res.message || "Transactions verified"
      );
      if (typeof window !== "undefined") {
        window.location.reload();
      }
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to verify transactions");
    },
  });

  return {
    verifyTransaction: mutate,
    isVerifyingTransaction: isPending,
    isVerifyTransactionError: isError,
    verifyTransactionError: error,
  };
};

export const useUpdateTransaction = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, isError, error } = useMutation<
    UpdateTransactionResponse,
    Error,
    { id: string; data: UpdateTransactionDto }
  >({
    mutationKey: [APIS.transaction.update.Id],
    mutationFn: async ({ id, data }) => {
      const res = await axiosInstance.patch(
        `${APIS.transaction.update.Url(id)}`,
        data
      );
      return res.data;
    },
    onSuccess: (res) => {
      // Invalidate relevant queries after successful update
      queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey[0] === APIS.transaction.list.Id,
      });
      queryClient.invalidateQueries({
        queryKey: [APIS.transaction.view.Id], // Invalidate single transaction cache
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: [APIS.Cashbook.listByBusiness.Id], // If you need to update cashbook balances
        exact: false,
      });

      queryClient.invalidateQueries({
        queryKey: [APIS.Cashbook.transactionCounts.Id], // If you need to update cashbook balances
        exact: false,
      });
      toast.success(res.message || "Transaction updated successfully");
      if (typeof window !== "undefined") {
        window.location.reload();
      }
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update transaction");
    },
  });

  return {
    updateTransaction: mutate,
    isUpdatingTransaction: isPending,
    isUpdateTransactionError: isError,
    updateTransactionError: error,
  };
};



interface DeleteTransactionResponse {
  success: boolean;
  message: string;
}

function invalidateTransactionQueries(
  queryClient: ReturnType<typeof useQueryClient>,
  bookId?: string,
) {
  queryClient.invalidateQueries({
    predicate: (query) => query.queryKey[0] === APIS.transaction.list.Id,
  });
  queryClient.invalidateQueries({
    queryKey: [APIS.Cashbook.listByBusiness.Id],
    exact: false,
  });
  queryClient.invalidateQueries({
    queryKey: [APIS.Cashbook.transactionCounts.Id],
    exact: false,
  });
  queryClient.invalidateQueries({
    queryKey: [APIS.transaction.bin.list.Id],
    exact: false,
  });
  if (bookId) {
    queryClient.invalidateQueries({
      queryKey: [APIS.transaction.bin.deletedByBook.Id, bookId],
    });
  }
}

/** Move transaction to recycle bin (soft delete). */
export const useDeleteTransaction = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, isError, error } = useMutation<
    DeleteTransactionResponse,
    Error,
    string
  >({
    mutationFn: async (transactionId: string) => {
      const response = await axiosInstance.delete(
        APIS.transaction.bin.softDelete.Url(transactionId),
      );

      if (response?.data) {
        return response.data;
      }
      throw new Error("Failed to move transaction to recycle bin");
    },
    onSuccess: (res) => {
      invalidateTransactionQueries(queryClient);
      if (typeof window !== "undefined") {
        window.location.reload();
      }
    },
    onError: (err: Error) => {
      console.error("Transaction soft delete failed:", err.message);
    },
  });

  return {
    deleteTransaction: mutate,
    isDeletingTransaction: isPending,
    isDeleteTransactionError: isError,
    deleteTransactionError: error,
  };
};

/** Permanently delete a transaction (from recycle bin). */
export const useHardDeleteTransaction = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, isError, error } = useMutation<
    DeleteTransactionResponse,
    Error,
    { transactionId: string; bookId?: string }
  >({
    mutationKey: [APIS.transaction.delete.Id],
    mutationFn: async ({ transactionId }) => {
      const response = await axiosInstance.delete(
        APIS.transaction.delete.Url(transactionId),
      );

      if (response?.data) {
        return response.data;
      }
      throw new Error("Failed to permanently delete transaction");
    },
    onSuccess: (_res, { bookId }) => {
      invalidateTransactionQueries(queryClient, bookId);
      if (typeof window !== "undefined") {
        window.location.reload();
      }
    },
    onError: (err: Error) => {
      console.error("Permanent transaction delete failed:", err.message);
    },
  });

  return {
    hardDeleteTransaction: mutate,
    isHardDeletingTransaction: isPending,
    isHardDeleteTransactionError: isError,
    hardDeleteTransactionError: error,
  };
};

export const useRestoreTransaction = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, isError, error } = useMutation<
    DeleteTransactionResponse,
    Error,
    { transactionId: string; bookId?: string }
  >({
    mutationKey: [APIS.transaction.bin.restore.Id],
    mutationFn: async ({ transactionId }) => {
      const response = await axiosInstance.patch(
        APIS.transaction.bin.restore.Url(transactionId),
      );

      if (response?.data) {
        return response.data;
      }
      throw new Error("Failed to restore transaction");
    },
    onSuccess: (res, { bookId }) => {
      invalidateTransactionQueries(queryClient, bookId);
      toast.success(res.message || "Transaction restored successfully");
      if (typeof window !== "undefined") {
        window.location.reload();
      }
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to restore transaction");
    },
  });

  return {
    restoreTransaction: mutate,
    isRestoringTransaction: isPending,
    isRestoreTransactionError: isError,
    restoreTransactionError: error,
  };
};

export const useGetDeletedTransactionsByBook = (
  bookId: string,
  enabled = true,
) => {
  const { data, isLoading, isError, error, refetch, isRefetching } = useQuery<
    { data: Transaction[]; message?: string },
    Error
  >({
    queryKey: [APIS.transaction.bin.deletedByBook.Id, bookId],
    queryFn: async () => {
      const response = await axiosInstance.get(
        APIS.transaction.bin.deletedByBook.Url(bookId),
      );

      if (response?.data) {
        return response.data as { data: Transaction[]; message?: string };
      }
      throw new Error("Failed to fetch deleted transactions");
    },
    enabled: !!bookId && enabled,
    retry: false,
  });

  return {
    deletedTransactions: data?.data ?? [],
    isDeletedTransactionsPending: isLoading || isRefetching,
    isDeletedTransactionsError: isError,
    deletedTransactionsError: error,
    refetchDeletedTransactions: refetch,
  };
};



interface GetTransactionsSummaryParams {
  bookId: string;
  dateFrom?: string;
  dateTo?: string;
  category?: string;
  paymentMode?: string;
  user?: string;
}

export const useGetTransactionsSummary = (params: GetTransactionsSummaryParams) => {
  const {
    bookId,
    dateFrom,
    dateTo,
    category,
    paymentMode,
    user,
  } = params;

  return useQuery({
    queryKey: [
      APIS.transaction.list.Id,
      bookId,
      dateFrom,
      dateTo,
      category,
      paymentMode,
      user,
    ],
    queryFn: async () => {
      const response = await axiosInstance.get(
        APIS.transaction.list.Url(bookId),
        {
          params: {
            ...(dateFrom && { dateFrom }),
            ...(dateTo && { dateTo }),
            ...(category && { category }),
            ...(paymentMode && { paymentMode }),
            ...(user && { user }),
          },
        }
      );

      if (!response?.data) {
        throw new Error("Failed to fetch transactions summary");
      }
      return response.data;
    },
    enabled: !!bookId,
    retry: false,
  });
};