import { FCM_API } from "@/constants/api";
import { axiosInstance } from "@/lib/axios";
import { getStoredFcmToken, removeStoredFcmToken } from "@/lib/fcm-token";

/** Unregister FCM token on logout (no React hooks). */
export async function unregisterStoredFcmToken(): Promise<void> {
  const token = getStoredFcmToken();
  if (!token) return;

  try {
    await axiosInstance.post(FCM_API.UNREGISTER_TOKEN.URL, { token });
  } catch (error) {
    console.warn("FCM unregister failed:", error);
  } finally {
    removeStoredFcmToken();
  }
}
