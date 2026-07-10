"use client";

import { useAuth } from "@/hooks";
import { useRouter } from "next/navigation";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  //   const router = useRouter();
  //   const { user } = useAuth();

  //   //   useEffect(() => {
  //   //     const accessToken = Cookies.get("accessToken");
  //   //     if (!accessToken) {
  //   //       router.push("/login");
  //   //     }
  //   //   }, [router]);

  //   if (!user) {
  //     router.push("/login"); // or return a loading spinner
  //   }

  return <>{children}</>;
}
