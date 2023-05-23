import random from 'lodash/random'

// Array of available nodes to connect to
export const nodes = ['https://mainnet.infura.io/v3/f55b065f57ad4ea4bf2c81b38da48c46']

// console.log(process.env, 'dotenv')

const getNodeUrl = () => {
  const randomIndex = random(0, nodes.length - 1)
  return 'https://mainnet.infura.io/v3/f55b065f57ad4ea4bf2c81b38da48c46'
}

export default getNodeUrl
