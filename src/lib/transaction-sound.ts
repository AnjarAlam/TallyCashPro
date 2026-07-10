import { TRANSACTION_SOUND_PREF_KEY } from "@/constants/storage";
import { safeLocalStorage } from "@/lib/safe-storage";

export const CASH_TRANSACTION_SOUND_URL = "/cashsound.mp3";

let audioInstance: HTMLAudioElement | null = null;

export function isTransactionSoundEnabled(): boolean {
  return safeLocalStorage.getItem(TRANSACTION_SOUND_PREF_KEY) === "true";
}

export function setTransactionSoundEnabled(enabled: boolean): void {
  safeLocalStorage.setItem(TRANSACTION_SOUND_PREF_KEY, String(enabled));
}

function getAudio(): HTMLAudioElement | null {
  if (typeof window === "undefined") return null;
  if (!audioInstance) {
    audioInstance = new Audio(CASH_TRANSACTION_SOUND_URL);
    audioInstance.preload = "auto";
  }
  return audioInstance;
}

/** Play cash transaction sound when enabled in settings. */
export function playTransactionSound(): void {
  if (!isTransactionSoundEnabled()) return;

  const audio = getAudio();
  if (!audio) return;

  audio.currentTime = 0;
  const playPromise = audio.play();
  if (playPromise) {
    playPromise.catch((err) => {
      console.warn("Transaction sound playback failed:", err);
    });
  }
}

export function isCashTransactionType(
  type?: string | null,
): type is "cash_in" | "cash_out" {
  return type === "cash_in" || type === "cash_out";
}

/** Whether an FCM / notification payload represents a cash in or cash out event. */
export function shouldPlaySoundForNotificationData(
  data?: Record<string, unknown> | null,
): boolean {
  if (!data) return false;

  const txType = data.txType as string | undefined;
  if (isCashTransactionType(txType)) return true;

  const notificationType = data.type as string | undefined;
  if (notificationType === "transaction_created") return true;

  if (data.sync === "true" || data.sync === true) {
    return isCashTransactionType(txType);
  }

  return false;
}

export function playTransactionSoundIfCashEvent(
  data?: Record<string, unknown> | null,
): void {
  if (shouldPlaySoundForNotificationData(data)) {
    playTransactionSound();
  }
}
