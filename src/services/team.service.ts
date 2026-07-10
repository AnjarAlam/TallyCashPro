import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '@/lib/axios'; // adjust this import according to your setup
import { toast } from 'sonner';
import { AddMemberPayload, AddMemberToBookPayload, BookMembersResponse, CompanyMembersResponse, RemoveMemberFromBooksPayload } from '@/interface';
import { APIS } from '@/constants/api';


// Business Members

export const useAddCompanyMember = () => {
    const queryClient = useQueryClient();

    const { mutate, isPending, isError, error } = useMutation({
        mutationKey: [APIS.Business.addMember.Id],
        mutationFn: async (payload: AddMemberPayload): Promise<any> => {
            const res = await axiosInstance.post(APIS.Business.addMember.Url, payload);
            return res.data;
        },
        onSuccess: (res) => {
            // Invalidate relevant queries
            queryClient.invalidateQueries({
                queryKey: [APIS.Business.members.Id],
                exact: false
            });
            // queryClient.invalidateQueries({
            //     queryKey: [APIS.Business.listByUser.Id],
            //     exact: false
            // });
            toast.success(res?.message);
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to add member');
        }
    });

    return {
        addCompanyMember: mutate,
        isAddingMember: isPending,
        isAddMemberError: isError,
        addMemberError: error,
    };
};

export const useCompanyMembers = (companyId: string) => {
    return useQuery<CompanyMembersResponse, Error>({
        queryKey: [APIS.Business.members.Id, companyId],
        queryFn: async () => {
            const response = await axiosInstance.get(APIS.Business.members.Url(companyId));
            return response.data;
        },
        enabled: !!companyId, // Only fetch when companyId is available

    });
};

export const useRemoveCompanyMember = () => {
    const queryClient = useQueryClient();

    const { mutate, isPending, isError, error } = useMutation<
        void, // Return type (assuming no response data)
        Error, // Error type
        { companyId: string; memberId: string } // Variables type
    >({
        mutationKey: [APIS.Business.removeMember.Id],
        mutationFn: async ({ companyId, memberId }) => {
            const response = await axiosInstance.delete(
                APIS.Business.removeMember.Url(companyId, memberId)
            );
            return response.data;
        },
        onSuccess: () => {
            // Invalidate company members queries
            queryClient.invalidateQueries({
                queryKey: [APIS.Business.members.Id],
                exact: false
            });
            toast.success('Member removed successfully');
        },
        onError: (error) => {
            toast.error(error.message || "Failed to remove member");
        },
    });

    return {
        removeCompanyMember: mutate,
        isRemovingMember: isPending,
        isRemoveMemberError: isError,
        removeMemberError: error,
    };
};





//Cashbook Members



export const useAddMemberToBook = () => {
    const queryClient = useQueryClient();

    const { mutate, isPending, isError, error } = useMutation({
        mutationKey: [APIS.Cashbook.addMember.Id],
        mutationFn: async (payload: AddMemberToBookPayload): Promise<any> => {
            const res = await axiosInstance.post(APIS.Cashbook.addMember.Url, payload);
            return res.data;
        },
        onSuccess: (res) => {
            // Invalidate relevant queries
            queryClient.invalidateQueries({
                queryKey: [APIS.Cashbook.members.Id],
                exact: false
            });
            queryClient.invalidateQueries({
                queryKey: [APIS.Business.members.Id],
                exact: false
            });
            queryClient.invalidateQueries({
                queryKey: [APIS.Business.listByUser.Id],
                exact: false
            });

            toast.success(res?.message || 'Member added to book successfully');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to add member to book');
        }
    });

    return {
        addMemberToBook: mutate,
        isAddingMemberToBook: isPending,
        isAddMemberToBookError: isError,
        addMemberToBookError: error,
    };
};


