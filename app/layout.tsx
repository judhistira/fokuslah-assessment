import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";

import { Navbar } from "@/components/layout/navbar";

import { QueryProvider } from "../providers/query-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Fokuslah",
  description: "Ultimate App for Math Learning",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen scroll-smooth antialiased`}
      >
        <SessionProvider>
          <QueryProvider>
            <div className="flex min-h-screen flex-col">
              <Navbar />
              <main className="min-h-[calc(100vh-80px)] flex-1 pb-16 md:mt-0 md:pb-0">
                {children}
              </main>
            </div>
            <Toaster richColors />
          </QueryProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
