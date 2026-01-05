import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Provider } from 'jotai'
import { TRPCReactProvider } from "@/trpc/client";
import { Toaster } from "@/components/ui/sonner";
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets:  ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Automatrix - Workflow Automation Platform",
  description: "Build powerful automation workflows with an intuitive visual editor",
};

export default function RootLayout({
  children,
}:  Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background`}
      >
        <TRPCReactProvider>
          <NuqsAdapter>
            <Provider>
              {children}
              <Toaster 
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  className: 'glass-effect',
                  style: {
                    background:  'var(--glass-bg)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid var(--glass-border)',
                  },
                }}
              />
            </Provider>
          </NuqsAdapter>
        </TRPCReactProvider>
      </body>
    </html>
  );
}