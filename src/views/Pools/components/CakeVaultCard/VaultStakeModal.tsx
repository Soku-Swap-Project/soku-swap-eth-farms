import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Modal, Text, Flex, Image, Button, BalanceInput, AutoRenewIcon, Link } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { useWeb3React } from '@web3-react/core'
import { BASE_EXCHANGE_URL } from 'config'
import { AbiItem } from 'web3-utils'
import { useAppDispatch } from 'state'
import { BIG_TEN } from 'utils/bigNumber'
import Slider from 'components/Slider'
import { useCakeVault, usePriceSokuEth, useBusdPriceFromToken, useTokenPrice, usePriceSutekuEth } from 'state/hooks'
import { getWeb3NoAccount } from 'utils/web3'
import { getAddress } from 'utils/addressHelpers'
// import { useCakeVaultContract } from 'hooks/useContract'
import useTheme from 'hooks/useTheme'
import useWithdrawalFeeTimer from 'hooks/cakeVault/useWithdrawalFeeTimer'
import BigNumber from 'bignumber.js'
import { getFullDisplayBalance, formatNumber, getDecimalAmount } from 'utils/formatBalance'
import useToast from 'hooks/useToast'
// import { fetchCakeVaultUserData } from 'state/pools'
import { Pool } from 'state/types'
import PercentageButton from './PercentageButton'
import { convertCakeToShares } from '../../helpers'
import FeeSummary from './FeeSummary'

// interface VaultStakeModalProps {
//   pool: Pool
//   stakingMax: BigNumber
//   // eslint-disable-next-line react/require-default-props
//   isRemovingStake?: boolean
//   // eslint-disable-next-line react/require-default-props
//   onDismiss?: () => void
// }

// const StyledButton = styled(Button)`
//   flex-grow: 1;
// `

// const StyledLink = styled(Link)`
//   width: 100%;
// `

// const VaultStakeModal: React.FC<VaultStakeModalProps> = ({ pool, stakingMax, isRemovingStake = false, onDismiss }) => {
//   const dispatch = useAppDispatch()
//   const [balance, setBalance] = useState(new BigNumber(0))
//   const { stakingToken } = pool
//   const sokuPrice = useTokenPrice('sokuswap')
//   const sutekuPrice = usePriceSutekuEth()
//   const web3 = getWeb3NoAccount()
//   const { account } = useWeb3React()
//   // const cakeVaultContract = useCakeVaultContract()
//   const {
//     userData: { lastDepositedTime, userShares },
//     pricePerFullShare,
//   } = useCakeVault()
//   const { t } = useTranslation()
//   const { theme } = useTheme()
//   const { toastSuccess, toastError } = useToast()
//   const [pendingTx, setPendingTx] = useState(false)
//   const [stakeAmount, setStakeAmount] = useState('')
//   const [staked, setStaked] = useState(0)
//   const [percent, setPercent] = useState(0)
//   const { hasUnstakingFee } = useWithdrawalFeeTimer(parseInt(lastDepositedTime, 10), userShares)
//   const cakePriceBusd = usePriceSokuEth()
//   const stakingTokenPrice =
//     stakingToken.address[56] === '0x198800aF50914004A9E9D19cA18C0b24587a50cf' ? sutekuPrice : sokuPrice
//   const usdValueStaked = stakeAmount && formatNumber(new BigNumber(stakeAmount).times(stakingTokenPrice).toNumber())

