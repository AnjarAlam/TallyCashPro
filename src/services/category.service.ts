// services/categoryService.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';


import { APIS } from '@/constants/api';
import {
    Category,
    CategoryResponse,
    CreateCategoryPayload,
    UpdateCategoryPayload,
} from "@/interface";
import { axiosInstance } from '@/lib/axios';
import { toast } from 'sonner';

export const useCreateCategory = () => {
    const queryClient = useQueryClient();

    const { mutate, isPending, isError, error } = useMutation<
        Category,
        Error,
        { payload: CreateCategoryPayload }
    >({
        mutationKey: [APIS.category.new.Id],
        mutationFn: async ({ payload }) => {
            const response = await axiosInstance.post(
                APIS.category.new.Url,
                payload,

            );
            return response.data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: [APIS.category.list.Id],
                exact: false
            });
            queryClient.invalidateQueries({
                queryKey: [APIS.category.listByBook.Id],
                exact: false
            });
            toast.success('Category created successfully');
        },
        onError: (error) => {
            toast.error(error.message || "Failed to create category");
        },
    });

    return {
        createCategory: mutate,
        isCreatingCategory: isPending,
        isCreateCategoryError: isError,
        createCategoryError: error,
    };
};

export const useCreateCategoryByBook = () => {
    const queryClient = useQueryClient();

    const { mutate, isPending, isError, error } = useMutation<
        Category,
        Error,
        { bookId: string; payload: CreateCategoryPayload }
    >({
        mutationKey: [APIS.category.newByBook.Id],
        mutationFn: async ({ bookId, payload }) => {
            const response = await axiosInstance.post(
                APIS.category.newByBook.Url(bookId),
                payload,
            );
            return response.data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: [APIS.category.listByBook.Id],
                exact: false
            });
            toast.success('Category created successfully');
        },
        onError: (error) => {
            toast.error(error.message || "Failed to create category");
        },
    });

    return {
        createCategoryByBook: mutate,
        isCreatingCategoryByBook: isPending,
        isCreateCategoryByBookError: isError,
        createCategoryByBookError: error,
    };
};

export const useGetCategories = ({
    businessId,
    typeFilter,
    sortBy,
    sortOrder,
    nameFilter
}: {
    businessId: string,
    typeFilter?: 'cash_in' | 'cash_out',
    sortBy?: string,
    sortOrder?: string,
    nameFilter?: string
}
) => {
    const {
        data,
        isLoading,
        isError,
        error,
        refetch,
        isRefetching,
    } = useQuery<CategoryResponse, Error>({
        queryKey: [
            APIS.category.list.Id,
            businessId,
            typeFilter,
            sortBy,
            sortOrder,
            nameFilter,
        ],
        queryFn: async () => {
            let url = APIS.category.list.Url;
            const params = {
                businessId,
                ...(typeFilter && { type: typeFilter }),
                ...(sortBy && { sortBy }),
                ...(sortOrder && { sortOrder }),
                ...(nameFilter && { name: nameFilter }),
            };

            const response = await axiosInstance.get(url, {
                params,
            });

            if (response?.data) {
                return response.data;
            } else {
                throw new Error("Failed to fetch categories");
            }

        },



        enabled: !!businessId,
        retry: false,
    });

    return {
        categories: data?.data || [],
        isCategoriesPending: isLoading || isRefetching,
        isCategoriesError: isError,
        categoriesError: error,
        refetchCategories: refetch,
    };
};

