"use client";

import { useQueryClient } from "@tanstack/react-query";
import { createContext, type ReactNode, useEffect, useState } from "react";
import { isValidToken, removeToken, setSession, getStoredToken } from "@/hooks/jwt/utils";
import { toast } from "sonner";
import { IUserData } from "@/interface";
import { useGetAuthUser } from "@/services";
import { unregisterStoredFcmToken } from "@/lib/fcm-client";
import {
  getStoredLastActivity,
  isInactivityExpired,
  recordSessionActivity,
} from "@/lib/session-inactivity";

type AuthContextType = {
  user: IUserData | null;
  loading: boolean;
  isLoggedin: boolean;
  refetchUser: () => Promise<void>;
  logout: () => Promise<void>;
  isUserDetailError: any;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient();

  const {
    userDetailData,
    isUserDetailPending,
    refetchUserDetail,
    isUserDetailError,
    userDetailError,
  } = useGetAuthUser();

  const [user, setUser] = useState<IUserData | null>(null);
  const [isLoggedin, setIsLoggedin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Helper function to get current auth state
  const getAuthState = () => {
    const token = getStoredToken();
    const hasValidToken = token ? isValidToken(token) : false;
    return { hasValidToken };
  };

  // Check and update auth status
  const checkAuthStatus = () => {
    const { hasValidToken } = getAuthState();
    setIsLoggedin(hasValidToken);
    return hasValidToken;
  };

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      setLoading(true);
      const { hasValidToken } = getAuthState();

      if (hasValidToken) {
        const lastActivity = getStoredLastActivity();
        if (lastActivity && isInactivityExpired(lastActivity)) {
          await logout();
          setLoading(false);
          return;
        }

        try {
          // Ensure axios has the token in its headers
          const token = getStoredToken();
          if (token) {
            await setSession(token);
          }
          if (!lastActivity) {
            recordSessionActivity();
          }
          await refetchUserDetail();
        } catch (error) {
          console.error("Failed to fetch user:", error);
          await logout();
        }
      } else {
        setIsLoggedin(false);
        setUser(null);
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  // useEffect(() => {
  //   if (isUserDetailError) logout();
  // }, [userDetailError]);
  // Check auth status on moun

  // Update user state when data changes
  useEffect(() => {
    if (userDetailData) {
      setUser(userDetailData);
      setIsLoggedin(true);
    } else if (!isUserDetailPending) {
      setUser(null);
      const { hasValidToken } = getAuthState();
      if (!hasValidToken) {
        setIsLoggedin(false);
      }
    }
    setLoading(isUserDetailPending);
  }, [userDetailData, isUserDetailPending]);

  // Enhanced refetch function
  const refetchUser = async () => {
    setLoading(true);
    try {
      const { data } = await refetchUserDetail();
      setUser(data || null);
      setIsLoggedin(!!data);
    } catch (error) {
      console.error("Error refetching user:", error);
      await logout();
    } finally {
      setLoading(false);
    }
  };

  // Enhanced logout function
  const logout = async () => {
    try {
      // Immediate state update
      setIsLoggedin(false);
      setUser(null);

      try {
        await unregisterStoredFcmToken();
      } catch {
        // Ignore FCM errors during logout
      }
      removeToken();

      queryClient.clear();
      queryClient.resetQueries({ queryKey: ["auth-user"] });

      toast.success("Logged out successfully");
      window.location.replace("/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Error during logout");
      // Ensure state is cleared even if error occurs
      setIsLoggedin(false);
      setUser(null);
      window.location.replace("/login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isLoggedin,
        refetchUser,
        logout,
        isUserDetailError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
