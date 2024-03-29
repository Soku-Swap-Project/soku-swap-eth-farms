import { useCallback } from 'react'
import { useWeb3React } from '@web3-react/core'
import BigNumber from 'bignumber.js'
import { useAppDispatch } from 'state'
import {
  fetchFarmUserDataAsync,
  updateUserStakedBalance,
  updateUserBalance,
  updateUserStakedBalanceFarmsV2,
  updateUserBalanceFarmsV2,
} from 'state/actions'
import { stake, sousStake, sousStakeBnb } from 'utils/callHelpers'
import { BIG_TEN } from 'utils/bigNumber'
import { useMasterchef, useMasterchefV2, useSousChef, useSousChefV2Farms } from './useContract'

const useStake = (pid: number) => {
  const dispatch = useAppDispatch()
  const { account } = useWeb3React()
  const masterChefContract = useMasterchef()

  const handleStake = useCallback(
    async (amount: string) => {
      const txHash = await stake(masterChefContract, pid, amount, account)
      dispatch(fetchFarmUserDataAsync(account))
      console.info(txHash)
    },
    [account, dispatch, masterChefContract, pid],
  )

  return { onStake: handleStake }
}

export const useStakeV2 = (pid: number) => {
  const dispatch = useAppDispatch()
  const { account } = useWeb3React()
  const masterChefContract = useMasterchefV2()

  const handleStake = useCallback(
    async (amount: string) => {
      const txHash = await stake(masterChefContract, pid, amount, account)
      dispatch(fetchFarmUserDataAsync(account))
      console.info(txHash)
    },
    [account, dispatch, masterChefContract, pid],
  )

  return { onStake: handleStake }
}

export const useSousStake = (sousId: number, isUsingBnb = false) => {
  const dispatch = useAppDispatch()
  const { account } = useWeb3React()
  const masterChefContract = useMasterchef()
  const sousChefContract = useSousChef(sousId)

  const handleStake = useCallback(
    async (amount: string, decimals: number) => {
      if (sousId === 0) {
        await stake(masterChefContract, 0, amount, account)
      } else if (isUsingBnb) {
        await sousStakeBnb(sousChefContract, amount, account)
      } else {
        await sousStake(sousChefContract, amount, decimals, account)
      }
      dispatch(updateUserStakedBalance(sousId, account))
      dispatch(updateUserBalance(sousId, account))
    },
    [account, dispatch, isUsingBnb, masterChefContract, sousChefContract, sousId],
  )

  return { onStake: handleStake }
}

export const useSousStakeFarms = (sousId: number, isUsingBnb = false) => {
  const dispatch = useAppDispatch()
  const { account } = useWeb3React()
  const masterChefContract = useMasterchef()
  const sousChefContract = useSousChefV2Farms(sousId)

  const stakeInFarm = async (amount, decimals) => {
    const stakeTx = await sousChefContract.methods
      .deposit(new BigNumber(amount).times(BIG_TEN.pow(decimals)).toString())
      .send({ from: account })
      .then((receipt) => {
        console.log('receipt', receipt)
      })
    dispatch(updateUserStakedBalanceFarmsV2(sousId, account))
    dispatch(updateUserBalanceFarmsV2(sousId, account))

    return stakeTx
  }

  const handleStake = useCallback(
    async (amount: string, decimals: number) => {
      if (sousId === 0) {
        await stake(masterChefContract, 0, amount, account)
      } else if (isUsingBnb) {
        await sousStakeBnb(sousChefContract, amount, account)
      } else {
        await sousStake(sousChefContract, amount, decimals, account)
      }
      dispatch(updateUserStakedBalanceFarmsV2(sousId, account))
      dispatch(updateUserBalanceFarmsV2(sousId, account))
    },
    [account, dispatch, isUsingBnb, masterChefContract, sousChefContract, sousId],
  )

  return { onStake: handleStake, stakeInFarm }
}

export default useStake
