"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { useRouter } from "next/navigation";
import { useRegisterUser } from "@/services/auth.service";
import { useEffect } from "react";
import { setSession } from "@/hooks/jwt/utils";
import { recordSessionActivity } from "@/lib/session-inactivity";
import { safeSessionStorage } from "@/lib/safe-storage";

// Define the form schema
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.email({
    message: "Please enter a valid email.",
  }),
  contact: z.string().min(10, {
    message: "Contact number must be at least 10 digits.",
  }),
  address: z.string().min(5, {
    message: "Address must be at least 5 characters.",
  }),
  city: z.string().min(2, {
    message: "City must be at least 2 characters.",
  }),
  state: z.string().min(2, {
    message: "State must be at least 2 characters.",
  }),
  country: z.string().min(2, {
    message: "Country must be at least 2 characters.",
  }),
  pinCode: z.string().min(3, {
    message: "PIN code must be at least 3 characters.",
  }),
});

export default function SignupCard() {
  const router = useRouter();
  const {
    registerUser,
    isRegisteringUser,
    isRegisterUserError,
    registerUserError,
  } = useRegisterUser();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      contact: "",
      address: "",
      city: "",
      state: "",
      country: "",
      pinCode: "",
    },
  });

  // Get email and token from session storage on component mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const email = safeSessionStorage.getItem("email");
      if (email) {
        form.setValue("email", email);
      }
    }
  }, [form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (typeof window === "undefined") return;

    const signupToken = safeSessionStorage.getItem("signupToken");

    if (!signupToken) {
      console.error("No signup token found");
      return;
    }

    registerUser(
      {
        payload: values,
        signupToken,
      },
      {
        onSuccess: async (res) => {
          await setSession(signupToken);
          recordSessionActivity();
          // Clear the signup token from session storage after successful registration
          safeSessionStorage.removeItem("signupToken");
          // // router.push("/dashboard");
          window.location.href = "/dashboard"; // Redirect to dashboard
        },
        onError: (err) => {
          console.error("Error registering user:", err);
        },
      }
    );
  }

  return (
    <Card className="w-full mx-auto border-none shadow-none rounded-none flex flex-col h-full">
      <CardHeader>
        <CardTitle className="text-2xl">Sign Up</CardTitle>
        <CardDescription>
          Create a new account by filling in the details below.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Name Field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <div className="space-y-2 border border-gray-300 bg-white p-3 rounded-md">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-md bg-gray-100">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                          <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                      </div>
                      <FormLabel className="text-sm font-medium text-gray-700 flex-1">
                        Full Name *
                      </FormLabel>
                    </div>
                    <FormControl>
                      <Input
                        placeholder="Your full name"
                        className="border-gray-300 focus-visible:ring-1 focus-visible:ring-gray-400"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-red-600" />
                  </div>
                </FormItem>
              )}
            />

            {/* Email Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <div className="space-y-2 border border-gray-300 bg-white p-3 rounded-md">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-md bg-gray-100">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                          <polyline points="22,6 12,13 2,6"></polyline>
                        </svg>
                      </div>
                      <FormLabel className="text-sm font-medium text-gray-700 flex-1">
                        Email Address *
                      </FormLabel>
                    </div>
                    <FormControl>
                      <Input
                        placeholder="your.email@example.com"
                        className="border-gray-300 focus-visible:ring-1 focus-visible:ring-gray-400"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-red-600" />
                  </div>
                </FormItem>
              )}
            />

            {/* Contact Field */}
            <FormField
              control={form.control}
              name="contact"
              render={({ field }) => (
                <FormItem>
                  <div className="space-y-2 border border-gray-300 bg-white p-3 rounded-md">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-md bg-gray-100">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                        </svg>
                      </div>
                      <FormLabel className="text-sm font-medium text-gray-700 flex-1">
                        Contact Number *
                      </FormLabel>
                    </div>
                    <FormControl>
                      <Input
                        placeholder="9876543210"
                        className="border-gray-300 focus-visible:ring-1 focus-visible:ring-gray-400"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-red-600" />
                  </div>
                </FormItem>
              )}
            />

            {/* Address Field */}
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <div className="space-y-2 border border-gray-300 bg-white p-3 rounded-md">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-md bg-gray-100">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                          <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                      </div>
                      <FormLabel className="text-sm font-medium text-gray-700 flex-1">
                        Address *
                      </FormLabel>
                    </div>
                    <FormControl>
                      <Input
                        placeholder="Your street address"
                        className="border-gray-300 focus-visible:ring-1 focus-visible:ring-gray-400"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-red-600" />
                  </div>
                </FormItem>
              )}
            />

            {/* City, State, Country, PIN Code Fields */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <div className="space-y-2 border border-gray-300 bg-white p-3 rounded-md">
                      <FormLabel className="text-sm font-medium text-gray-700">
                        City *
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="City"
                          className="border-gray-300 focus-visible:ring-1 focus-visible:ring-gray-400"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs text-red-600" />
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <div className="space-y-2 border border-gray-300 bg-white p-3 rounded-md">
                      <FormLabel className="text-sm font-medium text-gray-700">
                        State *
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="State"
                          className="border-gray-300 focus-visible:ring-1 focus-visible:ring-gray-400"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs text-red-600" />
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <div className="space-y-2 border border-gray-300 bg-white p-3 rounded-md">
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Country *
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Country"
                          className="border-gray-300 focus-visible:ring-1 focus-visible:ring-gray-400"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs text-red-600" />
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="pinCode"
                render={({ field }) => (
                  <FormItem>
                    <div className="space-y-2 border border-gray-300 bg-white p-3 rounded-md">
                      <FormLabel className="text-sm font-medium text-gray-700">
                        PIN Code *
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="PIN Code"
                          className="border-gray-300 focus-visible:ring-1 focus-visible:ring-gray-400"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs text-red-600" />
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end space-x-2 w-full pt-4">
              <Button
                type="submit"
                disabled={isRegisteringUser}
                className="bg-gray-900 hover:bg-gray-800 w-full"
              >
                {isRegisteringUser ? "Registering..." : "Register"}
              </Button>
            </div>

            {isRegisterUserError && (
              <div className="text-red-600 text-sm text-center">
                {registerUserError?.message || "Failed to register"}
              </div>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