//   const getStakingBalance = async (address) => {
//     const abi = [
//       {
//         inputs: [
//           { internalType: 'contract IERC20', name: '_token', type: 'address' },
//           { internalType: 'contract IMasterChef', name: '_masterchef', type: 'address' },
//           { internalType: 'address', name: '_admin', type: 'address' },
//           { internalType: 'address', name: '_treasury', type: 'address' },
//           { internalType: 'uint256', name: '_sutekuPoolId', type: 'uint256' },
//         ],
//         stateMutability: 'nonpayable',
//         type: 'constructor',
//       },
//       {
//         anonymous: false,
//         inputs: [
//           { indexed: true, internalType: 'address', name: 'sender', type: 'address' },
//           { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' },
//           { indexed: false, internalType: 'uint256', name: 'shares', type: 'uint256' },
//           { indexed: false, internalType: 'uint256', name: 'lastDepositedTime', type: 'uint256' },
//         ],
//         name: 'Deposit',
//         type: 'event',
//       },
//       {
//         anonymous: false,
//         inputs: [
//           { indexed: true, internalType: 'address', name: 'sender', type: 'address' },
//           { indexed: false, internalType: 'uint256', name: 'performanceFee', type: 'uint256' },
//           { indexed: false, internalType: 'uint256', name: 'callFee', type: 'uint256' },
//         ],
//         name: 'Harvest',
//         type: 'event',
//       },
//       {
//         anonymous: false,
//         inputs: [
//           { indexed: true, internalType: 'address', name: 'previousOwner', type: 'address' },
//           { indexed: true, internalType: 'address', name: 'newOwner', type: 'address' },
//         ],
//         name: 'OwnershipTransferred',
//         type: 'event',
//       },
//       { anonymous: false, inputs: [], name: 'Pause', type: 'event' },
//       {
//         anonymous: false,
//         inputs: [{ indexed: false, internalType: 'address', name: 'account', type: 'address' }],
//         name: 'Paused',
//         type: 'event',
//       },
//       { anonymous: false, inputs: [], name: 'Unpause', type: 'event' },
//       {
//         anonymous: false,
//         inputs: [{ indexed: false, internalType: 'address', name: 'account', type: 'address' }],
//         name: 'Unpaused',
//         type: 'event',
//       },
//       {
//         anonymous: false,
//         inputs: [
//           { indexed: true, internalType: 'address', name: 'sender', type: 'address' },
//           { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' },
//           { indexed: false, internalType: 'uint256', name: 'shares', type: 'uint256' },
//         ],
//         name: 'Withdraw',
//         type: 'event',
//       },
//       {
//         inputs: [],
//         name: 'MAX_CALL_FEE',
//         outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
//         stateMutability: 'view',
//         type: 'function',
//       },
//       {
//         inputs: [],
//         name: 'MAX_PERFORMANCE_FEE',
//         outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
//         stateMutability: 'view',
//         type: 'function',
//       },
//       {
//         inputs: [],
//         name: 'MAX_WITHDRAW_FEE',
//         outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
//         stateMutability: 'view',
//         type: 'function',
//       },
//       {
//         inputs: [],
//         name: 'MAX_WITHDRAW_FEE_PERIOD',
//         outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
//         stateMutability: 'view',
//         type: 'function',
//       },
//       {
//         inputs: [],
//         name: 'admin',
//         outputs: [{ internalType: 'address', name: '', type: 'address' }],
//         stateMutability: 'view',
//         type: 'function',
//       },
//       {
//         inputs: [],
//         name: 'available',
//         outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
//         stateMutability: 'view',
//         type: 'function',
//       },
//       {
//         inputs: [],
//         name: 'balanceOf',
//         outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
//         stateMutability: 'view',
//         type: 'function',
//       },
//       {
//         inputs: [],
//         name: 'calculateHarvestSutekuRewards',
//         outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
//         stateMutability: 'view',
//         type: 'function',
//       },
//       {
//         inputs: [],
//         name: 'calculateTotalPendingSutekuRewards',
//         outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
//         stateMutability: 'view',
//         type: 'function',
//       },
//       {
//         inputs: [],
//         name: 'callFee',
//         outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
//         stateMutability: 'view',
//         type: 'function',
//       },
//       {
//         inputs: [{ internalType: 'uint256', name: '_amount', type: 'uint256' }],
//         name: 'deposit',
//         outputs: [],
//         stateMutability: 'nonpayable',
//         type: 'function',
//       },
//       { inputs: [], name: 'emergencyWithdraw', outputs: [], stateMutability: 'nonpayable', type: 'function' },
//       {
//         inputs: [],
//         name: 'getPricePerFullShare',
//         outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
//         stateMutability: 'view',
//         type: 'function',
//       },
//       { inputs: [], name: 'harvest', outputs: [], stateMutability: 'nonpayable', type: 'function' },
//       {
//         inputs: [{ internalType: 'address', name: '_token', type: 'address' }],
//         name: 'inCaseTokensGetStuck',
//         outputs: [],
//         stateMutability: 'nonpayable',
//         type: 'function',
//       },
//       {
//         inputs: [],
//         name: 'lastHarvestedTime',
//         outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
//         stateMutability: 'view',
//         type: 'function',
//       },
//       {
//         inputs: [],
//         name: 'masterchef',
//         outputs: [{ internalType: 'contract IMasterChef', name: '', type: 'address' }],
//         stateMutability: 'view',
//         type: 'function',
//       },
//       {
//         inputs: [],
//         name: 'owner',
//         outputs: [{ internalType: 'address', name: '', type: 'address' }],
//         stateMutability: 'view',
//         type: 'function',
//       },
//       { inputs: [], name: 'pause', outputs: [], stateMutability: 'nonpayable', type: 'function' },
//       {
//         inputs: [],
//         name: 'paused',
//         outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
//         stateMutability: 'view',
//         type: 'function',
//       },
//       {
//         inputs: [],
//         name: 'performanceFee',
//         outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
//         stateMutability: 'view',
//         type: 'function',
//       },
//       { inputs: [], name: 'renounceOwnership', outputs: [], stateMutability: 'nonpayable', type: 'function' },
//       {
//         inputs: [{ internalType: 'address', name: '_admin', type: 'address' }],
//         name: 'setAdmin',
//         outputs: [],
//         stateMutability: 'nonpayable',
//         type: 'function',
//       },
//       {
//         inputs: [{ internalType: 'uint256', name: '_callFee', type: 'uint256' }],
//         name: 'setCallFee',
//         outputs: [],
//         stateMutability: 'nonpayable',
//         type: 'function',
//       },
//       {
//         inputs: [{ internalType: 'uint256', name: '_performanceFee', type: 'uint256' }],
//         name: 'setPerformanceFee',
//         outputs: [],
//         stateMutability: 'nonpayable',
//         type: 'function',
//       },
//       {
//         inputs: [{ internalType: 'address', name: '_treasury', type: 'address' }],
//         name: 'setTreasury',
//         outputs: [],
//         stateMutability: 'nonpayable',
//         type: 'function',
//       },
//       {
//         inputs: [{ internalType: 'uint256', name: '_withdrawFee', type: 'uint256' }],
//         name: 'setWithdrawFee',
//         outputs: [],
//         stateMutability: 'nonpayable',
//         type: 'function',
//       },
//       {
//         inputs: [{ internalType: 'uint256', name: '_withdrawFeePeriod', type: 'uint256' }],
//         name: 'setWithdrawFeePeriod',
//         outputs: [],
//         stateMutability: 'nonpayable',
//         type: 'function',
//       },
//       {
//         inputs: [],
//         name: 'sutekuPoolId',
//         outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
//         stateMutability: 'view',
//         type: 'function',
//       },
//       {
//         inputs: [],
//         name: 'token',
//         outputs: [{ internalType: 'contract IERC20', name: '', type: 'address' }],
//         stateMutability: 'view',
//         type: 'function',
//       },
//       {
//         inputs: [],
//         name: 'totalShares',
//         outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
//         stateMutability: 'view',
//         type: 'function',
//       },
//       {
//         inputs: [{ internalType: 'address', name: 'newOwner', type: 'address' }],
//         name: 'transferOwnership',
//         outputs: [],
//         stateMutability: 'nonpayable',
//         type: 'function',
//       },
//       {
//         inputs: [],
//         name: 'treasury',
//         outputs: [{ internalType: 'address', name: '', type: 'address' }],
//         stateMutability: 'view',
//         type: 'function',
//       },
//       { inputs: [], name: 'unpause', outputs: [], stateMutability: 'nonpayable', type: 'function' },
//       {
//         inputs: [{ internalType: 'uint256', name: '_sutekuPoolId', type: 'uint256' }],
//         name: 'updateSutekuPoolId',
//         outputs: [],
//         stateMutability: 'nonpayable',
//         type: 'function',
//       },
//       {
//         inputs: [{ internalType: 'address', name: '', type: 'address' }],
//         name: 'userInfo',
//         outputs: [
//           { internalType: 'uint256', name: 'shares', type: 'uint256' },
//           { internalType: 'uint256', name: 'lastDepositedTime', type: 'uint256' },
//           { internalType: 'uint256', name: 'cakeAtLastUserAction', type: 'uint256' },
//           { internalType: 'uint256', name: 'lastUserActionTime', type: 'uint256' },
//         ],
//         stateMutability: 'view',
//         type: 'function',
//       },
//       {
//         inputs: [{ internalType: 'uint256', name: '_shares', type: 'uint256' }],
//         name: 'withdraw',
//         outputs: [],
//         stateMutability: 'nonpayable',
//         type: 'function',
//       },
//       { inputs: [], name: 'withdrawAll', outputs: [], stateMutability: 'nonpayable', type: 'function' },
//       {
//         inputs: [],
//         name: 'withdrawFee',
//         outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
//         stateMutability: 'view',
//         type: 'function',
//       },
//       {
//         inputs: [],
//         name: 'withdrawFeePeriod',
//         outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
//         stateMutability: 'view',
//         type: 'function',
//       },
//     ]
//     const contract = new web3.eth.Contract(abi as unknown as AbiItem, getAddress(pool.contractAddress))
//     const stakedAmount = await contract.methods.userInfo(address).call()
//     console.log(stakedAmount, 'user staked')

