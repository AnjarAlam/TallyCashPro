"use client";

import { useState } from "react";
import { formatDate } from "@/lib";
import { UserSession } from "@/interface/session.types";
import {
  useGetSessions,
  useLogoutAllOtherSessions,
  useLogoutSession,
} from "@/services/session.service";
import { EditSessionNicknameDialog } from "@/components/settings/edit-session-nickname-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Laptop,
  Monitor,
  Smartphone,
  LogOut,
  RefreshCw,
  Pencil,
} from "lucide-react";
import { cn } from "@/lib/utils";

function getPlatformIcon(platform: string) {
  const p = platform.toLowerCase();
  if (p.includes("ios") || p.includes("android") || p.includes("mobile")) {
    return Smartphone;
  }
  if (p.includes("web") || p.includes("browser")) {
    return Monitor;
  }
  return Laptop;
}

function SessionCard({
  session,
  onLogout,
  isLoggingOut,
  onEditName,
}: {
  session: UserSession;
  onLogout: (sessionId: string) => void;
  isLoggingOut: boolean;
  onEditName: (session: UserSession) => void;
}) {
  const Icon = getPlatformIcon(session.platform);
  const hasNickname = Boolean(session.nickname?.trim());
  const displayName =
    session.nickname?.trim() || session.deviceName || "Unknown device";

  return (
    <div
      className={cn(
        "rounded-xl border bg-white p-4 shadow-sm",
        session.isCurrent ? "border-blue-200 ring-1 ring-blue-100" : "border-slate-200",
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-lg",
            session.isCurrent ? "bg-blue-50 text-blue-600" : "bg-slate-100 text-slate-600",
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-semibold text-slate-900 truncate">{displayName}</p>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-7 w-7 shrink-0 text-slate-500 hover:text-slate-900"
              aria-label="Rename device"
              onClick={() => onEditName(session)}
            >
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            {session.isCurrent ? (
              <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                This device
              </Badge>
            ) : null}
          </div>
          {hasNickname && session.deviceName ? (
            <p className="text-xs text-slate-400 mt-0.5 truncate">
              {session.deviceName}
            </p>
          ) : null}
          <p className="text-xs text-slate-500 mt-0.5 capitalize">
            {session.platform || "Unknown platform"}
          </p>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
            <span>Logged in {formatDate(session.loginAt, "Do-MMM-YYYY, h:mm A")}</span>
            <span>
              Last active {formatDate(session.lastActiveAt, "Do-MMM-YYYY, h:mm A")}
            </span>
          </div>
        </div>
        {!session.isCurrent ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="shrink-0 gap-1.5 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
            disabled={isLoggingOut}
            onClick={() => onLogout(session.sessionId)}
          >
            <LogOut className="h-3.5 w-3.5" />
            Log out
          </Button>
        ) : null}
      </div>
    </div>
  );
}

export function LoggedInDevicesScreen() {
  const [editingSession, setEditingSession] = useState<UserSession | null>(null);
  const [nicknameDialogOpen, setNicknameDialogOpen] = useState(false);

  const {
    sessions,
    isSessionsPending,
    isSessionsError,
    sessionsError,
    refetchSessions,
  } = useGetSessions();
  const { logoutSession, isLoggingOutSession } = useLogoutSession();
  const { logoutAllOtherSessions, isLoggingOutAllOther } =
    useLogoutAllOtherSessions();

  const otherSessionsCount = sessions.filter((s) => !s.isCurrent).length;

  const openEditNickname = (session: UserSession) => {
    setEditingSession(session);
    setNicknameDialogOpen(true);
  };

  if (isSessionsPending) {
    return (
      <div className="w-full space-y-3">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-24 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (isSessionsError) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error loading devices</AlertTitle>
        <AlertDescription>
          {sessionsError?.message || "Unknown error"}
        </AlertDescription>
        <Button variant="outline" className="mt-3" onClick={() => refetchSessions()}>
          Retry
        </Button>
      </Alert>
    );
  }

  return (
    <div className="w-full space-y-4">
      <EditSessionNicknameDialog
        session={editingSession}
        open={nicknameDialogOpen}
        onOpenChange={(open) => {
          setNicknameDialogOpen(open);
          if (!open) setEditingSession(null);
        }}
      />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-500">
          {sessions.length} active session{sessions.length !== 1 ? "s" : ""}
        </p>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={() => refetchSessions()}
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Refresh
          </Button>
          {otherSessionsCount > 0 ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-1.5 text-red-600 border-red-200 hover:bg-red-50"
              disabled={isLoggingOutAllOther}
              onClick={() => logoutAllOtherSessions()}
            >
              Log out all other devices
            </Button>
          ) : null}
        </div>
      </div>

      {sessions.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 bg-white p-8 text-center">
          <Monitor className="h-10 w-10 mx-auto text-slate-300 mb-3" />
          <p className="font-medium text-slate-700">No active sessions</p>
          <p className="text-sm text-slate-500 mt-1">
            Devices logged into your account will appear here.
          </p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {sessions.map((session) => (
            <SessionCard
              key={session.sessionId}
              session={session}
              onLogout={logoutSession}
              isLoggingOut={isLoggingOutSession}
              onEditName={openEditNickname}
            />
          ))}
        </div>
      )}
    </div>
  );
}
