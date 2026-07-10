"use client";

import type React from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { setSession } from "@/hooks/jwt/utils";
import { recordSessionActivity } from "@/lib/session-inactivity";
import type { VerifyOtpResponse } from "@/interface/auth.types";
import { otpSchema } from "@/schemes";
import { useSendOtp, useVerifyOtp } from "@/services/auth.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { safeSessionStorage } from "@/lib/safe-storage";

interface VerifyOtpFormProps {
  email: string;
  onSuccess: (res: VerifyOtpResponse) => void;
  onBack: () => void;
}

export function VerifyOtpForm({
  email,
  onSuccess: OnOtpVerified,
  onBack,
}: VerifyOtpFormProps) {
  const {
    verifyOtp: verifyOtpMutation,
    isVerifyingOtp,
    verifyOtpError,
  } = useVerifyOtp();
  const {
    sendOtp: resendOtpMutation,
    isSendingOtp: isResendingOtp,
    sendOtpError: resendOtpError,
  } = useSendOtp();

  const form = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      email: email,
      otp: "",
    },
  });

  const [isEmailEditable, setIsEmailEditable] = useState(false);

  // Update form default value if email prop changes
  useEffect(() => {
    form.setValue("email", email);
  }, [email, form]);

  function onSubmit(values: z.infer<typeof otpSchema>) {
    verifyOtpMutation(values, {
      onSuccess: async (res) => {
        if (typeof window !== "undefined") {
          safeSessionStorage.setItem("email", values.email);

          if (res?.data?.name) {
            await setSession(res.data.accessToken);
            recordSessionActivity();
            safeSessionStorage.removeItem("signupToken");
            window.location.href = "/dashboard";
          } else {
            safeSessionStorage.setItem("signupToken", res.data.accessToken);
            window.location.href = "/signup";
          }
        }

        console.log("User successfully logged in!", res);

        toast.success("OTP Verified!", {
          description: "You have successfully logged in.",
        });

        OnOtpVerified(res);
      },
      onError: (error) => {
        toast.error("Failed to verify OTP", {
          description:
            verifyOtpError?.message || "Please check the code and try again.",
        });
        console.error("Verify OTP error:", error);
      },
    });
  }

  function handleResendOtp() {
    resendOtpMutation(
      { email },
      {
        onSuccess: (res) => {
          toast.success("OTP Resent!", {
            description: `A new code has been sent to ${email}.`,
          });
        },
        onError: (error) => {
          toast.error("Failed to resend OTP", {
            description: resendOtpError?.message || "Please try again later.",
          });
          console.error("Resend OTP error:", error);
        },
      }
    );
  }

  return (
    <Card className="w-full max-w-sm mx-auto border-none shadow-none py-0">
      <CardHeader className="space-y-1 text-center">
        <CardDescription
          className="flex flex-col justify-center items-center"
          onClick={onBack}
        >
          Enter the 6-digit code sent to{" "}
          <span className="flex items-center gap-2  font-medium text-gray-900 dark:text-gray-50 hover:cursor-pointer hover:text-blue-600">
            {email} <Pencil className="w-4 h-4" />
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Email Display */}
            <div className="hidden relative border border-gray-300 rounded-md px-3 py-2 focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-blue-500">
              <label
                htmlFor="email-display"
                className="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900 dark:bg-gray-950 dark:text-gray-50"
              >
                Email
              </label>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-400" />
                <Input
                  id="email-display"
                  type="email"
                  value={email}
                  readOnly={!isEmailEditable}
                  onChange={(e) => form.setValue("email", e.target.value)}
                  className="border-none p-0 h-auto flex-grow focus-visible:ring-0 focus-visible:ring-offset-0"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsEmailEditable(!isEmailEditable)}
                  className="h-6 w-6 bg-teal-800  dark:bg-teal-950 hover:bg-teal-800 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  type="button"
                  aria-label={
                    isEmailEditable
                      ? "Disable email editing"
                      : "Enable email editing"
                  }
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* OTP Input */}
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="otp"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex justify-center">
                        <InputOTP
                          maxLength={6}
                          {...field}
                          onChange={(value) => {
                            field.onChange(value);
                          }}
                        >
                          <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                          </InputOTPGroup>
                          <InputOTPSeparator />
                          <InputOTPGroup>
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                          </InputOTPGroup>
                        </InputOTP>
                      </div>
                    </FormControl>
                    <FormMessage className="text-center" />
                  </FormItem>
                )}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-teal-800  dark:bg-teal-950 hover:bg-teal-800 text-white py-6 text-base rounded-lg"
              disabled={isVerifyingOtp}
            >
              {isVerifyingOtp ? "Verifying..." : "Verify & Continue"}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 w-full">
          Didn&apos;t receive code?{" "}
          <Button
            variant="link"
            onClick={handleResendOtp}
            disabled={isResendingOtp}
            className="p-0 h-auto text-blue-600 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-100"
          >
            {isResendingOtp ? "Resending..." : "Resend OTP"}
          </Button>
        </p>
      </CardFooter>
    </Card>
  );
}
