/** FCM topics auto-subscribed by backend on token register */
export const FCM_TOPICS = {
  ALL_USERS: "all_users",
  GENERAL_UPDATES: "general_updates",
} as const;

export const FCM_TOKEN_STORAGE_KEY = "fcmDeviceToken";
