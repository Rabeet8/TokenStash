"use client";

import React from "react";
import { WagmiProvider, createConfig } from "wagmi";
import { RainbowKitProvider, getDefaultConfig,lightTheme } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { mainnet, polygon, optimism, arbitrum, base, sepolia } from "wagmi/chains";
import "@rainbow-me/rainbowkit/styles.css";

const queryClient = new QueryClient();

const config = getDefaultConfig({
  appName: "My RainbowKit App",
  projectId: "5c356f2e7acca65c016840194470cd1a", 
  chains: [mainnet, polygon, optimism, arbitrum, base,sepolia],
  ssr: false, // Disable SSR to avoid the error
});

export default function WagmiConfig({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider coolMode
        theme={lightTheme({
            accentColor: "#5B61E9",
            accentColorForeground: "white",
            borderRadius: "large",
            fontStack: "system",
            overlayBlur: "small",
          })}
        >{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
