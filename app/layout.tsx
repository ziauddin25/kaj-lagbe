import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "কাজ লাগবে - Your Local Service Assistant",
  description: "Find and book local service providers in Dhaka - Electricians, Plumbers, AC Repair, Cleaners, Tutors, Mechanics",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#D02752",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn" className="h-full">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body className="h-full antialiased bg-bg-main">
        {children}
      </body>
    </html>
  );
}