import { isSupported, getToken, getMessaging } from "firebase/messaging";
import {app} from "@/lib/firebase";
import { axiosClient } from "./axiosClient";

export async function registerFcmToken(userId: string) {
  if (typeof window === "undefined") return;

  const supported = await isSupported();
  if (!supported) return;

  const messaging = getMessaging(app);

  try {
    const token = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY!,
    });

    if (token) {
      await axiosClient.post("/api/user/fcm-token", {
        userId,
        token,
      });
    }
  } catch (err) {
    console.error("FCM token registration failed", err);
  }
}
