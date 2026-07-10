import { AUTH_API } from "@/constants/api";
import { axiosInstance } from "@/lib/axios";
import {
  SessionActionResponse,
  SessionsListResponse,
  UpdateSessionNicknamePayload,
} from "@/interface/session.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useGetSessions = () => {
  const { data, isLoading, isError, error, refetch, isRefetching } = useQuery<
    SessionsListResponse,
    Error
  >({
    queryKey: [AUTH_API.SESSIONS.ID],
    queryFn: async () => {
      const response = await axiosInstance.get(AUTH_API.SESSIONS.URL);
      if (response?.data) {
        return response.data as SessionsListResponse;
      }
      throw new Error("Failed to fetch sessions");
    },
    retry: false,
  });

  return {
    sessions: data?.data ?? [],
    sessionsMessage: data?.message,
    isSessionsPending: isLoading || isRefetching,
    isSessionsError: isError,
    sessionsError: error,
    refetchSessions: refetch,
  };
};

export const useLogoutSession = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, isError, error } = useMutation<
    SessionActionResponse,
    Error,
    string,
    { previous?: SessionsListResponse }
  >({
    mutationKey: [AUTH_API.LOGOUT_SESSION.ID],
    mutationFn: async (sessionId: string) => {
      const response = await axiosInstance.delete(
        AUTH_API.LOGOUT_SESSION.URL(sessionId),
      );
      if (response?.data) {
        return response.data as SessionActionResponse;
      }
      throw new Error("Failed to log out session");
    },
    onMutate: async (sessionId) => {
      await queryClient.cancelQueries({ queryKey: [AUTH_API.SESSIONS.ID] });
      const previous = queryClient.getQueryData<SessionsListResponse>([
        AUTH_API.SESSIONS.ID,
      ]);
      if (previous?.data) {
        queryClient.setQueryData<SessionsListResponse>([AUTH_API.SESSIONS.ID], {
          ...previous,
          data: previous.data.filter((s) => s.sessionId !== sessionId),
        });
      }
      return { previous };
    },
    onSuccess: (res) => {
      toast.success(res.message || "Session logged out successfully");
    },
    onError: (err, _sessionId, context) => {
      if (context?.previous) {
        queryClient.setQueryData([AUTH_API.SESSIONS.ID], context.previous);
      }
      toast.error(err.message || "Failed to log out session");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [AUTH_API.SESSIONS.ID] });
    },
  });

  return {
    logoutSession: mutate,
    isLoggingOutSession: isPending,
    isLogoutSessionError: isError,
    logoutSessionError: error,
  };
};

export const useLogoutAllOtherSessions = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, isError, error } = useMutation<
    SessionActionResponse,
    Error,
    void
  >({
    mutationKey: [AUTH_API.LOGOUT_ALL_OTHER_SESSIONS.ID],
    mutationFn: async () => {
      const response = await axiosInstance.delete(
        AUTH_API.LOGOUT_ALL_OTHER_SESSIONS.URL,
      );
      if (response?.data) {
        return response.data as SessionActionResponse;
      }
      throw new Error("Failed to log out other sessions");
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: [AUTH_API.SESSIONS.ID] });
      toast.success(res.message || "All other sessions logged out successfully");
    },
    onError: (err) => {
      toast.error(err.message || "Failed to log out other sessions");
    },
  });

  return {
    logoutAllOtherSessions: mutate,
    isLoggingOutAllOther: isPending,
    isLogoutAllOtherError: isError,
    logoutAllOtherError: error,
  };
};

export const useUpdateSessionNickname = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, isError, error, variables } = useMutation<
    SessionActionResponse,
    Error,
    UpdateSessionNicknamePayload,
    { previous?: SessionsListResponse }
  >({
    mutationKey: [AUTH_API.UPDATE_SESSION_NICKNAME.ID],
    mutationFn: async ({ sessionId, nickname }) => {
      const response = await axiosInstance.post(
        AUTH_API.UPDATE_SESSION_NICKNAME.URL(sessionId),
        { nickname },
      );
      if (response?.data) {
        return response.data as SessionActionResponse;
      }
      throw new Error("Failed to update device name");
    },
    onMutate: async ({ sessionId, nickname }) => {
      await queryClient.cancelQueries({ queryKey: [AUTH_API.SESSIONS.ID] });
      const previous = queryClient.getQueryData<SessionsListResponse>([
        AUTH_API.SESSIONS.ID,
      ]);
      if (previous?.data) {
        queryClient.setQueryData<SessionsListResponse>([AUTH_API.SESSIONS.ID], {
          ...previous,
          data: previous.data.map((s) =>
            s.sessionId === sessionId ? { ...s, nickname } : s,
          ),
        });
      }
      return { previous };
    },
    onSuccess: (res) => {
      toast.success(res.message || "Device name updated");
    },
    onError: (err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData([AUTH_API.SESSIONS.ID], context.previous);
      }
      toast.error(err.message || "Failed to update device name");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [AUTH_API.SESSIONS.ID] });
    },
  });

  return {
    updateSessionNickname: mutate,
    isUpdatingNickname: isPending,
    updatingSessionId: variables?.sessionId,
    isUpdateNicknameError: isError,
    updateNicknameError: error,
  };
};
