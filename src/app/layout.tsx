import type { Metadata } from "next";
import '@mantine/core/styles.css';
import "./globals.css";
import { createTheme, MantineProvider } from '@mantine/core';

const theme = createTheme({
  primaryColor: 'violet',
  primaryShade: 6,
  fontFamily: 'EuclidSquare, ui-sans-serif, system-ui, sans-serif',
  headings: {
  fontFamily: 'EuclidSquare, ui-sans-serif, system-ui, sans-serif',
  fontWeight: '600',
},

  components: {
    Button: {
      defaultProps: {
        radius: 'xl',
      },
    },
    Paper: {
      defaultProps: {
        radius: 'md',
      },
    },
  },
});


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
            {children}
          </MantineProvider>
      </body>
    </html>
  );
}
