import random from 'lodash/random'

// Array of available nodes to connect to
export const nodes = ['https://eth-rpc.gateway.pokt.network']

// console.log(process.env, 'dotenv')

const getNodeUrl = () => {
  const randomIndex = random(0, nodes.length - 1)
  return 'https://eth-rpc.gateway.pokt.network'
}

export default getNodeUrl
