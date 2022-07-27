/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import farmsConfig from 'config/constants/farmsWithSmartChef'
import { BIG_ZERO } from 'utils/bigNumber'
import { PoolsState as FarmsState, Pool as Farm, CakeVault, VaultFees, VaultUser } from 'state/types'
import { fetchFarmsBlockLimits, fetchFarmsStakingLimits, fetchFarmsTotalStaking } from './fetchPools'
import {
  fetchFarmsV2Allowance,
  fetchUserBalancesFarmsV2,
  fetchUserStakeBalancesFarmsV2,
  fetchUserPendingRewardsFarmsV2,
} from './fetchPoolsUser'

const initialState: FarmsState = {
  data: [...farmsConfig],
  cakeVault: {
    totalShares: null,
    pricePerFullShare: null,
    totalCakeInVault: null,
    estimatedCakeBountyReward: null,
    totalPendingCakeHarvest: null,
    fees: {
      performanceFee: null,
      callFee: null,
      withdrawalFee: null,
      withdrawalFeePeriod: null,
    },
    userData: {
      isLoading: true,
      userShares: null,
      cakeAtLastUserAction: null,
      lastDepositedTime: null,
      lastUserActionTime: null,
    },
  },
}

// Thunks
export const fetchFarmsV2PublicDataAsync = (currentBlock: number) => async (dispatch) => {
  const blockLimits = await fetchFarmsBlockLimits()
  const totalStakings = await fetchFarmsTotalStaking()

  const liveData = farmsConfig.map((pool) => {
    const blockLimit = blockLimits.find((entry) => entry.sousId === pool.sousId)
    // console.log('limit', blockLimits)
    const totalStaking = totalStakings.find((entry) => entry.sousId === pool.sousId)
    const isPoolEndBlockExceeded = currentBlock > 0 && blockLimit ? currentBlock > Number(blockLimit.endBlock) : false
    const isPoolFinished = pool.isFinished || isPoolEndBlockExceeded

    return {
      ...blockLimit,
      ...totalStaking,
      isFinished: isPoolFinished,
    }
  })

  dispatch(setFarmsWithSmartChefPublicData(liveData))
}

export const fetchFarmsV2StakingLimitsAsync = () => async (dispatch, getState) => {
  const poolsWithStakingLimit = getState()
    .pools.data.filter(({ stakingLimit }) => stakingLimit !== null && stakingLimit !== undefined)
    .map((pool) => pool.sousId)

  const stakingLimits = await fetchFarmsStakingLimits(poolsWithStakingLimit)

  const stakingLimitData = farmsConfig.map((pool) => {
    if (poolsWithStakingLimit.includes(pool.sousId)) {
      return { sousId: pool.sousId }
    }
    const stakingLimit = stakingLimits[pool.sousId] || BIG_ZERO
    return {
      sousId: pool.sousId,
      stakingLimit: stakingLimit.toJSON(),
    }
  })

  dispatch(setFarmsWithSmartChefPublicData(stakingLimitData))
}

export const fetchFarmsV2UserDataAsync = (account) => async (dispatch) => {
  const allowances = await fetchFarmsV2Allowance(account)
  const stakingTokenBalances = await fetchUserBalancesFarmsV2(account)
  const stakedBalances = await fetchUserStakeBalancesFarmsV2(account)
  const pendingRewards = await fetchUserPendingRewardsFarmsV2(account)

  const userData = farmsConfig.map((pool) => ({
    sousId: pool.sousId,
    allowance: allowances[pool.sousId],
    stakingTokenBalance: stakingTokenBalances[pool.sousId],
    stakedBalance: stakedBalances[pool.sousId],
    pendingReward: pendingRewards[pool.sousId],
  }))

  dispatch(setFarmsWithSmartChefUserData(userData))
  return { allowances, stakingTokenBalances, stakedBalances, pendingRewards }
}
// eslint-disable consistent-return
export const getUserPoolData = async (account) => {
  let allowances
  let stakingTokenBalances
  let stakedBalances
  let pendingRewards

  try {
    allowances = await fetchFarmsV2Allowance(account)
    stakingTokenBalances = await fetchUserBalancesFarmsV2(account)
    stakedBalances = await fetchUserStakeBalancesFarmsV2(account)
    pendingRewards = await fetchUserPendingRewardsFarmsV2(account)

    const userData = farmsConfig.map((pool) => ({
      sousId: pool.sousId,
      allowance: allowances[pool.sousId],
      stakingTokenBalance: stakingTokenBalances[pool.sousId],
      stakedBalance: stakedBalances[pool.sousId],
      pendingReward: pendingRewards[pool.sousId],
    }))
    console.log(userData, 'user')
  } catch (error) {
    // console.log(error)
  }

  return { allowances, stakingTokenBalances, stakedBalances, pendingRewards }
}

