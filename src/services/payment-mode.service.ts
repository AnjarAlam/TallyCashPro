import { APIS } from '@/constants/api';
import { PaymentModesResponse, UpdatePaymentModePayload } from '@/interface';
import { axiosInstance } from '@/lib/axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { toast } from 'sonner';



export const useGetPaymentModes = (
    businessId: string,
    status?: 'active' | 'inactive'
) => {
    return useQuery<PaymentModesResponse, Error>({
        queryKey: [APIS.paymentMode.list.Id, businessId, status],
        queryFn: async () => {
            if (!businessId) {
                throw new Error('Business ID is required');
            }

            let url = APIS.paymentMode.list.Url(businessId);
            const params = new URLSearchParams();

            if (status) {
                params.append('status', status);
            }

            const response = await axiosInstance.get(url, {
                params
            });

            if (response.data?.status === 200) {
                return response.data;
            } else {
                throw new Error(response.data?.message || 'Failed to fetch payment modes');
            }
        },
        enabled: !!businessId,
        retry: false,
        staleTime: 1000 * 60 * 5, // 5 minutes cache
    });
};

// Convenience hook for active payment modes
export const useGetActivePaymentModes = (businessId: string) => {
    return useGetPaymentModes(businessId, 'active');
};



type CreatePaymentModePayload = {
    businessId: string;
    name: string;
    description?: string;
    status?: string;
    isDefault?: boolean;
};

export const useCreatePaymentMode = () => {
    const queryClient = useQueryClient();

    const { mutate, isPending, isError, error } = useMutation<
        Response, // Replace 'Response' with your actual response type if needed
        AxiosError<{ message?: string }>,
        { payload: CreatePaymentModePayload }
    >({
        mutationKey: [APIS.paymentMode.new.Id],
        mutationFn: async ({ payload }) => {
            const url = APIS.paymentMode.new.Url;

            const body = {
                businessId: payload.businessId,
                name: payload.name,
                ...(payload.description && { description: payload.description }),
                status: payload.status || 'active',
                isDefault: payload.isDefault || false,
            };

            const response = await axiosInstance.post(url, body);


            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [APIS.paymentMode.list.Id],
                exact: false // Adjust this to your actual query key
            });
            queryClient.invalidateQueries({
                queryKey: [APIS.paymentMode.listByBook.Id],
                exact: false
            });
            toast.success('Payment mode created successfully');
        },
        onError: (error) => {
            const errorMessage = error.response?.data?.message || error.message || 'Failed to create payment mode';
            console.error('❌ Error:', errorMessage);
            if (error.response) {
                console.error('❌ Response Data:', error.response.data);
                console.error('❌ Response Status:', error.response.status);
            } else {
                console.error('❌ Error Message:', error.message);
            }
            toast.error(errorMessage);
        },
    });

    return {
        createPaymentMode: mutate,
        isCreatingPaymentMode: isPending,
        isCreatePaymentModeError: isError,
        createPaymentModeError: error,
    };
};


export const useUpdatePaymentMode = () => {
    const queryClient = useQueryClient();

    const { mutate, isPending, isError, error } = useMutation<
        void,
        Error,
        { id: string; payload: UpdatePaymentModePayload }
    >({
        mutationKey: [APIS.paymentMode.update.Id],
        mutationFn: async ({ id, payload }) => {
            const response = await axiosInstance.patch(
                APIS.paymentMode.update.Url(id),
                payload
            );
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [APIS.paymentMode.list.Id],
                exact: false
            });
            queryClient.invalidateQueries({
                queryKey: [APIS.paymentMode.listByBook.Id],
                exact: false
            });
            toast.success('Payment mode updated successfully');
        },
        onError: (error) => {
            toast.error(error.message || "Failed to update payment mode");
        },
    });

    return {
        updatePaymentMode: mutate,
        isUpdatingPaymentMode: isPending,
        isUpdatePaymentModeError: isError,
        updatePaymentModeError: error,
    };
};


