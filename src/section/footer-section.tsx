import Link from "next/link";
import { DollarSign } from "lucide-react";

export default function FooterSection() {
  return (
    <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t bg-gray-100">
      <Link href="#" className="flex items-center gap-2 font-semibold">
        <DollarSign className="h-5 w-5 text-primary " />
        <span className="text-md ">Cash Track</span>
      </Link>
      <p className="text-xs text-muted-foreground sm:ml-auto ">
        &copy; {new Date().getFullYear()} Cash Track. All rights reserved.
      </p>
      <nav className="flex gap-4 sm:gap-6">
        <Link href="#" className="text-xs hover:underline underline-offset-4">
          Privacy Policy
        </Link>
        <Link href="#" className="text-xs hover:underline underline-offset-4">
          Terms of Service
        </Link>
      </nav>
    </footer>
  );
}
