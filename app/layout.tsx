"use client";

import { Logo } from "@/components/logo";
import { cn } from "@/utils/number";
import { Button, Toaster, TopBar } from "@mochi-ui/core";
import { ConnectKitButton } from "connectkit";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["vietnamese"], weight: "500" });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={cn(inter.className, "h-full")}>
        <Providers>
          <Suspense>
            <main>
              <TopBar
                leftSlot={<Logo />}
                rightSlot={
                  <div className="mx-1">
                    <ConnectKitButton.Custom>
                      {({ isConnected, show, truncatedAddress, ensName }) => {
                        return (
                          <Button onClick={show}>
                            {isConnected
                              ? ensName ?? truncatedAddress
                              : "Connect Wallet"}
                          </Button>
                        );
                      }}
                    </ConnectKitButton.Custom>
                  </div>
                }
              />
              <div className="overflow-y-auto h-[calc(100vh-56px)]">
                {children}
              </div>
            </main>
          </Suspense>
        </Providers>

        <div className="fixed right-6 top-16 z-50 mx-auto pointer-events-none max-w-[500px]">
          <Toaster />
        </div>
      </body>
    </html>
  );
}
