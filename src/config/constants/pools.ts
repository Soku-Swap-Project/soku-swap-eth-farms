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
    sousId: 1,
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
    isFinished: true,
  },
  {
    sousId: 2,
    stakingToken: tokens.sodatsu,
    earningToken: tokens.soku,
    contractAddress: {
      5: '',
      1: '0x47aAF9f0227262B475d9454031dD5a4F0F8c82EC',
    },
    poolCategory: PoolCategory.CORE,
    harvest: true,
    tokenPerBlock: '1',
    sortOrder: 999,
    isFinished: false,
  },
  {
    sousId: 3,
    stakingToken: tokens.sodatsu,
    earningToken: tokens.soku,
    contractAddress: {
      1: '0x356a0FcEf99d12776166174077D90c960D60f8ec',
      5: '',
    },
    poolCategory: PoolCategory.CORE,
    harvest: true,
    tokenPerBlock: '1',
    sortOrder: 999,
    isFinished: false,
  },
]

export default pools
