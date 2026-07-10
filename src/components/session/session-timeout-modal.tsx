"use client";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";

function formatCountdown(ms: number): string {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

interface SessionTimeoutModalProps {
  open: boolean;
  countdownMs: number;
  onStayLoggedIn: () => void;
  onLogout: () => void;
}

export function SessionTimeoutModal({
  open,
  countdownMs,
  onStayLoggedIn,
  onLogout,
}: SessionTimeoutModalProps) {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent
        className="sm:max-w-md"
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <AlertDialogHeader>
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 text-amber-600">
            <Clock className="h-6 w-6" />
          </div>
          <AlertDialogTitle className="text-center">
            Session Timeout Warning
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            You have been inactive for a while. Your session will end automatically
            unless you choose to stay logged in.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="flex flex-col items-center gap-1 py-2">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Time remaining
          </p>
          <p className="text-4xl font-bold tabular-nums text-slate-900">
            {formatCountdown(countdownMs)}
          </p>
        </div>

        <AlertDialogFooter className="sm:justify-center gap-2">
          <Button type="button" variant="outline" onClick={onLogout}>
            Logout
          </Button>
          <Button type="button" onClick={onStayLoggedIn}>
            Stay Logged In
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
