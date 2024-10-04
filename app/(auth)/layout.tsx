import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import clsx from "clsx";
import React from "react";

import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";

import { Providers } from "../providers";
import { Logo } from "@/components/icons";
import { ThemeSwitch } from "@/components/theme-switch";

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
          <div className="h-screen w-full relative">
            <ThemeSwitch className="absolute bottom-4 left-4"/>
            <div className="flex flex-col justify-center items-center h-screen gap-6">
              <div className="flex flex-row gap-2 flex-wrap items-center justify-center">
                <Logo size={50} />
                <p className="font-bold text-inherit text-5xl">{siteConfig.name}</p>
              </div>
              <div>
                {children}
              </div>
            </div>
          </div>

        </Providers>
      </body>
    </html>
  );
}