//     const userStaked = await stakedAmount[0]
//     const parsedBal = parseFloat(userStaked)

//     setStaked(parsedBal)
//   }

//   // useEffect(() => {
//   //   getStakingBalance(account)
//   //   console.log(staked, 'staked')
//   //   // eslint-disable-next-line react-hooks/exhaustive-deps
//   // }, [])

//   // useEffect(() => {
//   //   try {
//   //     const getBalance = async (address) => {
//   //       // If SUTEKU
//   //       if (stakingToken.address[56] === '0x198800af50914004a9e9d19ca18c0b24587a50cf') {
//   //         const abi = [
//   //           {
//   //             anonymous: false,
//   //             inputs: [
//   //               { indexed: true, internalType: 'address', name: 'owner', type: 'address' },
//   //               { indexed: true, internalType: 'address', name: 'spender', type: 'address' },
//   //               { indexed: false, internalType: 'uint256', name: 'value', type: 'uint256' },
//   //             ],
//   //             name: 'Approval',
//   //             type: 'event',
//   //           },
//   //           {
//   //             anonymous: false,
//   //             inputs: [
//   //               { indexed: true, internalType: 'address', name: 'previousOwner', type: 'address' },
//   //               { indexed: true, internalType: 'address', name: 'newOwner', type: 'address' },
//   //             ],
//   //             name: 'OwnershipTransferred',
//   //             type: 'event',
//   //           },
//   //           {
//   //             anonymous: false,
//   //             inputs: [
//   //               { indexed: true, internalType: 'address', name: 'from', type: 'address' },
//   //               { indexed: true, internalType: 'address', name: 'to', type: 'address' },
//   //               { indexed: false, internalType: 'uint256', name: 'value', type: 'uint256' },
//   //             ],
//   //             name: 'Transfer',
//   //             type: 'event',
//   //           },
//   //           {
//   //             inputs: [],
//   //             name: 'DOMAIN_TYPEHASH',
//   //             outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
//   //             stateMutability: 'view',
//   //             type: 'function',
//   //           },
//   //           {
//   //             inputs: [
//   //               { internalType: 'address', name: 'owner', type: 'address' },
//   //               { internalType: 'address', name: 'spender', type: 'address' },
//   //             ],
//   //             name: 'allowance',
//   //             outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
//   //             stateMutability: 'view',
//   //             type: 'function',
//   //           },
//   //           {
//   //             inputs: [
//   //               { internalType: 'address', name: 'spender', type: 'address' },
//   //               { internalType: 'uint256', name: 'amount', type: 'uint256' },
//   //             ],
//   //             name: 'approve',
//   //             outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
//   //             stateMutability: 'nonpayable',
//   //             type: 'function',
//   //           },
//   //           {
//   //             inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
//   //             name: 'balanceOf',
//   //             outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
//   //             stateMutability: 'view',
//   //             type: 'function',
//   //           },
//   //           {
//   //             inputs: [],
//   //             name: 'decimals',
//   //             outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
//   //             stateMutability: 'view',
//   //             type: 'function',
//   //           },
//   //           {
//   //             inputs: [
//   //               { internalType: 'address', name: 'spender', type: 'address' },
//   //               { internalType: 'uint256', name: 'subtractedValue', type: 'uint256' },
//   //             ],
//   //             name: 'decreaseAllowance',
//   //             outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
//   //             stateMutability: 'nonpayable',
//   //             type: 'function',
//   //           },
//   //           {
//   //             inputs: [],
//   //             name: 'getOwner',
//   //             outputs: [{ internalType: 'address', name: '', type: 'address' }],
//   //             stateMutability: 'view',
//   //             type: 'function',
//   //           },
//   //           {
//   //             inputs: [
//   //               { internalType: 'address', name: 'spender', type: 'address' },
//   //               { internalType: 'uint256', name: 'addedValue', type: 'uint256' },
//   //             ],
//   //             name: 'increaseAllowance',
//   //             outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
//   //             stateMutability: 'nonpayable',
//   //             type: 'function',
//   //           },
//   //           {
//   //             inputs: [
//   //               { internalType: 'address', name: '_to', type: 'address' },
//   //               { internalType: 'uint256', name: '_amount', type: 'uint256' },
//   //             ],
//   //             name: 'mint',
//   //             outputs: [],
//   //             stateMutability: 'nonpayable',
//   //             type: 'function',
//   //           },
//   //           {
//   //             inputs: [{ internalType: 'uint256', name: 'amount', type: 'uint256' }],
//   //             name: 'mint',
//   //             outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
//   //             stateMutability: 'nonpayable',
//   //             type: 'function',
//   //           },
//   //           {
//   //             inputs: [],
//   //             name: 'name',
//   //             outputs: [{ internalType: 'string', name: '', type: 'string' }],
//   //             stateMutability: 'view',
//   //             type: 'function',
//   //           },
//   //           {
//   //             inputs: [],
//   //             name: 'owner',
//   //             outputs: [{ internalType: 'address', name: '', type: 'address' }],
//   //             stateMutability: 'view',
//   //             type: 'function',
//   //           },
//   //           { inputs: [], name: 'renounceOwnership', outputs: [], stateMutability: 'nonpayable', type: 'function' },
//   //           {
//   //             inputs: [],
//   //             name: 'symbol',
//   //             outputs: [{ internalType: 'string', name: '', type: 'string' }],
//   //             stateMutability: 'view',
//   //             type: 'function',
//   //           },
//   //           {
//   //             inputs: [],
//   //             name: 'totalSupply',
//   //             outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
//   //             stateMutability: 'view',
//   //             type: 'function',
//   //           },
//   //           {
//   //             inputs: [
//   //               { internalType: 'address', name: 'recipient', type: 'address' },
//   //               { internalType: 'uint256', name: 'amount', type: 'uint256' },
//   //             ],
//   //             name: 'transfer',
//   //             outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
//   //             stateMutability: 'nonpayable',
//   //             type: 'function',
//   //           },
//   //           {
//   //             inputs: [
//   //               { internalType: 'address', name: 'sender', type: 'address' },
//   //               { internalType: 'address', name: 'recipient', type: 'address' },
//   //               { internalType: 'uint256', name: 'amount', type: 'uint256' },
//   //             ],
//   //             name: 'transferFrom',
//   //             outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
//   //             stateMutability: 'nonpayable',
//   //             type: 'function',
//   //           },
//   //           {
//   //             inputs: [{ internalType: 'address', name: 'newOwner', type: 'address' }],
//   //             name: 'transferOwnership',
//   //             outputs: [],
//   //             stateMutability: 'nonpayable',
//   //             type: 'function',
//   //           },
//   //         ]
//   //         const contract = new web3.eth.Contract(abi as unknown as AbiItem, getAddress(stakingToken.address))
//   //         const response = await contract.methods.balanceOf(address).call()
//   //         const bal = new BigNumber(response)
//   //         setBalance(bal)
//   //       } else if (stakingToken.address[56] === '0x0e4b5ea0259eb3d66e6fcb7cc8785817f8490a53') {
//   //         // If SOKU
//   //         const abi = [
//   //           { inputs: [], stateMutability: 'nonpayable', type: 'constructor' },
//   //           {
//   //             anonymous: false,
//   //             inputs: [
//   //               { indexed: true, internalType: 'address', name: 'owner', type: 'address' },
//   //               { indexed: true, internalType: 'address', name: 'spender', type: 'address' },
//   //               { indexed: false, internalType: 'uint256', name: 'value', type: 'uint256' },
//   //             ],
//   //             name: 'Approval',
//   //             type: 'event',
//   //           },
//   //           {
//   //             anonymous: false,
//   //             inputs: [
//   //               { indexed: true, internalType: 'address', name: 'delegator', type: 'address' },
//   //               { indexed: true, internalType: 'address', name: 'fromDelegate', type: 'address' },
//   //               { indexed: true, internalType: 'address', name: 'toDelegate', type: 'address' },
//   //             ],
//   //             name: 'DelegateChanged',
//   //             type: 'event',
//   //           },
//   //           {
//   //             anonymous: false,
//   //             inputs: [
//   //               { indexed: true, internalType: 'address', name: 'delegate', type: 'address' },
//   //               { indexed: false, internalType: 'uint256', name: 'previousBalance', type: 'uint256' },
//   //               { indexed: false, internalType: 'uint256', name: 'newBalance', type: 'uint256' },
//   //             ],
//   //             name: 'DelegateVotesChanged',
//   //             type: 'event',
//   //           },
//   //           {
//   //             anonymous: false,
//   //             inputs: [
//   //               { indexed: true, internalType: 'address', name: 'from', type: 'address' },
//   //               { indexed: true, internalType: 'address', name: 'to', type: 'address' },
//   //               { indexed: false, internalType: 'uint256', name: 'value', type: 'uint256' },
//   //             ],
//   //             name: 'Transfer',
//   //             type: 'event',
//   //           },
//   //           {
//   //             inputs: [],
//   //             name: 'DELEGATION_TYPEHASH',
//   //             outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
//   //             stateMutability: 'view',
//   //             type: 'function',
//   //           },
//   //           {
//   //             inputs: [],
//   //             name: 'DOMAIN_TYPEHASH',
//   //             outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
//   //             stateMutability: 'view',
//   //             type: 'function',
//   //           },
//   //           {
//   //             inputs: [
//   //               { internalType: 'address', name: 'owner', type: 'address' },
//   //               { internalType: 'address', name: 'spender', type: 'address' },
//   //             ],
//   //             name: 'allowance',
//   //             outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
//   //             stateMutability: 'view',
//   //             type: 'function',
//   //           },
//   //           {
//   //             inputs: [
//   //               { internalType: 'address', name: 'spender', type: 'address' },
//   //               { internalType: 'uint256', name: 'amount', type: 'uint256' },
//   //             ],
//   //             name: 'approve',
//   //             outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
//   //             stateMutability: 'nonpayable',
//   //             type: 'function',
//   //           },
//   //           {
//   //             inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
//   //             name: 'balanceOf',
//   //             outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
//   //             stateMutability: 'view',
//   //             type: 'function',
//   //           },
//   //           {
//   //             inputs: [
//   //               { internalType: 'address', name: '', type: 'address' },
//   //               { internalType: 'uint32', name: '', type: 'uint32' },
//   //             ],
//   //             name: 'checkpoints',
//   //             outputs: [
//   //               { internalType: 'uint32', name: 'fromBlock', type: 'uint32' },
//   //               { internalType: 'uint256', name: 'votes', type: 'uint256' },
//   //             ],
//   //             stateMutability: 'view',
//   //             type: 'function',
//   //           },
//   //           {
//   //             inputs: [],
//   //             name: 'decimals',
//   //             outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
//   //             stateMutability: 'view',
//   //             type: 'function',
//   //           },
//   //           {
//   //             inputs: [
//   //               { internalType: 'address', name: 'spender', type: 'address' },
//   //               { internalType: 'uint256', name: 'subtractedValue', type: 'uint256' },
//   //             ],
//   //             name: 'decreaseAllowance',
//   //             outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
//   //             stateMutability: 'nonpayable',
//   //             type: 'function',
//   //           },
//   //           {
//   //             inputs: [{ internalType: 'address', name: 'delegatee', type: 'address' }],
//   //             name: 'delegate',
//   //             outputs: [],
//   //             stateMutability: 'nonpayable',
//   //             type: 'function',
//   //           },
//   //           {
//   //             inputs: [
//   //               { internalType: 'address', name: 'delegatee', type: 'address' },
//   //               { internalType: 'uint256', name: 'nonce', type: 'uint256' },
//   //               { internalType: 'uint256', name: 'expiry', type: 'uint256' },
//   //               { internalType: 'uint8', name: 'v', type: 'uint8' },
//   //               { internalType: 'bytes32', name: 'r', type: 'bytes32' },
//   //               { internalType: 'bytes32', name: 's', type: 'bytes32' },
//   //             ],
//   //             name: 'delegateBySig',
//   //             outputs: [],
//   //             stateMutability: 'nonpayable',
//   //             type: 'function',
//   //           },
//   //           {
//   //             inputs: [{ internalType: 'address', name: 'delegator', type: 'address' }],
//   //             name: 'delegates',
//   //             outputs: [{ internalType: 'address', name: '', type: 'address' }],
//   //             stateMutability: 'view',
//   //             type: 'function',
//   //           },
//   //           {
//   //             inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
//   //             name: 'getCurrentVotes',
//   //             outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
//   //             stateMutability: 'view',
//   //             type: 'function',
//   //           },
//   //           {
//   //             inputs: [
//   //               { internalType: 'address', name: 'account', type: 'address' },
//   //               { internalType: 'uint256', name: 'blockNumber', type: 'uint256' },
//   //             ],
//   //             name: 'getPriorVotes',
//   //             outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
//   //             stateMutability: 'view',
//   //             type: 'function',
//   //           },
//   //           {
//   //             inputs: [
//   //               { internalType: 'address', name: 'spender', type: 'address' },
//   //               { internalType: 'uint256', name: 'addedValue', type: 'uint256' },
//   //             ],
//   //             name: 'increaseAllowance',
//   //             outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
//   //             stateMutability: 'nonpayable',
//   //             type: 'function',
//   //           },
//   //           {
//   //             inputs: [],
//   //             name: 'name',
//   //             outputs: [{ internalType: 'string', name: '', type: 'string' }],
//   //             stateMutability: 'view',
//   //             type: 'function',
//   //           },
//   //           {
//   //             inputs: [{ internalType: 'address', name: '', type: 'address' }],
//   //             name: 'nonces',
//   //             outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
//   //             stateMutability: 'view',
//   //             type: 'function',
//   //           },
//   //           {
//   //             inputs: [{ internalType: 'address', name: '', type: 'address' }],
//   //             name: 'numCheckpoints',
//   //             outputs: [{ internalType: 'uint32', name: '', type: 'uint32' }],
//   //             stateMutability: 'view',
//   //             type: 'function',
//   //           },
//   //           {
//   //             inputs: [],
//   //             name: 'symbol',
//   //             outputs: [{ internalType: 'string', name: '', type: 'string' }],
//   //             stateMutability: 'view',
//   //             type: 'function',
//   //           },
//   //           {
//   //             inputs: [],
//   //             name: 'totalSupply',
//   //             outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
//   //             stateMutability: 'view',
//   //             type: 'function',
//   //           },
//   //           {
//   //             inputs: [
//   //               { internalType: 'address', name: 'recipient', type: 'address' },
//   //               { internalType: 'uint256', name: 'amount', type: 'uint256' },
//   //             ],
//   //             name: 'transfer',
//   //             outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
//   //             stateMutability: 'nonpayable',
//   //             type: 'function',
//   //           },
//   //           {
//   //             inputs: [
//   //               { internalType: 'address', name: 'sender', type: 'address' },
//   //               { internalType: 'address', name: 'recipient', type: 'address' },
//   //               { internalType: 'uint256', name: 'amount', type: 'uint256' },
//   //             ],
//   //             name: 'transferFrom',
//   //             outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
//   //             stateMutability: 'nonpayable',
//   //             type: 'function',
//   //           },
//   //         ]
//   //         const contract = new web3.eth.Contract(abi as unknown as AbiItem, getAddress(stakingToken.address))
//   //         const response = await contract.methods.balanceOf(address).call()
//   //         const bal = new BigNumber(response)

