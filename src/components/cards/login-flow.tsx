"use client";

import { Button } from "@/components/ui/button";

import { useState } from "react";

import { VerifyOtpResponse } from "@/interface/auth.types";
import { Toaster } from "sonner";
import { SignIn, VerifyOtp } from "../form";
import { useRouter } from "next/navigation";
import { axiosInstance } from "@/lib/axios";
import { APIS } from "@/constants/api";

type AuthStep = "signIn" | "verifyOtp" | "loggedIn";

export default function OtpAuthFlow() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<AuthStep>("signIn");
  const [email, setEmail] = useState<string>("");

  const handleOtpSent = (userEmail: string) => {
    setEmail(userEmail);
    setCurrentStep("verifyOtp");
  };

  const handleOtpVerified = async (res: VerifyOtpResponse) => {
    setCurrentStep("loggedIn");

    console.log("User successfully logged in!", res);

    if (res.data?.name) {
      try {
        const response = await axiosInstance.get(APIS.Business.listByUser.Url);
        const companies = response.data?.data;
        if (companies && companies.length > 0) {
          const firstCompanyId = companies[0].company?._id;
          if (firstCompanyId) {
            window.location.href = `/dashboard/business/${firstCompanyId}/book`;
            return;
          }
        }
      } catch (error) {
        console.error("Failed to fetch business during login redirect:", error);
      }
      window.location.href = "/dashboard";
    } else {
      window.location.href = "/signup";
    }
  };

  const handleBackToSignIn = () => {
    setEmail("");
    setCurrentStep("signIn");
  };

  return (
    <div className="flex items-center justify-start bg-transparent">
      {currentStep === "signIn" && <SignIn onSuccess={handleOtpSent} />}

      {currentStep === "verifyOtp" && (
        <VerifyOtp
          email={email}
          onSuccess={handleOtpVerified}
          onBack={handleBackToSignIn}
        />
      )}

      {currentStep === "loggedIn" && (
        <div className="text-center text-lg font-semibold text-gray-800 dark:text-gray-200">
          Welcome, {email}! You are now logged in.
          <Button onClick={handleBackToSignIn} className="mt-4">
            Log Out
          </Button>
        </div>
      )}
      <Toaster richColors />
    </div>
  );
}
