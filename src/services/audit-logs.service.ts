import { APIS } from "@/constants/api";
import { axiosInstance } from "@/lib/axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// Interfaces
export interface AuditLogTransaction {
  _id: string;
  book: {
    _id: string;
    name: string;
    description: string;
    currency: string;
  };
  type: 'cash_in' | 'cash_out';
  amount: number;
}

export interface AuditLogChangedBy {
  _id: string;
  email: string;
  name: string;
}

export interface AuditLogAttachment {
  key: string;
  url: string;
  fileType: string;
  mimeType: string;
  size: number;
  uploadedAt: string;
  _id: string;
  createdAt: string;
  updatedAt: string;
  id?: string;
}

export interface AuditLog {
  _id: string;
  transaction: AuditLogTransaction;
  changedBy: AuditLogChangedBy;
  changeType: 'create' | 'update' | 'delete';
  newValues: {
    user?: string;
    book?: string;
    type?: 'cash_in' | 'cash_out';
    subType?: string;
    status?: string;
    amount?: number;
    party?: string;
    category?: string;
    paymentMode?: string;
    remark?: string;
    date?: string;
    time?: string;
    description?: string;
    attachments?: AuditLogAttachment[];
    createdBy?: string;
    updatedFlag?: boolean;
    updatedBy?: string;
    deleted?: boolean;
    records?: any[];
    customValues?: Record<string, any>;
    _id?: string;
    createdAt?: string;
    updatedAt?: string;
    __v?: number;
    signedAmount?: number;
    id?: string;
  };
  oldValues?: Record<string, any>;
  changeReason: string;
  changedAt: string;
}

export interface AuditLogsResponse {
  status: number;
  message: string;
  source: string;
  data: {
    logs: AuditLog[];
    total: number;
    page: number;
    totalPages: number;
  };
}

export interface ExportAuditLogsResponse {
  status: number;
  message: string;
  source: string;
  data?: {
    url: string;
  };
}

export interface FilterAuditLogsParams {
  startDate?: string;
  endDate?: string;
  changeType?: 'create' | 'update' | 'delete';
  changedById?: string;
  search?: string;
}

