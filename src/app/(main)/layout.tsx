import type { Metadata } from "next";
import "@mantine/core/styles.css";
import "@/styles/globals.css";
import Sidebar from "@/components/Sidebar";
import Providers from "../../providers/providers";
import AuthGuard from "@/components/Auth/AuthGuard";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  title: "Cold Calling App",
  description: "A modern cold calling app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthGuard>
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 overflow-auto p-6">
            <Providers>{children}</Providers>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
