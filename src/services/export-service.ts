import { APIS } from "@/constants/api";
import { axiosInstance } from "@/lib/axios";

interface ExportFilters {
  startDate?: string;
  endDate?: string;
  transactionType?: string;
  paymentMode?: string;
  category?: string;
  searchQuery?: string;
  pageSize?: number;
  book?: string;
  bookId?: string;
  dateFrom?: string;
  dateTo?: string;
  type?: string;
  pageNumber?: number;
}

interface ExportOptions {
  bookId: string;
  token: string;
  filters?: ExportFilters;
  type: "pdf" | "excel";
}

export const exportService = {
  async downloadExport({ bookId, token, filters = {}, type }: ExportOptions): Promise<Blob> {
    try {
      const isPDF = type === "pdf";
      const endpoint = isPDF ? APIS.export.pdf.Url : APIS.export.excel.Url;
      
      // Prepare query parameters based on export type
      const params = new URLSearchParams();
      
      if (isPDF) {
        // PDF parameters - exactly as working in your payload
        params.append("book", bookId);
        
        // Map date parameters
        if (filters.startDate) params.append("dateFrom", filters.startDate);
        if (filters.endDate) params.append("dateTo", filters.endDate);
        
        // Map other parameters
        if (filters.transactionType) params.append("type", filters.transactionType);
        if (filters.paymentMode) params.append("paymentMode", filters.paymentMode);
        if (filters.category) params.append("category", filters.category);
        if (filters.searchQuery) params.append("searchQuery", filters.searchQuery);
        
        // Map pagination
        params.append("pageSize", (filters.pageSize || 100).toString());
        params.append("pageNumber", (filters.pageNumber || 1).toString());
      } else {
        // Excel parameters - based on your curl examples
        // Note: Some parameters might be duplicated as shown in curl examples
        
        // Book ID parameter
        params.append("bookId", bookId);
        
        // Date parameters - providing both formats as seen in curl
        if (filters.startDate) {
          params.append("startDate", filters.startDate);
          // Also add createdAtFrom if it's in the filter or use startDate
          params.append("createdAtFrom", filters.dateFrom || filters.startDate);
        }
        if (filters.endDate) {
          params.append("endDate", filters.endDate);
          // Also add createdAtTo if it's in the filter or use endDate
          params.append("createdAtTo", filters.dateTo || filters.endDate);
        }
        
        // Other filter parameters
        if (filters.transactionType) params.append("type", filters.transactionType);
        if (filters.paymentMode) params.append("paymentMode", filters.paymentMode);
        if (filters.category) params.append("category", filters.category);
        if (filters.searchQuery) params.append("searchQuery", filters.searchQuery);
        
        // Pagination
        params.append("pageSize", (filters.pageSize || 100).toString());
        params.append("pageNumber", (filters.pageNumber || 1).toString());
      }

      console.log(`Export ${type} URL:`, `${endpoint}?${params.toString()}`);
      console.log(`Export ${type} params:`, Object.fromEntries(params.entries()));

      // Get the response as blob
      const response = await axiosInstance.get(`${endpoint}?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': isPDF ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        },
        responseType: 'blob',
      });

      return response.data;
    } catch (error) {
      console.error('Export service error:', error);
      throw new Error(`Failed to export ${type.toUpperCase()}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  async downloadMonthlyReport({ bookId, token, year, type }: { 
    bookId: string; 
    token: string; 
    year: string; 
    type: "pdf" | "excel" 
  }): Promise<Blob> {
    try {
      const isPDF = type === "pdf";
      const endpoint = isPDF 
        ? APIS.export.categoryMonthPdf.Url(bookId, year)
        : APIS.export.categoryMonthExcel.Url(bookId, year);
      
      console.log(`Downloading monthly ${type} report:`, endpoint);

      // Get the response as blob
      const response = await axiosInstance.get(endpoint, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': isPDF ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        },
        responseType: 'blob',
      });

      return response.data;
    } catch (error) {
      console.error('Monthly report download error:', error);
      throw new Error(`Failed to download monthly ${type.toUpperCase()} report: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  getFileName(bookId: string, type: "pdf" | "excel"): string {
    const extension = type === 'pdf' ? 'pdf' : 'xlsx';
    const date = new Date().toISOString().split('T')[0];
    return `transactions-${bookId}-${date}.${extension}`;
  },

  getMonthlyReportFileName(bookId: string, year: string, type: "pdf" | "excel"): string {
    const extension = type === 'pdf' ? 'pdf' : 'xlsx';
    return `category-month-report-${bookId}-${year}.${extension}`;
  },

  triggerDownload(blob: Blob, fileName: string): void {
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = fileName;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up
    window.URL.revokeObjectURL(downloadUrl);
  },
};