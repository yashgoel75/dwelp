import { createPublicClient, http } from 'viem'
import { polygonAmoy } from 'viem/chains'

export const publicClient = createPublicClient({ 
  chain: polygonAmoy,
  transport: http('https://polygon-amoy.g.alchemy.com/v2/lsabosOMapNRPIc7cq3_V')
})