export const useGetCategoriesByBook = ({
    bookId,
    typeFilter,
    sortBy,
    sortOrder,
    nameFilter
}: {
    bookId: string,
    typeFilter?: 'cash_in' | 'cash_out',
    sortBy?: string,
    sortOrder?: string,
    nameFilter?: string
}
) => {
    const {
        data,
        isLoading,
        isError,
        error,
        refetch,
        isRefetching,
    } = useQuery<CategoryResponse, Error>({
        queryKey: [
            APIS.category.listByBook.Id,
            bookId,
            typeFilter,
            sortBy,
            sortOrder,
            nameFilter,
        ],
        queryFn: async () => {
            let url = APIS.category.listByBook.Url;
            const params = {
                bookId,
                ...(typeFilter && { type: typeFilter }),
                ...(sortBy && { sortBy }),
                ...(sortOrder && { sortOrder }),
                ...(nameFilter && { name: nameFilter }),
            };

            const response = await axiosInstance.get(url, {
                params,
            });

            if (response?.data) {
                return response.data;
            } else {
                throw new Error("Failed to fetch categories");
            }
        },
        enabled: !!bookId,
        retry: false,
    });

    return {
        categories: data?.data || [],
        isCategoriesPending: isLoading || isRefetching,
        isCategoriesError: isError,
        categoriesError: error,
        refetchCategories: refetch,
    };
};

export const useUpdateCategory = () => {
    const queryClient = useQueryClient();

    const { mutate, isPending, isError, error } = useMutation<
        Category,
        Error,
        UpdateCategoryPayload
    >({
        mutationKey: [APIS.category.update.Id],
        mutationFn: async (payload) => {
            const response = await axiosInstance.patch(
                APIS.category.update.Url(payload.categoryId),
                payload,
            );
            return response.data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: [APIS.category.list.Id],
                exact: false
            });
            queryClient.invalidateQueries({
                queryKey: [APIS.category.listByBook.Id],
                exact: false
            });
            toast.success('Category updated successfully');
        },
        onError: (error) => {
            toast.error(error.message || "Failed to update category");
        },
    });

    return {
        updateCategory: mutate,
        isUpdatingCategory: isPending,
        isUpdateCategoryError: isError,
        updateCategoryError: error,
    };
};

export const useDeleteCategory = () => {
    const queryClient = useQueryClient();

    const { mutate, isPending, isError, error } = useMutation<
        void,
        Error,
        { categoryId: string }
    >({
        mutationKey: [APIS.category.delete.Id],
        mutationFn: async ({ categoryId }) => {
            await axiosInstance.delete(
                APIS.category.delete.Url(categoryId),
            );
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [APIS.category.list.Id],
                exact: false
            });
            queryClient.invalidateQueries({
                queryKey: [APIS.category.listByBook.Id],
                exact: false
            });
            toast.success('Category deleted successfully');
        },
        onError: (error) => {
            toast.error(error.message || "Failed to delete category");
        },
    });

    return {
        deleteCategory: mutate,
        isDeletingCategory: isPending,
        isDeleteCategoryError: isError,
        deleteCategoryError: error,
    };
};

export const useCopyCategories = () => {
    const queryClient = useQueryClient();

    const { mutate, mutateAsync, isPending, isError, error } = useMutation<
        { message: string },
        Error,
        { sourceBookId: string; targetBookId: string }
    >({
        mutationKey: [APIS.category.copyCategories.Id],
        mutationFn: async ({ sourceBookId, targetBookId }) => {
            const response = await axiosInstance.post(
                APIS.category.copyCategories.Url,
                {
                    sourceBookId,
                    targetBookId,
                }
            );
            return response.data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: [APIS.category.list.Id],
                exact: false
            });
            queryClient.invalidateQueries({
                queryKey: [APIS.category.listByBook.Id],
                exact: false
            });
            toast.success(data.message || 'Categories copied successfully');
        },
        onError: (error: any) => {
            // Check if it's a 400 error indicating no categories to copy
            if (error?.response?.status === 400) {
                toast.error("No categories to copy from this book.");
            } else {
                toast.error(error.message || "Failed to copy categories");
            }
        },
    });

    return {
        copyCategories: mutate,
        copyCategoriesAsync: mutateAsync,
        isCopyingCategories: isPending,
        isCopyCategoriesError: isError,
        copyCategoriesError: error,
    };
};