import type { Metadata } from "next";
import '@mantine/core/styles.css';
import "./globals.css";
import { MantineProvider } from '@mantine/core';
import Sidebar from "@/components/Sidebar";
import { theme } from "./theme";

export const metadata: Metadata = {
  title: "Cold Calling App",
  description: "A modern call calling app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <MantineProvider theme={theme}>
          <div className="flex">
            <Sidebar />
            <main className="ml-[72px] flex-1 min-h-screen">
              {children}
            </main>
          </div>
        </MantineProvider>
      </body>
    </html>
  );
}