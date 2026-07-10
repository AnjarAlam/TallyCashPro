import TanstackProvider from "@/components/providers/tanstack-provider";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/providers/auth-provider";
import { SessionInactivityProvider } from "@/providers/session-inactivity-provider";
import { ErrorBoundary } from "@/components/providers/error-boundary";
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Manrope, STIX_Two_Text } from "next/font/google";
import "./globals.css";
import FirebaseMessagingWrapper from "@/layout/firebase-notification-wrapper";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const stixTwoText = STIX_Two_Text({
  variable: "--font-stix-two-text",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "Tally Cash Pro",
  description: "Gtech Soft Solution",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Tally Cash Pro",
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${stixTwoText.variable} ${manrope.className} antialiased`}
      >
        <ErrorBoundary>
          <TanstackProvider>
            <AuthProvider>
              <SessionInactivityProvider>
                <FirebaseMessagingWrapper>
                  {children} <Toaster />
                </FirebaseMessagingWrapper>
              </SessionInactivityProvider>
            </AuthProvider>
          </TanstackProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
