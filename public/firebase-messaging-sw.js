importScripts("https://www.gstatic.com/firebasejs/9.6.10/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.6.10/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyCigqU18r-6Ib_FHjhS368h6RYa-cr12mY",
  authDomain: "tellycashpro.firebaseapp.com",
  projectId: "tellycashpro",
  storageBucket: "tellycashpro.firebasestorage.app",
  messagingSenderId: "632310928442",
  appId: "1:632310928442:web:3ade6affd2abf7ff385103",
});

const messaging = firebase.messaging();

function shouldPlayCashSound(data) {
  if (!data) return false;
  const txType = data.txType;
  if (txType === "cash_in" || txType === "cash_out") return true;
  if (data.type === "transaction_created") return true;
  return false;
}

function notifyClientsPlayCashSound() {
  clients.matchAll({ type: "window", includeUncontrolled: true }).then((list) => {
    for (const client of list) {
      client.postMessage({ type: "PLAY_TRANSACTION_SOUND" });
    }
  });
}

messaging.onBackgroundMessage((payload) => {
  const title =
    payload.notification?.title ||
    payload.data?.title ||
    "Tally Cash Pro";
  const body =
    payload.notification?.body || payload.data?.body || "";

  if (shouldPlayCashSound(payload.data)) {
    notifyClientsPlayCashSound();
  }

  const notificationOptions = {
    body,
    icon: "/logo.png",
    data: payload.data || {},
    tag: payload.data?.transactionId || payload.data?.type || "tally-notification",
  };

  self.registration.showNotification(title, notificationOptions);
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const data = event.notification?.data || {};
  let path = "/dashboard/notifications";

  if (data.screen === "transaction_details" && data.businessId && data.bookId && data.transactionId) {
    path = `/dashboard/business/${data.businessId}/${data.bookId}/${data.transactionId}`;
  } else if (data.businessId && data.bookId) {
    path = `/dashboard/business/${data.businessId}/${data.bookId}`;
  } else if (data.businessId) {
    path = `/dashboard/business/${data.businessId}`;
  }

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && "focus" in client) {
          client.navigate(path);
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(path);
      }
    }),
  );
});
