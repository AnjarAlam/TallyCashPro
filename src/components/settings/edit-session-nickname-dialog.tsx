"use client";

import { useEffect, useState } from "react";
import { UserSession } from "@/interface/session.types";
import { useUpdateSessionNickname } from "@/services/session.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface EditSessionNicknameDialogProps {
  session: UserSession | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditSessionNicknameDialog({
  session,
  open,
  onOpenChange,
}: EditSessionNicknameDialogProps) {
  const [nickname, setNickname] = useState("");
  const { updateSessionNickname, isUpdatingNickname } = useUpdateSessionNickname();

  useEffect(() => {
    if (open && session) {
      setNickname(session.nickname?.trim() ?? "");
    }
  }, [open, session]);

  const handleSave = () => {
    if (!session) return;
    const trimmed = nickname.trim();
    if (!trimmed) return;

    updateSessionNickname(
      { sessionId: session.sessionId, nickname: trimmed },
      {
        onSuccess: () => onOpenChange(false),
      },
    );
  };

  if (!session) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Rename device</DialogTitle>
          <DialogDescription>
            Set a custom name for this device. Detected as:{" "}
            <span className="font-medium text-slate-700">
              {session.deviceName || "Unknown device"}
            </span>
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2 py-2">
          <label htmlFor="session-nickname" className="text-sm font-medium text-slate-700">
            Device name
          </label>
          <Input
            id="session-nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder={session.deviceName || "e.g. Office laptop"}
            maxLength={64}
            disabled={isUpdatingNickname}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSave();
              }
            }}
          />
        </div>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isUpdatingNickname}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={isUpdatingNickname || !nickname.trim()}
          >
            {isUpdatingNickname ? "Saving…" : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
