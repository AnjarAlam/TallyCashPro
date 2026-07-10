"use client";

import Cookies from "js-cookie";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";

import { JWT_STORAGE_KEY } from "@/hooks/jwt/constant";
import { isValidToken } from "@/hooks/jwt/utils";
import { useAuth } from "@/hooks";
import { safeSessionStorage } from "@/lib/safe-storage";

const LoadingScreen = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="flex flex-col items-center space-y-4">
      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-gray-600">Loading...</p>
    </div>
  </div>
);

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

export default function ProtectedRoute({
  children,
  requireAuth = true,
  redirectTo = "/login",
}: ProtectedRouteProps) {
  const { user, loading, isLoggedin, isUserDetailError } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const [isChecking, setIsChecking] = useState(true);
  const authChecked = useRef(false);
  const actionTaken = useRef(false);

  // Consolidated auth check with error handling
  const checkAuth = () => {
    let tokenValid = false;
    let hasToken = false;

    try {
      const token = Cookies.get(JWT_STORAGE_KEY);
      hasToken = !!token;
      tokenValid = token ? isValidToken(token) : false;
    } catch (error) {
      console.error("Token validation error:", error);
      tokenValid = false;
    }

    return {
      hasToken,
      tokenValid,
      isAuth: !requireAuth || (tokenValid && isLoggedin && !!user),
    };
  };

  useEffect(() => {
    if (authChecked.current) return;
    if (loading) return;

    const { isAuth, tokenValid } = checkAuth();
    const hasError = isUserDetailError || (!tokenValid && requireAuth);

    // Handle any error condition first
    if (requireAuth && (hasError || !user)) {
      if (!actionTaken.current) {
        safeSessionStorage.setItem("authReturnTo", pathname);
        router.replace(
          `${redirectTo}?returnTo=${encodeURIComponent(pathname)}`
        );
        actionTaken.current = true;
        authChecked.current = true;
        setIsChecking(false);
      }
      return;
    }

    // Handle normal auth flow - only proceed if user exists
    if (isAuth && user) {
      authChecked.current = true;
      setIsChecking(false);
      return;
    }

    // Handle unauthenticated access
    if (!actionTaken.current) {
      safeSessionStorage.setItem("authReturnTo", pathname);
      router.replace(`${redirectTo}?returnTo=${encodeURIComponent(pathname)}`);
      actionTaken.current = true;
    }

    authChecked.current = true;
    setIsChecking(false);
  }, [
    user,
    loading,
    isLoggedin,
    pathname,
    isUserDetailError,
    requireAuth,
    redirectTo,
    router,
  ]);

  // Show loading screen during initial checks
  if (loading || isChecking) {
    return <LoadingScreen />;
  }

  // Final check after initial loading
  const { isAuth } = checkAuth();
  const hasError = isUserDetailError || (!isAuth && requireAuth);

  // Block children and redirect if any error occurs or user doesn't exist
  if (requireAuth && (hasError || !user)) {
    if (!actionTaken.current) {
      router.replace(`${redirectTo}?returnTo=${encodeURIComponent(pathname)}`);
      return <LoadingScreen />;
    }
    return <LoadingScreen />;
  }

  // Only render children if user exists
  return <>{user ? children : <LoadingScreen />}</>;
}
