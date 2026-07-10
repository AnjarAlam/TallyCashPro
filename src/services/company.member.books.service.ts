// hooks/use-company-member-books.ts
import { useInfiniteQuery, useMutation, useQuery, useQueryClient, QueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";
import { toast } from "sonner";
import { APIS } from "@/constants/api";
import {
  BookMembersResponse,
  MemberBookAccessResponse,
  AddMemberToBookDto,
  ChangeMemberBookRoleDto,
  RemoveMemberFromBookDto,
  ReorderBooksDto,
  UserBooksResponse,
  BaseResponse,
  CompanyMemberBook,
  BookMember
} from "@/interface/company-member-books";
import { Cashbook, CashbookListResponse } from "@/interface/cashbook";

/** Apply server-returned book order to the business page cashbook list cache. */
function applyBookOrderToListCache(
  queryClient: QueryClient,
  companyId: string,
  orderedBooks: Array<{ _id?: string; id?: string; order?: number }>,
) {
  if (!orderedBooks.length) return;

  queryClient.setQueriesData<CashbookListResponse>(
    { queryKey: [APIS.Cashbook.listByBusiness.Id, companyId], exact: false },
    (old) => {
      if (!old?.data?.length) return old;

      const byId = new Map(old.data.map((book) => [book._id, book]));
      const reordered: Cashbook[] = [];

      orderedBooks.forEach((item, index) => {
        const id = item._id ?? item.id;
        if (!id) return;
        const book = byId.get(id);
        if (book) {
          reordered.push({ ...book, order: item.order ?? index });
          byId.delete(id);
        }
      });

      byId.forEach((book) => reordered.push(book));

      return { ...old, data: reordered };
    },
  );
}

// Get Book Members Hook
export const useGetBookMembers = (
  companyId: string,
  bookId: string,
  enabled: boolean = true
) => {
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useQuery<BookMembersResponse, Error>({
    queryKey: [APIS.CompanyMemberBooks.getBookMembers.Id, companyId, bookId],
    queryFn: async () => {
      console.log('➡️ GET Book Members');
      console.log(`🔸 URL: ${APIS.CompanyMemberBooks.getBookMembers.Url(companyId, bookId)}`);

      const response = await axiosInstance.get(
        APIS.CompanyMemberBooks.getBookMembers.Url(companyId, bookId)
      );

      console.log('✅ Response Status:', response.status);
      console.log('✅ Response Data:', response.data);


      if (response?.data) {
        return response.data;
      } else {
        throw new Error("Failed to fetch book members");
      }
    },
    enabled: !!companyId && !!bookId && enabled,
    retry: false,
  });

  return {
    bookMembers: data?.data || [],
    isBookMembersPending: isLoading || isRefetching,
    isBookMembersError: isError,
    bookMembersError: error,
    refetchBookMembers: refetch,
  };
};

// Get Member Book Role Hook
export const useGetMemberBookRole = (
  bookId: string,
  memberId: string,
  enabled: boolean = true
) => {
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useQuery<MemberBookAccessResponse, Error>({
    queryKey: [APIS.CompanyMemberBooks.getMemberBookRole.Id, bookId, memberId],
    queryFn: async () => {
      console.log('➡️ GET Member Book Role');
      console.log(`🔸 URL: ${APIS.CompanyMemberBooks.getMemberBookRole.Url(bookId, memberId)}`);

      const response = await axiosInstance.get(
        APIS.CompanyMemberBooks.getMemberBookRole.Url(bookId, memberId)
      );

      console.log('✅ Response Status:', response.status);
      console.log('✅ Response Data:', response.data);

      if (response?.data) {
        return response.data;
      } else {
        throw new Error("Failed to fetch member book role");
      }
    },
    enabled: !!bookId && !!memberId && enabled,
    retry: false,
  });

  return {
    memberBookAccess: data?.data,
    isMemberBookAccessPending: isLoading || isRefetching,
    isMemberBookAccessError: isError,
    memberBookAccessError: error,
    refetchMemberBookAccess: refetch,
  };
};

// Add Member to Book Hook
export const useAddMemberToBook = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, isError, error } = useMutation<
    BaseResponse,
    Error,
    AddMemberToBookDto
  >({
    mutationKey: [APIS.CompanyMemberBooks.addMemberToBook.Id],
    mutationFn: async (payload: AddMemberToBookDto) => {
      console.log('➡️ POST Add Member to Book');
      console.log(`🔸 URL: ${APIS.CompanyMemberBooks.addMemberToBook.Url()}`);
      console.log(`🔸 Request Body:`, payload);

      const response = await axiosInstance.post(
        APIS.CompanyMemberBooks.addMemberToBook.Url(),
        payload
      );

      console.log('✅ Response Status:', response.status);
      console.log('✅ Response Data:', response.data);

      if (response?.data) {
        return response.data;
      } else {
        throw new Error("Failed to add member to book");
      }
    },
    onSuccess: (res) => {
      // Invalidate relevant queries after successful creation
      queryClient.invalidateQueries({
        queryKey: [APIS.CompanyMemberBooks.getBookMembers.Id],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: [APIS.CompanyMemberBooks.getUserBooks.Id],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: [APIS.Cashbook.members.Id],
        exact: false,
      });
      toast.success(res.message || "Member added successfully");
    },
    onError: (error) => {
      console.error('❌ Error adding member to book:', error);
      toast.error(error.message || "Failed to add member to book");
    },
  });

  return {
    addMemberToBook: mutate,
    isAddingMemberToBook: isPending,
    isAddMemberToBookError: isError,
    addMemberToBookError: error,
  };
};

