import tokens from './tokens'
import { FarmConfig } from './types'

const farmsV2: FarmConfig[] = [
  {
    pid: 1,
    lpSymbol: 'SOKU-ETH LP',
    lpAddresses: {
      1: '0x0de56b00b45a07b15Ca09661336f785E7E4D1d45',
      4: '0x6812108E96f2d53680446aF1dE8C6d474bD5b610',
    },
    token: tokens.soku,
    quoteToken: tokens.eth,
  },
  {
    pid: 2,
    lpSymbol: 'SUTEKU-ETH LP',
    lpAddresses: {
      1: '0x9C5465026C45152bCfBA70084cb1CCC065d691ca',
      4: '0x6812108E96f2d53680446aF1dE8C6d474bD5b610',
    },
    token: tokens.suteku,
    quoteToken: tokens.eth,
  },
  {
    pid: 3,
    lpSymbol: 'HOBI-ETH LP',
    lpAddresses: {
      1: '0xb72f4306faddaca030e5305090159cacd111c630',
      4: '0x6812108E96f2d53680446aF1dE8C6d474bD5b610',
    },
    token: tokens.hobi,
    quoteToken: tokens.eth,
  },
]

export default farmsV2
