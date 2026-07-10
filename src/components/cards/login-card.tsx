import Image from "next/image";

import OtpAuthFlow from "./login-flow"; // Assuming login-flow.tsx is in the same components directory
import { Card, CardHeader, CardTitle, CardDescription } from "../ui/card";

type Props = {};

export default function LoginCard({}: Props) {
  return (
    <Card className="w-full max-w-sm shadow-none border-none gap-0">
      <CardHeader className="space-y-4 text-center">
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center overflow-hidden">
            <Image
              src="/logo1.png"
              alt="TallyCash Pro"
              width={80}
              height={80}
              className="object-contain"
            />
          </div>
        </div>
        <CardTitle className="text-3xl font-bold">TallyCash Pro</CardTitle>
        <CardDescription className="text-gray-500 dark:text-gray-400">
          Sign in or create account
        </CardDescription>
      </CardHeader>
      {/* <SignIn /> */}
      <OtpAuthFlow />
    </Card>
  );
}
