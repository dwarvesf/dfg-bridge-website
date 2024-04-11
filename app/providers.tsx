"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import * as React from "react";
import { WagmiProvider, createConfig, http } from "wagmi";
import {
  baseSepolia,
  // mainnet,
  // base,
  sepolia,
} from "wagmi/chains";

// const { wallets } = getDefaultWallets();

export const config = createConfig(
  getDefaultConfig({
    chains: [
      // mainnet,
      // base,
      sepolia,
      baseSepolia,
    ],
    transports: {
      // [mainnet.id]: http("https://rpc.ankr.com/eth"),
      // [base.id]: http(),
      [sepolia.id]: http("https://rpc.ankr.com/eth_sepolia"),
      [baseSepolia.id]: http(),
    },
    walletConnectProjectId: "cf892c23188fc5556445ad4236a9aad6",
    appName: "DFG Bridge",
    appDescription: "Bridge DFG from ETH to Base to stake DFG ",
    appUrl: "https://icy.so",
    appIcon: "https://icy.so/ICY.png",
  })
);

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider theme="soft">{children}</ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
