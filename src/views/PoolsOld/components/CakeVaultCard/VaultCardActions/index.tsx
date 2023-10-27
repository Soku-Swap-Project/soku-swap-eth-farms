import BigNumber from 'bignumber.js'
import React, { useState } from 'react'
import styled from 'styled-components'
import { Flex, Text, Box } from '@pancakeswap/uikit'
// import { useWeb3React } from '@web3-react/core'
import { useTranslation } from 'contexts/Localization'
// import { useSoku, useSuteku } from 'hooks/useContract'
// import { getWeb3NoAccount } from 'utils/web3'
// import { getAddress } from 'utils/addressHelpers'
// import { AbiItem } from 'web3-utils'
// import useLastUpdated from 'hooks/useLastUpdated'
import { Pool } from 'state/types'
// import { BIG_ZERO } from 'utils/bigNumber'
// import VaultApprovalAction from './VaultApprovalAction'
import VaultStakeActions from './VaultStakeActions'

const InlineText = styled(Text)`
  display: inline;
`

const CakeVaultCardActions: React.FC<{
  pool: Pool
  accountHasSharesStaked: boolean
  isLoading: boolean
}> = ({ pool, accountHasSharesStaked, isLoading }) => {
  // const { account } = useWeb3React()
  // eslint-disable-next-line
  const { stakingToken, userData } = pool
  // const { lastUpdated, setLastUpdated } = useLastUpdated()
  // eslint-disable-next-line
  const [isVaultApproved, setIsVaultApproved] = useState(false)
  // eslint-disable-next-line
  const [balance, setBalance] = useState(new BigNumber(0))

  // const web3 = getWeb3NoAccount()
  // const cakeContract = useCake()
  // const sokuContract = useSoku()
  // const sutekuContract = useSuteku()
  // const cakeVaultContract = useCakeVaultContract()
  // console.log(cakeVaultContract, 'vault contract')
  const { t } = useTranslation()
  // const stakingTokenBalance = userData?.stakingTokenBalance ? new BigNumber(userData.stakingTokenBalance) : BIG_ZERO

  // useEffect(() => {
  //   const checkApprovalStatus = async () => {
  //     try {
  //       const response = await sutekuContract.methods.allowance(account, cakeVaultContract.options.address).call()
  //       const currentAllowance = new BigNumber(response)
  //       setIsVaultApproved(currentAllowance.gt(0))
  //     } catch (error) {
  //       console.log(error, 'vault card')
  //       setIsVaultApproved(false)
  //     }
  //   }

  //   checkApprovalStatus()
  // }, [account, sutekuContract, cakeVaultContract, lastUpdated])

  // useEffect(() => {
  //   try {
  //     const getBalance = async (address) => {
  //       // If SUTEKU
  //       if (stakingToken.address[56] === '0x198800af50914004a9e9d19ca18c0b24587a50cf') {
  //         const abi = [
  //           {
  //             anonymous: false,
  //             inputs: [
  //               { indexed: true, internalType: 'address', name: 'owner', type: 'address' },
  //               { indexed: true, internalType: 'address', name: 'spender', type: 'address' },
  //               { indexed: false, internalType: 'uint256', name: 'value', type: 'uint256' },
  //             ],
  //             name: 'Approval',
  //             type: 'event',
  //           },
  //           {
  //             anonymous: false,
  //             inputs: [
  //               { indexed: true, internalType: 'address', name: 'previousOwner', type: 'address' },
  //               { indexed: true, internalType: 'address', name: 'newOwner', type: 'address' },
  //             ],
  //             name: 'OwnershipTransferred',
  //             type: 'event',
  //           },
  //           {
  //             anonymous: false,
  //             inputs: [
  //               { indexed: true, internalType: 'address', name: 'from', type: 'address' },
  //               { indexed: true, internalType: 'address', name: 'to', type: 'address' },
  //               { indexed: false, internalType: 'uint256', name: 'value', type: 'uint256' },
  //             ],
  //             name: 'Transfer',
  //             type: 'event',
  //           },
  //           {
  //             inputs: [],
  //             name: 'DOMAIN_TYPEHASH',
  //             outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
  //             stateMutability: 'view',
  //             type: 'function',
  //           },
  //           {
  //             inputs: [
  //               { internalType: 'address', name: 'owner', type: 'address' },
  //               { internalType: 'address', name: 'spender', type: 'address' },
  //             ],
  //             name: 'allowance',
  //             outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
  //             stateMutability: 'view',
  //             type: 'function',
  //           },
  //           {
  //             inputs: [
  //               { internalType: 'address', name: 'spender', type: 'address' },
  //               { internalType: 'uint256', name: 'amount', type: 'uint256' },
  //             ],
  //             name: 'approve',
  //             outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
  //             stateMutability: 'nonpayable',
  //             type: 'function',
  //           },
  //           {
  //             inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
  //             name: 'balanceOf',
  //             outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
  //             stateMutability: 'view',
  //             type: 'function',
  //           },
  //           {
  //             inputs: [],
  //             name: 'decimals',
  //             outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
  //             stateMutability: 'view',
  //             type: 'function',
  //           },
  //           {
  //             inputs: [
  //               { internalType: 'address', name: 'spender', type: 'address' },
  //               { internalType: 'uint256', name: 'subtractedValue', type: 'uint256' },
  //             ],
  //             name: 'decreaseAllowance',
  //             outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
  //             stateMutability: 'nonpayable',
  //             type: 'function',
  //           },
  //           {
  //             inputs: [],
  //             name: 'getOwner',
  //             outputs: [{ internalType: 'address', name: '', type: 'address' }],
  //             stateMutability: 'view',
  //             type: 'function',
  //           },
  //           {
  //             inputs: [
  //               { internalType: 'address', name: 'spender', type: 'address' },
  //               { internalType: 'uint256', name: 'addedValue', type: 'uint256' },
  //             ],
  //             name: 'increaseAllowance',
  //             outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
  //             stateMutability: 'nonpayable',
  //             type: 'function',
  //           },
  //           {
  //             inputs: [
  //               { internalType: 'address', name: '_to', type: 'address' },
  //               { internalType: 'uint256', name: '_amount', type: 'uint256' },
  //             ],
  //             name: 'mint',
  //             outputs: [],
  //             stateMutability: 'nonpayable',
  //             type: 'function',
  //           },
  //           {
  //             inputs: [{ internalType: 'uint256', name: 'amount', type: 'uint256' }],
  //             name: 'mint',
  //             outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
  //             stateMutability: 'nonpayable',
  //             type: 'function',
  //           },
  //           {
  //             inputs: [],
  //             name: 'name',
  //             outputs: [{ internalType: 'string', name: '', type: 'string' }],
  //             stateMutability: 'view',
  //             type: 'function',
  //           },
  //           {
  //             inputs: [],
  //             name: 'owner',
  //             outputs: [{ internalType: 'address', name: '', type: 'address' }],
  //             stateMutability: 'view',
  //             type: 'function',
  //           },
  //           { inputs: [], name: 'renounceOwnership', outputs: [], stateMutability: 'nonpayable', type: 'function' },
  //           {
  //             inputs: [],
  //             name: 'symbol',
  //             outputs: [{ internalType: 'string', name: '', type: 'string' }],
  //             stateMutability: 'view',
  //             type: 'function',
  //           },
  //           {
  //             inputs: [],
  //             name: 'totalSupply',
  //             outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
  //             stateMutability: 'view',
  //             type: 'function',
  //           },
  //           {
  //             inputs: [
  //               { internalType: 'address', name: 'recipient', type: 'address' },
  //               { internalType: 'uint256', name: 'amount', type: 'uint256' },
  //             ],
  //             name: 'transfer',
  //             outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
  //             stateMutability: 'nonpayable',
  //             type: 'function',
  //           },
  //           {
  //             inputs: [
  //               { internalType: 'address', name: 'sender', type: 'address' },
  //               { internalType: 'address', name: 'recipient', type: 'address' },
  //               { internalType: 'uint256', name: 'amount', type: 'uint256' },
  //             ],
  //             name: 'transferFrom',
  //             outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
  //             stateMutability: 'nonpayable',
  //             type: 'function',
  //           },
  //           {
  //             inputs: [{ internalType: 'address', name: 'newOwner', type: 'address' }],
  //             name: 'transferOwnership',
  //             outputs: [],
  //             stateMutability: 'nonpayable',
  //             type: 'function',
  //           },
  //         ]
  //         const contract = new web3.eth.Contract(abi as unknown as AbiItem, getAddress(stakingToken.address))
  //         const response = await contract.methods.balanceOf(address).call()
  //         const bal = new BigNumber(response)
  //         setBalance(bal)
  //       } else if (stakingToken.address[56] === '0x0e4b5ea0259eb3d66e6fcb7cc8785817f8490a53') {
  //         // If SOKU
  //         const abi = [
  //           { inputs: [], stateMutability: 'nonpayable', type: 'constructor' },
  //           {
  //             anonymous: false,
  //             inputs: [
  //               { indexed: true, internalType: 'address', name: 'owner', type: 'address' },
  //               { indexed: true, internalType: 'address', name: 'spender', type: 'address' },
  //               { indexed: false, internalType: 'uint256', name: 'value', type: 'uint256' },
  //             ],
  //             name: 'Approval',
  //             type: 'event',
  //           },
  //           {
  //             anonymous: false,
  //             inputs: [
  //               { indexed: true, internalType: 'address', name: 'delegator', type: 'address' },
  //               { indexed: true, internalType: 'address', name: 'fromDelegate', type: 'address' },
  //               { indexed: true, internalType: 'address', name: 'toDelegate', type: 'address' },
  //             ],
  //             name: 'DelegateChanged',
  //             type: 'event',
  //           },
  //           {
  //             anonymous: false,
  //             inputs: [
  //               { indexed: true, internalType: 'address', name: 'delegate', type: 'address' },
  //               { indexed: false, internalType: 'uint256', name: 'previousBalance', type: 'uint256' },
  //               { indexed: false, internalType: 'uint256', name: 'newBalance', type: 'uint256' },
  //             ],
  //             name: 'DelegateVotesChanged',
  //             type: 'event',
  //           },
  //           {
  //             anonymous: false,
  //             inputs: [
  //               { indexed: true, internalType: 'address', name: 'from', type: 'address' },
  //               { indexed: true, internalType: 'address', name: 'to', type: 'address' },
  //               { indexed: false, internalType: 'uint256', name: 'value', type: 'uint256' },
  //             ],
  //             name: 'Transfer',
  //             type: 'event',
  //           },
  //           {
  //             inputs: [],
  //             name: 'DELEGATION_TYPEHASH',
  //             outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
  //             stateMutability: 'view',
  //             type: 'function',
  //           },
  //           {
  //             inputs: [],
  //             name: 'DOMAIN_TYPEHASH',
  //             outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
  //             stateMutability: 'view',
  //             type: 'function',
  //           },
  //           {
  //             inputs: [
  //               { internalType: 'address', name: 'owner', type: 'address' },
  //               { internalType: 'address', name: 'spender', type: 'address' },
  //             ],
  //             name: 'allowance',
  //             outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
  //             stateMutability: 'view',
  //             type: 'function',
  //           },
  //           {
  //             inputs: [
  //               { internalType: 'address', name: 'spender', type: 'address' },
  //               { internalType: 'uint256', name: 'amount', type: 'uint256' },
  //             ],
  //             name: 'approve',
  //             outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
  //             stateMutability: 'nonpayable',
  //             type: 'function',
  //           },
  //           {
  //             inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
  //             name: 'balanceOf',
  //             outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
  //             stateMutability: 'view',
  //             type: 'function',
  //           },
  //           {
  //             inputs: [
  //               { internalType: 'address', name: '', type: 'address' },
  //               { internalType: 'uint32', name: '', type: 'uint32' },
  //             ],
  //             name: 'checkpoints',
  //             outputs: [
  //               { internalType: 'uint32', name: 'fromBlock', type: 'uint32' },
  //               { internalType: 'uint256', name: 'votes', type: 'uint256' },
  //             ],
  //             stateMutability: 'view',
  //             type: 'function',
  //           },
  //           {
  //             inputs: [],
  //             name: 'decimals',
  //             outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
  //             stateMutability: 'view',
  //             type: 'function',
  //           },
  //           {
  //             inputs: [
  //               { internalType: 'address', name: 'spender', type: 'address' },
  //               { internalType: 'uint256', name: 'subtractedValue', type: 'uint256' },
  //             ],
  //             name: 'decreaseAllowance',
  //             outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
  //             stateMutability: 'nonpayable',
  //             type: 'function',
  //           },
  //           {
  //             inputs: [{ internalType: 'address', name: 'delegatee', type: 'address' }],
  //             name: 'delegate',
  //             outputs: [],
  //             stateMutability: 'nonpayable',
  //             type: 'function',
  //           },
  //           {
  //             inputs: [
  //               { internalType: 'address', name: 'delegatee', type: 'address' },
  //               { internalType: 'uint256', name: 'nonce', type: 'uint256' },
  //               { internalType: 'uint256', name: 'expiry', type: 'uint256' },
  //               { internalType: 'uint8', name: 'v', type: 'uint8' },
  //               { internalType: 'bytes32', name: 'r', type: 'bytes32' },
  //               { internalType: 'bytes32', name: 's', type: 'bytes32' },
  //             ],
  //             name: 'delegateBySig',
  //             outputs: [],
  //             stateMutability: 'nonpayable',
  //             type: 'function',
  //           },
  //           {
  //             inputs: [{ internalType: 'address', name: 'delegator', type: 'address' }],
  //             name: 'delegates',
  //             outputs: [{ internalType: 'address', name: '', type: 'address' }],
  //             stateMutability: 'view',
  //             type: 'function',
  //           },
  //           {
  //             inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
  //             name: 'getCurrentVotes',
  //             outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
  //             stateMutability: 'view',
  //             type: 'function',
  //           },
  //           {
  //             inputs: [
  //               { internalType: 'address', name: 'account', type: 'address' },
  //               { internalType: 'uint256', name: 'blockNumber', type: 'uint256' },
  //             ],
  //             name: 'getPriorVotes',
  //             outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
  //             stateMutability: 'view',
  //             type: 'function',
  //           },
  //           {
  //             inputs: [
  //               { internalType: 'address', name: 'spender', type: 'address' },
  //               { internalType: 'uint256', name: 'addedValue', type: 'uint256' },
  //             ],
  //             name: 'increaseAllowance',
  //             outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
  //             stateMutability: 'nonpayable',
  //             type: 'function',
  //           },
  //           {
  //             inputs: [],
  //             name: 'name',
  //             outputs: [{ internalType: 'string', name: '', type: 'string' }],
  //             stateMutability: 'view',
  //             type: 'function',
  //           },
  //           {
  //             inputs: [{ internalType: 'address', name: '', type: 'address' }],
  //             name: 'nonces',
  //             outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
  //             stateMutability: 'view',
  //             type: 'function',
  //           },
  //           {
  //             inputs: [{ internalType: 'address', name: '', type: 'address' }],
  //             name: 'numCheckpoints',
  //             outputs: [{ internalType: 'uint32', name: '', type: 'uint32' }],
  //             stateMutability: 'view',
  //             type: 'function',
  //           },
  //           {
  //             inputs: [],
  //             name: 'symbol',
  //             outputs: [{ internalType: 'string', name: '', type: 'string' }],
  //             stateMutability: 'view',
  //             type: 'function',
  //           },
  //           {
  //             inputs: [],
  //             name: 'totalSupply',
  //             outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
  //             stateMutability: 'view',
  //             type: 'function',
  //           },
  //           {
  //             inputs: [
  //               { internalType: 'address', name: 'recipient', type: 'address' },
  //               { internalType: 'uint256', name: 'amount', type: 'uint256' },
  //             ],
  //             name: 'transfer',
  //             outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
  //             stateMutability: 'nonpayable',
  //             type: 'function',
  //           },
  //           {
  //             inputs: [
  //               { internalType: 'address', name: 'sender', type: 'address' },
  //               { internalType: 'address', name: 'recipient', type: 'address' },
  //               { internalType: 'uint256', name: 'amount', type: 'uint256' },
  //             ],
  //             name: 'transferFrom',
  //             outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
  //             stateMutability: 'nonpayable',
  //             type: 'function',
  //           },
  //         ]
  //         const contract = new web3.eth.Contract(abi as unknown as AbiItem, getAddress(stakingToken.address))
  //         const response = await contract.methods.balanceOf(address).call()
  //         const bal = new BigNumber(response)

  //         setBalance(bal)
  //       } else {
  //         const abi = [
  //           {
  //             anonymous: false,
  //             inputs: [
  //               { indexed: true, internalType: 'address', name: 'owner', type: 'address' },
  //               { indexed: true, internalType: 'address', name: 'spender', type: 'address' },
  //               { indexed: false, internalType: 'uint256', name: 'value', type: 'uint256' },
  //             ],
  //             name: 'Approval',
  //             type: 'event',
  //           },
  //           {
  //             anonymous: false,
  //             inputs: [
  //               { indexed: true, internalType: 'address', name: 'previousOwner', type: 'address' },
  //               { indexed: true, internalType: 'address', name: 'newOwner', type: 'address' },
  //             ],
  //             name: 'OwnershipTransferred',
  //             type: 'event',
  //           },
  //           {
  //             anonymous: false,
  //             inputs: [
  //               { indexed: true, internalType: 'address', name: 'from', type: 'address' },
  //               { indexed: true, internalType: 'address', name: 'to', type: 'address' },
  //               { indexed: false, internalType: 'uint256', name: 'value', type: 'uint256' },
  //             ],
  //             name: 'Transfer',
  //             type: 'event',
  //           },
  //           {
  //             inputs: [],
  //             name: 'DOMAIN_TYPEHASH',
  //             outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
  //             stateMutability: 'view',
  //             type: 'function',
  //           },
  //           {
  //             inputs: [
  //               { internalType: 'address', name: 'owner', type: 'address' },
  //               { internalType: 'address', name: 'spender', type: 'address' },
  //             ],
  //             name: 'allowance',
  //             outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
  //             stateMutability: 'view',
  //             type: 'function',
  //           },
  //           {
  //             inputs: [
  //               { internalType: 'address', name: 'spender', type: 'address' },
  //               { internalType: 'uint256', name: 'amount', type: 'uint256' },
  //             ],
  //             name: 'approve',
  //             outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
  //             stateMutability: 'nonpayable',
  //             type: 'function',
  //           },
  //           {
  //             inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
  //             name: 'balanceOf',
  //             outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
  //             stateMutability: 'view',
  //             type: 'function',
  //           },
  //           {
  //             inputs: [],
  //             name: 'decimals',
  //             outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
  //             stateMutability: 'view',
  //             type: 'function',
  //           },
  //           {
  //             inputs: [
  //               { internalType: 'address', name: 'spender', type: 'address' },
  //               { internalType: 'uint256', name: 'subtractedValue', type: 'uint256' },
  //             ],
  //             name: 'decreaseAllowance',
  //             outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
  //             stateMutability: 'nonpayable',
  //             type: 'function',
  //           },
  //           {
  //             inputs: [],
  //             name: 'getOwner',
  //             outputs: [{ internalType: 'address', name: '', type: 'address' }],
  //             stateMutability: 'view',
  //             type: 'function',
  //           },
  //           {
  //             inputs: [
  //               { internalType: 'address', name: 'spender', type: 'address' },
  //               { internalType: 'uint256', name: 'addedValue', type: 'uint256' },
  //             ],
  //             name: 'increaseAllowance',
  //             outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
  //             stateMutability: 'nonpayable',
  //             type: 'function',
  //           },
  //           {
  //             inputs: [
  //               { internalType: 'address', name: '_to', type: 'address' },
  //               { internalType: 'uint256', name: '_amount', type: 'uint256' },
  //             ],
  //             name: 'mint',
  //             outputs: [],
  //             stateMutability: 'nonpayable',
  //             type: 'function',
  //           },
  //           {
  //             inputs: [{ internalType: 'uint256', name: 'amount', type: 'uint256' }],
  //             name: 'mint',
  //             outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
  //             stateMutability: 'nonpayable',
  //             type: 'function',
  //           },
  //           {
  //             inputs: [],
  //             name: 'name',
  //             outputs: [{ internalType: 'string', name: '', type: 'string' }],
  //             stateMutability: 'view',
  //             type: 'function',
  //           },
  //           {
  //             inputs: [],
  //             name: 'owner',
  //             outputs: [{ internalType: 'address', name: '', type: 'address' }],
  //             stateMutability: 'view',
  //             type: 'function',
  //           },
  //           {
  //             inputs: [],
  //             name: 'renounceOwnership',
  //             outputs: [],
  //             stateMutability: 'nonpayable',
  //             type: 'function',
  //           },
  //           {
  //             inputs: [],
  //             name: 'symbol',
  //             outputs: [{ internalType: 'string', name: '', type: 'string' }],
  //             stateMutability: 'view',
  //             type: 'function',
  //           },
  //           {
  //             inputs: [],
  //             name: 'totalSupply',
  //             outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
  //             stateMutability: 'view',
  //             type: 'function',
  //           },
  //           {
  //             inputs: [
  //               { internalType: 'address', name: 'recipient', type: 'address' },
  //               { internalType: 'uint256', name: 'amount', type: 'uint256' },
  //             ],
  //             name: 'transfer',
  //             outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
  //             stateMutability: 'nonpayable',
  //             type: 'function',
  //           },
  //           {
  //             inputs: [
  //               { internalType: 'address', name: 'sender', type: 'address' },
  //               { internalType: 'address', name: 'recipient', type: 'address' },
  //               { internalType: 'uint256', name: 'amount', type: 'uint256' },
  //             ],
  //             name: 'transferFrom',
  //             outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
  //             stateMutability: 'nonpayable',
  //             type: 'function',
  //           },
  //           {
  //             inputs: [{ internalType: 'address', name: 'newOwner', type: 'address' }],
  //             name: 'transferOwnership',
  //             outputs: [],
  //             stateMutability: 'nonpayable',
  //             type: 'function',
  //           },
  //         ]
  //         const contract = new web3.eth.Contract(abi as unknown as AbiItem, getAddress(stakingToken.address))
  //         const response = await contract.methods.balanceOf(address).call()
  //         const bal = new BigNumber(response)
  //         setBalance(bal)
  //       }
  //     }

  //     getBalance(account)
  //   } catch (error) {
  //     console.log(error, 'getBalance')
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // })

  return (
    <Flex flexDirection="column">
      <Flex flexDirection="column">
        <Box display="inline">
          <InlineText
            color={accountHasSharesStaked ? 'secondary' : 'textSubtle'}
            textTransform="uppercase"
            bold
            fontSize="12px"
          >
            {accountHasSharesStaked ? stakingToken.symbol : t('Stake')}{' '}
          </InlineText>
          <InlineText
            color={accountHasSharesStaked ? 'textSubtle' : 'secondary'}
            textTransform="uppercase"
            bold
            fontSize="12px"
          >
            {accountHasSharesStaked ? t('Staked (compounding)') : `${stakingToken.symbol}`}
          </InlineText>
        </Box>
        {isVaultApproved ? (
          <VaultStakeActions
            isLoading={isLoading}
            pool={pool}
            stakingTokenBalance={balance}
            accountHasSharesStaked={accountHasSharesStaked}
          />
        ) : (
          // <VaultApprovalAction pool={pool} isLoading={isLoading} setLastUpdated={setLastUpdated} />
          <></>
        )}
      </Flex>
    </Flex>
  )
}

export default CakeVaultCardActions
