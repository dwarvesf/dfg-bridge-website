"use client";

import * as React from "react";
import {
  RainbowKitProvider,
  getDefaultWallets,
  getDefaultConfig,
} from "@rainbow-me/rainbowkit";
import { trustWallet, ledgerWallet } from "@rainbow-me/rainbowkit/wallets";
import {
  // mainnet,
  // base,
  sepolia,
  baseSepolia,
} from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, http } from "wagmi";
import { Toaster } from "react-hot-toast";

const { wallets } = getDefaultWallets();

export const config = getDefaultConfig({
  appName: "DFG Bridge",
  projectId: "cf892c23188fc5556445ad4236a9aad6",
  wallets: [
    ...wallets,
    {
      groupName: "Other",
      wallets: [trustWallet, ledgerWallet],
    },
  ],
  chains: [
    // mainnet,
    // base,
    sepolia,
    baseSepolia,
  ],
  transports: {
    // [mainnet.id]: http(),
    // [base.id]: http(),
    [sepolia.id]: http("https://rpc.ankr.com/eth_sepolia"),
    [baseSepolia.id]: http(),
  },
  ssr: true,
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
        <Toaster />
      </QueryClientProvider>
    </WagmiProvider>
  );
}