export const updateUserAllowanceFarmsV2 = (sousId: number, account: string) => async (dispatch) => {
  const allowances = await fetchFarmsV2Allowance(account)
  dispatch(updateFarmsWithSmartChefUserData({ sousId, field: 'allowance', value: allowances[sousId] }))
}

export const updateUserBalanceFarmsV2 = (sousId: number, account: string) => async (dispatch) => {
  const tokenBalances = await fetchUserBalancesFarmsV2(account)
  dispatch(updateFarmsWithSmartChefUserData({ sousId, field: 'stakingTokenBalance', value: tokenBalances[sousId] }))
}

export const updateUserStakedBalanceFarmsV2 = (sousId: number, account: string) => async (dispatch) => {
  const stakedBalances = await fetchUserStakeBalancesFarmsV2(account)
  dispatch(updateFarmsWithSmartChefUserData({ sousId, field: 'stakedBalance', value: stakedBalances[sousId] }))
}

export const updateUserPendingRewardFarmsV2 = (sousId: number, account: string) => async (dispatch) => {
  const pendingRewards = await fetchUserPendingRewardsFarmsV2(account)
  dispatch(updateFarmsWithSmartChefUserData({ sousId, field: 'pendingReward', value: pendingRewards[sousId] }))
}

// export const fetchCakeVaultPublicData = createAsyncThunk<CakeVault>('cakeVault/fetchPublicData', async () => {
//   const publicVaultInfo = await fetchPublicVaultData()
//   return publicVaultInfo
// })

// export const fetchCakeVaultFees = createAsyncThunk<VaultFees>('cakeVault/fetchFees', async () => {
//   const vaultFees = await fetchVaultFees()
//   return vaultFees
// })

// export const fetchCakeVaultUserData = createAsyncThunk<VaultUser, { account: string }>(
//   'cakeVault/fetchUser',
//   async ({ account }) => {
//     const userData = await fetchVaultUser(account)
//     return userData
//   },
// )

export const FarmsWithSmartChefSlice = createSlice({
  name: 'FarmsWithSmartChef',
  initialState,
  reducers: {
    setFarmsWithSmartChefPublicData: (state, action) => {
      const liveFarmsWithSmartChefData: Farm[] = action.payload
      state.data = state.data.map((pool) => {
        const livePoolData = liveFarmsWithSmartChefData.find((entry) => entry.sousId === pool.sousId)
        return { ...pool, ...livePoolData }
      })
    },
    setFarmsWithSmartChefUserData: (state, action) => {
      const userData = action.payload
      state.data = state.data.map((pool) => {
        const userPoolData = userData.find((entry) => entry.sousId === pool.sousId)
        return { ...pool, userData: userPoolData }
      })
    },
    updateFarmsWithSmartChefUserData: (state, action) => {
      const { field, value, sousId } = action.payload
      const index = state.data.findIndex((p) => p.sousId === sousId)

      if (index >= 0) {
        state.data[index] = { ...state.data[index], userData: { ...state.data[index].userData, [field]: value } }
      }
    },
  },
  // extraReducers: (builder) => {
  //   // Vault public data that updates frequently
  //   builder.addCase(fetchCakeVaultPublicData.fulfilled, (state, action: PayloadAction<CakeVault>) => {
  //     state.cakeVault = { ...state.cakeVault, ...action.payload }
  //   })
  //   // Vault fees
  //   builder.addCase(fetchCakeVaultFees.fulfilled, (state, action: PayloadAction<VaultFees>) => {
  //     const fees = action.payload
  //     state.cakeVault = { ...state.cakeVault, fees }
  //   })
  //   // Vault user data
  //   builder.addCase(fetchCakeVaultUserData.fulfilled, (state, action: PayloadAction<VaultUser>) => {
  //     const userData = action.payload
  //     userData.isLoading = false
  //     state.cakeVault = { ...state.cakeVault, userData }
  //   })
  // },
})

// Actions
export const { setFarmsWithSmartChefPublicData, setFarmsWithSmartChefUserData, updateFarmsWithSmartChefUserData } =
  FarmsWithSmartChefSlice.actions

export default FarmsWithSmartChefSlice.reducer
