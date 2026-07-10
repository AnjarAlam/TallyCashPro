import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function CtaSection() {
  return (
    <section
      id="contact"
      className="w-full py-12 md:py-24 lg:py-32 border-t bg-gradient-to-l from-gray-50 to-white"
    >
      <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
        <div className="space-y-3">
          <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight dark:text-black">
            Ready to Take Control of Your Finances?
          </h2>
          <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Join thousands of users who are already mastering their money with
            Cash Track. Sign up today!
          </p>
        </div>
        <div className="mx-auto w-full max-w-sm space-y-2">
          <form className="flex gap-2">
            <Input
              type="email"
              placeholder="Enter your email"
              className="max-w-lg flex-1"
            />
            <Button type="submit">Sign Up</Button>
          </form>
          <p className="text-xs text-muted-foreground">
            By signing up, you agree to our
            <Link href="#" className="underline underline-offset-2">
              Terms &amp; Conditions
            </Link>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
