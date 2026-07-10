// services/analytics.service.ts
import { APIS } from "@/constants/api";
import { axiosInstance } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export interface EnhancedAnalyticsResponse {
  status: number;
  message: string;
  source: string;
  summary: {
    cash_out: {
      count: number;
      totalAmount: number;
    };
    cash_in: {
      count: number;
      totalAmount: number;
    };
  };
  netBalance: number;
  income: number;
  expense: number;
  monthlyTrends: Array<{
    _id: {
      year: number;
      month: number;
      type: string;
    };
    totalAmount: number;
    count: number;
  }>;
  categoryBreakdown: Array<{
    _id: {
      category: string;
      type: string;
    };
    totalAmount: number;
    count: number;
  }>;
}

export const useGetEnhancedAnalytics = (bookId: string) => {
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useQuery<EnhancedAnalyticsResponse, Error>({
    queryKey: [APIS.Cashbook.enhancedAnalytics.Id, bookId],
    queryFn: async () => {
      if (!bookId) throw new Error("Book ID is required");
      
      const response = await axiosInstance.get(
        APIS.Cashbook.enhancedAnalytics.Url(bookId)
      );

      if (response?.data) {
        return response.data;
      } else {
        throw new Error("Failed to fetch enhanced analytics");
      }
    },
    retry: false,
    enabled: !!bookId, // Only enable query if bookId exists
  });
// console.log("Enhanced Analytics Data:", data);
  return {
    analyticsData: data,
    isAnalyticsPending: isLoading || isRefetching,
    isAnalyticsError: isError,
    analyticsError: error,
    refetchAnalytics: refetch,
  };
};