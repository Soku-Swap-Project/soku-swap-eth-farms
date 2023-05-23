/* eslint-disable */
import { useEffect, useMemo, useState } from 'react'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import { useSelector } from 'react-redux'
import { useAppDispatch } from 'state'
import { orderBy } from 'lodash'
import { Team } from 'config/constants/types'
import Nfts from 'config/constants/nfts'
import { getWeb3NoAccount } from 'utils/web3'
import { getBalanceAmount } from 'utils/formatBalance'
import { BIG_NINE, BIG_ZERO } from 'utils/bigNumber'
import useRefresh from 'hooks/useRefresh'
import { filterFarmsByLpToken, filterFarmsByQuoteToken } from 'utils/farmsPriceHelpers'
import {
  fetchFarmsPublicDataAsync,
  fetchFarmsPublicDataAsyncV2,
  fetchPoolsPublicDataAsync,
  fetchPoolsUserDataAsync,
  // fetchCakeVaultPublicData,
  // fetchCakeVaultUserData,
  // fetchCakeVaultFees,
  setBlock,
  fetchFarmsV2PublicDataAsync as fetchFarmSmartChefPublicDataAsync,
  fetchFarmsV2UserDataAsync as fetchFarmSmartChefUserDataAsync,
} from './actions'
import {
  State,
  Farm,
  Pool,
  ProfileState,
  TeamsState,
  AchievementState,
  PriceState,
  FarmsState,
  FarmsStateV2,
  FarmV2,
} from './types'
// import { fetchProfile } from './profile'
// import { fetchTeam, fetchTeams } from './teams'
// import { fetchAchievements } from './achievements'
import { fetchPrices, ethPrice } from './prices'
import { fetchWalletNfts } from './collectibles'
// import { getCanClaim } from './predictions/helpers'
import { transformPool } from './pools/helpers'
import { transformPool as transformFarm } from './farmsWithSmartChef/helpers'

import { fetchPoolsStakingLimitsAsync } from './pools'
import { fetchFarmsV2StakingLimitsAsync } from './farmsWithSmartChef'
import useSutekuPrice from 'hooks/useSutekuPrice'

const web3 = getWeb3NoAccount()

export const useFetchPublicData = () => {
  const dispatch = useAppDispatch()
  const { slowRefresh } = useRefresh()
  const web3 = getWeb3NoAccount()
  useEffect(() => {
    const fetchPoolsPublicData = async () => {
      const blockNumber = await web3.eth.getBlockNumber()
      dispatch(fetchPoolsPublicDataAsync(blockNumber))
    }
    dispatch(fetchFarmsPublicDataAsync())
    dispatch(fetchFarmsPublicDataAsyncV2())
    fetchPoolsPublicData()
    dispatch(fetchPoolsStakingLimitsAsync())
  }, [dispatch, slowRefresh, web3])

  useEffect(() => {
    const interval = setInterval(async () => {
      const blockNumber = await web3.eth.getBlockNumber()
      dispatch(setBlock(blockNumber))
    }, 6000)

    return () => clearInterval(interval)
  }, [dispatch, web3])
}

export const useFetchPublicDataV2 = () => {
  const dispatch = useAppDispatch()
  const { slowRefresh } = useRefresh()
  const web3 = getWeb3NoAccount()
  useEffect(() => {
    const fetchFarmsPublicData = async () => {
      const blockNumber = await web3.eth.getBlockNumber()
      dispatch(fetchFarmSmartChefPublicDataAsync(blockNumber))
    }
    dispatch(fetchFarmsPublicDataAsyncV2())
    fetchFarmsPublicData()
    dispatch(fetchFarmsV2StakingLimitsAsync())
  }, [dispatch, slowRefresh, web3])

  useEffect(() => {
    const interval = setInterval(async () => {
      const blockNumber = await web3.eth.getBlockNumber()
      dispatch(setBlock(blockNumber))
    }, 6000)

    return () => clearInterval(interval)
  }, [dispatch, web3])
}

export const useFarms = (): FarmsState => {
  const farms = useSelector((state: State) => state.farms)
  return farms
}

export const useFarmsV2 = (): FarmsStateV2 => {
  const farms = useSelector((state: State) => state.farmsV2)
  return farms
}

export const useFarmFromPid = (pid): Farm => {
  const farm = useSelector((state: State) => state.farms.data.find((f) => f.pid === pid))
  return farm
}

