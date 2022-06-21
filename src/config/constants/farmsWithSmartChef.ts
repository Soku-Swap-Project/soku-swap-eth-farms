import tokens from './tokens'
import LpTokens from './lptokens'
import { PoolConfig as FarmsWithSmartChefConfig, PoolCategory as FarmsWithSmartChefCategory } from './types'

const farmsWithSmartChef: FarmsWithSmartChefConfig[] = [
  // {
  //   sousId: 1,
  //   stakingToken: LpTokens.soku_eth,
  //   earningToken: tokens.suteku,
  //   contractAddress: {
  //     1: '0x0FE46ca202A7564E905650180668D065104c6a76',
  //     4: '',
  //   },
  //   poolCategory: FarmsWithSmartChefCategory['30DAYLOCK'],
  //   harvest: true,
  //   tokenPerBlock: '1',
  //   sortOrder: 999,
  //   isFinished: false,
  // },
  {
    sousId: 1,
    stakingToken: LpTokens.soku_eth,
    earningToken: tokens.suteku,
    contractAddress: {
      1: '0x20024Dd355e49C29426A81F8cb26663f9cfDe5Be',
      4: '',
    },
    poolCategory: FarmsWithSmartChefCategory['30DAYLOCK'],
    harvest: true,
    tokenPerBlock: '1',
    sortOrder: 999,
    isFinished: false,
  },
  {
    sousId: 2,
    stakingToken: LpTokens.suteku_eth,
    earningToken: tokens.suteku,
    contractAddress: {
      1: '0xeAb84BC24462e973c63225C3bf0067533a02BD11',
      4: '',
    },
    poolCategory: FarmsWithSmartChefCategory['30DAYLOCK'],
    harvest: true,
    tokenPerBlock: '1',
    sortOrder: 999,
    isFinished: false,
  },
]

export default farmsWithSmartChef