//   //         setBalance(bal)
//   //       } else {
//   //         const abi = [
//   //           {
//   //             anonymous: false,
//   //             inputs: [
//   //               { indexed: true, internalType: 'address', name: 'owner', type: 'address' },
//   //               { indexed: true, internalType: 'address', name: 'spender', type: 'address' },
//   //               { indexed: false, internalType: 'uint256', name: 'value', type: 'uint256' },
//   //             ],
//   //             name: 'Approval',
//   //             type: 'event',
//   //           },
//   //           {
//   //             anonymous: false,
//   //             inputs: [
//   //               { indexed: true, internalType: 'address', name: 'previousOwner', type: 'address' },
//   //               { indexed: true, internalType: 'address', name: 'newOwner', type: 'address' },
//   //             ],
//   //             name: 'OwnershipTransferred',
//   //             type: 'event',
//   //           },
//   //           {
//   //             anonymous: false,
//   //             inputs: [
//   //               { indexed: true, internalType: 'address', name: 'from', type: 'address' },
//   //               { indexed: true, internalType: 'address', name: 'to', type: 'address' },
//   //               { indexed: false, internalType: 'uint256', name: 'value', type: 'uint256' },
//   //             ],
//   //             name: 'Transfer',
//   //             type: 'event',
//   //           },
//   //           {
//   //             inputs: [],
//   //             name: 'DOMAIN_TYPEHASH',
//   //             outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
//   //             stateMutability: 'view',
//   //             type: 'function',
//   //           },
//   //           {
//   //             inputs: [
//   //               { internalType: 'address', name: 'owner', type: 'address' },
//   //               { internalType: 'address', name: 'spender', type: 'address' },
//   //             ],
//   //             name: 'allowance',
//   //             outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
//   //             stateMutability: 'view',
//   //             type: 'function',
//   //           },
//   //           {
//   //             inputs: [
//   //               { internalType: 'address', name: 'spender', type: 'address' },
//   //               { internalType: 'uint256', name: 'amount', type: 'uint256' },
//   //             ],
//   //             name: 'approve',
//   //             outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
//   //             stateMutability: 'nonpayable',
//   //             type: 'function',
//   //           },
//   //           {
//   //             inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
//   //             name: 'balanceOf',
//   //             outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
//   //             stateMutability: 'view',
//   //             type: 'function',
//   //           },
//   //           {
//   //             inputs: [],
//   //             name: 'decimals',
//   //             outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
//   //             stateMutability: 'view',
//   //             type: 'function',
//   //           },
//   //           {
//   //             inputs: [
//   //               { internalType: 'address', name: 'spender', type: 'address' },
//   //               { internalType: 'uint256', name: 'subtractedValue', type: 'uint256' },
//   //             ],
//   //             name: 'decreaseAllowance',
//   //             outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
//   //             stateMutability: 'nonpayable',
//   //             type: 'function',
//   //           },
//   //           {
//   //             inputs: [],
//   //             name: 'getOwner',
//   //             outputs: [{ internalType: 'address', name: '', type: 'address' }],
//   //             stateMutability: 'view',
//   //             type: 'function',
//   //           },
//   //           {
//   //             inputs: [
//   //               { internalType: 'address', name: 'spender', type: 'address' },
//   //               { internalType: 'uint256', name: 'addedValue', type: 'uint256' },
//   //             ],
//   //             name: 'increaseAllowance',
//   //             outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
//   //             stateMutability: 'nonpayable',
//   //             type: 'function',
//   //           },
//   //           {
//   //             inputs: [
//   //               { internalType: 'address', name: '_to', type: 'address' },
//   //               { internalType: 'uint256', name: '_amount', type: 'uint256' },
//   //             ],
//   //             name: 'mint',
//   //             outputs: [],
//   //             stateMutability: 'nonpayable',
//   //             type: 'function',
//   //           },
//   //           {
//   //             inputs: [{ internalType: 'uint256', name: 'amount', type: 'uint256' }],
//   //             name: 'mint',
//   //             outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
//   //             stateMutability: 'nonpayable',
//   //             type: 'function',
//   //           },
//   //           {
//   //             inputs: [],
//   //             name: 'name',
//   //             outputs: [{ internalType: 'string', name: '', type: 'string' }],
//   //             stateMutability: 'view',
//   //             type: 'function',
//   //           },
//   //           {
//   //             inputs: [],
//   //             name: 'owner',
//   //             outputs: [{ internalType: 'address', name: '', type: 'address' }],
//   //             stateMutability: 'view',
//   //             type: 'function',
//   //           },
//   //           {
//   //             inputs: [],
//   //             name: 'renounceOwnership',
//   //             outputs: [],
//   //             stateMutability: 'nonpayable',
//   //             type: 'function',
//   //           },
//   //           {
//   //             inputs: [],
//   //             name: 'symbol',
//   //             outputs: [{ internalType: 'string', name: '', type: 'string' }],
//   //             stateMutability: 'view',
//   //             type: 'function',
//   //           },
//   //           {
//   //             inputs: [],
//   //             name: 'totalSupply',
//   //             outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
//   //             stateMutability: 'view',
//   //             type: 'function',
//   //           },
//   //           {
//   //             inputs: [
//   //               { internalType: 'address', name: 'recipient', type: 'address' },
//   //               { internalType: 'uint256', name: 'amount', type: 'uint256' },
//   //             ],
//   //             name: 'transfer',
//   //             outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
//   //             stateMutability: 'nonpayable',
//   //             type: 'function',
//   //           },
//   //           {
//   //             inputs: [
//   //               { internalType: 'address', name: 'sender', type: 'address' },
//   //               { internalType: 'address', name: 'recipient', type: 'address' },
//   //               { internalType: 'uint256', name: 'amount', type: 'uint256' },
//   //             ],
//   //             name: 'transferFrom',
//   //             outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
//   //             stateMutability: 'nonpayable',
//   //             type: 'function',
//   //           },
//   //           {
//   //             inputs: [{ internalType: 'address', name: 'newOwner', type: 'address' }],
//   //             name: 'transferOwnership',
//   //             outputs: [],
//   //             stateMutability: 'nonpayable',
//   //             type: 'function',
//   //           },
//   //         ]
//   //         const contract = new web3.eth.Contract(abi as unknown as AbiItem, getAddress(stakingToken.address))
//   //         const response = await contract.methods.balanceOf(address).call()
//   //         const bal = new BigNumber(response)
//   //         setBalance(bal)
//   //       }
//   //     }

