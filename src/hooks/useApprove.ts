import { useCallback } from 'react'
import { useWeb3React } from '@web3-react/core'
import { Contract } from 'web3-eth-contract'
import { ethers } from 'ethers'
import { useAppDispatch } from 'state'
import {
  updateUserAllowance,
  fetchFarmUserDataAsync,
  fetchFarmUserDataAsyncV2,
  updateUserAllowanceFarmsV2,
} from 'state/actions'
import { approve } from 'utils/callHelpers'
import { useMasterchef, useMasterchefV2, useCake, useSousChef, useSousChefV2Farms } from './useContract'

// Approve a Farm
export const useApprove = (lpContract: Contract) => {
  const dispatch = useAppDispatch()
  const { account } = useWeb3React()
  const masterChefContract = useMasterchef()

  const handleApprove = useCallback(async () => {
    try {
      const tx = await approve(lpContract, masterChefContract, account)
      // console.log('tx', tx)
      dispatch(fetchFarmUserDataAsync(account))
      return tx
    } catch (e) {
      return false
    }
  }, [account, dispatch, lpContract, masterChefContract])

  return { onApprove: handleApprove }
}

export const useApproveV2 = (lpContract: Contract) => {
  const dispatch = useAppDispatch()
  const { account } = useWeb3React()
  const masterChefContract = useMasterchefV2()

  const handleApprove = useCallback(async () => {
    try {
      const tx = await approve(lpContract, masterChefContract, account)
      // console.log('tx', tx)
      dispatch(fetchFarmUserDataAsyncV2(account))
      return tx
    } catch (e) {
      return false
    }
  }, [account, dispatch, lpContract, masterChefContract])

  return { onApprove: handleApprove }
}

// Approve a Pool
export const useSousApprove = (lpContract: Contract, sousId) => {
  const dispatch = useAppDispatch()
  const { account } = useWeb3React()
  const sousChefContract = useSousChef(sousId)

  const handleApprove = useCallback(async () => {
    try {
      const tx = await approve(lpContract, sousChefContract, account)
      // console.log('tx', tx)
      dispatch(updateUserAllowance(sousId, account))
      return tx
    } catch (e) {
      return false
    }
  }, [account, dispatch, lpContract, sousChefContract, sousId])

  return { onApprove: handleApprove }
}

export const useSousApproveFarms = (lpContract: Contract, sousId) => {
  const dispatch = useAppDispatch()
  const { account } = useWeb3React()
  const sousChefContract = useSousChefV2Farms(sousId)

  const handleApprove = useCallback(async () => {
    try {
      const tx = await approve(lpContract, sousChefContract, account)
      // console.log('tx', tx)
      dispatch(updateUserAllowanceFarmsV2(sousId, account))
      return tx
    } catch (e) {
      return false
    }
  }, [account, dispatch, lpContract, sousChefContract, sousId])

  return { onApprove: handleApprove }
}

// Approve the lottery
// export const useLotteryApprove = () => {
//   const { account } = useWeb3React()
//   const cakeContract = useCake()
//   const lotteryContract = useLottery()

//   const handleApprove = useCallback(async () => {
//     try {
//       const tx = await approve(cakeContract, lotteryContract, account)
//       return tx
//     } catch (e) {
//       return false
//     }
//   }, [account, cakeContract, lotteryContract])

//   return { onApprove: handleApprove }
// }

// Approve an IFO
export const useIfoApprove = (tokenContract: Contract, spenderAddress: string) => {
  const { account } = useWeb3React()
  const onApprove = useCallback(async () => {
    const tx = await tokenContract.methods.approve(spenderAddress, ethers.constants.MaxUint256).send({ from: account })
    return tx
  }, [account, spenderAddress, tokenContract])

  return onApprove
}
