import { IUserData } from "@/interface";
import { axiosInstance } from "@/lib/axios";
import { getStoredToken, isValidToken } from "@/hooks/jwt/utils";
import { useQuery } from "@tanstack/react-query";

export const useGetAuthUser = () => {
    const token = getStoredToken();
    const hasToken = token ? isValidToken(token) : false;

    const {
        isError,
        error,
        data,
        isLoading,
        refetch,
        isRefetching,
    } = useQuery<IUserData, Error>({
        queryKey: ['auth-user'],
        enabled: hasToken,
        queryFn: async () => {
            const response = await axiosInstance.get("/users/current");

            if (response?.data?.data) return response.data.data;
            else throw new Error("Try Again Later");
        },
        retry: false,
    });

    return {
        refetchUserDetail: refetch,
        userDetailData: data,
        isUserDetailPending: isLoading || isRefetching,
        isUserDetailError: isError,
        userDetailError: error,
    };
};