//   //     getBalance(account)
//   //   } catch (error) {
//   //     console.log(error, 'getBalance')
//   //   }
//   //   // eslint-disable-next-line react-hooks/exhaustive-deps
//   // })

//   const handleStakeInputChange = (input: string) => {
//     if (input) {
//       const convertedInput = new BigNumber(input).multipliedBy(BIG_TEN.pow(stakingToken.decimals))
//       const percentage = Math.floor(convertedInput.dividedBy(stakingMax).multipliedBy(100).toNumber())
//       setPercent(percentage > 100 ? 100 : percentage)
//     } else {
//       setPercent(0)
//     }
//     setStakeAmount(input)
//   }

//   const handleChangePercent = (sliderPercent: number) => {
//     if (sliderPercent > 0) {
//       const percentageOfStakingMax = stakingMax.dividedBy(100).multipliedBy(sliderPercent)
//       const amountToStake = getFullDisplayBalance(percentageOfStakingMax, stakingToken.decimals, stakingToken.decimals)
//       setStakeAmount(amountToStake)
//     } else {
//       setStakeAmount('')
//     }
//     setPercent(sliderPercent)
//   }

//   const handleWithdrawal = async (convertedStakeAmount: BigNumber) => {
//     setPendingTx(true)
//     const shareStakeToWithdraw = convertCakeToShares(convertedStakeAmount, pricePerFullShare)
//     // trigger withdrawAll function if the withdrawal will leave 0.000001 CAKE or less
//     const triggerWithdrawAllThreshold = new BigNumber(1000000000000)
//     const sharesRemaining = userShares.minus(shareStakeToWithdraw.sharesAsBigNumber)
//     const isWithdrawingAll = sharesRemaining.lte(triggerWithdrawAllThreshold)

