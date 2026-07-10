// Create Business Hook
import { APIS } from "@/constants/api";
import { GetCompanyListResponse } from "@/interface";
import { axiosInstance } from "@/lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { TransferCashbookDto, TransferCashbookResponse } from "./cashbook.service";


interface CreateBusinessDto {
    name: string;
    description: string;
    category: string;
}

export const useCreateBusiness = () => {
    const queryClient = useQueryClient();

    const { mutate, isPending, isError, error } = useMutation({
        mutationKey: [APIS.Business.create.Id],
        mutationFn: async (payload: CreateBusinessDto): Promise<any> => {
            const res = await axiosInstance.post(APIS.Business.create.Url, payload);
            return res.data;
        },
        onSuccess: (res) => {
            console.log("RES:::", res.message)
            // Invalidate the business list query to trigger a refetch
            queryClient.invalidateQueries({
                queryKey: [APIS.Business.listByUser.Id],
                exact: false
            });
            toast.success(res?.message);
        },
        onError: (error) => {
            toast.error(error?.message); // Changed from toast.success to toast.error
        }
    });

    return {
        createBusiness: mutate,
        isCreatingBusiness: isPending,
        isCreateBusinessError: isError,
        createBusinessError: error,
    };
};

export const useUpdateBusiness = () => {
    const queryClient = useQueryClient();

    const { mutate, isPending, isError, error } = useMutation({
        mutationKey: [APIS.Business.update.Id],
        mutationFn: async ({ businessId, payload }: { businessId: string, payload: CreateBusinessDto }): Promise<any> => {
            const res = await axiosInstance.patch(APIS.Business.update.Url(businessId), payload);
            return res.data;
        },
        onSuccess: (res) => {
            console.log("RES:::", res.message)
            // Invalidate the business list query to trigger a refetch
            queryClient.invalidateQueries({
                queryKey: [APIS.Business.listByUser.Id],
                exact: false
            });
            toast.success(res?.message);
        },
        onError: (error) => {
            toast.error(error?.message); // Changed from toast.success to toast.error
        }
    });

    return {
        updateBusiness: mutate,
        isUpdatingBusiness: isPending,
        isUpdateBusinessError: isError,
        updateBusinessError: error,
    };
};


export const useDeleteBusiness = () => {
    const queryClient = useQueryClient();

    const { mutate, isPending, isError, error } = useMutation({
        mutationKey: [APIS.Business.delete.Id],
        mutationFn: async (businessId: string): Promise<any> => {
            const res = await axiosInstance.delete(APIS.Business.delete.Url(businessId));
            return res.data;
        },
        onSuccess: (res) => {
            // Invalidate the business list query to trigger a refetch
            queryClient.invalidateQueries({
                queryKey: [APIS.Business.listByUser.Id],
                exact: false
            });

            toast.success(res?.message || "Business deleted successfully");
        },
        onError: (error) => {
            toast.error(error?.message || "Failed to delete business");
        }
    });

    return {
        deleteBusiness: mutate,
        isDeletingBusiness: isPending,
        isDeleteBusinessError: isError,
        deleteBusinessError: error,
    };
};

export const useGetCompanyList = () => {
    const {
        data,
        isLoading,
        isError,
        error,
        refetch,
        isRefetching,
    } = useQuery<GetCompanyListResponse, Error>({
        queryKey: [APIS.Business.listByUser.Id],
        queryFn: async () => {

            const response = await axiosInstance.get(APIS.Business.listByUser.Url)

            if (response?.data) {
                return response.data

            } else {
                throw new Error("Failed to fetch company list. Try again later.");
            }
        },
        retry: false,
    });

    return {
        companyList: data?.data ?? null,
        isCompanyListPending: isLoading || isRefetching,
        isCompanyListError: isError,
        companyListError: error,
        refetchCompanyList: refetch,
    };
};


// Types
interface GetCompanyResponse {
    status: number;
    message: string;
    source: string;
    data: Company;
}

interface Company {
    isActive: boolean;
    _id: string;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
    category: string;
}
export const useGetCompanyById = (companyId: string) => {
    const {
        data,
        isLoading,
        isError,
        error,
        refetch,
        isRefetching,
    } = useQuery<GetCompanyResponse, Error>({
        queryKey: [APIS.Business.one.Id, companyId],
        queryFn: async () => {
            if (!companyId) {
                throw new Error("Company ID is required");
            }

            const response = await axiosInstance.get(APIS.Business.one.Url(companyId));

            if (response?.data) {
                return response.data;
            } else {
                throw new Error("Failed to fetch company details. Try again later.");
            }
        },
        retry: false,
        enabled: !!companyId, // Only run the query if companyId exists
    });

    return {
        company: data?.data ?? null,
        isCompanyPending: isLoading || isRefetching,
        isCompanyError: isError,
        companyError: error,
        refetchCompany: refetch,
    };
};

