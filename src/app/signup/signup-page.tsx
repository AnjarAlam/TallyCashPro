"use client";

import { LoginCarousel, SignupCard } from "@/components/cards";

export default function SignupPage() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background text-foreground">
      {/* Left side with illustration and carousel */}
      <div className="relative hidden lg:flex flex-col items-center justify-center p-8 bg-teal-800 text-white dark:bg-teal-950 dark:text-gray-100">
        <LoginCarousel />
      </div>
      {/* Right side with login form */}
      <div className="flex flex-col items-center justify-center p-8 bg-white dark:bg-gray-950">
        <SignupCard />
      </div>
    </div>
  );
}