// Change Member Book Role Hook
export const useChangeMemberBookRole = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, isError, error } = useMutation<
    BaseResponse,
    Error,
    ChangeMemberBookRoleDto
  >({
    mutationKey: [APIS.CompanyMemberBooks.changeMemberBookRole.Id],
    mutationFn: async (payload: ChangeMemberBookRoleDto) => {
      console.log('➡️ POST Change Member Book Role');
      console.log(`🔸 URL: ${APIS.CompanyMemberBooks.changeMemberBookRole.Url()}`);
      console.log(`🔸 Request Body:`, payload);

      const response = await axiosInstance.post(
        APIS.CompanyMemberBooks.changeMemberBookRole.Url(),
        payload
      );

      console.log('✅ Response Status:', response.status);
      console.log('✅ Response Data:', response.data);

      if (response?.data) {
        return response.data;
      } else {
        throw new Error("Failed to change member book role");
      }
    },
    onSuccess: (res) => {
      // Invalidate relevant queries after successful update
      queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey[0] === APIS.CompanyMemberBooks.getBookMembers.Id ||
          query.queryKey[0] === APIS.CompanyMemberBooks.getMemberBookRole.Id,
      });
      queryClient.invalidateQueries({
        queryKey: [APIS.Cashbook.members.Id],
        exact: false,
      });
      toast.success(res.message || "Member role updated successfully");
    },
    onError: (error) => {
      console.error('❌ Error changing member book role:', error);
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

// Remove Member from Book Hook
export const useRemoveMemberFromBook = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, isError, error } = useMutation<
    BaseResponse,
    Error,
    RemoveMemberFromBookDto

  >({
    mutationKey: [APIS.CompanyMemberBooks.removeMemberFromBook.Id],
    mutationFn: async (payload: RemoveMemberFromBookDto) => {
      console.log('➡️ DELETE Remove Member from Book');
      console.log(`🔸 URL: ${APIS.CompanyMemberBooks.removeMemberFromBook.Url()}`);
      console.log(`🔸 Request Body:`, payload);

      const response = await axiosInstance.delete(
        APIS.CompanyMemberBooks.removeMemberFromBook.Url(),
        { data: payload }
      );

      console.log('✅ Response Status:', response.status);
      console.log('✅ Response Data:', response.data);

      if (response?.data) {
        return response.data;
      } else {
        throw new Error("Failed to remove member from book");
      }
    },
    onSuccess: (res) => {
      // Invalidate relevant queries after successful deletion
      queryClient.invalidateQueries({
        queryKey: [APIS.CompanyMemberBooks.getBookMembers.Id],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: [APIS.CompanyMemberBooks.getUserBooks.Id],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: [APIS.Cashbook.members.Id],
        exact: false,
      });
      toast.success(res.message || "Member removed successfully");
    },
    onError: (error) => {
      console.error('❌ Error removing member from book:', error);
      toast.error(error.message || "Failed to remove member from book");
    },
  });

  return {
    removeMemberFromBook: mutate,
    isRemovingMemberFromBook: isPending,
    isRemoveMemberFromBookError: isError,
    removeMemberFromBookError: error,
  };
};