// Add this to your existing business service
export const useUpdateBusinessOrder = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, isError, error } = useMutation({
    mutationKey: [APIS.Business.reorder.Id],
    mutationFn: async (orderData: Array<{ companyId: string; order: number }>) => {
      const payload = { companies: orderData };
      const response = await axiosInstance.post(APIS.Business.reorder.Url, payload);
      return response.data;
    },
    
  });

  return {
    updateBusinessOrder: mutate,
    isUpdatingOrder: isPending,
    isUpdateOrderError: isError,
    updateOrderError: error,
  };
};



export interface CompanyForTransfer {
  _id: string;
  name: string;
  email?: string;
  logo?: string;
  businessType?: string;
}

export interface CompanyMembership {
  _id: string;
  company: CompanyForTransfer;
  companyRole: string;
  isPrimary: boolean;
}

export interface CompanyListResponse {
  status: number;
  message: string;
  source: string;
  data: CompanyMembership[];
}

export const useGetCompaniesForTransfer = () => {
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useQuery<CompanyListResponse, Error>({
    queryKey: ["companies-for-transfer"],
    queryFn: async () => {
      const response = await axiosInstance.get(APIS.Business.listByUser.Url);
      
      if (response?.data) {
        return response.data;
      } else {
        throw new Error("Failed to fetch companies for transfer");
      }
    },
    retry: false,
  });

  // Extract companies from the membership data
  const companies = data?.data?.map(item => item.company) || [];

  return {
    companies,
    isCompaniesLoading: isLoading || isRefetching,
    isCompaniesError: isError,
    companiesError: error,
    refetchCompanies: refetch,
  };
};



// Types
export interface AuditLogUser {
  _id: string;
  email: string;
  name: string;
}

export interface AuditLog {
  _id: string;
  company: string;
  changedBy: AuditLogUser;
  changeType: 'create' | 'update' | 'delete' | 'other';
  newValues: Record<string, any>;
  oldValues?: Record<string, any>;
  changeReason: string;
  action: string;
  changedAt: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface AuditLogsResponse {
  status: number;
  message: string;
  source: string;
  data: {
    logs: AuditLog[];
    total: number;
    page: string;
    totalPages: number;
  };
}

// Hooks
export const useGetCompanyAuditLogs = (companyId: string, page: number = 1, limit: number = 20) => {
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useQuery<AuditLogsResponse, Error>({
    queryKey: ["company-audit-logs", companyId, page, limit],
    queryFn: async () => {
      if (!companyId) {
        throw new Error("Company ID is required");
      }

      const response = await axiosInstance.get(
        `${APIS.Business.one.Url(companyId)}/logs`,
        {
          params: { page, limit }
        }
      );

      if (response?.data) {
        return response.data;
      } else {
        throw new Error("Failed to fetch audit logs");
      }
    },
    retry: false,
    enabled: !!companyId,
  });

  return {
    auditLogs: data?.data?.logs || [],
    totalLogs: data?.data?.total || 0,
    currentPage: parseInt(data?.data?.page || "1"),
    totalPages: data?.data?.totalPages || 1,
    isAuditLogsLoading: isLoading || isRefetching,
    isAuditLogsError: isError,
    auditLogsError: error,
    refetchAuditLogs: refetch,
  };
};



export const useGetBooksAuditLogs = (
  companyId: string, 
  page: number = 1, 
  limit: number = 20
) => {
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useQuery<AuditLogsResponse, Error>({
    queryKey: ["books-audit-logs", companyId, page, limit],
    queryFn: async () => {
      if (!companyId) {
        throw new Error("Company ID is required");
      }

      const response = await axiosInstance.get(
        APIS.Business.Books.logs.Url(companyId),
        {
          params: { 
            page, 
            limit,
            // Add any additional params if needed
          }
        }
      );
      
      if (response?.data) {
        return response.data;
      } else {
        throw new Error("Failed to fetch books audit logs");
      }
    },
    retry: false,
    enabled: !!companyId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    auditLogs: data?.data?.logs || [],
    totalLogs: data?.data?.total || 0,
    currentPage: parseInt(data?.data?.page || "1"),
    totalPages: data?.data?.totalPages || 1,
    isAuditLogsLoading: isLoading || isRefetching,
    isAuditLogsError: isError,
    auditLogsError: error,
    refetchAuditLogs: refetch,
  };
};