//     if (isWithdrawingAll) {
//       cakeVaultContract.methods
//         .withdrawAll()
//         .send({ from: account })
//         .on('sending', () => {
//           setPendingTx(true)
//         })
//         .on('receipt', () => {
//           toastSuccess(t('Unstaked!'), t('Your earnings have also been harvested to your wallet'))
//           setPendingTx(false)
//           onDismiss()
//           dispatch(fetchCakeVaultUserData({ account }))
//         })
//         .on('error', (error) => {
//           console.error(error)
//           // Remove message from toast before prod
//           toastError(t('Error'), t('%error% - Please try again.', { error: error.message }))
//           setPendingTx(false)
//         })
//     } else {
//       cakeVaultContract.methods
//         .withdraw(shareStakeToWithdraw.sharesAsBigNumber.toString())
//         // .toString() being called to fix a BigNumber error in prod
//         // as suggested here https://github.com/ChainSafe/web3.js/issues/2077
//         .send({ from: account })
//         .on('sending', () => {
//           setPendingTx(true)
//         })
//         .on('receipt', () => {
//           toastSuccess(t('Unstaked!'), t('Your earnings have also been harvested to your wallet'))
//           setPendingTx(false)
//           onDismiss()
//           dispatch(fetchCakeVaultUserData({ account }))
//         })
//         .on('error', (error) => {
//           console.error(error)
//           // Remove message from toast before prod
//           toastError(t('Error'), t('%error% - Please try again.', { error: error.message }))
//           setPendingTx(false)
//         })
//     }
//   }

