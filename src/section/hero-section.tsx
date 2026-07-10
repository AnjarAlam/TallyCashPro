import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="min-h-screen w-full bg-background text-foreground">
      {/* Hero Section */}
      <section className="w-full pt-6 pb-12 md:pb-20 lg:pb-28">
        <div className="container px-4 md:px-6">
          <div className="grid lg:grid-cols-2 items-center gap-10">
            {/* Text Content */}
            <div className="space-y-6 pl-4 md:pl-10 lg:pl-16">
              <h1 className="text-4xl sm:text-5xl xl:text-6xl font-extrabold tracking-tight">
                Track Your Cash, Master Your Future with{" "}
                <span className="text-primary">Cash Track</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-xl">
                Seamlessly manage your finances, gain insights, and achieve your
                financial goals with our intuitive fintech platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="#contact">
                  <Button className="px-8 py-3 text-lg shadow-md hover:shadow-lg transition">
                    Get Started
                  </Button>
                </Link>
                <Link href="#features">
                  <Button
                    variant="outline"
                    className="px-8 py-3 text-lg border-input hover:border-primary hover:text-primary transition"
                  >
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Image */}
            <div className="flex justify-center lg:justify-end">
              <Image
                src="/images/hero.jpg"
                width={550}
                height={550}
                alt="Financial Dashboard"
                className="rounded-2xl shadow-xl object-contain"
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
