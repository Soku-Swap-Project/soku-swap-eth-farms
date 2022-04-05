import random from 'lodash/random'

// Array of available nodes to connect to
export const nodes = [
  'https://bsc-dataseed2.defibit.io/',
  'https://bsc-dataseed3.defibit.io/',
  'https://bsc-dataseed4.defibit.io/',
  'https://bsc-dataseed2.ninicoin.io/',
  'https://bsc-dataseed3.ninicoin.io/',
  'https://bsc-dataseed4.ninicoin.io/',
  'https://bsc-dataseed1.binance.org/',
  'https://bsc-dataseed2.binance.org/',
  'https://bsc-dataseed3.binance.org/',
  'https://bsc-dataseed4.binance.org/',
]

// console.log(process.env, 'dotenv')

const getNodeUrl = () => {
  const randomIndex = random(0, nodes.length - 1)
  return 'https://speedy-nodes-nyc.moralis.io/a80a9a59f7e3ae9405c48919/eth/mainnet'
}

export default getNodeUrl
