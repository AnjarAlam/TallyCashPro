import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from '@/lib/axios';
import { CashbookMemberRoleResponse, CompanyMemberRoleResponse } from '@/interface';
import { APIS } from '@/constants/api';

export const useCompanyMemberRole = (companyId: string) => {
    return useQuery<CompanyMemberRoleResponse, Error>({
        queryKey: ['company-member-role', companyId],
        queryFn: async () => {
            const response = await axiosInstance.get(`/company-members/get-company-member-role/${companyId}`);
            return response.data;
        },
        enabled: !!companyId,
        staleTime: 1000 * 60 * 5,
        retry: 1,
    });
};

/** Fetches member's book role and access (e.g. dataAccessDurationDays for accountant). */
export const useCashbookMemberRole = (bookId: string, memberId: string) => {
    return useQuery<CashbookMemberRoleResponse, Error>({
        queryKey: [APIS.CompanyMemberBooks.getMemberBookRole.Id, bookId, memberId],
        queryFn: async () => {
            const url = APIS.CompanyMemberBooks.getMemberBookRole.Url(bookId, memberId);
            const response = await axiosInstance.get(url);
            return response.data;
        },
        enabled: !!bookId && !!memberId,
        staleTime: 1000 * 60 * 5,
        retry: 1,
    });
};


