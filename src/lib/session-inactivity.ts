import { safeLocalStorage } from "@/lib/safe-storage";

// ---------------------------------------------------------------------------
// Timeout constants — change these values directly for testing / production.
// ---------------------------------------------------------------------------
//export const INACTIVITY_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes (testing)
 export const INACTIVITY_TIMEOUT_MS = 30 * 60 * 1000; // 1 hour (production)

export const WARNING_COUNTDOWN_MS = 3 * 60 * 1000; // 3 minutes

export const SESSION_LAST_ACTIVITY_KEY = "sessionLastActivityAt";

export type InactivityStatus =
  | { state: "active" }
  | { state: "warning"; remainingMs: number; warningStartedAt: number }
  | { state: "expired" };

export function getStoredLastActivity(): number | null {
  const raw = safeLocalStorage.getItem(SESSION_LAST_ACTIVITY_KEY);
  if (!raw) return null;

  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : null;
}

export function setStoredLastActivity(timestamp: number = Date.now()): void {
  safeLocalStorage.setItem(SESSION_LAST_ACTIVITY_KEY, String(timestamp));
}

export function clearStoredLastActivity(): void {
  safeLocalStorage.removeItem(SESSION_LAST_ACTIVITY_KEY);
}

export function recordSessionActivity(): number {
  const now = Date.now();
  setStoredLastActivity(now);
  return now;
}

export function evaluateInactivity(
  lastActivityAt: number,
  now: number = Date.now(),
): InactivityStatus {
  const idleElapsed = now - lastActivityAt;
  const totalTimeoutMs = INACTIVITY_TIMEOUT_MS + WARNING_COUNTDOWN_MS;

  if (idleElapsed >= totalTimeoutMs) {
    return { state: "expired" };
  }

  if (idleElapsed >= INACTIVITY_TIMEOUT_MS) {
    const warningStartedAt = lastActivityAt + INACTIVITY_TIMEOUT_MS;
    const warningElapsed = idleElapsed - INACTIVITY_TIMEOUT_MS;
    const remainingMs = WARNING_COUNTDOWN_MS - warningElapsed;

    return { state: "warning", remainingMs, warningStartedAt };
  }

  return { state: "active" };
}

export function isInactivityExpired(
  lastActivityAt: number,
  now: number = Date.now(),
): boolean {
  return evaluateInactivity(lastActivityAt, now).state === "expired";
}
