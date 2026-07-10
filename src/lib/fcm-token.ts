import { FCM_TOKEN_STORAGE_KEY } from "@/constants/fcm";
import { safeLocalStorage } from "@/lib/safe-storage";

export function getStoredFcmToken(): string | null {
  return safeLocalStorage.getItem(FCM_TOKEN_STORAGE_KEY);
}

export function setStoredFcmToken(token: string): void {
  safeLocalStorage.setItem(FCM_TOKEN_STORAGE_KEY, token);
}

export function removeStoredFcmToken(): void {
  safeLocalStorage.removeItem(FCM_TOKEN_STORAGE_KEY);
}
