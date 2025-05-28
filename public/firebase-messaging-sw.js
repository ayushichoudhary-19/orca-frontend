importScripts("https://www.gstatic.com/firebasejs/9.6.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyCOgtwxPKAPxJQs1Q3LkjJkyGGCiA9kLRM",
  authDomain: "orca-6609b.firebaseapp.com",
  projectId: "orca-6609b",
  messagingSenderId: "905862560940",
  appId: "1:905862560940:web:6f50f539d30bb094aa7309",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  const notificationTitle = payload.notification?.title || "New Notification";
  const notificationOptions = {
    body: payload.notification?.body,
    icon: "/logo.png",
    data: payload.data,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener("notificationclick", function (event) {
  const postId = event.notification?.data?.postId;
  const campaignId = event.notification?.data?.campaignId;

  const url = campaignId && postId
    ? `/campaigns/${campaignId}/posts/${postId}`
    : "/";

  event.notification.close();
  event.waitUntil(clients.openWindow(url));
});