// Reorder Books Hook
export const useReorderBooks = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, isError, error } = useMutation<
    BaseResponse,
    Error,
    ReorderBooksDto
  >({
    mutationKey: [APIS.CompanyMemberBooks.reorderBooks.Id],
    mutationFn: async (payload: ReorderBooksDto) => {
      console.log('➡️ POST Reorder Books');
      console.log(`🔸 URL: ${APIS.CompanyMemberBooks.reorderBooks.Url()}`);
      console.log(`🔸 Request Body:`, payload);

      const response = await axiosInstance.post(
        APIS.CompanyMemberBooks.reorderBooks.Url(),
        payload
      );

      console.log('✅ Response Status:', response.status);
      console.log('✅ Response Data:', response.data);

      if (response?.data) {
        return response.data;
      } else {
        throw new Error("Failed to reorder books");
      }
    },
    onSuccess: (res, variables) => {
      if (Array.isArray(res?.data) && res.data.length > 0) {
        applyBookOrderToListCache(queryClient, variables.companyId, res.data);
      }

      queryClient.invalidateQueries({
        queryKey: [APIS.CompanyMemberBooks.getUserBooks.Id],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: [APIS.CompanyMemberBooks.getMemberBooks.Id],
        exact: false,
      });

      toast.success(res.message || "Books reordered successfully");
    },
    onError: (error) => {
      console.error('❌ Error reordering books:', error);
      toast.error(error.message || "Failed to reorder books");
    },
  });

  return {
    reorderBooks: mutate,
    isReorderingBooks: isPending,
    isReorderBooksError: isError,
    reorderBooksError: error,
  };
};

// Get User Books Hook (with search functionality)
interface GetUserBooksParams {
  companyId: string;
  textSearch?: string;
}

export const useGetUserBooks = (
  params: GetUserBooksParams,
  enabled: boolean = true
) => {
  const {
    companyId,
    textSearch,
  } = params;

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useQuery<UserBooksResponse, Error>({
    queryKey: [
      APIS.CompanyMemberBooks.getUserBooks.Id,
      companyId,
      textSearch,
    ],
    queryFn: async () => {
      console.log('➡️ GET User Books');
      console.log(`🔸 URL: ${APIS.CompanyMemberBooks.getUserBooks.Url()}`);
      console.log(`🔸 Query Parameters:`, { companyId, textSearch });

      const response = await axiosInstance.get(
        APIS.CompanyMemberBooks.getUserBooks.Url(),
        {
          params: {
            companyId,
            ...(textSearch && textSearch.length > 0 && { textSearch }),
          },
        }
      );

      console.log('✅ Response Status:', response.status);
      console.log('✅ Response Data:', response.data);

      if (response?.data) {
        return response.data;
      } else {
        throw new Error("Failed to fetch user books");
      }
    },
    enabled: !!companyId && enabled,
    retry: false,
  });

  return {
    userBooks: data?.data || [],
    isUserBooksPending: isLoading || isRefetching,
    isUserBooksError: isError,
    userBooksError: error,
    refetchUserBooks: refetch,
  };
};
