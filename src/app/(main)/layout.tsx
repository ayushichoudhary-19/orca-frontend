"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { registerFcmToken } from "@/lib/registerFcmToken";
import Sidebar from "@/components/Sidebar";
import { Header } from "@/components/Header";
import AuthGuard from "@/components/Auth/AuthGuard";
import { useFcmNotifications } from "@/hooks/useFcmNotifications";
import Providers from "@/providers/providers";
import { usePathname } from "next/navigation";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const uid = useSelector((state: RootState) => state.auth.user?.uid);
  const isDialerPage = usePathname().split("/").pop() === "call";

  useFcmNotifications();

  useEffect(() => {
    if (uid) {
      registerFcmToken(uid);
    }
  }, [uid]);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/firebase-messaging-sw.js")
        .then((registration) => {
          console.log("FCM Service Worker registered", registration);
        })
        .catch((err) => {
          console.error("Service Worker registration failed", err);
        });
    }
  }, []);

  return (
    <AuthGuard>
      <div className="flex h-screen overflow-hidden">
        {!isDialerPage && <Sidebar />}
        <div className="flex-1 flex flex-col bg-[#f9f9f9]">
          {!isDialerPage && (
            <div className="sticky top-0 z-50">
              <Header />
            </div>
          )}
          <main className={`flex-1 ${isDialerPage ? "p-0" : "p-6 overflow-y-auto"}`}>
            <Providers>{children}</Providers>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
