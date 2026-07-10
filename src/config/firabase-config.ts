/** @deprecated Use `@/config/firebase-config` */
export {
  messaging,
  requestNotificationPermission as requestPermission,
  getFcmDeviceToken,
  registerFirebaseServiceWorker,
  isFirebaseConfigured,
  FIREBASE_VAPID_KEY,
} from "./firebase-config";
