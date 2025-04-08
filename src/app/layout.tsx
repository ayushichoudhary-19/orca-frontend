import '@mantine/core/styles.css';
import "@/styles/globals.css";
import { MantineProvider } from "@mantine/core";
import { theme } from "./theme";
import Providers from "./providers";
import { Urbanist } from 'next/font/google';

const urbanist = Urbanist({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700', '800'],
    variable: '--font-urbanist',
  });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={urbanist.variable}>
      <body>
        <MantineProvider theme={theme}>
          <Providers>{children}</Providers>
        </MantineProvider>
      </body>
    </html>
  );
}