// Hook to get audit logs for a specific book
export const useGetAuditLogs = (
  bookId: string, 
  page: number = 1, 
  limit: number = 20,
  filters?: FilterAuditLogsParams
) => {
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useQuery<AuditLogsResponse, Error>({
    queryKey: [APIS.AuditLogs.listByBook.Id, bookId, page, limit, filters],
    queryFn: async () => {
      // Build query parameters
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      // Add filter parameters if provided
      if (filters?.startDate) params.append('startDate', filters.startDate);
      if (filters?.endDate) params.append('endDate', filters.endDate);
      if (filters?.changeType) params.append('changeType', filters.changeType);
      if (filters?.changedById) params.append('changedById', filters.changedById);
      if (filters?.search) params.append('search', filters.search);

      const response = await axiosInstance.get(
        `${APIS.AuditLogs.listByBook.Url(bookId)}?${params.toString()}`
      );

      if (response?.data) {
        return response.data;
      } else {
        throw new Error("Failed to fetch audit logs");
      }
    },
    enabled: !!bookId,
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    auditLogs: data?.data?.logs || [],
    totalLogs: data?.data?.total || 0,
    currentPage: data?.data?.page || 1,
    totalPages: data?.data?.totalPages || 1,
    isAuditLogsPending: isLoading || isRefetching,
    isAuditLogsError: isError,
    auditLogsError: error,
    refetchAuditLogs: refetch,
  };
};

// Hook to get a specific audit log by ID
export const useGetAuditLogById = (logId: string) => {
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useQuery<AuditLogsResponse, Error>({
    queryKey: [APIS.AuditLogs.getById.Id, logId],
    queryFn: async () => {
      const response = await axiosInstance.get(
        APIS.AuditLogs.getById.Url(logId)
      );

      if (response?.data) {
        return response.data;
      } else {
        throw new Error("Failed to fetch audit log");
      }
    },
    enabled: !!logId,
    retry: false,
  });

  return {
    auditLog: data?.data?.logs?.[0] || null,
    isAuditLogPending: isLoading || isRefetching,
    isAuditLogError: isError,
    auditLogError: error,
    refetchAuditLog: refetch,
  };
};

// Hook to export audit logs
export const useExportAuditLogs = () => {
  const {
    mutate,
    isPending,
    isError,
    error,
  } = useMutation<ExportAuditLogsResponse, Error, {
    bookId: string;
    businessId: string;
    format?: 'csv' | 'excel' | 'pdf';
    filters?: FilterAuditLogsParams;
  }>({
    mutationKey: [APIS.AuditLogs.export.Id],
    mutationFn: async ({ bookId, businessId, format = 'csv', filters }) => {
      // Build query parameters
      const params = new URLSearchParams({
        format,
      });

      // Add filter parameters if provided
      if (filters?.startDate) params.append('startDate', filters.startDate);
      if (filters?.endDate) params.append('endDate', filters.endDate);
      if (filters?.changeType) params.append('changeType', filters.changeType);
      if (filters?.changedById) params.append('changedById', filters.changedById);
      if (filters?.search) params.append('search', filters.search);

      const response = await axiosInstance.get(
        `${APIS.AuditLogs.export.Url(businessId, bookId)}?${params.toString()}`,
        {
          responseType: 'blob',
        }
      );

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `audit-logs-${bookId}-${new Date().toISOString().split('T')[0]}.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      return {
        status: 200,
        message: "Audit logs exported successfully",
        source: "client",
      };
    },
    onSuccess: () => {
      toast.success("Audit logs exported successfully");
    },
    onError: (error) => {
      console.error("Export audit logs error:", error);
      toast.error(error.message || "Failed to export audit logs");
    },
  });

  return {
    exportAuditLogs: mutate,
    isExportingAuditLogs: isPending,
    isExportAuditLogsError: isError,
    exportAuditLogsError: error,
  };
};

// Hook to get audit log statistics
export const useGetAuditLogStats = (bookId: string) => {
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useQuery<{
    status: number;
    message: string;
    source: string;
    data: {
      total: number;
      byChangeType: {
        create: number;
        update: number;
        delete: number;
      };
      byUser: Array<{
        userId: string;
        name: string;
        email: string;
        count: number;
      }>;
      last30Days: Array<{
        date: string;
        count: number;
      }>;
    };
  }, Error>({
    queryKey: [APIS.AuditLogs.stats.Id, bookId],
    queryFn: async () => {
      const response = await axiosInstance.get(
        APIS.AuditLogs.stats.Url(bookId)
      );

      if (response?.data) {
        return response.data;
      } else {
        throw new Error("Failed to fetch audit log statistics");
      }
    },
    enabled: !!bookId,
    retry: false,
  });

  return {
    stats: data?.data || {
      total: 0,
      byChangeType: { create: 0, update: 0, delete: 0 },
      byUser: [],
      last30Days: [],
    },
    isStatsPending: isLoading || isRefetching,
    isStatsError: isError,
    statsError: error,
    refetchStats: refetch,
  };
};

// Hook to clear old audit logs (admin only)
export const useClearAuditLogs = () => {
  const queryClient = useQueryClient();

  const {
    mutate,
    isPending,
    isError,
    error,
  } = useMutation<{
    status: number;
    message: string;
    source: string;
  }, Error, {
    bookId: string;
    olderThanDays: number;
    reason?: string;
  }>({
    mutationKey: [APIS.AuditLogs.clear.Id],
    mutationFn: async ({ bookId, olderThanDays, reason }) => {
      const response = await axiosInstance.post(
        APIS.AuditLogs.clear.Url(bookId),
        { olderThanDays, reason }
      );

      if (response?.data) {
        return response.data;
      } else {
        throw new Error("Failed to clear audit logs");
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [APIS.AuditLogs.listByBook.Id],
      });
      queryClient.invalidateQueries({
        queryKey: [APIS.AuditLogs.stats.Id],
      });
      toast.success(data.message || "Audit logs cleared successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to clear audit logs");
    },
  });

  return {
    clearAuditLogs: mutate,
    isClearingAuditLogs: isPending,
    isClearAuditLogsError: isError,
    clearAuditLogsError: error,
  };
};

// Helper function to format audit log data for display
export const formatAuditLogForDisplay = (log: AuditLog) => {
  const changeTypeMap = {
    create: { label: 'Created', color: 'green', icon: 'plus' },
    update: { label: 'Updated', color: 'blue', icon: 'edit' },
    delete: { label: 'Deleted', color: 'red', icon: 'trash' },
  };

  const transactionTypeMap = {
    cash_in: { label: 'Cash In', color: 'green' },
    cash_out: { label: 'Cash Out', color: 'red' },
  };

  return {
    ...log,
    displayChangeType: changeTypeMap[log.changeType] || { label: log.changeType, color: 'gray', icon: 'activity' },
    displayTransactionType: transactionTypeMap[log.transaction.type] || { label: log.transaction.type, color: 'gray' },
    formattedDate: new Date(log.changedAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }),
    formattedTime: new Date(log.changedAt).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    }),
    amountFormatted: new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: log.transaction.book.currency || 'USD',
      minimumFractionDigits: 0,
    }).format(log.transaction.amount),
  };
};

// Helper function to compare old and new values
export const getChangedFields = (oldValues: Record<string, any>, newValues: Record<string, any>) => {
  const changedFields: Array<{
    field: string;
    oldValue: any;
    newValue: any;
    isObject?: boolean;
  }> = [];

  if (!oldValues) return [];

  // Check all keys in both objects
  const allKeys = new Set([...Object.keys(oldValues), ...Object.keys(newValues)]);

  allKeys.forEach(key => {
    const oldVal = oldValues[key];
    const newVal = newValues[key];

    // Skip if both are undefined or null
    if (oldVal === undefined && newVal === undefined) return;
    if (oldVal === null && newVal === null) return;

    // Check if values are different
    if (JSON.stringify(oldVal) !== JSON.stringify(newVal)) {
      changedFields.push({
        field: key,
        oldValue: oldVal,
        newValue: newVal,
        isObject: typeof oldVal === 'object' || typeof newVal === 'object',
      });
    }
  });

  return changedFields;
};

// Hook to get audit logs for a specific transaction
export const useGetTransactionAuditLogs = (transactionId: string) => {
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useQuery<TransactionAuditLogsResponse, Error>({
    queryKey: [APIS.AuditLogs.listByTransaction.Id, transactionId],
    queryFn: async () => {
      const response = await axiosInstance.get(
        APIS.AuditLogs.listByTransaction.Url(transactionId)
      );

      if (response?.data) {
        return response.data;
      } else {
        throw new Error("Failed to fetch transaction audit logs");
      }
    },
    enabled: !!transactionId,
    retry: false,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

  return {
    transactionAuditLogs: data?.data || [],
    isTransactionAuditLogsPending: isLoading || isRefetching,
    isTransactionAuditLogsError: isError,
    transactionAuditLogsError: error,
    refetchTransactionAuditLogs: refetch,
  };
};


export interface TransactionAuditLog {
  _id: string;
  transaction: string | AuditLogTransaction;
  changedBy: AuditLogChangedBy;
  changeType: 'create' | 'update' | 'delete';
  newValues: Record<string, any>;
  oldValues?: Record<string, any>;
  changeReason: string;
  changedAt: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface TransactionAuditLogsResponse {
  status: number;
  message: string;
  source: string;
  data: TransactionAuditLog[];
}

// Helper function to format transaction audit log for display
export const formatTransactionAuditLog = (log: TransactionAuditLog) => {
  const changeTypeMap = {
    create: { label: 'Created', color: 'green', icon: 'plus', bgColor: 'bg-green-50', textColor: 'text-green-700' },
    update: { label: 'Updated', color: 'blue', icon: 'edit', bgColor: 'bg-blue-50', textColor: 'text-blue-700' },
    delete: { label: 'Deleted', color: 'red', icon: 'trash', bgColor: 'bg-red-50', textColor: 'text-red-700' },
  };

  const changeTypeInfo = changeTypeMap[log.changeType] || { 
    label: log.changeType, 
    color: 'gray', 
    icon: 'activity', 
    bgColor: 'bg-gray-50', 
    textColor: 'text-gray-700' 
  };

  return {
    ...log,
    changeTypeInfo,
    formattedDate: new Date(log.changedAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }),
    formattedTime: new Date(log.changedAt).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    }),
    relativeTime: getRelativeTime(log.changedAt),
  };
};

// Helper function to get relative time (e.g., "2 hours ago")
const getRelativeTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

// Helper to get field change details
export const getFieldChanges = (log: TransactionAuditLog) => {
  if (!log.oldValues) return [];

  const changedFields: Array<{
    field: string;
    oldValue: any;
    newValue: any;
    fieldLabel: string;
  }> = [];

  const fieldLabels: Record<string, string> = {
    amount: 'Amount',
    category: 'Category',
    paymentMode: 'Payment Method',
    party: 'Party',
    remark: 'Remark',
    description: 'Description',
    date: 'Date',
    time: 'Time',
    status: 'Status',
    attachments: 'Attachments',
  };

  Object.keys(log.oldValues).forEach(key => {
    const oldVal = log.oldValues?.[key];
    const newVal = log.newValues?.[key];

    // Skip if values are the same or both undefined
    if (JSON.stringify(oldVal) === JSON.stringify(newVal)) return;
    if (oldVal === undefined && newVal === undefined) return;
    if (oldVal === null && newVal === null) return;

    changedFields.push({
      field: key,
      oldValue: oldVal,
      newValue: newVal,
      fieldLabel: fieldLabels[key] || key,
    });
  });

  return changedFields;
};