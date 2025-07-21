import { createPublicClient, http } from 'viem'
import { polygonAmoy } from 'viem/chains'

export const publicClient = createPublicClient({ 
  chain: polygonAmoy,
  transport: http('https://polygon-amoy.infura.io/v3/0143df0befda47cb8c39faca907961e3')
})