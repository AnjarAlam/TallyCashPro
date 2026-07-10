"use client";

import { useState } from "react";
import { NotificationList } from "@/components/notifications/notification-list";
import { Button } from "@/components/ui/button";
import {
  useDeleteAllNotifications,
  useDeleteNotification,
  useGetNotifications,
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
} from "@/services/notification.service";
import { CheckCheck, ChevronLeft, ChevronRight, Trash2 } from "lucide-react";

const PAGE_SIZE = 20;

export function NotificationsScreen() {
  const [page, setPage] = useState(1);

  const {
    notifications,
    total,
    totalPages,
    unreadCount,
    isNotificationsPending,
    isNotificationsError,
    notificationsError,
    refetchNotifications,
  } = useGetNotifications({ page, limit: PAGE_SIZE });

  const { markNotificationRead, isMarkingRead } = useMarkNotificationRead();
  const { markAllNotificationsRead, isMarkingAllRead } =
    useMarkAllNotificationsRead();
  const { deleteNotification, isDeletingNotification } = useDeleteNotification();
  const { deleteAllNotifications, isDeletingAllNotifications } =
    useDeleteAllNotifications();

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm text-slate-500">
            {total} notification{total !== 1 ? "s" : ""}
            {unreadCount > 0 ? ` · ${unreadCount} unread` : ""}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {unreadCount > 0 ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-1.5"
              disabled={isMarkingAllRead}
              onClick={() => markAllNotificationsRead()}
            >
              <CheckCheck className="h-3.5 w-3.5" />
              Mark all read
            </Button>
          ) : null}
          {total > 0 ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-1.5 text-red-600 border-red-200 hover:bg-red-50"
              disabled={isDeletingAllNotifications}
              onClick={() => {
                if (window.confirm("Delete all notifications?")) {
                  deleteAllNotifications(undefined, {
                    onSuccess: () => setPage(1),
                  });
                }
              }}
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete all
            </Button>
          ) : null}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => refetchNotifications()}
          >
            Refresh
          </Button>
        </div>
      </div>

      <NotificationList
        notifications={notifications}
        isLoading={isNotificationsPending}
        isError={isNotificationsError}
        errorMessage={notificationsError?.message}
        onMarkRead={(id) => markNotificationRead(id)}
        onDelete={(id) => deleteNotification(id)}
        isMarkingRead={isMarkingRead}
        isDeleting={isDeletingNotification}
      />

      {totalPages > 1 ? (
        <div className="flex items-center justify-between pt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-1"
            disabled={page <= 1 || isNotificationsPending}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <span className="text-sm text-slate-500">
            Page {page} of {totalPages}
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-1"
            disabled={page >= totalPages || isNotificationsPending}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      ) : null}
    </div>
  );
}
