"use client";

import { IS_MAINNET } from "@/envs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import * as React from "react";
import { WagmiProvider, createConfig, http } from "wagmi";
import { base, baseSepolia, mainnet, sepolia } from "wagmi/chains";

const isMainnet = Boolean(IS_MAINNET);

export const config = createConfig(
  getDefaultConfig({
    chains:
      isMainnet === false || isMainnet === undefined
        ? [sepolia, baseSepolia]
        : [mainnet, base],
    transports:
      isMainnet === false || isMainnet === undefined
        ? {
            [sepolia.id]: http("https://rpc.ankr.com/eth_sepolia"),
            [baseSepolia.id]: http(),
          }
        : {
            [mainnet.id]: http("https://rpc.ankr.com/eth"),
            [base.id]: http(),
          },
    walletConnectProjectId: "cf892c23188fc5556445ad4236a9aad6",
    appName: "DFG Bridge",
    appDescription: "Bridge DFG from ETH to Base to stake DFG",
    appUrl: "https://bridge.d.foundation/",
    appIcon: "https://bridge.d.foundation/DFG.png",
  })
);
const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider customTheme={customTheme} theme="soft">
          {children}
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

const customTheme = {
  // "--ck-font-family": "Inter",
  "--ck-font-weight": "600",
  "--ck-border-radius": "8px",
  "--ck-overlay-backdrop-filter": "blur(2px)",
  "--ck-modal-heading-font-weight": "700",
  "--ck-qr-border-radius": "8px",
  "--ck-connectbutton-font-size": "17px",
  "--ck-connectbutton-font-weight": "700",
  "--ck-connectbutton-color": "#fff",
  "--ck-connectbutton-background": "#017aff",
  "--ck-connectbutton-background-secondary": "#FFFFFF",
  "--ck-connectbutton-border-radius": "8px",
  "--ck-connectbutton-box-shadow": "0 0 0 0 #ffffff",
  "--ck-connectbutton-hover-color": "#fff",
  "--ck-connectbutton-hover-background": "#0068d6",
  "--ck-connectbutton-hover-box-shadow": "0 0 0 0 #ffffff",
  "--ck-connectbutton-active-color": "#373737",
  "--ck-connectbutton-active-background": "#91c5fd",
  "--ck-connectbutton-active-box-shadow": "0 0 0 0 #ffffff",
  "--ck-connectbutton-balance-color": "#373737",
  "--ck-connectbutton-balance-background": "#fff",
  "--ck-connectbutton-balance-box-shadow": "inset 0 0 0 1px #F6F7F9",
  "--ck-connectbutton-balance-hover-background": "#F6F7F9",
  "--ck-connectbutton-balance-hover-box-shadow": "inset 0 0 0 1px #F0F2F5",
  "--ck-connectbutton-balance-active-background": "#F0F2F5",
  "--ck-connectbutton-balance-active-box-shadow": "inset 0 0 0 1px #EAECF1",
  "--ck-primary-button-font-weight": "500",
  "--ck-primary-button-border-radius": "8px",
  "--ck-primary-button-color": "#4c5054",
  "--ck-primary-button-background": "#F6F7F9",
  "--ck-primary-button-box-shadow": "0 0 0 0 #ffffff",
  "--ck-primary-button-hover-color": "#373737",
  "--ck-primary-button-hover-background": "#F0F2F5",
  "--ck-primary-button-hover-box-shadow": "0 0 0 0 #ffffff",
  "--ck-primary-button-active-color": "#373737",
  "--ck-primary-button-active-background": "#F0F2F5",
  "--ck-primary-button-active-box-shadow": "0 0 0 0 #ffffff",
  "--ck-secondary-button-font-weight": "500",
  "--ck-secondary-button-border-radius": "16px",
  "--ck-secondary-button-color": "#373737",
  "--ck-secondary-button-background": "#F6F7F9",
  "--ck-secondary-button-box-shadow": "0 0 0 0 #ffffff",
  "--ck-secondary-button-hover-color": "#373737",
  "--ck-secondary-button-hover-background": "#dfe4ec",
  "--ck-secondary-button-hover-box-shadow": "0 0 0 0 #ffffff",
  "--ck-secondary-button-active-color": "#373737",
  "--ck-secondary-button-active-background": "#dfe4ec",
  "--ck-secondary-button-active-box-shadow": "0 0 0 0 #ffffff",
  "--ck-tertiary-button-font-weight": "500",
  "--ck-tertiary-button-border-radius": "8px",
  "--ck-tertiary-button-color": "#373737",
  "--ck-tertiary-button-background": "#F6F7F9",
  "--ck-tertiary-button-box-shadow": "0 0 0 0 #ffffff",
  "--ck-tertiary-button-hover-color": "#373737",
  "--ck-tertiary-button-hover-background": "#F6F7F9",
  "--ck-tertiary-button-hover-box-shadow": "0 0 0 0 #ffffff",
  "--ck-tertiary-button-active-color": "#373737",
  "--ck-tertiary-button-active-background": "#F6F7F9",
  "--ck-tertiary-button-active-box-shadow": "0 0 0 0 #ffffff",
  "--ck-modal-box-shadow": "0px 2px 4px 0px #00000005",
  "--ck-overlay-background": "#00000008",
  "--ck-body-color": "#4c5054",
  "--ck-body-color-muted": "#999999",
  "--ck-body-color-muted-hover": "#111111",
  "--ck-body-background": "#ffffff",
  "--ck-body-background-transparent": "rgba(255,255,255,0)",
  "--ck-body-background-secondary": "#f6f7f9",
  "--ck-body-background-secondary-hover-background": "#e0e4eb",
  "--ck-body-background-secondary-hover-outline": "#4282FF",
  "--ck-body-background-tertiary": "#F3F4F7",
  "--ck-body-action-color": "#999999",
  "--ck-body-divider": "#f7f6f8",
  "--ck-body-color-danger": "#FF4E4E",
  "--ck-body-color-valid": "#32D74B",
  "--ck-siwe-border": "#F0F0F0",
  "--ck-body-disclaimer-background": "#f6f7f9",
  "--ck-body-disclaimer-color": "#AAAAAB",
  "--ck-body-disclaimer-link-color": "#838485",
  "--ck-body-disclaimer-link-hover-color": "#000000",
  "--ck-tooltip-background": "#ffffff",
  "--ck-tooltip-background-secondary": "#ffffff",
  "--ck-tooltip-color": "#999999",
  "--ck-tooltip-shadow": "0px 2px 10px 0 #00000014",
  "--ck-dropdown-button-color": "#999999",
  "--ck-dropdown-button-box-shadow":
    "0 0 0 1px rgba(0,0,0,0.01), 0px 0px 7px rgba(0, 0, 0, 0.05)",
  "--ck-dropdown-button-background": "#fff",
  "--ck-dropdown-button-hover-color": "#8B8B8B",
  "--ck-dropdown-button-hover-background": "#F5F7F9",
  "--ck-qr-dot-color": "#000000",
  "--ck-qr-background": "#ffffff",
  "--ck-qr-border-color": "#f7f6f8",
  "--ck-focus-color": "#1A88F8",
  "--ck-spinner-color": "#1A88F8",
  "--ck-copytoclipboard-stroke": "#CCCCCC",
  "--ck-recent-badge-color": "#777",
  "--ck-recent-badge-background": "#F6F7F9",
  "--ck-recent-badge-border-radius": "32px",
};
