import tokens from './tokens'
import { PoolConfig, PoolCategory } from './types'

const pools: PoolConfig[] = [
  // {
  //   sousId: 0,
  //   stakingToken: tokens.suteku,
  //   earningToken: tokens.suteku,
  //   contractAddress: {
  //     97: '0x186B09041249bf6438543e67580824F6647323B1',
  //     56: '0x2A62a4F578011c5C978F8c111338CD7Be740CFEF',
  //   },
  //   poolCategory: PoolCategory.CORE,
  //   harvest: true,
  //   tokenPerBlock: '0.1',
  //   sortOrder: 1,
  //   isFinished: false,
  // },

  // 90 Day Locked Staking Pools
  {
    sousId: 2,
    stakingToken: tokens.sodatsu,
    earningToken: tokens.soku,
    contractAddress: {
      5: '',
      1: '0x0e61A77480a143dA0941D88B610c6e75f1cC239a',
    },
    poolCategory: PoolCategory.CORE,
    harvest: true,
    tokenPerBlock: '1',
    sortOrder: 999,
    isFinished: false,
  },
]

export default pools
