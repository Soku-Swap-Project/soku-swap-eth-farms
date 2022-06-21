import { useCallback } from 'react'
import { useWeb3React } from '@web3-react/core'
import BigNumber from 'bignumber.js'

import { useAppDispatch } from 'state'
import {
  fetchFarmUserDataAsync,
  updateUserStakedBalance,
  updateUserBalance,
  updateUserPendingReward,
  updateUserStakedBalanceFarmsV2,
  updateUserBalanceFarmsV2,
  updateUserPendingRewardFarmsV2,
} from 'state/actions'
import { BIG_TEN } from 'utils/bigNumber'
import { unstake, sousUnstake, sousEmergencyUnstake } from 'utils/callHelpers'
import { useMasterchef, useSousChef, useMasterchefV2, useSousChefV2Farms } from './useContract'

const useUnstake = (pid: number) => {
  const dispatch = useAppDispatch()
  const { account } = useWeb3React()
  const masterChefContract = useMasterchef()

  const handleUnstake = useCallback(
    async (amount: string) => {
      const txHash = await unstake(masterChefContract, pid, amount, account)
      dispatch(fetchFarmUserDataAsync(account))
      console.info(txHash)
    },
    [account, dispatch, masterChefContract, pid],
  )

  return { onUnstake: handleUnstake }
}

export const useUnstakeV2 = (pid: number) => {
  const dispatch = useAppDispatch()
  const { account } = useWeb3React()
  const masterChefContract = useMasterchefV2()

  const handleUnstake = useCallback(
    async (amount: string) => {
      const txHash = await unstake(masterChefContract, pid, amount, account)
      dispatch(fetchFarmUserDataAsync(account))
      console.info(txHash)
    },
    [account, dispatch, masterChefContract, pid],
  )

  return { onUnstake: handleUnstake }
}

export const useSousUnstake = (sousId, enableEmergencyWithdraw = false) => {
  const dispatch = useAppDispatch()
  const { account } = useWeb3React()
  const masterChefContract = useMasterchef()
  const sousChefContract = useSousChef(sousId)

  const handleUnstake = useCallback(
    async (amount: string, decimals: number) => {
      if (sousId === 0) {
        const txHash = await unstake(masterChefContract, 0, amount, account)
        console.info(txHash)
      } else if (enableEmergencyWithdraw) {
        const txHash = await sousEmergencyUnstake(sousChefContract, account)
        console.info(txHash)
      } else {
        const txHash = await sousUnstake(sousChefContract, amount, decimals, account)
        console.info(txHash)
      }
      dispatch(updateUserStakedBalance(sousId, account))
      dispatch(updateUserBalance(sousId, account))
      dispatch(updateUserPendingReward(sousId, account))
    },
    [account, dispatch, enableEmergencyWithdraw, masterChefContract, sousChefContract, sousId],
  )

  return { onUnstake: handleUnstake }
}

export const useSousUnstakeFarms = (sousId, enableEmergencyWithdraw = false) => {
  const dispatch = useAppDispatch()
  const { account } = useWeb3React()
  const masterChefContract = useMasterchef()
  const sousChefContract = useSousChefV2Farms(sousId)

  const unStakeInFarm = async (amount, decimals) => {
    const unStakeTx = await sousChefContract.methods
      .withdraw(new BigNumber(amount).times(BIG_TEN.pow(decimals)).toString())
      .send({ from: account })
      .then((receipt) => {
        console.log('receipt', receipt)
      })
    dispatch(updateUserStakedBalanceFarmsV2(sousId, account))
    dispatch(updateUserBalanceFarmsV2(sousId, account))
    dispatch(updateUserPendingRewardFarmsV2(sousId, account))

    return unStakeTx
  }

  const handleUnstake = useCallback(
    async (amount: string, decimals: number) => {
      if (sousId === 0) {
        const txHash = await unstake(masterChefContract, 0, amount, account)
        console.info(txHash)
      } else if (enableEmergencyWithdraw) {
        const txHash = await sousEmergencyUnstake(sousChefContract, account)
        console.info(txHash)
      } else {
        const txHash = await sousUnstake(sousChefContract, amount, decimals, account)
        console.info(txHash)
      }
      dispatch(updateUserStakedBalanceFarmsV2(sousId, account))
      dispatch(updateUserBalanceFarmsV2(sousId, account))
      dispatch(updateUserPendingRewardFarmsV2(sousId, account))
    },
    [account, dispatch, enableEmergencyWithdraw, masterChefContract, sousChefContract, sousId],
  )

  return { onUnstake: handleUnstake, unStakeInFarm }
}

export default useUnstake
