import React, { useState, useEffect } from 'react'
import { Flex, Button, useModal, Skeleton } from '@pancakeswap/uikit'
import { useWeb3React } from '@web3-react/core'
import { useBusdPriceFromToken, useTokenPrice, usePriceBnbSuteku } from 'state/hooks'
import BigNumber from 'bignumber.js'
import { useTranslation } from 'contexts/Localization'
import { Pool } from 'state/types'
import { getWeb3NoAccount } from 'utils/web3'
import { getAddress } from 'utils/addressHelpers'
import { AbiItem } from 'web3-utils'
import NotEnoughTokensModal from '../../PoolCard/Modals/NotEnoughTokensModal'
// import VaultStakeModal from '../VaultStakeModal'
// import HasSharesActions from './HasSharesActions'

interface VaultStakeActionsProps {
  pool: Pool
  stakingTokenBalance: BigNumber
  accountHasSharesStaked: boolean
  // eslint-disable-next-line react/require-default-props
  isLoading?: boolean
}

const VaultStakeActions: React.FC<VaultStakeActionsProps> = ({
  pool,
  stakingTokenBalance,
  accountHasSharesStaked,
  isLoading = false,
}) => {
  const { stakingToken } = pool
  const { t } = useTranslation()
  const sokuPrice = useTokenPrice('sokuswap')
  const sutekuPrice = usePriceBnbSuteku()
  const { account } = useWeb3React()
  const [balance, setBalance] = useState(new BigNumber(0))
  const [onPresentTokenRequired] = useModal(<NotEnoughTokensModal tokenSymbol={stakingToken.symbol} />)
  // const [onPresentStake] = useModal(<VaultStakeModal stakingMax={balance} pool={pool} />)
  const web3 = getWeb3NoAccount()

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

  // console.log(balance.toNumber(), 'bal')
  const formattedBal = balance.toString()
  // console.log(parseFloat(formattedBal), 'formatted')

  // const renderStakeAction = () => {
  //   return accountHasSharesStaked ? (
  //     <HasSharesActions pool={pool} stakingTokenBalance={stakingTokenBalance} />
  //   ) : (
  //     <Button style={{ backgroundColor: '#04bbfb' }} onClick={balance.gt(0) ? onPresentStake : onPresentTokenRequired}>
  //       {t('Stake')}
  //     </Button>
  //   )
  // }

  return <Flex flexDirection="column">{isLoading ? <Skeleton width="100%" height="52px" /> : <></>}</Flex>
}

export default VaultStakeActions
