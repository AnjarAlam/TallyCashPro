"use client";

import { useEffect, useRef } from "react";
import { onMessage } from "firebase/messaging";
import { useQueryClient } from "@tanstack/react-query";
import {
  getFcmDeviceToken,
  isFirebaseConfigured,
  messaging,
} from "@/config/firebase-config";
import { useAuth } from "@/hooks/use-auth";
import { setStoredFcmToken } from "@/lib/fcm-token";
import { handleForegroundPushMessage } from "@/lib/notification-push";
import { useRegisterFCMToken } from "@/services/fcm.service";
import { playTransactionSound } from "@/lib/transaction-sound";

export default function FirebaseMessagingWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoggedin, loading } = useAuth();
  const queryClient = useQueryClient();
  const { registerFCMToken } = useRegisterFCMToken();
  const hasInitializedRef = useRef(false);

  useEffect(() => {
    if (loading || !isLoggedin || hasInitializedRef.current) {
      return;
    }

    if (!isFirebaseConfigured() || !messaging) {
      return;
    }

    hasInitializedRef.current = true;

    const setupMessaging = async () => {
      try {
        const token = await getFcmDeviceToken();
        if (token) {
          setStoredFcmToken(token);
          registerFCMToken({ token });
        }

        const msg = messaging;
        if (!msg) return;

        const unsubscribe = onMessage(msg, (payload) => {
          handleForegroundPushMessage(payload, queryClient);
        });

        return unsubscribe;
      } catch (error) {
        console.error("Error initializing Firebase Messaging:", error);
        hasInitializedRef.current = false;
      }
    };

    let cleanup: (() => void) | undefined;
    setupMessaging().then((unsub) => {
      if (typeof unsub === "function") {
        cleanup = unsub;
      }
    });

    return () => {
      cleanup?.();
    };
  }, [isLoggedin, loading, registerFCMToken, queryClient]);

  useEffect(() => {
    if (!loading && !isLoggedin) {
      hasInitializedRef.current = false;
    }
  }, [isLoggedin, loading]);

  useEffect(() => {
    if (typeof navigator === "undefined" || !navigator.serviceWorker) return;

    const onSwMessage = (event: MessageEvent) => {
      if (event.data?.type === "PLAY_TRANSACTION_SOUND") {
        playTransactionSound();
      }
    };

    navigator.serviceWorker.addEventListener("message", onSwMessage);
    return () => {
      navigator.serviceWorker.removeEventListener("message", onSwMessage);
    };
  }, []);

  return <>{children}</>;
}
