import random from 'lodash/random'

// Array of available nodes to connect to
export const nodes = [
  'https://rpc.ankr.com/eth	',
  'https://eth.llamarpc.com',
  'https://rpc.ankr.com/eth',
  'https://endpoints.omniatech.io/v1/eth/mainnet/public	',
  'https://1rpc.io/eth',
]

// console.log(process.env, 'dotenv')

const getNodeUrl = () => {
  const randomIndex = random(0, nodes.length - 1)
  return nodes[randomIndex]
}

export default getNodeUrl
