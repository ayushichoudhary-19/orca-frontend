import type { Metadata } from "next";
import '@mantine/core/styles.css';
import "@/styles/globals.css";
import Sidebar from "@/components/Sidebar";
import Providers from '../providers';

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
          <div className="flex">
            <Sidebar />
            <main className="ml-[72px] flex-1 min-h-screen">
              <Providers>
                {children}
              </Providers>
            </main>
          </div>
  );
}
