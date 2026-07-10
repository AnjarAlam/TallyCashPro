import { FCM_API } from "@/constants/api";
import { axiosInstance } from "@/lib/axios";
import {
  FcmActionResponse,
  FcmTokenPayload,
  SendFcmNotificationPayload,
} from "@/interface/fcm.types";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useRegisterFCMToken = () => {
  const { mutate, isPending, isError, error, isSuccess } = useMutation<
    FcmActionResponse,
    Error,
    FcmTokenPayload
  >({
    mutationKey: [FCM_API.REGISTER_TOKEN.ID],
    mutationFn: async (payload) => {
      const response = await axiosInstance.post(
        FCM_API.REGISTER_TOKEN.URL,
        payload,
      );
      if (response?.data) {
        return response.data as FcmActionResponse;
      }
      throw new Error("Failed to register FCM token");
    },
    onError: (err) => {
      console.error("FCM register error:", err);
    },
  });

  return {
    registerFCMToken: mutate,
    isRegistering: isPending,
    isRegistrationError: isError,
    isRegistrationSuccess: isSuccess,
    registrationError: error,
  };
};

export const useUnregisterFCMToken = () => {
  const { mutate, isPending, isError, error } = useMutation<
    FcmActionResponse,
    Error,
    FcmTokenPayload
  >({
    mutationKey: [FCM_API.UNREGISTER_TOKEN.ID],
    mutationFn: async (payload) => {
      const response = await axiosInstance.post(
        FCM_API.UNREGISTER_TOKEN.URL,
        payload,
      );
      if (response?.data) {
        return response.data as FcmActionResponse;
      }
      throw new Error("Failed to unregister FCM token");
    },
  });

  return {
    unregisterFCMToken: mutate,
    isUnregistering: isPending,
    isUnregisterError: isError,
    unregisterError: error,
  };
};

export const useSendFcmNotification = () => {
  const { mutate, isPending, isError, error, data } = useMutation<
    FcmActionResponse,
    Error,
    SendFcmNotificationPayload
  >({
    mutationKey: [FCM_API.SEND_NOTIFICATION.ID],
    mutationFn: async (payload) => {
      if (!payload.userId && !payload.topic) {
        throw new Error("Either userId or topic must be provided");
      }
      const response = await axiosInstance.post(
        FCM_API.SEND_NOTIFICATION.URL,
        payload,
      );
      if (response?.data) {
        return response.data as FcmActionResponse;
      }
      throw new Error("Failed to send notification");
    },
    onSuccess: (res) => {
      toast.success(res.message || "Notification sent");
    },
    onError: (err) => {
      toast.error(err.message || "Failed to send notification");
    },
  });

  return {
    sendFcmNotification: mutate,
    isSendingNotification: isPending,
    isSendNotificationError: isError,
    sendNotificationError: error,
    sendNotificationResponse: data,
  };
};

export const useSubscribeFcmTopic = () => {
  const { mutate, isPending, isError, error } = useMutation<
    FcmActionResponse,
    Error,
    string
  >({
    mutationKey: [FCM_API.SUBSCRIBE_TOPIC.ID],
    mutationFn: async (topic) => {
      const response = await axiosInstance.post(
        FCM_API.SUBSCRIBE_TOPIC.URL(topic),
      );
      if (response?.data) {
        return response.data as FcmActionResponse;
      }
      throw new Error("Failed to subscribe to topic");
    },
    onSuccess: (res) => {
      toast.success(res.message || "Subscribed successfully");
    },
    onError: (err) => {
      toast.error(err.message || "Failed to subscribe");
    },
  });

  return {
    subscribeFcmTopic: mutate,
    isSubscribingTopic: isPending,
    isSubscribeTopicError: isError,
    subscribeTopicError: error,
  };
};

export const useUnsubscribeFcmTopic = () => {
  const { mutate, isPending, isError, error } = useMutation<
    FcmActionResponse,
    Error,
    string
  >({
    mutationKey: [FCM_API.UNSUBSCRIBE_TOPIC.ID],
    mutationFn: async (topic) => {
      const response = await axiosInstance.post(
        FCM_API.UNSUBSCRIBE_TOPIC.URL(topic),
      );
      if (response?.data) {
        return response.data as FcmActionResponse;
      }
      throw new Error("Failed to unsubscribe from topic");
    },
    onSuccess: (res) => {
      toast.success(res.message || "Unsubscribed successfully");
    },
    onError: (err) => {
      toast.error(err.message || "Failed to unsubscribe");
    },
  });

  return {
    unsubscribeFcmTopic: mutate,
    isUnsubscribingTopic: isPending,
    isUnsubscribeTopicError: isError,
    unsubscribeTopicError: error,
  };
};