//   const handleDeposit = async (convertedStakeAmount: BigNumber) => {
//     cakeVaultContract.methods
//       .deposit(convertedStakeAmount.toString())
//       // .toString() being called to fix a BigNumber error in prod
//       // as suggested here https://github.com/ChainSafe/web3.js/issues/2077
//       .send({ from: account })
//       .on('sending', () => {
//         setPendingTx(true)
//       })
//       .on('receipt', () => {
//         toastSuccess(t('Staked!'), t('Your funds have been staked in the pool'))
//         setPendingTx(false)
//         onDismiss()
//         dispatch(fetchCakeVaultUserData({ account }))
//       })
//       .on('error', (error) => {
//         console.error(error)
//         // Remove message from toast before prod
//         toastError(t('Error'), t('%error% - Please try again.', { error: error.message }))
//         setPendingTx(false)
//       })
//   }

//   const handleConfirmClick = async () => {
//     const convertedStakeAmount = getDecimalAmount(new BigNumber(stakeAmount), stakingToken.decimals)
//     setPendingTx(true)
//     // unstaking
//     if (isRemovingStake) {
//       handleWithdrawal(convertedStakeAmount)
//       // staking
//     } else {
//       handleDeposit(convertedStakeAmount)
//     }
//   }

//   // console.log(stakingMax, 'stakingMax')

