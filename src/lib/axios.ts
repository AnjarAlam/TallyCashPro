import { AUTH_API } from "@/constants/api";
import { JWT_STORAGE_KEY } from "@/hooks/jwt/constant";
import {
  forceAuthRedirect,
  isAuthPublicEndpoint,
  shouldHandleUnauthorized,
} from "@/lib/auth-session";
import axios from "axios";
import Cookies from "js-cookie";
import { safeLocalStorage } from "./safe-storage";
import { getStoredFcmToken } from "@/lib/fcm-token";

// Helper to get token from cookies or localStorage
const getToken = () => {
  const cookieToken = Cookies.get(JWT_STORAGE_KEY);
  if (cookieToken) return cookieToken;
  return safeLocalStorage.getItem(JWT_STORAGE_KEY);
};

export const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL ,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
    maxContentLength: Infinity, // allow large content
    maxBodyLength: Infinity,   // allow large body
    maxRedirects: 5,
});

// Add request interceptor to include the token
axiosInstance.interceptors.request.use(
    (config) => {

        // Skip adding Authorization header for update-profile endpoint
        if (config.url && (
            config.url.endsWith(AUTH_API.UPDATE.URL) ||
            config.url.includes(AUTH_API.UPDATE.URL)
        )) {
            return config;
        }


        const token = getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        const deviceToken = getStoredFcmToken();
        if (deviceToken) {
            config.headers["x-device-token"] = deviceToken;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const status = error?.response?.status;
        const requestUrl = error?.config?.url as string | undefined;

        if (
            status === 401 &&
            shouldHandleUnauthorized(requestUrl) &&
            !isAuthPublicEndpoint(requestUrl)
        ) {
            await forceAuthRedirect();
        }

        return Promise.reject(error);
    }
);
