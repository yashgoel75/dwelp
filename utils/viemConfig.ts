import { createPublicClient, http } from 'viem'
import { polygonAmoy } from 'viem/chains'

export const publicClient = createPublicClient({ 
  chain: polygonAmoy,
  transport: http('https://polygon-amoy.infura.io/v3/37a6105087cc441dae7833b5a0f2ebe2')
})