export const useBookMembers = (companyId: string, bookId: string) => {
    return useQuery<BookMembersResponse, Error>({
        queryKey: [APIS.Cashbook.members.Id, companyId, bookId],
        queryFn: async () => {
            const response = await axiosInstance.get(APIS.Cashbook.members.Url(companyId, bookId));
            return response.data;
        },
        enabled: !!companyId && !!bookId, // Only fetch when both IDs are available
    });
};


export const useChangeMemberBookRole = () => {
    const queryClient = useQueryClient();

    const { mutate, isPending, isError, error } = useMutation<
        ChangeMemberBookRoleResponse,
        Error,
        ChangeMemberBookRoleDto
    >({
        mutationKey: [APIS.Cashbook.changeMemberRole.Id],
        mutationFn: async (payload: ChangeMemberBookRoleDto) => {
            const res = await axiosInstance.post(
                APIS.Cashbook.changeMemberRole.Url,
                payload
            );
            return res.data;
        },
        onSuccess: (res) => {
            // Invalidate relevant queries after successful mutation
            queryClient.invalidateQueries({
                queryKey: [APIS.Cashbook.members.Id],
                exact: false
            });
            queryClient.invalidateQueries({
                queryKey: [APIS.Cashbook.listByBusiness.Id],
                exact: false
            });
            toast.success(res.message);
        },
        onError: (error) => {
            toast.error(error.message || "Failed to change member book role");
        },
    });

    return {
        changeMemberBookRole: mutate,
        isChangingMemberBookRole: isPending,
        isChangeMemberBookRoleError: isError,
        changeMemberBookRoleError: error,
    };
};

// Types (you should define these according to your API spec)
interface ChangeMemberBookRoleResponse {
    message: string;
    // other response fields
}

interface ChangeMemberBookRoleDto {
    memberBookId: string;
    newRole: string;
    /** For accountant role: number of days of transaction access from today */
    dataAccessDurationDays?: number;
}




export const useRemoveMemberFromBooks = () => {
    const queryClient = useQueryClient();

    const { mutate, isPending, isError, error } = useMutation<
        void,
        Error,
        RemoveMemberFromBooksPayload
    >({
        mutationKey: [APIS.Cashbook.removeMember.Id],
        mutationFn: async (payload) => {
            const response = await axiosInstance.delete(
                APIS.Cashbook.removeMember.Url,
                { data: payload } // DELETE request with body
            );
            return response.data;
        },
        onSuccess: () => {
            // Invalidate relevant queries
            queryClient.invalidateQueries({
                queryKey: [APIS.Cashbook.members.Id],
                exact: false
            });
            queryClient.invalidateQueries({
                queryKey: [APIS.Business.members.Id],
                exact: false
            });
            toast.success('Member removed from books successfully');
        },
        onError: (error) => {
            toast.error(error.message || "Failed to remove member from books");
        },
    });

    return {
        removeMemberFromBooks: mutate,
        isRemovingFromBooks: isPending,
        isRemoveFromBooksError: isError,
        removeFromBooksError: error,
    };
};



// Change Role for Company Members


interface ChangeMemberRoleForBusinessResponse {
    message: string;
    // other response fields if needed
}

interface ChangeMemberRoleBusinessDto {
    memberId: string;
    newRole: string; // Adjust the type if you have specific role types
}

export const useChangeMemberRole = () => {
    const queryClient = useQueryClient();

    return useMutation<
        ChangeMemberRoleForBusinessResponse,
        Error,
        ChangeMemberRoleBusinessDto
    >({
        mutationKey: ["changeMemberRole"],
        mutationFn: async (payload: ChangeMemberRoleBusinessDto) => {
            const res = await axiosInstance.post(
                APIS.Business.changeMemberRole.Url,
                payload
            );
            return res.data;
        },
        onSuccess: (res) => {
            // Invalidate relevant queries after successful mutation
            queryClient.invalidateQueries({
                queryKey: [APIS.Business.members.Id],
                exact: false
            });
            // toast.success(res.message || "Member role updated successfully");
        },
        onError: (error) => {
            toast.error(error.message || "Failed to update member role");
        },
    });
};