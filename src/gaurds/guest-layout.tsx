"use client";

import Cookies from "js-cookie";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";

import { JWT_STORAGE_KEY } from "@/hooks/jwt/constant";
import { isValidToken } from "@/hooks/jwt/utils";
import { useAuth } from "@/hooks";

const LoadingScreen = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="flex flex-col items-center space-y-4">
      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-gray-600">Loading...</p>
    </div>
  </div>
);

interface GuestLayoutProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export default function GuestLayout({
  children,
  redirectTo = "/dashboard",
}: GuestLayoutProps) {
  const { user, loading, isLoggedin } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo");

  const [shouldRender, setShouldRender] = useState(false);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const checkAuth = () => {
      try {
        const token = Cookies.get(JWT_STORAGE_KEY);
        const tokenValid = token ? isValidToken(token) : false;
        return tokenValid || (isLoggedin && !!user);
      } catch (error) {
        console.error("Auth check error:", error);
        return false;
      }
    };

    if (loading) return;

    if (checkAuth()) {
      router.replace(returnTo || redirectTo);
    } else {
      setShouldRender(true);
    }
  }, [loading]); // Only depend on loading

  if (loading || !shouldRender) {
    return <LoadingScreen />;
  }

  return <>{children}</>;
}
