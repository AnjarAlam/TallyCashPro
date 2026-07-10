import { Button } from "@/components/ui/button";
import { DollarSign } from "lucide-react";
import Link from "next/link";

export default function MainNav() {
  return (
    <header className="flex h-16 items-center px-4 lg:px-6">
      <Link href="#" className="flex items-center gap-2 font-semibold">
        {/* <DollarSign className="h-6 w-6 text-primary" /> */}
        <span className="text-lg pl-20">Tally Cash Pro</span>
      </Link>
      <nav className="ml-auto hidden md:flex gap-6 pr-40">
        <Link
          href="/dashboard"
          className="text-sm font-medium hover:underline underline-offset-4"
        >
          Dashboard
        </Link>
        <Link
          href="/login"
          className="text-sm font-medium hover:underline underline-offset-4"
        >
          Login
        </Link>
        {/* <Link
          href="#testimonials"
          className="text-sm font-medium hover:underline underline-offset-4"
        >
          Testimonials
        </Link>
        <Link
          href="#contact"
          className="text-sm font-medium hover:underline underline-offset-4"
        >
          Contact
        </Link>
        <Button variant="outline" size="sm">
          Sign In
        </Button> */}
      </nav>
    </header>
  );
}
