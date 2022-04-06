import tokens from './tokens'
import { FarmConfig } from './types'

const farmsV2: FarmConfig[] = [
  {
    pid: 1,
    lpSymbol: 'SOKU-ETH LP',
    lpAddresses: {
      4: '',
      1: '0x0de56b00b45a07b15Ca09661336f785E7E4D1d45',
    },
    token: tokens.soku,
    quoteToken: tokens.eth,
  },
  {
    pid: 2,
    lpSymbol: 'SUTEKU-ETH LP',
    lpAddresses: {
      4: '',
      1: '0x9C5465026C45152bCfBA70084cb1CCC065d691ca',
    },
    token: tokens.suteku,
    quoteToken: tokens.eth,
  },
]

export default farmsV2