export const useFarmFromPidV2 = (pid): Farm => {
  const farm = useSelector((state: State) => state.farmsV2.data.find((f) => f.pid === pid))
  return farm
}

export const useFarmFromLpSymbol = (lpSymbol: string): Farm => {
  const farm = useSelector((state: State) => state.farms.data.find((f) => f.lpSymbol === lpSymbol))
  return farm
}

export const useFarmFromLpSymbolV2 = (lpSymbol: string): Farm => {
  const farm = useSelector((state: State) => state.farmsV2.data.find((f) => f.lpSymbol === lpSymbol))
  return farm
}

export const useFarmUser = (pid) => {
  const farm = useFarmFromPid(pid)

  return {
    allowance: farm.userData ? new BigNumber(farm.userData.allowance) : BIG_ZERO,
    tokenBalance: farm.userData ? new BigNumber(farm.userData.tokenBalance) : BIG_ZERO,
    stakedBalance: farm.userData ? new BigNumber(farm.userData.stakedBalance) : BIG_ZERO,
    earnings: farm.userData ? new BigNumber(farm.userData.earnings) : BIG_ZERO,
  }
}

export const useFarmUserV2 = (pid) => {
  const farm = useFarmFromPidV2(pid)

  return {
    allowance: farm.userData ? new BigNumber(farm.userData.allowance) : BIG_ZERO,
    tokenBalance: farm.userData ? new BigNumber(farm.userData.tokenBalance) : BIG_ZERO,
    stakedBalance: farm.userData ? new BigNumber(farm.userData.stakedBalance) : BIG_ZERO,
    earnings: farm.userData ? new BigNumber(farm.userData.earnings) : BIG_ZERO,
  }
}

// Return a farm for a given token symbol. The farm is filtered based on attempting to return a farm with a quote token from an array of preferred quote tokens
export const useFarmFromTokenSymbol = (tokenSymbol: string, preferredQuoteTokens?: string[]): Farm => {
  const farms = useSelector((state: State) => state.farms.data.filter((farm) => farm.token.symbol === tokenSymbol))
  const filteredFarm = filterFarmsByQuoteToken(farms, preferredQuoteTokens)
  return filteredFarm
}

export const useFarmFromTokenSymbolV2 = (tokenSymbol: string, preferredQuoteTokens?: string[]): Farm => {
  const farms = useSelector((state: State) => state.farmsV2.data.filter((farm) => farm.token.symbol === tokenSymbol))
  const filteredFarm = filterFarmsByQuoteToken(farms, preferredQuoteTokens)
  return filteredFarm
}

export const useFarmFromTokenSymbolSmartChef = (tokenSymbol: any, preferredQuoteTokens?: string[]): Pool => {
  const farms = useSelector((state: State) =>
    state.farmsWithSmartChef.data.filter((farm) => farm.stakingToken === tokenSymbol),
  )
  const filteredFarm = filterFarmsByLpToken(farms, preferredQuoteTokens)
  return filteredFarm
}

export const useBusdPriceFromPid = (pid: number): BigNumber => {
  const farm = useFarmFromPid(pid)
  const ethPriceBusd = usePriceBnbBusd()
  // console.log('bnb price', ethPriceBusd)
  const quoteTokenFarm = useFarmFromTokenSymbol(farm?.quoteToken?.symbol)

  // Catch in case a farm isn't found
  if (!farm) {
    return null
  }

  // With a quoteToken of BUSD or wBNB, it is straightforward to return the token price.
  if (farm.quoteToken.symbol === 'BUSD') {
    return farm.tokenPriceVsQuote ? new BigNumber(farm.tokenPriceVsQuote) : BIG_ZERO
  }

  if (farm.quoteToken.symbol === 'SOKU') {
    // console.log('farm', farm.tokenPriceVsQuote)

    return ethPriceBusd.gt(0) ? ethPriceBusd.times(farm.tokenPriceVsQuote) : BIG_ZERO
  }

  if (farm.quoteToken.symbol === 'wBNB') {
    return ethPriceBusd.gt(0) ? ethPriceBusd.times(farm.tokenPriceVsQuote) : BIG_ZERO
  }

  // Possible alternative farm quoteTokens:
  // UST (i.e. MIR-UST), pBTC (i.e. PNT-pBTC), BTCB (i.e. bBADGER-BTCB), ETH (i.e. SUSHI-ETH)
  // If the farm's quote token isn't BUSD or wBNB, we then use the quote token, of the original farm's quote token
  // i.e. for farm PNT - pBTC
  // we find the pBTC farm (pBTC - BNB)'s quote token - BNB
  // from the BNB - pBTC BUSD price, we can calculate the PNT - BUSD price
  if (quoteTokenFarm?.quoteToken?.symbol === 'wBNB') {
    const quoteTokenInBusd = ethPriceBusd.gt(0) && ethPriceBusd.times(quoteTokenFarm.tokenPriceVsQuote)
    return farm.tokenPriceVsQuote ? new BigNumber(farm.tokenPriceVsQuote).times(quoteTokenInBusd) : BIG_ZERO
  }

  if (quoteTokenFarm?.quoteToken?.symbol === 'BUSD') {
    const quoteTokenInBusd = quoteTokenFarm.tokenPriceVsQuote
    return quoteTokenInBusd ? new BigNumber(farm.tokenPriceVsQuote).times(quoteTokenInBusd) : BIG_ZERO
  }

  // Catch in case token does not have immediate or once-removed BUSD/wBNB quoteToken
  return BIG_ZERO
}

