"use client";
import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultConfig,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  base,
  polygonAmoy,
  sepolia
} from 'wagmi/chains';
import {
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";

const config = getDefaultConfig({
  appName: 'dwelp-vips',
  projectId: '6ddb8e36716fb918c3c9da9aa052cc62',
  chains: [mainnet, polygon, polygonAmoy, optimism, arbitrum, base, sepolia],
  ssr: true,
});

export default config;