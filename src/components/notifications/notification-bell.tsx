"use client";

import Link from "next/link";
import { Bell, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { NotificationList } from "@/components/notifications/notification-list";
import { useAuth } from "@/hooks/use-auth";
import {
  useDeleteNotification,
  useGetNotifications,
  useGetUnreadNotificationCount,
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
} from "@/services/notification.service";

const DROPDOWN_LIMIT = 8;

export function NotificationBell() {
  const { isLoggedin } = useAuth();
  const { unreadCount } = useGetUnreadNotificationCount(isLoggedin);
  const {
    notifications,
    isNotificationsPending,
    isNotificationsError,
    notificationsError,
    refetchNotifications,
  } = useGetNotifications({ page: 1, limit: DROPDOWN_LIMIT }, isLoggedin);

  const { markNotificationRead, isMarkingRead } = useMarkNotificationRead();
  const { markAllNotificationsRead, isMarkingAllRead } =
    useMarkAllNotificationsRead();
  const { deleteNotification, isDeletingNotification } = useDeleteNotification();

  const displayCount = unreadCount > 99 ? "99+" : String(unreadCount);

  if (!isLoggedin) {
    return null;
  }

  return (
    <Popover
      onOpenChange={(open) => {
        if (open) refetchNotifications();
      }}
    >
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9 text-slate-600 hover:text-slate-900"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 ? (
            <Badge className="absolute -right-0.5 -top-0.5 h-5 min-w-5 px-1 flex items-center justify-center text-[10px] bg-red-500 hover:bg-red-500 text-white border-0">
              {displayCount}
            </Badge>
          ) : null}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[min(100vw-2rem,380px)] p-0" align="end">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div>
            <p className="text-sm font-semibold text-slate-900">Notifications</p>
            {unreadCount > 0 ? (
              <p className="text-xs text-slate-500">{unreadCount} unread</p>
            ) : null}
          </div>
          <div className="flex items-center gap-1">
            {unreadCount > 0 ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 gap-1 text-xs"
                disabled={isMarkingAllRead}
                onClick={() => markAllNotificationsRead()}
              >
                <CheckCheck className="h-3.5 w-3.5" />
                Read all
              </Button>
            ) : null}
          </div>
        </div>
        <div className="max-h-[min(60vh,400px)] overflow-y-auto p-3">
          <NotificationList
            notifications={notifications}
            isLoading={isNotificationsPending}
            isError={isNotificationsError}
            errorMessage={notificationsError?.message}
            onMarkRead={(id) => markNotificationRead(id)}
            onDelete={(id) => deleteNotification(id)}
            isMarkingRead={isMarkingRead}
            isDeleting={isDeletingNotification}
            compact
          />
        </div>
        <div className="border-t px-4 py-2.5">
          <Button variant="link" className="h-auto p-0 text-sm w-full" asChild>
            <Link href="/dashboard/notifications">View all notifications</Link>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
