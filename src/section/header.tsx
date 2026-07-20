"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DialogTitle } from "@radix-ui/react-dialog";
import { useStoreUrl } from "@/hooks/use-store-url";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const storeUrl = useStoreUrl();

  const navLinks = [
    { href: "/solutions", label: "Solutions", hasDropdown: false },
    // { href: "/pricing", label: "Pricing", hasDropdown: false },
    { href: "/partner", label: "Partner with us", hasDropdown: false },
    { href: "/resources", label: "Resources", hasDropdown: false },
  ];

  return (
    <header className="w-full bg-white border-b border-gray-100/80 sticky top-0 z-50">
      <div className="w-full max-w-[1400px] mx-auto py-3 sm:py-4 md:py-5 px-4 sm:px-6 md:px-12 flex items-center justify-between gap-3">
        {/* Left: Logo & Separator */}
        <div className="flex items-center min-w-0 flex-1 lg:flex-none">
          <Link href="/" className="flex items-center gap-1.5 sm:gap-2 min-w-0 shrink">
            <img
              src="/logo1.png"
              alt="TallyCashPro Logo"
              className="h-8 w-auto sm:h-9 md:h-10 object-contain shrink-0"
            />
            <span className="text-base sm:text-xl md:text-2xl font-bold tracking-tight text-[#0b2265] truncate">
              TallyCash<span className="text-[#139d8c]">Pro</span>
            </span>
          </Link>

          {/* Vertical Separator */}
          <div className="hidden lg:block h-8 w-[1px] bg-slate-200 mx-6" />

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-slate-600 font-bold hover:text-[#0ea5e9] transition-colors flex items-center gap-1 text-sm md:text-[15px]"
              >
                {link.label}
                {link.hasDropdown && <ChevronDown className="h-4 w-4 text-slate-400" />}
              </Link>
            ))}
          </nav>
        </div>

        {/* Right: Actions */}
        <div className="hidden lg:flex items-center gap-6">
          <Link
            href="/login"
            className="text-slate-700 font-bold hover:text-[#0ea5e9] transition-colors text-sm md:text-[15px]"
          >
            Login
          </Link>
          <a
            href={storeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gradient-to-r from-[#0ea5e9] to-[#10b981] hover:from-[#0284c7] hover:to-[#059669] text-white font-bold px-6 py-2.5 rounded-full text-sm md:text-[15px] shadow-sm hover:shadow-md transition-all duration-200"
          >
            Download
          </a>
        </div>

        {/* Mobile Menu Trigger */}
        <div className="lg:hidden flex items-center shrink-0">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <button className="text-slate-700 p-1.5 sm:p-2 hover:bg-slate-100 rounded-lg transition-colors">
                <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
                <span className="sr-only">Toggle menu</span>
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[350px] p-6 bg-white">
              <DialogTitle className="sr-only">Mobile Navigation Menu</DialogTitle>
              <div className="flex flex-col gap-6 mt-6">
                {/* Logo in Drawer */}
                <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
                  <img
                    src="/logo1.png"
                    alt="TallyCashPro Logo"
                    className="h-8 w-auto object-contain"
                  />
                  <span className="text-lg font-bold tracking-tight text-[#0b2265]">
                    TallyCash<span className="text-[#139d8c]">Pro</span>
                  </span>
                </div>

                {/* Navigation Links */}
                <nav className="flex flex-col gap-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className="text-slate-700 font-bold hover:text-[#0ea5e9] transition-colors py-2 flex items-center justify-between border-b border-slate-50"
                    >
                      {link.label}
                      {link.hasDropdown && <ChevronDown className="h-4 w-4 text-slate-400" />}
                    </Link>
                  ))}
                </nav>

                {/* Action Buttons */}
                <div className="flex flex-col gap-3 pt-4">
                  <Link
                    href="/login"
                    onClick={() => setIsOpen(false)}
                    className="w-full text-center text-slate-700 font-bold hover:text-[#0ea5e9] transition-colors py-3 border border-slate-200 rounded-full text-sm"
                  >
                    Login
                  </Link>
                  <a
                    href={storeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsOpen(false)}
                    className="w-full text-center bg-gradient-to-r from-[#0ea5e9] to-[#10b981] hover:from-[#0284c7] hover:to-[#059669] text-white font-bold py-3 rounded-full text-sm shadow-sm transition-all duration-200"
                  >
                    Download
                  </a>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

