"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { safeSessionStorage } from "@/lib/safe-storage";

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const signupToken = safeSessionStorage.getItem("signupToken");
      if (!signupToken) {
        router.push("/login");
      }
    }
  }, []);

  return <>{children}</>;
}
