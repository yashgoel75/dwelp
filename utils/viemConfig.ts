import { createPublicClient, http } from 'viem'
import { polygonAmoy } from 'viem/chains'

export const publicClient = createPublicClient({ 
  chain: polygonAmoy,
  transport: http('https://polygon-amoy.infura.io/v3/652ee568eab9493b9111ff9f583ab35e')
})