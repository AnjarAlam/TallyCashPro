"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Wallet, X } from "lucide-react";

interface ServicesCardProps {
  title: string;
  description: string;
  buttonText: string;
  onClose?: () => void;
}

export function ServicesCard({
  title,
  description,
  buttonText,
  onClose,
}: ServicesCardProps) {
  return (
    <Card className="relative w-full max-w-xl bg-[#2563eb] text-white rounded-xl overflow-hidden shadow-none border-primary">
      <CardContent className="p-6 flex flex-col gap-4">
        {onClose && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-white hover:bg-white/20"
            onClick={onClose}
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </Button>
        )}
        <div className="flex items-center gap-2">
          <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
          <h2 className="text-lg font-semibold">{title}</h2>
        </div>
        <p className="text-sm leading-relaxed pr-12">{description}</p>
        <div className="flex items-center justify-between mt-2">
          <Button className="bg-white text-[#2563eb] hover:bg-gray-100 rounded-full px-6 py-2 font-medium">
            {buttonText}
          </Button>
          <div className="bg-white/20 p-3 rounded-lg">
            <Wallet className="h-8 w-8 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
