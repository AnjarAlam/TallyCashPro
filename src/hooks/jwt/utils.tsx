import { axiosInstance } from "@/lib/axios";
import Cookies from "js-cookie";
import { JWT_STORAGE_KEY } from "./constant";
import { safeLocalStorage, safeSessionStorage } from "@/lib/safe-storage";
import { removeStoredFcmToken } from "@/lib/fcm-token";
import { clearStoredLastActivity } from "@/lib/session-inactivity";

// Cache for decoded tokens to avoid repeated decoding
const tokenCache = new Map<string, any>();

// ----------------------------------------------------------------------

export function jwtDecode(token: string) {
  try {
    if (!token?.trim()) return null;

    // Check cache first
    if (tokenCache.has(token)) {
      return tokenCache.get(token);
    }

    const parts = token.split(".");
    if (parts.length !== 3) {
      throw new Error("Invalid token structure");
    }

    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = JSON.parse(
      typeof atob === "function"
        ? atob(base64)
        : Buffer.from(base64, "base64").toString()
    );

    // Cache the decoded token
    tokenCache.set(token, decoded);
    return decoded;
  } catch (error) {
    console.error("JWT decode error:", error);
    return null;
  }
}

// ----------------------------------------------------------------------

export function isValidToken(accessToken?: string | null): boolean {
  if (!accessToken?.trim()) return false;

  try {
    const decoded = jwtDecode(accessToken);
    if (!decoded?.exp) return false;

    // Add 5s buffer to account for network latency
    return decoded.exp - Date.now() / 1000 > 5;
  } catch (error) {
    console.error("Token validation error:", error);
    return false;
  }
}

// ----------------------------------------------------------------------

const expirationTimers = new Map<string, NodeJS.Timeout>();

export function scheduleTokenExpiration(exp: number) {
  // Clear any existing timer for this token
  const existingTimer = expirationTimers.get(JWT_STORAGE_KEY);
  if (existingTimer) {
    clearTimeout(existingTimer);
  }

  const currentTime = Date.now();
  const timeLeft = Math.max(0, exp * 1000 - currentTime);

  const timer = setTimeout(() => {
    try {
      console.warn("Token expired - redirecting to login");
      Cookies.remove(JWT_STORAGE_KEY);
      tokenCache.clear();
      // window.location.assign(paths.auth.login);
    } catch (error) {
      console.error("Token expiration handler error:", error);
    } finally {
      expirationTimers.delete(JWT_STORAGE_KEY);
    }
  }, timeLeft);

  expirationTimers.set(JWT_STORAGE_KEY, timer);
}

// ----------------------------------------------------------------------

// Helper to get token from cookies or localStorage (fallback)
export function getStoredToken(): string | null {
  // Try cookies first
  const cookieToken = Cookies.get(JWT_STORAGE_KEY);
  if (cookieToken) return cookieToken;
  
  // Fallback to localStorage
  const localStorageToken = safeLocalStorage.getItem(JWT_STORAGE_KEY);
  return localStorageToken;
}

// ----------------------------------------------------------------------

