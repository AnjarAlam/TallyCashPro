import { useMutation, useQuery, useQueryClient, useQueries } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";
import { toast } from "sonner";
import { APIS } from "@/constants/api";
import { Cashbook } from "@/interface";
import { useGetCompaniesForTransfer } from "@/services/business.service";

// Attachment interface
export interface AttachmentDto {
  key: string;
  url: string;
  fileType: string;
  mimeType: string;
  size: number;
}

// Create Transfer DTO
export interface CreateTransferDto {
  sourceBookId: string;
  targetBookId: string;
  amount: number;
  targetAmount?: number;
  description?: string;
  remark?: string;
  date?: string;
  time?: string;
  category?: string;
  paymentMode?: string;
  invoiceNo?: string;
  attachments?: AttachmentDto[];
  records?: Record<string, any>[];
  customValues?: Record<string, any>;
}

export interface TransferTargetBook extends Cashbook {
  companyId: string;
  companyName: string;
}

export const useGetAllUserBooksForTransfer = () => {
  const { companies, isCompaniesLoading } = useGetCompaniesForTransfer();

  const bookQueries = useQueries({
    queries: companies.map((company) => ({
      queryKey: [APIS.Cashbook.listByBusiness.Id, company._id, "transfer-target"],
      queryFn: async (): Promise<TransferTargetBook[]> => {
        const response = await axiosInstance.get(
          APIS.Cashbook.listByBusiness.Url(company._id),
        );
        const books: Cashbook[] = response.data?.data || [];
        return books.map((book) => ({
          ...book,
          companyId: company._id,
          companyName: company.name,
        }));
      },
      enabled: !!company._id,
      retry: false,
    })),
  });

  const allBooks = bookQueries.flatMap((query) => query.data || []);
  const isBooksLoading =
    isCompaniesLoading || bookQueries.some((query) => query.isLoading);

  return {
    allBooks,
    isBooksLoading,
  };
};

// Approve/Reject DTO
export interface ApproveRejectTransferDto {
  approvalReason?: string;
  rejectionReason?: string;
}

// Transaction interface
export interface Transaction {
  _id: string;
  user: string;
  book: string;
  type: string;
  subType: string;
  status: string;
  targetBookId: string;
  amount: number;
  category?: string;
  paymentMode?: string;
  remark?: string;
  date: string;
  time?: string;
  invoiceNo?: string;
  description?: string;
  attachments?: any[];
  createdBy: string;
  updatedFlag: boolean;
  updatedBy: string | null;
  deleted: boolean;
  records?: any[];
  customValues?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  __v: number;
  linkedTransactionId: string;
}

// Create Transfer Response
export interface TransferResponse {
  status: number;
  message: string;
  source: string;
  data: {
    sourceTransaction: Transaction;
    targetTransaction: Transaction;
  };
}

// Approve/Reject Response
export interface ApproveRejectResponse {
  status: number;
  message: string;
  source: string;
  data: {
    message: string;
  };
}

export const useCreateTransfer = () => {
  const queryClient = useQueryClient();

  return useMutation<TransferResponse, Error, CreateTransferDto>({
    mutationKey: ["create-transfer"],
    mutationFn: async (payload: CreateTransferDto) => {
      const response = await axiosInstance.post(
        APIS.transfer.create.Url,
        payload
      );
      return response.data;
    },
    onSuccess: (data) => {
      // Invalidate relevant queries to refresh data
      queryClient.invalidateQueries({
        queryKey: [APIS.transaction.list.Id],
      });
      queryClient.invalidateQueries({
        queryKey: [APIS.Cashbook.transactionCounts.Id],
      });
      queryClient.invalidateQueries({
        queryKey: [APIS.Cashbook.listByBusiness.Id],
      });
      
      // Show success message
      toast.success(data.message || "Transfer created successfully. Awaiting approval.");
    },
    onError: (error: any) => {
      // Show error message with proper error handling
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          "Failed to create transfer";
      toast.error(errorMessage);
    },
  });
};

export const useApproveTransfer = () => {
  const queryClient = useQueryClient();

  return useMutation<ApproveRejectResponse, Error, { 
    transferId: string; 
    data: { approvalReason?: string } 
  }>({
    mutationKey: ["approve-transfer"],
    mutationFn: async ({ transferId, data }) => {
      const response = await axiosInstance.patch(
        `/transactions/transfer/${transferId}/approve`,
        data
      );
      return response.data;
    },
    onSuccess: (data) => {
      // Invalidate all relevant queries
      queryClient.invalidateQueries({
        queryKey: [APIS.transaction.list.Id],
      });
      queryClient.invalidateQueries({
        queryKey: [APIS.Cashbook.transactionCounts.Id],
      });
      queryClient.invalidateQueries({
        queryKey: [APIS.Cashbook.listByBusiness.Id],
      });
      queryClient.invalidateQueries({
        queryKey: [APIS.transaction.view.Id],
      });
      
      // Show success message
      toast.success(data.message || "Transfer approved successfully");
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          "Failed to approve transfer";
      toast.error(errorMessage);
    },
  });
};

export const useRejectTransfer = () => {
  const queryClient = useQueryClient();

  return useMutation<ApproveRejectResponse, Error, { 
    transferId: string; 
    data: { rejectionReason?: string } 
  }>({
    mutationKey: ["reject-transfer"],
    mutationFn: async ({ transferId, data }) => {
      const response = await axiosInstance.patch(
        `/transactions/transfer/${transferId}/reject`,
        data
      );
      return response.data;
    },
    onSuccess: (data) => {
      // Invalidate all relevant queries
      queryClient.invalidateQueries({
        queryKey: [APIS.transaction.list.Id],
      });
      queryClient.invalidateQueries({
        queryKey: [APIS.Cashbook.transactionCounts.Id],
      });
      queryClient.invalidateQueries({
        queryKey: [APIS.Cashbook.listByBusiness.Id],
      });
      queryClient.invalidateQueries({
        queryKey: [APIS.transaction.view.Id],
      });
      
      // Show success message
      toast.success(data.message || "Transfer rejected successfully");
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          "Failed to reject transfer";
      toast.error(errorMessage);
    },
  });
};

// Optional: Add a hook for getting transfer by ID
export const useGetTransferById = (transferId: string) => {
  return useQuery({
    queryKey: ["transfer", transferId],
    queryFn: async () => {
      const response = await axiosInstance.get(`/transactions/transfer/${transferId}`);
      return response.data;
    },
    enabled: !!transferId, // Only run query if transferId exists
  });
};