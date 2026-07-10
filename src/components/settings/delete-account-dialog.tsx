"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks";
import { useDeleteAccount } from "@/services/auth.service";

const REQUIRED_TEXT = "DELETE PERMANENTLY";

interface DeleteAccountDialogProps {
  trigger: React.ReactNode;
}

export function DeleteAccountDialog({ trigger }: DeleteAccountDialogProps) {
  const { logout, user } = useAuth();
  const router = useRouter();
  const { deleteAccount, isDeletingAccount } = useDeleteAccount();
  const [open, setOpen] = useState(false);
  const [confirmationText, setConfirmationText] = useState("");
  const isConfirmed = confirmationText.trim() === REQUIRED_TEXT;

  const handleDeleteAccount = async () => {
    const userId = user?._id;
    if (!userId) {
      toast.error("User ID not found. Please try logging out and back in.");
      return;
    }
    if (!isConfirmed) {
      toast.error(`Please type "${REQUIRED_TEXT}" to confirm`);
      return;
    }

    try {
      await deleteAccount(userId, {
        onSuccess: () => {
          toast.success("Account deleted successfully");
          logout();
          router.push("/");
        },
        onError: (error: { message?: string }) => {
          toast.error(error?.message || "Failed to delete account");
          setOpen(false);
          setConfirmationText("");
        },
      });
    } catch {
      toast.error("An unexpected error occurred");
      setOpen(false);
      setConfirmationText("");
    }
  };

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) setConfirmationText("");
  };

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-red-600">
            Delete Account Permanently
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-4">
              <div>
                <p className="font-medium mb-2 text-foreground">
                  This action cannot be undone. This will permanently:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Delete your account and all personal information</li>
                  <li>Delete all your businesses and cashbooks</li>
                  <li>Delete all transactions and financial data</li>
                  <li>Remove you from all teams and collaborations</li>
                </ul>
              </div>
              <div className="space-y-2 pt-2">
                <Label htmlFor="settings-delete-confirm" className="text-sm font-medium text-foreground">
                  To confirm, type{" "}
                  <span className="font-mono text-red-600">&quot;{REQUIRED_TEXT}&quot;</span> below:
                </Label>
                <Input
                  id="settings-delete-confirm"
                  placeholder={`Type "${REQUIRED_TEXT}"`}
                  value={confirmationText}
                  onChange={(e) => setConfirmationText(e.target.value)}
                  className="font-mono"
                />
                {confirmationText && !isConfirmed && (
                  <p className="text-sm text-red-500">
                    Please type exactly &quot;{REQUIRED_TEXT}&quot;
                  </p>
                )}
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
          <AlertDialogCancel className="mt-0">Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDeleteAccount}
            disabled={!isConfirmed || isDeletingAccount || !user?._id}
            className="bg-red-600 hover:bg-red-700 text-white w-full sm:w-auto"
          >
            {isDeletingAccount ? (
              <span className="animate-pulse">Deleting...</span>
            ) : !user?._id ? (
              "User ID Missing"
            ) : (
              "Delete Account Permanently"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
