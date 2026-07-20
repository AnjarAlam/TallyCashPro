// Cashbook Hooks
import { APIS } from "@/constants/api";
import { BookTotalsResponse, Cashbook, CashbookListResponse, CreateCashbookDto, CreateCashbookResponse, UpdateCashbookDto } from "@/interface";
import { axiosInstance } from "@/lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// Add this interface to your existing interfaces or create a new one
export interface TransferCashbookDto {
  bookId: string;
  targetCompanyId: string;
  transferReason?: string;
}

export interface TransferCashbookResponse {
  status: number;
  message: string;
  source: string;
  data?: any;
}

export const useCreateCashbook = () => {
    const queryClient = useQueryClient();

    const { mutate, isPending, isError, error } = useMutation<
        CreateCashbookResponse,
        Error,
        CreateCashbookDto
    >({
        mutationKey: [APIS.Cashbook.createByBusiness.Id],
        mutationFn: async (payload: CreateCashbookDto) => {
            const { companyId, ...rest } = payload;
            const res = await axiosInstance.post(
                APIS.Cashbook.createByBusiness.Url(payload.companyId),
                rest
            );
            return res.data;
        },
        onSuccess: (res) => {
            queryClient.invalidateQueries({
                queryKey: [APIS.Cashbook.listByBusiness.Id],
                exact: false
            });
            toast.success(res.message);
        },
        onError: (error) => {
            toast.error(error.message || "Failed to create cashbook");
        },
    });

    return {
        createCashbook: mutate,
        isCreatingCashbook: isPending,
        isCreateCashbookError: isError,
        createCashbookError: error,
    };
};

export const useUpdateCashbook = () => {
    const queryClient = useQueryClient();

    const { mutate, isPending, isError, error } = useMutation<
        CreateCashbookResponse,
        Error,
        UpdateCashbookDto
    >({
        mutationKey: [APIS.Cashbook.updateById.Id],
        mutationFn: async (payload: UpdateCashbookDto) => {
            const { companyId, ...rest } = payload;
            const res = await axiosInstance.patch(
                APIS.Cashbook.updateById.Url(payload.companyId, payload.bookId),
                rest
            );
            return res.data;
        },
        onSuccess: (res) => {
            queryClient.invalidateQueries({
                queryKey: [APIS.Cashbook.listByBusiness.Id],
                exact: false
            });
            toast.success(res.message);
            if (typeof window !== "undefined") {
                window.location.reload();
            }
        },
        onError: (error) => {
            toast.error(error.message || "Failed to Update cashbook");
        },
    });

    return {
        updateCashbook: mutate,
        isUpdatingCashbook: isPending,
        isUpdateCashbookError: isError,
        updateCashbookError: error,
    };
};

/**
 * Mobile uses GET member-books/:companyId — books are sorted by assignment `order`
 * (same field as member-book relation: { order, book, BookRole }).
 * Web merges that order with user-books totals for card display.
 */
export const mergeMemberBooksOrderWithTotals = (
    memberBooks: Cashbook[],
    userBooks: Cashbook[],
): Cashbook[] => {
    const totalsById = new Map(userBooks.map((book) => [book._id, book]));
    const merged: Cashbook[] = [];

    for (const memberBook of memberBooks) {
        const totals = totalsById.get(memberBook._id);
        totalsById.delete(memberBook._id);

        merged.push({
            ...(totals ?? {
                totalIn: 0,
                totalOut: 0,
            }),
            ...memberBook,
            order: memberBook.order ?? totals?.order,
            bookRole:
                memberBook.bookRole ??
                memberBook.role ??
                totals?.bookRole ??
                totals?.role,
            totalIn: totals?.totalIn ?? memberBook.totalIn ?? 0,
            totalOut: totals?.totalOut ?? memberBook.totalOut ?? 0,
        });
    }

    totalsById.forEach((book) => merged.push(book));

    return merged.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
};

export const useGetCashbookList = (companyId: string, searchText?: string) => {
    const trimmedSearch = searchText?.trim() || undefined;

    const {
        data,
        isLoading,
        isError,
        error,
        refetch,
        isRefetching,
    } = useQuery<CashbookListResponse, Error>({
        queryKey: [APIS.Cashbook.listByBusiness.Id, companyId, trimmedSearch],
        queryFn: async () => {
            const userBooksResponse = await axiosInstance.get(
                APIS.Cashbook.listByBusiness.Url(companyId, trimmedSearch),
            );
            const userBooksPayload = userBooksResponse?.data as CashbookListResponse;

            if (!userBooksPayload) {
                throw new Error("Failed to fetch cashbook list");
            }

            const userBooks = userBooksPayload.data ?? [];

            // Search: user-books already filters server-side — do not merge full member-books list
            if (trimmedSearch) {
                const memberBooksResponse = await axiosInstance.get<{ data: Cashbook[] }>(
                    APIS.CompanyMemberBooks.getMemberBooks.Url(companyId),
                );
                const orderById = new Map(
                    (memberBooksResponse?.data?.data ?? []).map((book) => [
                        book._id,
                        book.order ?? 0,
                    ]),
                );

                return {
                    ...userBooksPayload,
                    data: [...userBooks].sort(
                        (a, b) =>
                            (orderById.get(a._id) ?? 0) - (orderById.get(b._id) ?? 0),
                    ),
                };
            }

            const memberBooksResponse = await axiosInstance.get<{ data: Cashbook[] }>(
                APIS.CompanyMemberBooks.getMemberBooks.Url(companyId),
            );
            const memberBooks = memberBooksResponse?.data?.data ?? [];

            return {
                ...userBooksPayload,
                data: mergeMemberBooksOrderWithTotals(memberBooks, userBooks),
            };
        },
        enabled: !!companyId,
        retry: false,
    });

    return {
        cashbookList: data?.data || [],
        isCashbookListPending: isLoading || isRefetching,
        isCashbookListError: isError,
        cashbookListError: error,
        refetchCashbookList: refetch,
    };
};

