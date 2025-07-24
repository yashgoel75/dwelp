"use client";

import { http, createConfig } from '@wagmi/core'
import { mainnet, sepolia, polygon, polygonAmoy } from '@wagmi/core/chains'

export const config = createConfig({
    chains: [mainnet, sepolia, polygon, polygonAmoy],
    transports: {
        [mainnet.id]: http(),
        [sepolia.id]: http(),
        [polygon.id]: http(),
        [polygonAmoy.id]: http(),
    },
})