import BigNumber from 'bignumber.js'
import farmsConfig from 'config/constants/farmsWithSmartChef'
// import sousChefABI from 'config/abi/sousChef.json'
// import sousChefV2ABI from 'config/abi/sousChefV2.json'
// import SmartChefInitializeable from 'config/abi/SmartChefInitializable.json'
import cakeABI from 'config/abi/cake.json'
import wbnbABI from 'config/abi/weth.json'
import multicall from 'utils/multicall'
import { getAddress, getWbnbAddress } from 'utils/addressHelpers'
import { BIG_ZERO } from 'utils/bigNumber'
import { getSouschefContractFarms } from 'utils/contractHelpers'
// import { AbiItem } from 'web3-utils'
// import Web3 from 'web3'

export const fetchFarmsBlockLimits = async () => {
  const poolsWithEnd = farmsConfig.filter((p) => p.sousId !== 0)

  const callsStartBlock = poolsWithEnd.map((farmConfig) => {
    return {
      address: getAddress(farmConfig.contractAddress),
      name: 'startBlock',
    }
  })
  const callsEndBlock = poolsWithEnd.map((farmConfig) => {
    return {
      address: getAddress(farmConfig.contractAddress),
      name: 'bonusEndBlock',
    }
  })

  const abi = [
    { inputs: [], stateMutability: 'nonpayable', type: 'constructor' },
    {
      anonymous: false,
      inputs: [
        { indexed: false, internalType: 'address', name: 'tokenRecovered', type: 'address' },
        { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' },
      ],
      name: 'AdminTokenRecovery',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        { indexed: true, internalType: 'address', name: 'user', type: 'address' },
        { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' },
      ],
      name: 'ClaimReward',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        { indexed: true, internalType: 'address', name: 'user', type: 'address' },
        { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' },
      ],
      name: 'Deposit',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        { indexed: true, internalType: 'address', name: 'user', type: 'address' },
        { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' },
      ],
      name: 'EmergencyWithdraw',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [{ indexed: false, internalType: 'uint256', name: 'poolLimitPerUser', type: 'uint256' }],
      name: 'NewPoolLimit',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [{ indexed: false, internalType: 'uint256', name: 'rewardPerBlock', type: 'uint256' }],
      name: 'NewRewardPerBlock',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        { indexed: false, internalType: 'uint256', name: 'startBlock', type: 'uint256' },
        { indexed: false, internalType: 'uint256', name: 'endBlock', type: 'uint256' },
      ],
      name: 'NewStartAndEndBlocks',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        { indexed: true, internalType: 'address', name: 'previousOwner', type: 'address' },
        { indexed: true, internalType: 'address', name: 'newOwner', type: 'address' },
      ],
      name: 'OwnershipTransferred',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        { indexed: true, internalType: 'address', name: 'user', type: 'address' },
        { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' },
      ],
      name: 'Withdraw',
      type: 'event',
    },
    {
      inputs: [],
      name: 'PRECISION_FACTOR',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'SMART_CHEF_FACTORY',
      outputs: [{ internalType: 'address', name: '', type: 'address' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'accTokenPerShare',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [{ internalType: 'address', name: '', type: 'address' }],
      name: 'addressEndLockTime',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'bonusEndBlock',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      stateMutability: 'view',
      type: 'function',
    },
    { inputs: [], name: 'claimReward', outputs: [], stateMutability: 'nonpayable', type: 'function' },
    {
      inputs: [{ internalType: 'uint256', name: '_amount', type: 'uint256' }],
      name: 'deposit',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [{ internalType: 'uint256', name: '_amount', type: 'uint256' }],
      name: 'emergencyRewardWithdraw',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    { inputs: [], name: 'emergencyWithdraw', outputs: [], stateMutability: 'nonpayable', type: 'function' },
    {
      inputs: [],
      name: 'endLockTime',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [{ internalType: 'address', name: '_user', type: 'address' }],
      name: 'getRemainingLockTime',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'hasAllRewardDistributedByAdmin',
      outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'hasSavedPendingRewardUpdatedByAdmin',
      outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'hasUserLimit',
      outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'contract IBEP20', name: '_stakedToken', type: 'address' },
        { internalType: 'contract IBEP20', name: '_rewardToken', type: 'address' },
        { internalType: 'uint256', name: '_rewardPerBlock', type: 'uint256' },
        { internalType: 'uint256', name: '_startBlock', type: 'uint256' },
        { internalType: 'uint256', name: '_bonusEndBlock', type: 'uint256' },
        { internalType: 'uint256', name: '_lockTime', type: 'uint256' },
        { internalType: 'uint256', name: '_poolLimitPerUser', type: 'uint256' },
        { internalType: 'address', name: '_admin', type: 'address' },
      ],
      name: 'initialize',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [],
      name: 'isInitialized',
      outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'lastRewardBlock',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'lockTime',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'numberOfClaimCurrentAndTotalPendingReward',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'numberOfClaimSavedPendingReward',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'owner',
      outputs: [{ internalType: 'address', name: '', type: 'address' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [{ internalType: 'address', name: '_user', type: 'address' }],
      name: 'pendingReward',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'poolLimitPerUser',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'address', name: '_tokenAddress', type: 'address' },
        { internalType: 'uint256', name: '_tokenAmount', type: 'uint256' },
      ],
      name: 'recoverWrongTokens',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    { inputs: [], name: 'renounceOwnership', outputs: [], stateMutability: 'nonpayable', type: 'function' },
    {
      inputs: [],
      name: 'rewardPerBlock',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'rewardToken',
      outputs: [{ internalType: 'contract IBEP20', name: '', type: 'address' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'stakedToken',
      outputs: [{ internalType: 'contract IBEP20', name: '', type: 'address' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'startBlock',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      stateMutability: 'view',
      type: 'function',
    },
    { inputs: [], name: 'stopReward', outputs: [], stateMutability: 'nonpayable', type: 'function' },
    {
      inputs: [{ internalType: 'address', name: '', type: 'address' }],
      name: 'temporaryPendingReward',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [{ internalType: 'address', name: 'newOwner', type: 'address' }],
      name: 'transferOwnership',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'bool', name: '_hasUserLimit', type: 'bool' },
        { internalType: 'uint256', name: '_poolLimitPerUser', type: 'uint256' },
      ],
      name: 'updatePoolLimitPerUser',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [{ internalType: 'uint256', name: '_rewardPerBlock', type: 'uint256' }],
      name: 'updateRewardPerBlock',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'uint256', name: '_startBlock', type: 'uint256' },
        { internalType: 'uint256', name: '_bonusEndBlock', type: 'uint256' },
      ],
      name: 'updateStartAndEndBlocks',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [{ internalType: 'address', name: '', type: 'address' }],
      name: 'userInfo',
      outputs: [
        { internalType: 'uint256', name: 'amount', type: 'uint256' },
        { internalType: 'uint256', name: 'rewardDebt', type: 'uint256' },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [{ internalType: 'uint256', name: '_amount', type: 'uint256' }],
      name: 'withdraw',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
  ]

  const starts = await multicall(abi, callsStartBlock)
  const ends = await multicall(abi, callsEndBlock)

  return poolsWithEnd.map((cakePoolConfig, index) => {
    const startBlock = starts[index]
    const endBlock = ends[index]

    return {
      sousId: cakePoolConfig.sousId,
      startBlock: new BigNumber(startBlock).toJSON(),
      endBlock: new BigNumber(endBlock).toJSON(),
    }
  })
}

export const fetchFarmsTotalStaking = async () => {
  const nonEthPools = farmsConfig.filter((p) => p.stakingToken.symbol !== 'ETH')
  const ethPool = farmsConfig.filter((p) => p.stakingToken.symbol === 'ETH')

  const callsNonEthPools = nonEthPools.map((poolConfig) => {
    return {
      address: getAddress(poolConfig.stakingToken.address),
      name: 'balanceOf',
      params: [getAddress(poolConfig.contractAddress)],
    }
  })

  const callsEthPools = ethPool.map((poolConfig) => {
    return {
      address: getWbnbAddress(),
      name: 'balanceOf',
      params: [getAddress(poolConfig.contractAddress)],
    }
  })

  const nonEthPoolsTotalStaked = await multicall(cakeABI, callsNonEthPools)
  const ethPoolsTotalStaked = await multicall(wbnbABI, callsEthPools)

  return [
    ...nonEthPools.map((p, index) => ({
      sousId: p.sousId,
      totalStaked: new BigNumber(nonEthPoolsTotalStaked[index]).toJSON(),
    })),
    ...ethPool.map((p, index) => ({
      sousId: p.sousId,
      totalStaked: new BigNumber(ethPoolsTotalStaked[index]).toJSON(),
    })),
  ]
}

export const fetchFarmStakingLimit = async (sousId: number): Promise<BigNumber> => {
  try {
    const sousContract = getSouschefContractFarms(sousId)
    const stakingLimit = await sousContract.methods.poolLimitPerUser().call()
    return new BigNumber(stakingLimit)
  } catch (error) {
    return BIG_ZERO
  }
}

export const fetchFarmsStakingLimits = async (
  poolsWithStakingLimit: number[],
): Promise<{ [key: string]: BigNumber }> => {
  const validPools = farmsConfig
    .filter((p) => p.stakingToken.symbol !== 'ETH' && !p.isFinished)
    .filter((p) => !poolsWithStakingLimit.includes(p.sousId))

  // Get the staking limit for each valid pool
  // Note: We cannot batch the calls via multicall because V1 pools do not have "poolLimitPerUser" and will throw an error
  const stakingLimitPromises = validPools.map((validPool) => fetchFarmStakingLimit(validPool.sousId))
  const stakingLimits = await Promise.all(stakingLimitPromises)

  return stakingLimits.reduce((accum, stakingLimit, index) => {
    return {
      ...accum,
      [validPools[index].sousId]: stakingLimit,
    }
  }, {})
}
