"use client";

import { SessionTimeoutModal } from "@/components/session/session-timeout-modal";
import { useAuth } from "@/hooks";
import {
  clearStoredLastActivity,
  evaluateInactivity,
  getStoredLastActivity,
  recordSessionActivity,
  WARNING_COUNTDOWN_MS,
} from "@/lib/session-inactivity";
import { usePathname } from "next/navigation";
import {
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

const ACTIVITY_THROTTLE_MS = 1000;
const TICK_INTERVAL_MS = 1000;

const ACTIVITY_EVENTS = [
  "mousemove",
  "mousedown",
  "click",
  "keydown",
  "scroll",
  "touchstart",
  "touchmove",
] as const;

const PUBLIC_PATHS = ["/login", "/signup", "/"];

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
}

export function SessionInactivityProvider({ children }: { children: ReactNode }) {
  const { isLoggedin, loading, logout } = useAuth();
  const pathname = usePathname();

  const [showWarning, setShowWarning] = useState(false);
  const [countdownMs, setCountdownMs] = useState(WARNING_COUNTDOWN_MS);

  const lastActivityAtRef = useRef(Date.now());
  const warningStartedAtRef = useRef<number | null>(null);
  const tickIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const showWarningRef = useRef(false);
  const logoutRef = useRef(logout);
  const isLoggingOutRef = useRef(false);
  const isMonitoringRef = useRef(false);

  logoutRef.current = logout;

  const isMonitoring =
    isLoggedin && !loading && !isPublicPath(pathname);

  isMonitoringRef.current = isMonitoring;

  const clearTickInterval = useCallback(() => {
    if (tickIntervalRef.current) {
      clearInterval(tickIntervalRef.current);
      tickIntervalRef.current = null;
    }
  }, []);

  const applyInactivityStatus = useCallback(
    (status: ReturnType<typeof evaluateInactivity>) => {
      if (status.state === "expired") {
        void performLogoutRef.current();
        return;
      }

      if (status.state === "warning") {
        warningStartedAtRef.current = status.warningStartedAt;
        showWarningRef.current = true;
        setShowWarning(true);
        setCountdownMs(status.remainingMs);
        return;
      }

      warningStartedAtRef.current = null;
      showWarningRef.current = false;
      setShowWarning(false);
      setCountdownMs(WARNING_COUNTDOWN_MS);
    },
    [],
  );

  const performLogout = useCallback(async () => {
    if (isLoggingOutRef.current) return;
    isLoggingOutRef.current = true;

    clearTickInterval();
    clearStoredLastActivity();
    showWarningRef.current = false;
    warningStartedAtRef.current = null;
    setShowWarning(false);

    await logoutRef.current();
  }, [clearTickInterval]);

  const performLogoutRef = useRef(performLogout);
  performLogoutRef.current = performLogout;

  const syncSessionState = useCallback(() => {
    if (!isMonitoringRef.current || isLoggingOutRef.current) return;

    const stored = getStoredLastActivity();
    if (stored) {
      lastActivityAtRef.current = stored;
    }

    const status = evaluateInactivity(lastActivityAtRef.current);
    applyInactivityStatus(status);
  }, [applyInactivityStatus]);

  const recordActivity = useCallback(() => {
    if (!isMonitoringRef.current || showWarningRef.current) return;
    lastActivityAtRef.current = recordSessionActivity();
  }, []);

  const handleStayLoggedIn = useCallback(() => {
    lastActivityAtRef.current = recordSessionActivity();
    warningStartedAtRef.current = null;
    showWarningRef.current = false;
    setShowWarning(false);
    setCountdownMs(WARNING_COUNTDOWN_MS);
  }, []);

  const handleLogout = useCallback(() => {
    void performLogout();
  }, [performLogout]);

  const handleResume = useCallback(() => {
    syncSessionState();
  }, [syncSessionState]);

  const handleVisibilityChange = useCallback(() => {
    if (document.visibilityState === "visible") {
      syncSessionState();
    }
  }, [syncSessionState]);

  useEffect(() => {
    if (!isMonitoring) {
      clearTickInterval();
      showWarningRef.current = false;
      warningStartedAtRef.current = null;
      setShowWarning(false);
      isLoggingOutRef.current = false;
      return;
    }

    isLoggingOutRef.current = false;

    const stored = getStoredLastActivity();
    if (stored) {
      lastActivityAtRef.current = stored;
    } else {
      lastActivityAtRef.current = recordSessionActivity();
    }

    syncSessionState();

    let throttleTimer: ReturnType<typeof setTimeout> | null = null;

    const onActivity = () => {
      if (throttleTimer) return;

      throttleTimer = setTimeout(() => {
        throttleTimer = null;
      }, ACTIVITY_THROTTLE_MS);

      recordActivity();
    };

    ACTIVITY_EVENTS.forEach((event) => {
      window.addEventListener(event, onActivity, { passive: true });
    });

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleResume);
    window.addEventListener("pageshow", handleResume);

    clearTickInterval();
    tickIntervalRef.current = setInterval(syncSessionState, TICK_INTERVAL_MS);

    return () => {
      ACTIVITY_EVENTS.forEach((event) => {
        window.removeEventListener(event, onActivity);
      });
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleResume);
      window.removeEventListener("pageshow", handleResume);
      if (throttleTimer) clearTimeout(throttleTimer);
      clearTickInterval();
    };
  }, [
    isMonitoring,
    recordActivity,
    syncSessionState,
    handleResume,
    handleVisibilityChange,
    clearTickInterval,
  ]);

  return (
    <>
      {children}
      <SessionTimeoutModal
        open={showWarning}
        countdownMs={countdownMs}
        onStayLoggedIn={handleStayLoggedIn}
        onLogout={handleLogout}
      />
    </>
  );
}