export const useBusdPriceFromPidV2 = (pid: number): BigNumber => {
  const farm = useFarmFromPidV2(pid)
  const bnbPriceBusd = usePriceBnbBusd()
  const quoteTokenFarm = useFarmFromTokenSymbolSmartChef(farm?.quoteToken?.symbol)

  // Catch in case a farm isn't found
  if (!farm) {
    return null
  }

  // With a quoteToken of BUSD or wBNB, it is straightforward to return the token price.
  if (farm.quoteToken.symbol === 'ETH') {
    return farm.tokenPriceVsQuote ? new BigNumber(farm.tokenPriceVsQuote) : BIG_ZERO
  }

  if (farm.quoteToken.symbol === 'SOKU') {
    // console.log('farm', farm.tokenPriceVsQuote)

    return (bnbPriceBusd as BigNumber).isGreaterThan(0) ? bnbPriceBusd.times(farm.tokenPriceVsQuote) : BIG_ZERO
  }

  if (farm.quoteToken.symbol === 'SMUDGE') {
    // console.log('farm', farm.tokenPriceVsQuote)

    return BIG_NINE
  }

  if (farm.quoteToken.symbol === 'wBNB') {
    return (bnbPriceBusd as BigNumber).isGreaterThan(0) ? bnbPriceBusd.times(farm.tokenPriceVsQuote) : BIG_ZERO
  }

  // Possible alternative farm quoteTokens:
  // UST (i.e. MIR-UST), pBTC (i.e. PNT-pBTC), BTCB (i.e. bBADGER-BTCB), ETH (i.e. SUSHI-ETH)
  // If the farm's quote token isn't BUSD or wBNB, we then use the quote token, of the original farm's quote token
  // i.e. for farm PNT - pBTC
  // we find the pBTC farm (pBTC - BNB)'s quote token - BNB
  // from the BNB - pBTC BUSD price, we can calculate the PNT - BUSD price
  // if (quoteTokenFarm?.quoteToken?.symbol === 'wBNB') {
  //   const quoteTokenInBusd = bnbPriceBusd?.toNumber() > 0 && bnbPriceBusd.times(quoteTokenFarm.tokenPriceVsQuote)
  //   return farm.tokenPriceVsQuote ? new BigNumber(farm.tokenPriceVsQuote).times(quoteTokenInBusd) : BIG_ZERO
  // }

  // if (quoteTokenFarm?.quoteToken?.symbol === 'BUSD') {
  //   const quoteTokenInBusd = quoteTokenFarm.tokenPriceVsQuote
  //   return quoteTokenInBusd ? new BigNumber(farm.tokenPriceVsQuote).times(quoteTokenInBusd) : BIG_ZERO
  // }

  // Catch in case token does not have immediate or once-removed BUSD/wBNB quoteToken
  return BIG_ZERO
}

export const useBusdPriceFromToken = (tokenSymbol: string): BigNumber => {
  const tokenFarm = useFarmFromTokenSymbol(tokenSymbol)
  const tokenPrice = useBusdPriceFromPid(tokenFarm?.pid)
  return tokenPrice
}

