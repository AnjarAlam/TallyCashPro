"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar as CalendarIcon, Info } from "lucide-react";
import { cn } from "@/lib/utils";

export type AccountantDurationType = "week" | "month" | "custom";

export interface AccountantDurationResult {
  dataAccessDurationDays: number;
}

const WEEK_DAYS = 7;
const MONTH_DAYS = 30;
const MIN_CUSTOM_DAYS = 1;
const MAX_CUSTOM_DAYS = 365;

interface AccountantDurationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (result: AccountantDurationResult) => void;
  isLoading?: boolean;
  initialDurationType?: AccountantDurationType;
  initialCustomDays?: number;
}

export function AccountantDurationModal({
  open,
  onOpenChange,
  onConfirm,
  isLoading = false,
  initialDurationType = "month",
  initialCustomDays = 30,
}: AccountantDurationModalProps) {
  const [durationType, setDurationType] = useState<AccountantDurationType>(initialDurationType);
  const [customDays, setCustomDays] = useState<string>(String(initialCustomDays));

  const getDays = (): number | null => {
    switch (durationType) {
      case "week":
        return WEEK_DAYS;
      case "month":
        return MONTH_DAYS;
      case "custom": {
        const n = parseInt(customDays, 10);
        if (Number.isNaN(n) || n < MIN_CUSTOM_DAYS || n > MAX_CUSTOM_DAYS) return null;
        return n;
      }
      default:
        return null;
    }
  };

  const canConfirm = getDays() !== null;

  const handleConfirm = () => {
    const days = getDays();
    if (days !== null) {
      onConfirm({ dataAccessDurationDays: days });
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] z-[9999]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg bg-green-100 flex items-center justify-center">
              <CalendarIcon className="h-4 w-4 text-green-600" />
            </div>
            <DialogTitle className="text-xl font-bold">
              Accountant Duration
            </DialogTitle>
          </div>
          <DialogDescription asChild>
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 flex gap-2">
              <Info className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-sm text-amber-800">
                Accountant will have access to transactions for the specified
                duration from today.
              </p>
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-wrap gap-2 py-2">
          <Button
            type="button"
            variant={durationType === "week" ? "default" : "outline"}
            size="sm"
            className={cn(durationType === "week" && "bg-blue-600 hover:bg-blue-700")}
            onClick={() => setDurationType("week")}
          >
            1 Week
          </Button>
          <Button
            type="button"
            variant={durationType === "month" ? "default" : "outline"}
            size="sm"
            className={cn(durationType === "month" && "bg-blue-600 hover:bg-blue-700")}
            onClick={() => setDurationType("month")}
          >
            1 Month
          </Button>
          <Button
            type="button"
            variant={durationType === "custom" ? "default" : "outline"}
            size="sm"
            className={cn(durationType === "custom" && "bg-blue-600 hover:bg-blue-700")}
            onClick={() => setDurationType("custom")}
          >
            Custom
          </Button>
        </div>

        {durationType === "custom" && (
          <div className="space-y-2 py-2">
            <Label htmlFor="custom-days" className="text-sm font-medium text-gray-700">
              Number of days
            </Label>
            <Input
              id="custom-days"
              type="number"
              min={MIN_CUSTOM_DAYS}
              max={MAX_CUSTOM_DAYS}
              placeholder="e.g. 14"
              value={customDays}
              onChange={(e) => setCustomDays(e.target.value)}
              className="w-full"
            />
            <p className="text-xs text-gray-500">
              Enter days (1–365). Access will be from today going back.
            </p>
          </div>
        )}

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!canConfirm || isLoading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? "Updating..." : "Update"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
