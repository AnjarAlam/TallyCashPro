"use client";

import { NotificationItem } from "@/components/notifications/notification-item";
import { AppNotification } from "@/interface/notification.types";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Bell } from "lucide-react";

interface NotificationListProps {
  notifications: AppNotification[];
  isLoading?: boolean;
  isError?: boolean;
  errorMessage?: string;
  onMarkRead?: (id: string) => void;
  onDelete?: (id: string) => void;
  isMarkingRead?: boolean;
  isDeleting?: boolean;
  compact?: boolean;
  emptyMessage?: string;
}

export function NotificationList({
  notifications,
  isLoading,
  isError,
  errorMessage,
  onMarkRead,
  onDelete,
  isMarkingRead,
  isDeleting,
  compact,
  emptyMessage = "No notifications yet",
}: NotificationListProps) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(compact ? 3 : 5)].map((_, i) => (
          <Skeleton
            key={i}
            className={`w-full rounded-lg ${compact ? "h-16" : "h-20"}`}
          />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Could not load notifications</AlertTitle>
        <AlertDescription>{errorMessage || "Unknown error"}</AlertDescription>
      </Alert>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <Bell className="h-10 w-10 text-slate-300 mb-3" />
        <p className="text-sm font-medium text-slate-600">{emptyMessage}</p>
        <p className="text-xs text-slate-400 mt-1">
          Transaction and team updates will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {notifications.map((n) => (
        <NotificationItem
          key={n._id}
          notification={n}
          onMarkRead={onMarkRead}
          onDelete={onDelete}
          isMarkingRead={isMarkingRead}
          isDeleting={isDeleting}
          compact={compact}
        />
      ))}
    </div>
  );
}
