"use client";
import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultConfig,
} from '@rainbow-me/rainbowkit';
import {
  polygonAmoy,
  sepolia
} from 'wagmi/chains';

const config = getDefaultConfig({
  appName: 'dwelp-vips',
  projectId: '6ddb8e36716fb918c3c9da9aa052cc62',
  chains: [polygonAmoy, sepolia],
  ssr: true,
});

export default config;