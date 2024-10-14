import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import clsx from "clsx";
import { Toaster } from "react-hot-toast";
import React from "react";

import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";
import AuthGuard from "@/components/AuthGuard";
import { AuthProvider } from "@/contexts/AuthContext";
import GlobalNavbar from "@/components/global/navbar";

import { Providers } from "../providers";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <head />
      <body
        className={clsx(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
        )}
      >
        <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
          <div>
            <Toaster position="bottom-right" reverseOrder={false} />
          </div>
          <AuthProvider>
            <AuthGuard>
              <div className="relative flex flex-col h-screen">
                <GlobalNavbar />
                <main className="container mx-auto max-w-7xl pt-10 px-6 flex-grow">
                  {children}
                </main>
                <footer className="w-full flex items-center justify-center py-3" />
              </div>
            </AuthGuard>
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
