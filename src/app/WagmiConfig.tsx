"use client";

import React from "react";
import { WagmiProvider, createConfig } from "wagmi";
import {
  RainbowKitProvider,
  getDefaultConfig,
  lightTheme,
} from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { mainnet, polygon, optimism, arbitrum, base, sepolia } from "wagmi/chains";
import "@rainbow-me/rainbowkit/styles.css";

const queryClient = new QueryClient();

// Create wagmi config using getDefaultConfig
const config = getDefaultConfig({
  appName: "My RainbowKit App",
  projectId: "5c356f2e7acca65c016840194470cd1a",
  chains: [mainnet, polygon, optimism, arbitrum, base, sepolia],
  ssr: false, // Disable SSR
}) as ReturnType<typeof createConfig>;  // Type assertion to match WagmiProvider expectations

interface WagmiConfigProps {
  children: React.ReactNode;
}

export default function WagmiConfig({ children }: WagmiConfigProps) {
  // Create a stable reference to prevent re-renders
  const [mounted, setMounted] = React.useState(false);
  
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Handle hydration issues by not rendering until mounted
  if (!mounted) return null;

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          coolMode
          theme={lightTheme({
            accentColor: "#5B61E9",
            accentColorForeground: "white",
            borderRadius: "large",
            fontStack: "system",
            overlayBlur: "small",
          })}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}