"use client";

import { AppNotification } from "@/interface/notification.types";
import { formatDate } from "@/lib";
import { getNotificationNavigationPath } from "@/lib/notification-push";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface NotificationItemProps {
  notification: AppNotification;
  onMarkRead?: (id: string) => void;
  onDelete?: (id: string) => void;
  isMarkingRead?: boolean;
  isDeleting?: boolean;
  compact?: boolean;
}

export function NotificationItem({
  notification,
  onMarkRead,
  onDelete,
  isMarkingRead,
  isDeleting,
  compact = false,
}: NotificationItemProps) {
  const router = useRouter();
  const href = getNotificationNavigationPath(notification.data);

  const handleClick = () => {
    if (!notification.isRead && onMarkRead) {
      onMarkRead(notification._id);
    }
    if (href) {
      router.push(href);
    }
  };

  return (
    <div
      className={cn(
        "group flex gap-3 rounded-lg border p-3 transition-colors cursor-pointer",
        notification.isRead
          ? "border-slate-100 bg-white hover:bg-slate-50"
          : "border-blue-100 bg-blue-50/40 hover:bg-blue-50/70",
        compact && "p-2.5",
      )}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick();
        }
      }}
      role="button"
      tabIndex={0}
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p
            className={cn(
              "text-sm leading-snug",
              notification.isRead
                ? "font-medium text-slate-700"
                : "font-semibold text-slate-900",
            )}
          >
            {notification.title}
          </p>
          {!notification.isRead ? (
            <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-blue-500" />
          ) : null}
        </div>
        <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{notification.body}</p>
        <p className="text-[11px] text-slate-400 mt-1">
          {formatDate(notification.createdAt, "Do MMM YYYY, h:mm A")}
        </p>
      </div>
      {onDelete ? (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0 opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-600"
          disabled={isDeleting}
          onClick={(e) => {
            e.stopPropagation();
            onDelete(notification._id);
          }}
          aria-label="Delete notification"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      ) : null}
    </div>
  );
}
