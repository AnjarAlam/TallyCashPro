import { APIS } from '@/constants/api';
import { CreatePartyPayload, PartiesResponse, Party } from '@/interface';
import { UpdatePartyByBookPayload } from '@/interface/party';
import { axiosInstance } from '@/lib/axios';
import { useInfiniteQuery, InfiniteData, useQueryClient, useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

type PartyTypeFilter = 'Customer' | 'Supplier';
type PartyStatusFilter = 'active' | 'inactive';

function invalidatePartyListQueries(
    queryClient: ReturnType<typeof useQueryClient>,
    bookId?: string,
) {
    queryClient.invalidateQueries({
        queryKey: [APIS.party.list.Id],
        exact: false,
    });
    if (bookId) {
        queryClient.invalidateQueries({
            queryKey: [APIS.party.list.Id, bookId],
            exact: false,
        });
    }
}

export const useGetBookPartiesInfinite = (
    bookId: string,
    search?: string,
    type?: PartyTypeFilter,
    status?: PartyStatusFilter,
) => {
    const limit = 100;

    const {
        data,
        isLoading,
        isError,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        refetch,
    } = useInfiniteQuery<
        PartiesResponse,
        Error,
        InfiniteData<PartiesResponse>,
        (string | undefined)[],
        number
    >({
        queryKey: [
            APIS.party.list.Id,
            bookId,
            search,
            type,
            status,
        ],
        initialPageParam: 1,
        queryFn: async ({ pageParam }) => {
            const response = await axiosInstance.get(
                APIS.party.list.Url(bookId),
                {
                    params: {
                        page: pageParam,
                        limit,
                        ...(search && { search }),
                        ...(type && { type }),
                        ...(status && { status }),
                    },
                },
            );

            if (response?.data) {
                return response.data as PartiesResponse;
            }
            throw new Error("Failed to fetch parties");
        },
        getNextPageParam: (lastPage) => {
            const totalPages = lastPage.totalPages ?? 0;
            const page = lastPage.page ?? 1;
            return page < totalPages ? page + 1 : undefined;
        },
        enabled: !!bookId,
        retry: false,
    });

    const parties = data?.pages.flatMap((page) => page.data) || [];

    return {
        parties,
        isPartiesPending: isLoading,
        isPartiesError: isError,
        partiesError: error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        refetchParties: refetch,
        total: data?.pages[0]?.total || 0,
        currentLimit: limit,
    };
};

/** @deprecated Use useGetBookPartiesInfinite */
export const useGetUserPartiesInfinite = useGetBookPartiesInfinite;

export const useCreateParty = () => {
    const queryClient = useQueryClient();

    const { mutate, isPending, isError, error } = useMutation<
        Party,
        Error,
        { bookId: string; payload: CreatePartyPayload }
    >({
        mutationKey: [APIS.party.new.Id],
        mutationFn: async ({ bookId, payload }) => {
            const response = await axiosInstance.post(
                APIS.party.new.Url,
                payload,
                { params: { bookId } },
            );
            return response.data;
        },
        onSuccess: (_data, { bookId }) => {
            invalidatePartyListQueries(queryClient, bookId);
            toast.success('Party created successfully');
        },
        onError: (error) => {
            toast.error(error.message || "Failed to create party");
        },
    });

    return {
        createParty: mutate,
        isCreatingParty: isPending,
        isCreatePartyError: isError,
        createPartyError: error,
    };
};

export const useUpdateParty = () => {
    const queryClient = useQueryClient();

    const { mutate, isPending, isError, error } = useMutation<
        Party,
        Error,
        { id: string; bookId: string; payload: UpdatePartyByBookPayload }
    >({
        mutationKey: [APIS.party.update.Id],
        mutationFn: async ({ id, bookId, payload }) => {
            const response = await axiosInstance.patch(
                APIS.party.update.Url(id),
                payload,
                { params: { bookId } },
            );
            return response.data;
        },
        onSuccess: (_data, { bookId }) => {
            invalidatePartyListQueries(queryClient, bookId);
            toast.success('Party updated successfully');
        },
        onError: (error) => {
            toast.error(error.message || "Failed to update party");
        },
    });

    return {
        updateParty: mutate,
        isUpdatingParty: isPending,
        isUpdatePartyError: isError,
        updatePartyError: error,
    };
};

export const useDeleteParty = () => {
    const queryClient = useQueryClient();

    const { mutate, isPending, isError, error } = useMutation<
        void,
        Error,
        { id: string; bookId: string }
    >({
        mutationKey: [APIS.party.delete.Id],
        mutationFn: async ({ id, bookId }) => {
            const response = await axiosInstance.delete(
                APIS.party.delete.Url(id),
                { params: { bookId } },
            );
            return response.data;
        },
        onSuccess: (_data, { bookId }) => {
            invalidatePartyListQueries(queryClient, bookId);
        },
    });

    return {
        deleteParty: mutate,
        isDeletingParty: isPending,
        isDeletePartyError: isError,
        deletePartyError: error,
    };
};
