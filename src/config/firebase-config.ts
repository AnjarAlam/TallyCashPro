import { initializeApp, type FirebaseApp } from "firebase/app";
import { getMessaging, getToken, type Messaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey:
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY ??
    "AIzaSyCigqU18r-6Ib_FHjhS368h6RYa-cr12mY",
  authDomain:
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ??
    "tellycashpro.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "tellycashpro",
  storageBucket:
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ??
    "tellycashpro.firebasestorage.app",
  messagingSenderId:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "632310928442",
  appId:
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID ??
    "1:632310928442:web:3ade6affd2abf7ff385103",
};

export const FIREBASE_VAPID_KEY =
  process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY ??
  "BGPB1Fqi5PzcqeaUJA7BNxskZRj-jcpMJ_IKzOv4GEV6bGQb6y5OdvXtdaA7UtdmnmdvjXHziPtY2f2pdLSxh4Q";

export function isFirebaseConfigured(): boolean {
  return Boolean(
    firebaseConfig.apiKey &&
      firebaseConfig.projectId &&
      firebaseConfig.messagingSenderId &&
      firebaseConfig.appId &&
      FIREBASE_VAPID_KEY,
  );
}

let app: FirebaseApp | null = null;

function getFirebaseApp(): FirebaseApp | null {
  if (typeof window === "undefined") return null;
  if (!isFirebaseConfigured()) {
    console.warn("Firebase is not configured. Set NEXT_PUBLIC_FIREBASE_* env vars.");
    return null;
  }
  if (!app) {
    app = initializeApp(firebaseConfig);
  }
  return app;
}

export const messaging: Messaging | null = (() => {
  try {
    if (
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      isFirebaseConfigured()
    ) {
      const firebaseApp = getFirebaseApp();
      if (firebaseApp) {
        return getMessaging(firebaseApp);
      }
    }
    return null;
  } catch (error) {
    console.warn("Firebase messaging not available:", error);
    return null;
  }
})();

export async function registerFirebaseServiceWorker(): Promise<
  ServiceWorkerRegistration | undefined
> {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    return undefined;
  }
  try {
    return await navigator.serviceWorker.register("/firebase-messaging-sw.js", {
      scope: "/",
    });
  } catch (error) {
    console.error("Service worker registration failed:", error);
    return undefined;
  }
}

export async function requestNotificationPermission(): Promise<
  NotificationPermission | null
> {
  if (typeof Notification === "undefined") {
    return null;
  }
  if (Notification.permission === "granted") {
    return "granted";
  }
  if (Notification.permission === "denied") {
    return "denied";
  }
  return Notification.requestPermission();
}

export async function getFcmDeviceToken(): Promise<string | null> {
  if (!messaging || !isFirebaseConfigured()) {
    return null;
  }

  const permission = await requestNotificationPermission();
  if (permission !== "granted") {
    return null;
  }

  try {
    const swRegistration = await registerFirebaseServiceWorker();
    const token = await getToken(messaging, {
      vapidKey: FIREBASE_VAPID_KEY,
      serviceWorkerRegistration: swRegistration,
    });
    return token || null;
  } catch (error) {
    console.error("Error getting FCM token:", error);
    return null;
  }
}
