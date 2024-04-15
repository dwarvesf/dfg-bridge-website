"use client";

import { Logo } from "@/components/logo";
import { cn } from "@/utils/number";
import { Toaster, TopBar } from "@mochi-ui/core";
import { ConnectKitButton } from "connectkit";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import { Providers } from "./providers";
import Head from "next/head";

const inter = Inter({ subsets: ["vietnamese"], weight: "500" });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <Head>
        <title>🧊 $DFG</title>
        <meta name="title" content="🧊 $DFG" />
        <meta
          name="description"
          content="The Dwarves Community Token, use $DFG to claim $USDC, exclusive merch & more benefits later on."
        />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://dfg.d.foundation" />
        <meta property="og:title" content="🧊 $DFG" />
        <meta
          property="og:description"
          content="The Dwarves Community Token, use $DFG to claim $USDC, exclusive merch & more benefits later on."
        />
        <meta property="og:image" content="/banner.png" />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://dfg.d.foundation" />
        <meta property="twitter:title" content="🧊 $DFG" />
        <meta
          property="twitter:description"
          content="The Dwarves Community Token, use $DFG to claim $USDC, exclusive merch & more benefits later on."
        />
        <meta property="twitter:image" content="/banner.png" />
      </Head>
      <body className={cn(inter.className, "h-full")}>
        <Providers>
          <Suspense>
            <main>
              <TopBar
                leftSlot={<Logo />}
                rightSlot={
                  <div className="mx-1">
                    <ConnectKitButton />
                  </div>
                }
              />
              <div className="overflow-y-auto h-[calc(100vh-56px)]">
                {children}
              </div>
            </main>
          </Suspense>
        </Providers>

        <div className="fixed top-16 right-6 z-50 max-w-[500px] pointer-events-none mx-auto">
          <Toaster />
        </div>
      </body>
    </html>
  );
}
