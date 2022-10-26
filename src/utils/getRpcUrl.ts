import random from 'lodash/random'

// Array of available nodes to connect to
export const nodes = ['https://rpc.ankr.com/eth']

// console.log(process.env, 'dotenv')

const getNodeUrl = () => {
  const randomIndex = random(0, nodes.length - 1)
  return 'https://rpc.ankr.com/eth'
}

export default getNodeUrl
