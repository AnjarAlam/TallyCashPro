import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Home, Info, Mail, Menu } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
export function LandingPageSidebar() {
  return (
    <>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="-ml-1 sm:hidden">
            <Menu className="size-4" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <SheetHeader className="sr-only">
            <SheetTitle>Are you absolutely sure?</SheetTitle>
          </SheetHeader>
          <div className="flex h-full flex-col bg-background p-4">
            {/* Header section, mimicking SidebarHeader */}
            <div className="flex items-center gap-2 pb-4">
              <Link href="/" className="flex items-center gap-2">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Menu className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">Landing Menu</span>
                </div>
              </Link>
            </div>

            {/* Navigation content, mimicking SidebarContent */}
            <nav className="flex flex-1 flex-col gap-1">
              <Button variant="ghost" className="justify-start" asChild>
                <Link href="/">
                  <Home className="mr-2 size-4" />
                  <span>Home</span>
                </Link>
              </Button>
              <Button variant="ghost" className="justify-start" asChild>
                <Link href="/about">
                  <Info className="mr-2 size-4" />
                  <span>About</span>
                </Link>
              </Button>
              <Button variant="ghost" className="justify-start" asChild>
                <Link href="/contact">
                  <Mail className="mr-2 size-4" />
                  <span>Contact</span>
                </Link>
              </Button>
              <Button variant="ghost" className="justify-start" asChild>
                <Link href="/dashboard">
                  <span>Go to Dashboard</span>
                </Link>
              </Button>
            </nav>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