export async function setSession(accessToken?: string | null) {
  try {
    // Clear existing token data
    const existingToken = getStoredToken();
    if (existingToken) {
      tokenCache.delete(existingToken);
    }
    const existingTimer = expirationTimers.get(JWT_STORAGE_KEY);
    if (existingTimer) clearTimeout(existingTimer);

    if (accessToken?.trim()) {
      // Validate before setting
      if (!isValidToken(accessToken)) {
        throw new Error("Invalid token provided");
      }

      // Store in both cookies and localStorage for maximum compatibility
      // Cookies for HTTP requests
      Cookies.set(
        JWT_STORAGE_KEY,
        accessToken,
        {
          expires: 7, // 7 days - cookie persists across browser sessions
          sameSite: "lax", // More compatible than "strict" for cross-platform
          path: "/",
        }
      );
      
      // localStorage as backup (more reliable on Windows)
      safeLocalStorage.setItem(JWT_STORAGE_KEY, accessToken);

      // Set axios default header
      axiosInstance.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

      // Schedule token expiration
      // const decoded = jwtDecode(accessToken);
      // if (decoded?.exp) {
      //   scheduleTokenExpiration(decoded.exp);
      // }
    } else {
      // Clear session from both storages
      Cookies.remove(JWT_STORAGE_KEY, { path: "/" });
      safeLocalStorage.removeItem(JWT_STORAGE_KEY);
      delete axiosInstance.defaults.headers.common.Authorization;
    }
  } catch (error) {
    console.error("Session set error:", error);
    // Ensure clean state on error
    Cookies.remove(JWT_STORAGE_KEY, { path: "/" });
    safeLocalStorage.removeItem(JWT_STORAGE_KEY);
    delete axiosInstance.defaults.headers.common.Authorization;
    throw error;
  }
}

// ----------------------------------------------------------------------

// Utility to get current token info
export function getCurrentTokenInfo() {
  const token = Cookies.get(JWT_STORAGE_KEY);
  if (!token) return null;

  const decoded = jwtDecode(token);
  return {
    token,
    decoded,
    isValid: isValidToken(token),
    expiresAt: decoded?.exp ? new Date(decoded.exp * 1000) : null,
  };
}

// Automatic token refresh (add to your utils)
// export async function refreshToken() {
//   try {
//     const response = await axiosInstance.post('/auth/refresh');
//     if (response.data.accessToken) {
//       await setSession(response.data.accessToken);
//       return true;
//     }
//     return false;
//   } catch (error) {
//     await setSession(null);
//     return false;
//   }
// }

// Periodic token validity check
// export function startTokenWatcher(interval = 30000) {
//   const check = async () => {
//     const token = Cookies.get(JWT_STORAGE_KEY);
//     if (token && !isValidToken(token)) {
//       try {
//         await refreshToken();
//       } catch {
//         await setSession(null);
//       }
//     }
//   };

//   const timer = setInterval(check, interval);
//   return () => clearInterval(timer);
// }

function hardRemoveCookie(name: string) {
  if (typeof document === "undefined") return;

  const expire = "expires=Thu, 01 Jan 1970 00:00:00 GMT";
  const hostname = window.location.hostname;
  const paths = ["/"];
  const domains: (string | undefined)[] = [undefined];

  if (hostname) {
    domains.push(hostname, `.${hostname}`);
  }

  for (const path of paths) {
    for (const domain of domains) {
      const options: Cookies.CookieAttributes = { path };
      if (domain) options.domain = domain;
      Cookies.remove(name, options);
    }
  }

  document.cookie = `${name}=; ${expire}; path=/`;
  if (hostname) {
    document.cookie = `${name}=; ${expire}; path=/; domain=${hostname}`;
  }
}

export function clearAuthStorage() {
  const token = getStoredToken();

  hardRemoveCookie(JWT_STORAGE_KEY);
  safeLocalStorage.removeItem(JWT_STORAGE_KEY);
  safeLocalStorage.removeItem("currentBusiness");
  removeStoredFcmToken();

  safeSessionStorage.removeItem("signUpToken");
  safeSessionStorage.removeItem("hasSeenModal");
  safeSessionStorage.removeItem("authReturnTo");
  clearStoredLastActivity();

  if (token) {
    tokenCache.delete(token);
  }

  delete axiosInstance.defaults.headers.common.Authorization;

  const existingTimer = expirationTimers.get(JWT_STORAGE_KEY);
  if (existingTimer) {
    clearTimeout(existingTimer);
    expirationTimers.delete(JWT_STORAGE_KEY);
  }
}

export function removeToken() {
  try {
    clearAuthStorage();
    return true;
  } catch (error) {
    console.error("Error removing token:", error);
    return false;
  }
}