function invalidateCashbookListQueries(
    queryClient: ReturnType<typeof useQueryClient>,
    companyId?: string,
) {
    queryClient.invalidateQueries({
        queryKey: [APIS.Cashbook.listByBusiness.Id],
        exact: false,
    });
    queryClient.invalidateQueries({
        queryKey: [APIS.CompanyMemberBooks.getMemberBooks.Id],
        exact: false,
    });
    queryClient.invalidateQueries({
        queryKey: [APIS.CompanyMemberBooks.getUserBooks.Id],
        exact: false,
    });
    if (companyId) {
        queryClient.invalidateQueries({
            queryKey: [APIS.Cashbook.recycleBin.Id, companyId],
        });
    }
}

/** Move book to recycle bin (soft delete). */
export const useSoftDeleteCashbook = () => {
    const queryClient = useQueryClient();

    const { mutate, isPending, isError, error } = useMutation<
        DeleteCashbookResponse,
        Error,
        { companyId: string; bookId: string }
    >({
        mutationKey: [APIS.Cashbook.softDelete.Id],
        mutationFn: async ({ companyId, bookId }) => {
            const response = await axiosInstance.delete(
                APIS.Cashbook.softDelete.Url(companyId, bookId),
            );
            if (response?.data) {
                return response.data as DeleteCashbookResponse;
            }
            throw new Error("Failed to move book to deleted books");
        },
        onSuccess: (_res, { companyId }) => {
            invalidateCashbookListQueries(queryClient, companyId);
            if (typeof window !== "undefined") {
                window.location.reload();
            }
        },
    });

    return {
        softDeleteCashbook: mutate,
        isSoftDeleteCashbookPending: isPending,
        isSoftDeleteCashbookError: isError,
        softDeleteCashbookError: error,
    };
};

/** Permanently delete book and related data (from recycle bin). */
export const useHardDeleteCashbook = () => {
    const queryClient = useQueryClient();

    const { mutate, isPending, isError, error } = useMutation<
        DeleteCashbookResponse,
        Error,
        { companyId: string; bookId: string }
    >({
        mutationKey: [APIS.Cashbook.delete.Id],
        mutationFn: async ({ companyId, bookId }) => {
            const response = await axiosInstance.delete(
                APIS.Cashbook.delete.Url(companyId, bookId),
            );
            if (response?.data) {
                return response.data as DeleteCashbookResponse;
            }
            throw new Error("Failed to delete cashbook");
        },
        onSuccess: (_res, { companyId }) => {
            invalidateCashbookListQueries(queryClient, companyId);
            if (typeof window !== "undefined") {
                window.location.reload();
            }
        },
    });

    return {
        hardDeleteCashbook: mutate,
        isHardDeleteCashbookPending: isPending,
        isHardDeleteCashbookError: isError,
        hardDeleteCashbookError: error,
    };
};

/** @deprecated Use useSoftDeleteCashbook or useHardDeleteCashbook */
export const useDeleteCashbook = useSoftDeleteCashbook;

export const useGetRecycleBinBooks = (companyId: string, enabled = true) => {
    const { data, isLoading, isError, error, refetch, isRefetching } = useQuery<
        { data: Cashbook[]; message?: string },
        Error
    >({
        queryKey: [APIS.Cashbook.recycleBin.Id, companyId],
        queryFn: async () => {
            const response = await axiosInstance.get(
                APIS.Cashbook.recycleBin.Url(companyId),
            );
            if (response?.data) {
                return response.data as { data: Cashbook[]; message?: string };
            }
            throw new Error("Failed to fetch deleted books");
        },
        enabled: !!companyId && enabled,
        retry: false,
    });

    return {
        deletedBooks: data?.data ?? [],
        isDeletedBooksPending: isLoading || isRefetching,
        isDeletedBooksError: isError,
        deletedBooksError: error,
        refetchDeletedBooks: refetch,
    };
};

