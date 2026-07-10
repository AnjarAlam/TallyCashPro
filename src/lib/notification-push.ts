import type { MessagePayload } from "firebase/messaging";
import type { QueryClient } from "@tanstack/react-query";
import { NOTIFICATIONS_API } from "@/constants/api";
import { toast } from "sonner";
import { playTransactionSoundIfCashEvent } from "@/lib/transaction-sound";

export function invalidateNotificationQueries(queryClient: QueryClient) {
  queryClient.invalidateQueries({
    queryKey: [NOTIFICATIONS_API.UNREAD_COUNT.ID],
  });
  queryClient.invalidateQueries({
    queryKey: [NOTIFICATIONS_API.LIST.ID],
  });
}

function getPayloadTitleBody(payload: MessagePayload): {
  title: string;
  body: string;
} {
  const title =
    payload.notification?.title ??
    (payload.data?.title as string | undefined) ??
    "Tally Cash Pro";
  const body =
    payload.notification?.body ??
    (payload.data?.body as string | undefined) ??
    "";
  return { title, body };
}

export function showBrowserNotification(
  title: string,
  body: string,
  data?: Record<string, string>,
) {
  if (typeof Notification === "undefined" || Notification.permission !== "granted") {
    return;
  }
  try {
    const notification = new Notification(title, {
      body,
      icon: "/logo.png",
      tag: data?.transactionId ?? data?.type ?? "tally-notification",
      data,
    });
    notification.onclick = () => {
      window.focus();
      notification.close();
    };
  } catch (error) {
    console.warn("Browser notification failed:", error);
  }
}

export function handleForegroundPushMessage(
  payload: MessagePayload,
  queryClient: QueryClient,
) {
  const { title, body } = getPayloadTitleBody(payload);

  invalidateNotificationQueries(queryClient);

  playTransactionSoundIfCashEvent(
    payload.data as Record<string, unknown> | undefined,
  );

  if (body) {
    toast.info(title, { description: body, duration: 5000 });
  } else {
    toast.info(title);
  }

  showBrowserNotification(
    title,
    body,
    payload.data as Record<string, string> | undefined,
  );
}

export function getNotificationNavigationPath(
  data?: Record<string, unknown>,
): string | null {
  if (!data) return null;

  const screen = data.screen as string | undefined;
  const businessId = data.businessId as string | undefined;
  const bookId = data.bookId as string | undefined;
  const transactionId = data.transactionId as string | undefined;

  if (
    screen === "transaction_details" &&
    businessId &&
    bookId &&
    transactionId
  ) {
    return `/dashboard/business/${businessId}/${bookId}/${transactionId}`;
  }

  if (businessId && bookId) {
    return `/dashboard/business/${businessId}/${bookId}`;
  }

  if (businessId) {
    return `/dashboard/business/${businessId}`;
  }

  return "/dashboard/notifications";
}
