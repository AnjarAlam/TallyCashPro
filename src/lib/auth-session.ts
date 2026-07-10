import { getStoredToken } from "@/hooks/jwt/utils";

let isRedirecting = false;

const AUTH_PUBLIC_PATHS = [
  "/auth/send-otp",
  "/auth/verify-otp",
  "/auth/register",
  "/auth/refresh-token",
];

const PUBLIC_PAGES = ["/login", "/signup", "/"];

function isPublicPage(): boolean {
  if (typeof window === "undefined") return false;
  const path = window.location.pathname;
  return PUBLIC_PAGES.some((p) => path === p || path.startsWith(`${p}/`));
}

export function isAuthPublicEndpoint(url?: string): boolean {
  if (!url) return false;
  return AUTH_PUBLIC_PATHS.some((path) => url.includes(path));
}

export function shouldHandleUnauthorized(requestUrl?: string): boolean {
  if (isRedirecting) return false;
  if (isPublicPage()) return false;
  if (isAuthPublicEndpoint(requestUrl)) return false;
  if (!getStoredToken()) return false;
  return true;
}

export async function forceAuthRedirect() {
  if (isRedirecting) return;
  isRedirecting = true;

  try {
    const { clearAuthStorage } = await import("@/hooks/jwt/utils");
    clearAuthStorage();
  } catch (error) {
    console.error("Failed to clear auth storage:", error);
  }

  window.location.replace("/login");
}