export const useLpTokenPrice = (symbol: string) => {
  const farm = useFarmFromLpSymbol(symbol)
  const farmTokenPriceInUsd = useBusdPriceFromPid(farm.pid)
  let lpTokenPrice = BIG_ZERO

  if (farm.lpTotalSupply && farm.lpTotalInQuoteToken) {
    // Total value of base token in LP
    const valueOfBaseTokenInFarm = farmTokenPriceInUsd.times(farm.tokenAmountTotal)
    // Double it to get overall value in LP
    const overallValueOfAllTokensInFarm = valueOfBaseTokenInFarm.times(2)
    // Divide total value of all tokens, by the number of LP tokens
    const totalLpTokens = getBalanceAmount(farm.lpTotalSupply)
    lpTokenPrice = overallValueOfAllTokensInFarm.div(totalLpTokens)
  }

  return lpTokenPrice
}

export const useLpTokenPriceV2 = (symbol: string) => {
  const farm = useFarmFromLpSymbolV2(symbol)
  const farmTokenPriceInUsd = useBusdPriceFromPidV2(farm.pid)
  const priceOfEth = ethPrice()
  let lpTokenPrice = BIG_ZERO

  if (farm.lpTotalSupply && farm.lpTotalInQuoteToken) {
    // Total value of base token in LP
    const valueOfBaseTokenInFarm = farmTokenPriceInUsd.times(farm.tokenAmountTotal)
    // Double it to get overall value in LP
    const overallValueOfAllTokensInFarm = valueOfBaseTokenInFarm.times(2).times(priceOfEth)
    // Divide total value of all tokens, by the number of LP tokens
    const totalLpTokens = getBalanceAmount(farm.lpTotalSupply)
    lpTokenPrice = overallValueOfAllTokensInFarm.div(totalLpTokens)

    // https://dailydefi.org/articles/lp-token-value-calculation/
  } else if (farm.lpSymbol === 'SOKU-SMUDGE LP') {
    const web3 = getWeb3NoAccount()
    const contractABI = [
      { inputs: [], stateMutability: 'nonpayable', type: 'constructor' },
      {
        anonymous: false,
        inputs: [
          { indexed: true, internalType: 'address', name: 'owner', type: 'address' },
          { indexed: true, internalType: 'address', name: 'spender', type: 'address' },
          { indexed: false, internalType: 'uint256', name: 'value', type: 'uint256' },
        ],
        name: 'Approval',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          { indexed: true, internalType: 'address', name: 'sender', type: 'address' },
          { indexed: false, internalType: 'uint256', name: 'amount0', type: 'uint256' },
          { indexed: false, internalType: 'uint256', name: 'amount1', type: 'uint256' },
          { indexed: true, internalType: 'address', name: 'to', type: 'address' },
        ],
        name: 'Burn',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          { indexed: true, internalType: 'address', name: 'sender', type: 'address' },
          { indexed: false, internalType: 'uint256', name: 'amount0', type: 'uint256' },
          { indexed: false, internalType: 'uint256', name: 'amount1', type: 'uint256' },
        ],
        name: 'Mint',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          { indexed: true, internalType: 'address', name: 'sender', type: 'address' },
          { indexed: false, internalType: 'uint256', name: 'amount0In', type: 'uint256' },
          { indexed: false, internalType: 'uint256', name: 'amount1In', type: 'uint256' },
          { indexed: false, internalType: 'uint256', name: 'amount0Out', type: 'uint256' },
          { indexed: false, internalType: 'uint256', name: 'amount1Out', type: 'uint256' },
          { indexed: true, internalType: 'address', name: 'to', type: 'address' },
        ],
        name: 'Swap',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          { indexed: false, internalType: 'uint112', name: 'reserve0', type: 'uint112' },
          { indexed: false, internalType: 'uint112', name: 'reserve1', type: 'uint112' },
        ],
        name: 'Sync',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          { indexed: true, internalType: 'address', name: 'from', type: 'address' },
          { indexed: true, internalType: 'address', name: 'to', type: 'address' },
          { indexed: false, internalType: 'uint256', name: 'value', type: 'uint256' },
        ],
        name: 'Transfer',
        type: 'event',
      },
      {
        inputs: [],
        name: 'DOMAIN_SEPARATOR',
        outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [],
        name: 'MINIMUM_LIQUIDITY',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [],
        name: 'PERMIT_TYPEHASH',
        outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [
          { internalType: 'address', name: '', type: 'address' },
          { internalType: 'address', name: '', type: 'address' },
        ],
        name: 'allowance',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [
          { internalType: 'address', name: 'spender', type: 'address' },
          { internalType: 'uint256', name: 'value', type: 'uint256' },
        ],
        name: 'approve',
        outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [{ internalType: 'address', name: '', type: 'address' }],
        name: 'balanceOf',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [{ internalType: 'address', name: 'to', type: 'address' }],
        name: 'burn',
        outputs: [
          { internalType: 'uint256', name: 'amount0', type: 'uint256' },
          { internalType: 'uint256', name: 'amount1', type: 'uint256' },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [],
        name: 'decimals',
        outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [],
        name: 'factory',
        outputs: [{ internalType: 'address', name: '', type: 'address' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [],
        name: 'getReserves',
        outputs: [
          { internalType: 'uint112', name: '_reserve0', type: 'uint112' },
          { internalType: 'uint112', name: '_reserve1', type: 'uint112' },
          { internalType: 'uint32', name: '_blockTimestampLast', type: 'uint32' },
        ],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [
          { internalType: 'address', name: '_token0', type: 'address' },
          { internalType: 'address', name: '_token1', type: 'address' },
        ],
        name: 'initialize',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [],
        name: 'kLast',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [{ internalType: 'address', name: 'to', type: 'address' }],
        name: 'mint',
        outputs: [{ internalType: 'uint256', name: 'liquidity', type: 'uint256' }],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [],
        name: 'name',
        outputs: [{ internalType: 'string', name: '', type: 'string' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [{ internalType: 'address', name: '', type: 'address' }],
        name: 'nonces',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [
          { internalType: 'address', name: 'owner', type: 'address' },
          { internalType: 'address', name: 'spender', type: 'address' },
          { internalType: 'uint256', name: 'value', type: 'uint256' },
          { internalType: 'uint256', name: 'deadline', type: 'uint256' },
          { internalType: 'uint8', name: 'v', type: 'uint8' },
          { internalType: 'bytes32', name: 'r', type: 'bytes32' },
          { internalType: 'bytes32', name: 's', type: 'bytes32' },
        ],
        name: 'permit',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [],
        name: 'price0CumulativeLast',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [],
        name: 'price1CumulativeLast',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [{ internalType: 'address', name: 'to', type: 'address' }],
        name: 'skim',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [
          { internalType: 'uint256', name: 'amount0Out', type: 'uint256' },
          { internalType: 'uint256', name: 'amount1Out', type: 'uint256' },
          { internalType: 'address', name: 'to', type: 'address' },
          { internalType: 'bytes', name: 'data', type: 'bytes' },
        ],
        name: 'swap',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [],
        name: 'symbol',
        outputs: [{ internalType: 'string', name: '', type: 'string' }],
        stateMutability: 'view',
        type: 'function',
      },
      { inputs: [], name: 'sync', outputs: [], stateMutability: 'nonpayable', type: 'function' },
      {
        inputs: [],
        name: 'token0',
        outputs: [{ internalType: 'address', name: '', type: 'address' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [],
        name: 'token1',
        outputs: [{ internalType: 'address', name: '', type: 'address' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [],
        name: 'totalSupply',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [
          { internalType: 'address', name: 'to', type: 'address' },
          { internalType: 'uint256', name: 'value', type: 'uint256' },
        ],
        name: 'transfer',
        outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [
          { internalType: 'address', name: 'from', type: 'address' },
          { internalType: 'address', name: 'to', type: 'address' },
          { internalType: 'uint256', name: 'value', type: 'uint256' },
        ],
        name: 'transferFrom',
        outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
        stateMutability: 'nonpayable',
        type: 'function',
      },
    ] // Replace with the actual ABI
    const contractAddress = '0xc30424b354d41852082f712900bf3366baf1b776'

    const contract = new web3.eth.Contract(contractABI as any, contractAddress)
    // Call the contract function to retrieve the reserves of the token pair
    contract.methods.getReserves().call((error, reserves) => {
      if (error) {
        console.error('Error retrieving reserves:', error)
      } else {
        // Extract the relevant information from the reserves object
        const token0Amount = reserves._reserve0
        const token1Amount = reserves._reserve1

        // Perform calculations based on the reserves to get the LP token price
        // Adjust the calculation based on the specific formula used by the liquidity pool
        lpTokenPrice = new BigNumber(token0Amount).div(token1Amount)
      }
    })
  }

  return lpTokenPrice
}

// Pools

export const usePools = (account): Pool[] => {
  const { fastRefresh } = useRefresh()
  const dispatch = useAppDispatch()
  useEffect(() => {
    if (account) {
      dispatch(fetchPoolsUserDataAsync(account))
    }
  }, [account, dispatch, fastRefresh])

  const pools = useSelector((state: State) => state.pools.data)
  return pools.map(transformPool)
}

export const usePoolFromPid = (sousId: number): Pool => {
  const pool = useSelector((state: State) => state.pools.data.find((p) => p.sousId === sousId))
  return transformPool(pool)
}

// export const useFetchCakeVault = () => {
//   const { account } = useWeb3React()
//   const { fastRefresh } = useRefresh()
//   const dispatch = useAppDispatch()

//   useEffect(() => {
//     dispatch(fetchCakeVaultPublicData())
//   }, [dispatch, fastRefresh])

//   useEffect(() => {
//     dispatch(fetchCakeVaultUserData({ account }))
//   }, [dispatch, fastRefresh, account])

//   useEffect(() => {
//     dispatch(fetchCakeVaultFees())
//   }, [dispatch])
// }

export const useCakeVault = () => {
  const {
    totalShares: totalSharesAsString,
    pricePerFullShare: pricePerFullShareAsString,
    totalCakeInVault: totalCakeInVaultAsString,
    estimatedCakeBountyReward: estimatedCakeBountyRewardAsString,
    totalPendingCakeHarvest: totalPendingCakeHarvestAsString,
    fees: { performanceFee, callFee, withdrawalFee, withdrawalFeePeriod },
    userData: {
      isLoading,
      userShares: userSharesAsString,
      cakeAtLastUserAction: cakeAtLastUserActionAsString,
      lastDepositedTime,
      lastUserActionTime,
    },
  } = useSelector((state: State) => state.pools.cakeVault)

  // console.log(pricePerFullShareAsString, 'pricePerFullShare')

  const estimatedCakeBountyReward = useMemo(() => {
    return new BigNumber(estimatedCakeBountyRewardAsString)
  }, [estimatedCakeBountyRewardAsString])

  const totalPendingCakeHarvest = useMemo(() => {
    return new BigNumber(totalPendingCakeHarvestAsString)
  }, [totalPendingCakeHarvestAsString])

  const totalShares = useMemo(() => {
    return new BigNumber(totalSharesAsString)
  }, [totalSharesAsString])

  const pricePerFullShare = useMemo(() => {
    return new BigNumber(pricePerFullShareAsString)
  }, [pricePerFullShareAsString])

  const totalCakeInVault = useMemo(() => {
    return new BigNumber(totalCakeInVaultAsString)
  }, [totalCakeInVaultAsString])

  const userShares = useMemo(() => {
    return new BigNumber(userSharesAsString)
  }, [userSharesAsString])

  const cakeAtLastUserAction = useMemo(() => {
    return new BigNumber(cakeAtLastUserActionAsString)
  }, [cakeAtLastUserActionAsString])

  return {
    totalShares,
    pricePerFullShare,
    totalCakeInVault,
    estimatedCakeBountyReward,
    totalPendingCakeHarvest,
    fees: {
      performanceFee,
      callFee,
      withdrawalFee,
      withdrawalFeePeriod,
    },
    userData: {
      isLoading,
      userShares,
      cakeAtLastUserAction,
      lastDepositedTime,
      lastUserActionTime,
    },
  }
}

// Farms With SmartChef

export const useFarmsWithSmartChef = (account): Pool[] => {
  const { fastRefresh } = useRefresh()
  const dispatch = useAppDispatch()
  useEffect(() => {
    if (account) {
      dispatch(fetchFarmSmartChefUserDataAsync(account))
    }
  }, [account, dispatch, fastRefresh])

  const farms = useSelector((state: State) => state.farmsWithSmartChef.data)
  return farms.map(transformFarm)
}

export const useFarmWithSmartChefFromPid = (sousId: number): Pool => {
  const farm = useSelector((state: State) => state.farmsWithSmartChef.data.find((p) => p.sousId === sousId))
  return transformFarm(farm)
}

// Profile

// export const useFetchProfile = () => {
//   const { account } = useWeb3React()
//   const dispatch = useAppDispatch()

//   useEffect(() => {
//     dispatch(fetchProfile(account))
//   }, [account, dispatch])
// }

export const useProfile = () => {
  const { isInitialized, isLoading, data, hasRegistered }: ProfileState = useSelector((state: State) => state.profile)
  return { profile: data, hasProfile: isInitialized && hasRegistered, isInitialized, isLoading }
}

// Teams

// export const useTeam = (id: number) => {
//   const team: Team = useSelector((state: State) => state.teams.data[id])
//   const dispatch = useAppDispatch()

//   useEffect(() => {
//     dispatch(fetchTeam(id))
//   }, [id, dispatch])

//   return team
// }

// export const useTeams = () => {
//   const { isInitialized, isLoading, data }: TeamsState = useSelector((state: State) => state.teams)
//   const dispatch = useAppDispatch()

//   useEffect(() => {
//     dispatch(fetchTeams())
//   }, [dispatch])

//   return { teams: data, isInitialized, isLoading }
// }

// Achievements

// export const useFetchAchievements = () => {
//   const { account } = useWeb3React()
//   const dispatch = useAppDispatch()

//   useEffect(() => {
//     if (account) {
//       dispatch(fetchAchievements(account))
//     }
//   }, [account, dispatch])
// }

// export const useAchievements = () => {
//   const achievements: AchievementState['data'] = useSelector((state: State) => state.achievements.data)
//   return achievements
// }

// Prices

export const useTokenData = (token_symbol) => {
  let token
  let res
  const getCoinData = async () => {
    await require('axios')
      .get(
        `https://api.coingecko.com/api/v3/coins/${token_symbol}?localization=true&tickers=true&market_data=true&community_data=false&developer_data=false&sparkline=false`,
      )
      .then((response) => {
        if (response) {
          token = response
          console.log('coingecko response', response)
        }
      })

    const token_price = token.data.market_data.current_price['usd']
    res = token_price
  }
  getCoinData()

  return res
}

const CoinGecko = require('coingecko-api')

//2. Initiate the CoinGecko API Client
const CoinGeckoClient = new CoinGecko()

let price

//3. Make calls

export const useTokenPrice = (token: string) => {
  const [tokenPrice, setTokenPrice] = useState(0)
  const { slowRefresh } = useRefresh()

  useEffect(() => {
    const getTokenPrice = async (token_symbol) => {
      try {
        const res = await CoinGeckoClient.coins.fetch(token_symbol, {
          headers: {
            'X-CoinGecko-API-Key': 'CG-zkP5j8VkGrkSvGp3LF8Nvmh2',
          },
        })
        const data = await res.data
        const price = data?.market_data?.current_price['usd']

        setTokenPrice(price)
      } catch (e) {
        console.log(e)
      }
    }

    getTokenPrice(token)
  }, [slowRefresh])

  return tokenPrice
}

export const useFetchPriceList = () => {
  const { slowRefresh } = useRefresh()
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(fetchPrices())
  }, [dispatch, slowRefresh])
}

export const useGetApiPrices = () => {
  const prices: PriceState['data'] = useSelector((state: State) => state.prices.data)
  return prices
}

export const useGetApiPrice = (address: string) => {
  const prices = useGetApiPrices()

  if (!prices) {
    return 0
  }

  return prices[address.toLowerCase()]
}

export const usePriceBnbBusd = (): BigNumber => {
  const ethPrice = useTokenPrice('ethereum')

  return new BigNumber(ethPrice)
}

export const usePriceSokuEth = (): BigNumber => {
  const sokuFarm = useFarmFromPidV2(1)
  // console.log(sokuFarm, 'farm')
  const priceOfEth = ethPrice()

  const sokuPriceETH = sokuFarm.tokenPriceVsQuote ? sokuFarm.tokenPriceVsQuote : BIG_ZERO
  const sokuPriceUsd = Number(sokuPriceETH) * Number(priceOfEth)
  const sokuPriceETHAsBN = new BigNumber(sokuPriceUsd)

  return sokuPriceETHAsBN
}

export const usePriceSutekuEth = (): BigNumber => {
  const sutekuFarm = useFarmFromPidV2(2)
  const soku_price = usePriceSokuEth()
  const priceOfEth = ethPrice()

  const sutekuPriceBSC = useSutekuPrice()
  const sutekuPriceBSCAsBN = new BigNumber(sutekuPriceBSC)

  const sutekuPriceETH = sutekuFarm.tokenPriceVsQuote ? sutekuFarm.tokenPriceVsQuote : BIG_ZERO

  const sutekuPriceUsd = Number(sutekuPriceETH) * Number(priceOfEth)
  const sutekuPriceETHAsBN = new BigNumber(sutekuPriceUsd)
  const averageSutekuPrice = sutekuPriceBSCAsBN.plus(sutekuPriceETHAsBN).div(new BigNumber(2))

  return averageSutekuPrice
}

export const usePriceHobiEth = (): BigNumber => {
  const hobiFarm = useFarmFromPidV2(3)

  const hobiPrice = hobiFarm.tokenPriceVsQuote ? hobiFarm.tokenPriceVsQuote : BIG_ZERO

  return new BigNumber(1)
}

export const usePriceSodatsuEth = (): BigNumber => {
  const sodatsuFarm = useFarmFromPidV2(8)
  const priceOfEth = ethPrice()

  const sodatsuPriceETH = sodatsuFarm.tokenPriceVsQuote ? sodatsuFarm.tokenPriceVsQuote : BIG_ZERO

  const sodatsuPriceUsd = Number(sodatsuPriceETH) * Number(priceOfEth)
  const sodatsuPriceETHAsBN = new BigNumber(sodatsuPriceUsd)

  return sodatsuPriceETHAsBN
}

// Block
export const useBlock = () => {
  return useSelector((state: State) => state.block)
}

export const useInitialBlock = () => {
  return useSelector((state: State) => state.block.initialBlock)
}

// Predictions
export const useIsHistoryPaneOpen = () => {
  return useSelector((state: State) => state.predictions.isHistoryPaneOpen)
}

export const useIsChartPaneOpen = () => {
  return useSelector((state: State) => state.predictions.isChartPaneOpen)
}

export const useGetRounds = () => {
  return useSelector((state: State) => state.predictions.rounds)
}

export const useGetSortedRounds = () => {
  const roundData = useGetRounds()
  return orderBy(Object.values(roundData), ['epoch'], ['asc'])
}

export const useGetCurrentEpoch = () => {
  return useSelector((state: State) => state.predictions.currentEpoch)
}

export const useGetIntervalBlocks = () => {
  return useSelector((state: State) => state.predictions.intervalBlocks)
}

export const useGetBufferBlocks = () => {
  return useSelector((state: State) => state.predictions.bufferBlocks)
}

export const useGetTotalIntervalBlocks = () => {
  const intervalBlocks = useGetIntervalBlocks()
  const bufferBlocks = useGetBufferBlocks()
  return intervalBlocks + bufferBlocks
}

export const useGetRound = (id: string) => {
  const rounds = useGetRounds()
  return rounds[id]
}

export const useGetCurrentRound = () => {
  const currentEpoch = useGetCurrentEpoch()
  const rounds = useGetSortedRounds()
  return rounds.find((round) => round.epoch === currentEpoch)
}

export const useGetPredictionsStatus = () => {
  return useSelector((state: State) => state.predictions.status)
}

export const useGetHistoryFilter = () => {
  return useSelector((state: State) => state.predictions.historyFilter)
}

export const useGetCurrentRoundBlockNumber = () => {
  return useSelector((state: State) => state.predictions.currentRoundStartBlockNumber)
}

export const useGetMinBetAmount = () => {
  const minBetAmount = useSelector((state: State) => state.predictions.minBetAmount)
  return useMemo(() => new BigNumber(minBetAmount), [minBetAmount])
}

export const useGetIsFetchingHistory = () => {
  return useSelector((state: State) => state.predictions.isFetchingHistory)
}

export const useGetHistory = () => {
  return useSelector((state: State) => state.predictions.history)
}

export const useGetHistoryByAccount = (account: string) => {
  const bets = useGetHistory()
  return bets ? bets[account] : []
}

export const useGetBetByRoundId = (account: string, roundId: string) => {
  const bets = useSelector((state: State) => state.predictions.bets)

  if (!bets[account]) {
    return null
  }

  if (!bets[account][roundId]) {
    return null
  }

  return bets[account][roundId]
}

// export const useBetCanClaim = (account: string, roundId: string) => {
//   const bet = useGetBetByRoundId(account, roundId)

//   if (!bet) {
//     return false
//   }

//   return getCanClaim(bet)
// }

export const useGetLastOraclePrice = (): BigNumber => {
  const lastOraclePrice = useSelector((state: State) => state.predictions.lastOraclePrice)
  return new BigNumber(lastOraclePrice)
}

// Collectibles
export const useGetCollectibles = () => {
  const { account } = useWeb3React()
  const dispatch = useAppDispatch()
  const { isInitialized, isLoading, data } = useSelector((state: State) => state.collectibles)
  const identifiers = Object.keys(data)

  useEffect(() => {
    // Fetch nfts only if we have not done so already
    if (!isInitialized) {
      dispatch(fetchWalletNfts(account))
    }
  }, [isInitialized, account, dispatch])

  return {
    isInitialized,
    isLoading,
    tokenIds: data,
    nftsInWallet: Nfts.filter((nft) => identifiers.includes(nft.identifier)),
  }
}