export const useDeletePaymentMode = () => {
    const queryClient = useQueryClient();

    const { mutate, isPending, isError, error } = useMutation<
        void,
        Error,
        string // Just the ID for deletion
    >({
        mutationKey: [APIS.paymentMode.delete.Id],
        mutationFn: async (id) => {
            const response = await axiosInstance.delete(
                APIS.paymentMode.delete.Url(id)
            );
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [APIS.paymentMode.list.Id],
                exact: false
            });
            queryClient.invalidateQueries({
                queryKey: [APIS.paymentMode.listByBook.Id],
                exact: false
            });
            toast.success('Payment mode deleted successfully');
        },
        onError: (error) => {
            toast.error(error.message || "Failed to delete payment mode");
        },
    });

    return {
        deletePaymentMode: mutate,
        isDeletingPaymentMode: isPending,
        isDeletePaymentModeError: isError,
        deletePaymentModeError: error,
    };
};

// Book-based payment mode hooks
export const useGetPaymentModesByBook = ({
    bookId,
    status
}: {
    bookId: string,
    status?: 'active' | 'inactive'
}) => {
    return useQuery<PaymentModesResponse, Error>({
        queryKey: [APIS.paymentMode.listByBook.Id, bookId, status],
        queryFn: async () => {
            if (!bookId) {
                throw new Error('Book ID is required');
            }

            let url = APIS.paymentMode.listByBook.Url;
            const params = new URLSearchParams();
            params.append('bookId', bookId);

            if (status) {
                params.append('status', status);
            }

            const response = await axiosInstance.get(url, {
                params
            });

            if (response.data?.status === 200) {
                return response.data;
            } else {
                throw new Error(response.data?.message || 'Failed to fetch payment modes');
            }
        },
        enabled: !!bookId,
        retry: false,
        staleTime: 1000 * 60 * 5, // 5 minutes cache
    });
};

export const useCreatePaymentModeByBook = () => {
    const queryClient = useQueryClient();

    const { mutate, isPending, isError, error } = useMutation<
        Response,
        AxiosError<{ message?: string }>,
        { bookId: string; payload: CreatePaymentModePayload }
    >({
        mutationKey: [APIS.paymentMode.newByBook.Id],
        mutationFn: async ({ bookId, payload }) => {
            const url = APIS.paymentMode.newByBook.Url(bookId);

            const body = {
                businessId: payload.businessId,
                name: payload.name,
                ...(payload.description && { description: payload.description }),
                status: payload.status || 'active',
                isDefault: payload.isDefault || false,
            };

            const response = await axiosInstance.post(url, body);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [APIS.paymentMode.listByBook.Id],
                exact: false
            });
            queryClient.invalidateQueries({
                queryKey: [APIS.paymentMode.list.Id],
                exact: false
            });
            toast.success('Payment mode created successfully');
        },
        onError: (error) => {
            const errorMessage = error.response?.data?.message || error.message || 'Failed to create payment mode';
            toast.error(errorMessage);
        },
    });

    return {
        createPaymentModeByBook: mutate,
        isCreatingPaymentModeByBook: isPending,
        isCreatePaymentModeByBookError: isError,
        createPaymentModeByBookError: error,
    };
};

export const useCopyPaymentModes = () => {
    const queryClient = useQueryClient();

    const { mutate, mutateAsync, isPending, isError, error } = useMutation<
        { message: string },
        Error,
        { sourceBookId: string; targetBookId: string }
    >({
        mutationKey: [APIS.paymentMode.copyPaymentModes.Id],
        mutationFn: async ({ sourceBookId, targetBookId }) => {
            const response = await axiosInstance.post(
                APIS.paymentMode.copyPaymentModes.Url,
                {
                    sourceBookId,
                    targetBookId,
                }
            );
            return response.data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: [APIS.paymentMode.list.Id],
                exact: false
            });
            queryClient.invalidateQueries({
                queryKey: [APIS.paymentMode.listByBook.Id],
                exact: false
            });
            toast.success(data.message || 'Payment modes copied successfully');
        },
        onError: (error: any) => {
            // Check if it's a 400 error indicating no payment modes to copy
            if (error?.response?.status === 400) {
                toast.error("No payment modes to copy from this book.");
            } else {
                toast.error(error.message || "Failed to copy payment modes");
            }
        },
    });

    return {
        copyPaymentModes: mutate,
        copyPaymentModesAsync: mutateAsync,
        isCopyingPaymentModes: isPending,
        isCopyPaymentModesError: isError,
        copyPaymentModesError: error,
    };
};