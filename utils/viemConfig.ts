import { useMemo } from 'react';
import { useChainId } from 'wagmi';
import { createPublicClient, http } from 'viem';
import { mainnet, sepolia, polygon, polygonAmoy } from 'viem/chains';

const urls: Record<number, string> = {
  [polygonAmoy.id]: 'https://polygon-amoy.infura.io/v3/652ee568eab9493b9111ff9f583ab35e',
  [polygon.id]: 'https://polygon-mainnet.g.alchemy.com/v2/lsabosOMapNRPIc7cq3_V',
  [sepolia.id]: 'https://eth-sepolia.g.alchemy.com/v2/lsabosOMapNRPIc7cq3_V',
  [mainnet.id]: 'https://eth-mainnet.g.alchemy.com/v2/lsabosOMapNRPIc7cq3_V',
};

export function usePublicClientByChain() {
  const chainId = useChainId();

  const client = useMemo(() => {
    const chain = [polygonAmoy, polygon, sepolia, mainnet].find((c) => c.id === chainId) ?? mainnet;
    const url = urls[chain.id];

    return createPublicClient({
      chain,
      transport: http(url),
    });
  }, [chainId]);

  return client;
}