//   return (
//     <Modal title={isRemovingStake ? t('Unstake') : t('Stake in Pool')} onDismiss={onDismiss} headerBackground="#f9f9fa">
//       <Flex alignItems="center" justifyContent="space-between" mb="8px">
//         <Text bold>{isRemovingStake ? t('Unstake') : t('Stake')}:</Text>
//         <Flex alignItems="center" minWidth="70px">
//           {/* <Image src={`/images/tokens/${stakingToken.symbol}.png`} width={24} height={24} alt={stakingToken.symbol} /> */}
//           {stakingToken.symbol === 'SOKU' ? (
//             <img
//               src="https://i.ibb.co/sm60Zb7/Soku-Logo-400x400.png"
//               width={24}
//               height={24}
//               alt={stakingToken.symbol}
//               style={{ objectFit: 'contain' }}
//             />
//           ) : (
//             <img
//               src="https://i.ibb.co/ZfBZpjN/Suteku-Logo.png"
//               width={24}
//               height={24}
//               alt={stakingToken.symbol}
//               style={{ objectFit: 'contain' }}
//             />
//           )}

//           <Text ml="4px" bold>
//             {stakingToken.symbol}
//           </Text>
//         </Flex>
//       </Flex>
//       <BalanceInput
//         value={stakeAmount}
//         onUserInput={handleStakeInputChange}
//         currencyValue={stakingTokenPrice > 0 && `~${usdValueStaked || 0} USD`}
//         style={{ background: 'rgb(239 238 238 / 79%)', border: 'none' }}
//       />
//       <Text ml="auto" color="textSubtle" fontSize="12px" mb="8px">
//         {t('Balance: %balance%', {
//           balance: getFullDisplayBalance(isRemovingStake ? new BigNumber(staked) : stakingMax, stakingToken.decimals),
//         })}
//       </Text>
//       <Slider
//         min={0}
//         max={100}
//         value={percent}
//         onChange={handleChangePercent}
//         name="stake"
//         valueLabel={`${percent}%`}
//         step={1}
//       />
//       <Flex alignItems="center" justifyContent="space-between" mt="8px">
//         <PercentageButton onClick={() => handleChangePercent(25)}>25%</PercentageButton>
//         <PercentageButton onClick={() => handleChangePercent(50)}>50%</PercentageButton>
//         <PercentageButton onClick={() => handleChangePercent(75)}>75%</PercentageButton>
//         <PercentageButton onClick={() => handleChangePercent(isRemovingStake ? 100 : 99.99)}>MAX</PercentageButton>
//       </Flex>
//       {isRemovingStake && hasUnstakingFee && (
//         <FeeSummary stakingTokenSymbol={stakingToken.symbol} stakeAmount={stakeAmount} />
//       )}
//       <Button
//         style={{ background: '#05195a' }}
//         isLoading={pendingTx}
//         endIcon={pendingTx ? <AutoRenewIcon spin color="currentColor" /> : null}
//         onClick={handleConfirmClick}
//         disabled={!stakeAmount || parseFloat(stakeAmount) === 0}
//         mt="24px"
//       >
//         {pendingTx ? t('Confirming') : t('Confirm')}
//       </Button>
//       {!isRemovingStake && (
//         <StyledLink external href={BASE_EXCHANGE_URL}>
//           <Button style={{ background: '#05195a' }} width="100%" mt="8px" variant="primary">
//             <Text color="#fff" fontWeight="bolder">
//               {' '}
//               {t('Get %symbol%', { symbol: stakingToken.symbol })}
//             </Text>
//           </Button>
//         </StyledLink>
//       )}
//     </Modal>
//   )
// }

// export default VaultStakeModal

export {}
