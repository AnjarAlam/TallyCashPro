"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Mail } from "lucide-react"; // Import Mail and Wallet icons
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage, // FormLabel is removed
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { sendOtp } from "@/schemes";
import { useSendOtp } from "@/services/auth.service";

interface SignInFormProps {
  onSuccess: (email: string) => void;
}

export function SignInForm({ onSuccess }: SignInFormProps) {
  const { sendOtp: sendOtpMutation, isSendingOtp, sendOtpError } = useSendOtp();
  const form = useForm<z.infer<typeof sendOtp>>({
    resolver: zodResolver(sendOtp),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof sendOtp>) {
    sendOtpMutation(values, {
      onSuccess: (res) => {
        toast.success("OTP sent successfully!", {
          description: `A 6-digit code has been sent to ${values.email}.`,
        });
        onSuccess(values.email);
      },
      onError: (err) => {
        toast.error("Failed to send OTP", {
          description: sendOtpError?.message || "Please try again.",
        });
        console.error("Send OTP error:", err);
      },
    });
  }

  return (
    <Card className="w-full max-w-sm mx-auto border-none shadow-none py-0">
      <CardContent className="pt-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <FormControl>
                      <Input
                        id="email"
                        placeholder="Email"
                        {...field}
                        type="email"
                        autoComplete="email"
                        className="pl-10 py-6 rounded-lg" // Added pl-10 and py-6 for spacing and height
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full bg-teal-800  dark:bg-teal-950 hover:bg-teal-800 text-white py-6 text-base rounded-lg" // Updated color and padding
              disabled={isSendingOtp}
            >
              {isSendingOtp ? "Requesting OTP..." : "Request OTP"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
