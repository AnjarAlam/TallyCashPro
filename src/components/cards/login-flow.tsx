"use client";

import { Button } from "@/components/ui/button";

import { useState } from "react";

import { VerifyOtpResponse } from "@/interface/auth.types";
import { Toaster } from "sonner";
import { SignIn, VerifyOtp } from "../form";
import { useRouter } from "next/navigation";

type AuthStep = "signIn" | "verifyOtp" | "loggedIn";

export default function OtpAuthFlow() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<AuthStep>("signIn");
  const [email, setEmail] = useState<string>("");

  const handleOtpSent = (userEmail: string) => {
    setEmail(userEmail);
    setCurrentStep("verifyOtp");
  };

  const handleOtpVerified = (res: VerifyOtpResponse) => {
    setCurrentStep("loggedIn");

    // Here you would typically redirect the user or update global auth state
    console.log("User successfully logged in!", res);
    const currentTime = Date.now();
    console.log("currentTime", res);

    // if (res.data.name) {
    //   router.push("/dashboard");
    // } else {
    //   router.push("/dashboard/profile");
    // }
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
