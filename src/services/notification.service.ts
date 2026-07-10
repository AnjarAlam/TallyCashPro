import { NOTIFICATIONS_API } from "@/constants/api";
import { axiosInstance } from "@/lib/axios";
import {
  NotificationsListResponse,
  NotificationsQueryParams,
  UnreadCountResponse,
} from "@/interface/notification.types";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

const DEFAULT_PAGE_SIZE = 20;

export const useGetUnreadNotificationCount = (enabled = true) => {
  const { data, isLoading, isError, error, refetch } = useQuery<
    UnreadCountResponse,
    Error
  >({
    queryKey: [NOTIFICATIONS_API.UNREAD_COUNT.ID],
    queryFn: async () => {
      const response = await axiosInstance.get(
        NOTIFICATIONS_API.UNREAD_COUNT.URL,
      );
      if (response?.data) {
        return response.data as UnreadCountResponse;
      }
      throw new Error("Failed to fetch unread count");
    },
    enabled,
    refetchInterval: enabled ? 60_000 : false,
    staleTime: 30_000,
    retry: false,
  });

  return {
    unreadCount: data?.data?.count ?? 0,
    isUnreadCountPending: isLoading,
    isUnreadCountError: isError,
    unreadCountError: error,
    refetchUnreadCount: refetch,
  };
};

export const useGetNotifications = (
  params: NotificationsQueryParams = {},
  enabled = true,
) => {
  const page = params.page ?? 1;
  const limit = params.limit ?? DEFAULT_PAGE_SIZE;

  const { data, isLoading, isError, error, refetch, isRefetching } = useQuery<
    NotificationsListResponse,
    Error
  >({
    queryKey: [NOTIFICATIONS_API.LIST.ID, page, limit],
    queryFn: async () => {
      const response = await axiosInstance.get(NOTIFICATIONS_API.LIST.URL, {
        params: { page, limit },
      });
      if (response?.data) {
        return response.data as NotificationsListResponse;
      }
      throw new Error("Failed to fetch notifications");
    },
    enabled,
    retry: false,
  });

  const listData = data?.data;

  return {
    notifications: listData?.items ?? [],
    total: listData?.total ?? 0,
    unreadCount: listData?.unreadCount ?? 0,
    page: listData?.page ?? page,
    totalPages: listData?.totalPages ?? 1,
    isNotificationsPending: isLoading || isRefetching,
    isNotificationsError: isError,
    notificationsError: error,
    refetchNotifications: refetch,
  };
};

function invalidateNotificationQueries(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({
    queryKey: [NOTIFICATIONS_API.UNREAD_COUNT.ID],
  });
  queryClient.invalidateQueries({
    queryKey: [NOTIFICATIONS_API.LIST.ID],
  });
}

export const useMarkNotificationRead = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, isError, error } = useMutation<void, Error, string>({
    mutationKey: [NOTIFICATIONS_API.READ_ONE.ID],
    mutationFn: async (id) => {
      await axiosInstance.patch(NOTIFICATIONS_API.READ_ONE.URL(id));
    },
    onSuccess: () => {
      invalidateNotificationQueries(queryClient);
    },
    onError: (err) => {
      toast.error(err.message || "Failed to mark as read");
    },
  });

  return {
    markNotificationRead: mutate,
    isMarkingRead: isPending,
    isMarkReadError: isError,
    markReadError: error,
  };
};

export const useMarkAllNotificationsRead = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, isError, error } = useMutation<void, Error, void>({
    mutationKey: [NOTIFICATIONS_API.READ_ALL.ID],
    mutationFn: async () => {
      await axiosInstance.patch(NOTIFICATIONS_API.READ_ALL.URL);
    },
    onSuccess: () => {
      invalidateNotificationQueries(queryClient);
      toast.success("All notifications marked as read");
    },
    onError: (err) => {
      toast.error(err.message || "Failed to mark all as read");
    },
  });

  return {
    markAllNotificationsRead: mutate,
    isMarkingAllRead: isPending,
    isMarkAllReadError: isError,
    markAllReadError: error,
  };
};

export const useDeleteNotification = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, isError, error } = useMutation<void, Error, string>({
    mutationKey: [NOTIFICATIONS_API.DELETE_ONE.ID],
    mutationFn: async (id) => {
      await axiosInstance.delete(NOTIFICATIONS_API.DELETE_ONE.URL(id));
    },
    onSuccess: () => {
      invalidateNotificationQueries(queryClient);
      toast.success("Notification deleted");
    },
    onError: (err) => {
      toast.error(err.message || "Failed to delete notification");
    },
  });

  return {
    deleteNotification: mutate,
    isDeletingNotification: isPending,
    isDeleteNotificationError: isError,
    deleteNotificationError: error,
  };
};

export const useDeleteAllNotifications = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, isError, error } = useMutation<void, Error, void>({
    mutationKey: [NOTIFICATIONS_API.DELETE_ALL.ID],
    mutationFn: async () => {
      await axiosInstance.delete(NOTIFICATIONS_API.DELETE_ALL.URL);
    },
    onSuccess: () => {
      invalidateNotificationQueries(queryClient);
      toast.success("All notifications deleted");
    },
    onError: (err) => {
      toast.error(err.message || "Failed to delete notifications");
    },
  });

  return {
    deleteAllNotifications: mutate,
    isDeletingAllNotifications: isPending,
    isDeleteAllError: isError,
    deleteAllError: error,
  };
};
