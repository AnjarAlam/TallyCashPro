import { AUTH_API } from "@/constants/api";
import { axiosInstance } from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";
import type {
    LogoutResponse,
    RefreshTokenDto,
    RefreshTokenResponse,
    RequestOtpDto,
    RequestOtpResponse,
    UpdateUserDto,
    UpdateUserResponse,
    VerifyOtpDto,
    VerifyOtpResponse,
} from "@/interface/auth.types";

// Send OTP
export const useSendOtp = () => {
    const { mutate, isPending, isError, error } = useMutation({
        mutationKey: [AUTH_API.REQUEST_OTP.ID],
        mutationFn: async (payload: RequestOtpDto): Promise<RequestOtpResponse> => {
            const res = await axiosInstance.post(AUTH_API.REQUEST_OTP.URL, payload);
            return res.data;
        },
    });

    return {
        sendOtp: mutate,
        isSendingOtp: isPending,
        isSendingOtpError: isError,
        sendOtpError: error,
    };
};

// Verify OTP
export const useVerifyOtp = () => {
    const { mutate, isPending, isError, error } = useMutation({
        mutationKey: [AUTH_API.VERIFY_OTP.ID],
        mutationFn: async (payload: VerifyOtpDto): Promise<VerifyOtpResponse> => {
            const res = await axiosInstance.post(AUTH_API.VERIFY_OTP.URL, payload);
            return res.data;
        },
    });

    return {
        verifyOtp: mutate,
        isVerifyingOtp: isPending,
        isVerifyOtpError: isError,
        verifyOtpError: error,
    };
};

// Refresh Token
export const useRefreshToken = () => {
    const { mutate, isPending, isError, error } = useMutation({
        mutationKey: [AUTH_API.REFRESH_TOKEN.ID],
        mutationFn: async (payload: RefreshTokenDto): Promise<RefreshTokenResponse> => {
            const res = await axiosInstance.post(AUTH_API.REFRESH_TOKEN.URL, payload);
            return res.data;
        },
    });

    return {
        refreshToken: mutate,
        isRefreshingToken: isPending,
        isRefreshTokenError: isError,
        refreshTokenError: error,
    };
};

// Logout
export const useLogout = () => {
    const { mutate, isPending, isError, error } = useMutation({
        mutationKey: [AUTH_API.LOGOUT.ID],
        mutationFn: async (): Promise<LogoutResponse> => {
            const res = await axiosInstance.post(AUTH_API.LOGOUT.URL);
            return res.data;
        },
    });

    return {
        logout: mutate,
        isLoggingOut: isPending,
        isLogoutError: isError,
        logoutError: error,
    };
};



export const useUpdateUser = () => {
    const queryClient = useQueryClient();
    const token = Cookies.get("accessToken");
    const { mutate, isPending, isError, error } = useMutation({
        mutationKey: [AUTH_API.UPDATE.ID], // You can define a constant for this like you did with AUTH_API
        mutationFn: async (payload: UpdateUserDto): Promise<UpdateUserResponse> => {
            const res = await axiosInstance.patch(AUTH_API.UPDATE.URL, payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }); // Using PATCH as we're updating
            return res.data;
        },
        onSuccess: async (res) => {
            // Invalidate queries or perform any other side effects after successful registration
            queryClient.invalidateQueries({ queryKey: ['auth-user'], exact: false });
            // Optionally, you can redirect or update global state here
        },
    });

    return {
        updateUser: mutate,
        isUpdatingUser: isPending,
        isUpdatingUserError: isError,
        updateUserError: error,
    };
};


export const useRegisterUser = () => {
    const queryClient = useQueryClient();
    const { mutate, isPending, isError, error } = useMutation({
        mutationKey: [AUTH_API.UPDATE.ID], // You can define a constant for this like you did with AUTH_API
        mutationFn: async ({ signupToken, payload }: { signupToken: string, payload: UpdateUserDto }): Promise<UpdateUserResponse> => {
            const res = await axiosInstance.patch(AUTH_API.UPDATE.URL, payload, {
                headers: {
                    Authorization: `Bearer ${signupToken}`,
                },
            }); // Using PATCH as we're updating
            return res.data;
        },
        onSuccess: async (res) => {
            // Invalidate queries or perform any other side effects after successful registration
            queryClient.invalidateQueries({ queryKey: ['auth-user'], exact: false });
            // Optionally, you can redirect or update global state here
        },
        onError: (err) => {
            console.error("Registration error:", err);
        }
    });

    return {
        registerUser: mutate,
        isRegisteringUser: isPending,
        isRegisterUserError: isError,
        registerUserError: error,
    };

    
};

export const useDeleteAccount = () => {
    const { mutate, isPending, isError, error } = useMutation({
        mutationKey: [AUTH_API.DELETE_ACCOUNT.ID],
        mutationFn: async (userId: string): Promise<any> => {
            const token = Cookies.get("accessToken");
            const res = await axiosInstance.delete(AUTH_API.DELETE_ACCOUNT.URL(userId), {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return res.data;
        },
    });

    return {
        deleteAccount: mutate,
        isDeletingAccount: isPending,
        isDeleteAccountError: isError,
        deleteAccountError: error,
    };
};