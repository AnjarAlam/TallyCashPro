// components/buttons/transfer-button.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import Link from "next/link";

interface TransferButtonProps {
  businessId: string;
  cashbookId: string;
  className?: string;
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "floating";
  size?: "default" | "sm" | "lg" | "icon";
  currency?: string;
}

export function TransferButton({
  businessId,
  cashbookId,
  className,
  variant = "default",
  size = "default",
}: TransferButtonProps) {
  const transferHref = `/dashboard/business/${businessId}/${cashbookId}/transfer`;

  if (variant === "floating") {
    return (
      <Button
        size="lg"
        className="rounded-full shadow-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
        asChild
      >
        <Link href={transferHref}>
          <Send className="h-5 w-5" />
        </Link>
      </Button>
    );
  }

  return (
    <Button variant={variant} size={size} className={className} asChild>
      <Link href={transferHref}>
        <Send className="h-4 w-4 mr-2" />
        Transfer
      </Link>
    </Button>
  );
}
