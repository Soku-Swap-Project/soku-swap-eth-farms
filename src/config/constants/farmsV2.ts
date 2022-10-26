import tokens from './tokens'
import { FarmConfig } from './types'

const farmsV2: FarmConfig[] = [
  {
    pid: 1,
    lpSymbol: 'SOKU-ETH LP',
    lpAddresses: {
      1: '0x0de56b00b45a07b15Ca09661336f785E7E4D1d45',
      5: '0x6812108E96f2d53680446aF1dE8C6d474bD5b610',
    },
    token: tokens.soku,
    quoteToken: tokens.eth,
  },
  {
    pid: 2,
    lpSymbol: 'SUTEKU-ETH LP',
    lpAddresses: {
      1: '0x9C5465026C45152bCfBA70084cb1CCC065d691ca',
      5: '0x6812108E96f2d53680446aF1dE8C6d474bD5b610',
    },
    token: tokens.suteku,
    quoteToken: tokens.eth,
  },
  {
    pid: 3,
    lpSymbol: 'HOBI-ETH LP',
    lpAddresses: {
      1: '0xb72f4306FADdAca030e5305090159CACd111c630',
      5: '0x6812108E96f2d53680446aF1dE8C6d474bD5b610',
    },
    token: tokens.hobi,
    quoteToken: tokens.eth,
  },
  // {
  //   pid: 4,
  //   lpSymbol: 'SOKU-ETH LP',
  //   lpAddresses: {
  //     1: '0x2a4da9BE7A78573B12385Ea91c8b7B07A98336ED',
  //     5: '0x6812108E96f2d53680446aF1dE8C6d474bD5b610',
  //   },
  //   token: tokens.soku,
  //   quoteToken: tokens.eth,
  // },
  {
    pid: 8,
    lpSymbol: 'SODATSU-ETH LP',
    lpAddresses: {
      1: '0x778B81ce35a21EE911971Fa06164e5d649b4d06d',
      5: '0x6812108E96f2d53680446aF1dE8C6d474bD5b610',
    },
    token: tokens.sodatsu,
    quoteToken: tokens.eth,
  },
]

export default farmsV2