export const useRestoreCashbook = () => {
    const queryClient = useQueryClient();

    const { mutate, isPending, isError, error } = useMutation<
        DeleteCashbookResponse,
        Error,
        { companyId: string; bookId: string }
    >({
        mutationKey: [APIS.Cashbook.restore.Id],
        mutationFn: async ({ companyId, bookId }) => {
            const response = await axiosInstance.post(
                APIS.Cashbook.restore.Url(companyId, bookId),
            );
            if (response?.data) {
                return response.data as DeleteCashbookResponse;
            }
            throw new Error("Failed to restore book");
        },
        onSuccess: (res, { companyId }) => {
            invalidateCashbookListQueries(queryClient, companyId);
            toast.success(res.message || "Book restored successfully");
            if (typeof window !== "undefined") {
                window.location.reload();
            }
        },
        onError: (err) => {
            toast.error(err.message || "Failed to restore book");
        },
    });

    return {
        restoreCashbook: mutate,
        isRestoringCashbook: isPending,
        isRestoreCashbookError: isError,
        restoreCashbookError: error,
    };
};

// Types
interface DeleteCashbookResponse {
    status: number;
    message: string;
    source: string;
}

// Hook to get user companies (if still needed)
export const useGetUserCompanies = () => {
    const {
        data,
        isLoading,
        isError,
        error,
        refetch,
        isRefetching,
    } = useQuery<any, Error>({
        queryKey: [APIS.Cashbook.listByBusiness.Id],
        queryFn: async () => {
            const response = await axiosInstance.get(APIS.Cashbook.listByBusiness.Url(""));

            if (response?.data) {
                return response.data;
            } else {
                throw new Error("Failed to fetch user companies");
            }
        },
        retry: false,
    });

    return {
        userCompanies: data?.data || [],
        isUserCompaniesPending: isLoading || isRefetching,
        isUserCompaniesError: isError,
        userCompaniesError: error,
        refetchUserCompanies: refetch,
    };
};



export const useGetBookTotals = (bookId: string) => {
    const {
        data,
        isLoading,
        isError,
        error,
        refetch,
        isRefetching,
    } = useQuery<BookTotalsResponse, Error>({
        queryKey: [APIS.Cashbook.transactionCounts.Id, bookId],
        queryFn: async () => {
            const response = await axiosInstance.get(APIS.Cashbook.transactionCounts.Url(bookId));

            if (response?.data) {
                return response.data;
            } else {
                throw new Error("Failed to fetch book totals");
            }
        },
        retry: false,
        enabled: !!bookId, // Only enable query if bookId exists
    });

    return {
        bookTotals: data?.data || {
            totalIn: 0,
            totalOut: 0,
            balance: 0,
            totalInTransactions: 0,
        },
        isBookTotalsPending: isLoading || isRefetching,
        isBookTotalsError: isError,
        bookTotalsError: error,
        refetchBookTotals: refetch,
    };
};

// Hook to get a single cashbook by ID
export const useGetCashbookById = (companyId: string, bookId: string) => {
    const {
        data,
        isLoading,
        isError,
        error,
        refetch,
        isRefetching,
    } = useQuery<CashbookListResponse, Error>({
        queryKey: [APIS.Cashbook.listByBusiness.Id, companyId, bookId],
        queryFn: async () => {
            const response = await axiosInstance.get(
                APIS.Cashbook.listByBusiness.Url(companyId)
            );

            if (response?.data) {
                return response.data;
            } else {
                throw new Error("Failed to fetch cashbook");
            }
        },
        enabled: !!companyId && !!bookId,
        retry: false,
    });

    // Find the specific book from the list
    const cashbook = data?.data?.find((book) => book._id === bookId);

    return {
        cashbook: cashbook || null,
        isCashbookPending: isLoading || isRefetching,
        isCashbookError: isError,
        cashbookError: error,
        refetchCashbook: refetch,
    };
};


// services/cashbook.service.ts - Update the mutationFn
export const useTransferCashbook = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, isError, error } = useMutation<
    TransferCashbookResponse,
    Error,
    TransferCashbookDto
  >({
    mutationKey: [APIS.Cashbook.transferBook.Id],
    mutationFn: async (payload: TransferCashbookDto) => {
      // Ensure all fields are strings
      const cleanPayload = {
        bookId: String(payload.bookId).trim(),
        targetCompanyId: String(payload.targetCompanyId).trim(),
        ...(payload.transferReason && { 
          transferReason: String(payload.transferReason).trim() 
        })
      };

      console.log("📤 Sending transfer payload:", cleanPayload);

            const res = await axiosInstance.post(
                APIS.Cashbook.transferBook.Url(cleanPayload.targetCompanyId),
                {
                    bookId: cleanPayload.bookId,
                    targetCompanyId: cleanPayload.targetCompanyId,
                    transferReason: cleanPayload.transferReason,
                }
            );
      return res.data;
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({
        queryKey: [APIS.Cashbook.listByBusiness.Id],
        exact: false
      });
      toast.success(res.message || "Cashbook transferred successfully");
      if (typeof window !== "undefined") {
        window.location.reload();
      }
    },
    onError: (error) => {
      console.error("Transfer API error:", {
        error,
        // response: error.response?.data,
        // status: error.response?.status
      });
      toast.error(error.message || "Failed to transfer cashbook");
    },
  });

  return {
    transferCashbook: mutate,
    isTransferringCashbook: isPending,
    isTransferCashbookError: isError,
    transferCashbookError: error,
  };
};