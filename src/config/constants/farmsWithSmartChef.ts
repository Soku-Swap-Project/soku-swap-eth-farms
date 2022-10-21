import tokens from './tokens'
import LpTokens from './lptokens'
import { PoolConfig as FarmsWithSmartChefConfig, PoolCategory as FarmsWithSmartChefCategory } from './types'

const farmsWithSmartChef: FarmsWithSmartChefConfig[] = [
  {
    sousId: 1,
    stakingToken: LpTokens.soku_eth_sushi,
    earningToken: tokens.sodatsu,
    contractAddress: {
      1: '0xf1294743ff92B07182eDA500997B8e5Ed82e1a5b',
      4: '',
    },
    poolCategory: FarmsWithSmartChefCategory.CORE,
    harvest: true,
    tokenPerBlock: '1',
    sortOrder: 999,
    isFinished: false,
  },
  // {
  //   sousId: 1,
  //   stakingToken: LpTokens.soku_eth,
  //   earningToken: tokens.suteku,
  //   contractAddress: {
  //     1: '0x20024Dd355e49C29426A81F8cb26663f9cfDe5Be',
  //     4: '',
  //   },
  //   poolCategory: FarmsWithSmartChefCategory['30DAYLOCK'],
  //   harvest: true,
  //   tokenPerBlock: '1',
  //   sortOrder: 999,
  //   isFinished: false,
  // },
  // {
  //   sousId: 2,
  //   stakingToken: LpTokens.suteku_eth,
  //   earningToken: tokens.suteku,
  //   contractAddress: {
  //     1: '0xeAb84BC24462e973c63225C3bf0067533a02BD11',
  //     4: '',
  //   },
  //   poolCategory: FarmsWithSmartChefCategory['30DAYLOCK'],
  //   harvest: true,
  //   tokenPerBlock: '1',
  //   sortOrder: 999,
  //   isFinished: false,
  // },
  // {
  //   sousId: 3,
  //   stakingToken: LpTokens.soku_eth,
  //   earningToken: tokens.hobi,
  //   contractAddress: {
  //     1: '0x8CEadCa17bD12e6D5A88f155d27B79421AEa8a79',
  //     4: '',
  //   },
  //   poolCategory: FarmsWithSmartChefCategory['30DAYLOCK'],
  //   harvest: true,
  //   tokenPerBlock: '1',
  //   sortOrder: 999,
  //   isFinished: false,
  // },
  // {
  //   sousId: 4,
  //   stakingToken: LpTokens.hobi_eth,
  //   earningToken: tokens.sodatsu,
  //   contractAddress: {
  //     1: '0x26cbd080A92A168d359b6974F34BC8533487816d',
  //     4: '',
  //   },
  //   poolCategory: FarmsWithSmartChefCategory['30DAYLOCK'],
  //   harvest: true,
  //   tokenPerBlock: '1',
  //   sortOrder: 999,
  //   isFinished: false,
  // },
]

export default farmsWithSmartChef
