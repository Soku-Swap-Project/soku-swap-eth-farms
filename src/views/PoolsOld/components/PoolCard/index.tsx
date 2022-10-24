import BigNumber from 'bignumber.js'
import React, { useState, useEffect } from 'react'
import { CardBody, Flex, Text, CardRibbon } from '@pancakeswap/uikit'
import UnlockButton from 'components/UnlockButton'
import { useTranslation } from 'contexts/Localization'
import { BIG_ZERO } from 'utils/bigNumber'
import { AbiItem } from 'web3-utils'
import { getWeb3NoAccount } from 'utils/web3'
import { getAddress } from 'utils/addressHelpers'
import { Pool } from 'state/types'
import AprRow from './AprRow'
import { StyledCard, StyledCardInner } from './StyledCard'
import CardFooter from './CardFooter'
import StyledCardHeader from './StyledCardHeader'
import CardActions from './CardActions'

const PoolCard: React.FC<{ pool: Pool; account: string }> = ({ pool, account }) => {
  const { sousId, stakingToken, earningToken, isFinished, userData } = pool
  const [lockTime, setLockTime] = useState()
  const [reward, setReward] = useState(new BigNumber(0))
  const [rewardPerBlock, setRewardPerBlock] = useState('')
  const [stakingTokenBalance, setStakingTokenBalance] = useState(new BigNumber(0))
  const [isApproved, setIsVaultApproved] = useState(false)
  const [stakedAmount, setStakedAmount] = useState(Number)
  const web3 = getWeb3NoAccount()

  const { t } = useTranslation()
  // const stakedBalance = userData?.stakedBalance ? new BigNumber(userData.stakedBalance) : BIG_ZERO
  const accountHasStakedBalance = stakedAmount > 0

  useEffect(() => {
    const checkApprovalStatus = async () => {
      try {
        if (stakingToken.address[56] === '0x0e4B5Ea0259eB3D66E6FCB7Cc8785817F8490a53') {
          const abi = [
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
                { indexed: true, internalType: 'address', name: 'delegator', type: 'address' },
                { indexed: true, internalType: 'address', name: 'fromDelegate', type: 'address' },
                { indexed: true, internalType: 'address', name: 'toDelegate', type: 'address' },
              ],
              name: 'DelegateChanged',
              type: 'event',
            },
            {
              anonymous: false,
              inputs: [
                { indexed: true, internalType: 'address', name: 'delegate', type: 'address' },
                { indexed: false, internalType: 'uint256', name: 'previousBalance', type: 'uint256' },
                { indexed: false, internalType: 'uint256', name: 'newBalance', type: 'uint256' },
              ],
              name: 'DelegateVotesChanged',
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
              name: 'DELEGATION_TYPEHASH',
              outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
              stateMutability: 'view',
              type: 'function',
            },
            {
              inputs: [],
              name: 'DOMAIN_TYPEHASH',
              outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
              stateMutability: 'view',
              type: 'function',
            },
            {
              inputs: [
                { internalType: 'address', name: 'owner', type: 'address' },
                { internalType: 'address', name: 'spender', type: 'address' },
              ],
              name: 'allowance',
              outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
              stateMutability: 'view',
              type: 'function',
            },
            {
              inputs: [
                { internalType: 'address', name: 'spender', type: 'address' },
                { internalType: 'uint256', name: 'amount', type: 'uint256' },
              ],
              name: 'approve',
              outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
              stateMutability: 'nonpayable',
              type: 'function',
            },
            {
              inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
              name: 'balanceOf',
              outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
              stateMutability: 'view',
              type: 'function',
            },
            {
              inputs: [
                { internalType: 'address', name: '', type: 'address' },
                { internalType: 'uint32', name: '', type: 'uint32' },
              ],
              name: 'checkpoints',
              outputs: [
                { internalType: 'uint32', name: 'fromBlock', type: 'uint32' },
                { internalType: 'uint256', name: 'votes', type: 'uint256' },
              ],
              stateMutability: 'view',
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
              inputs: [
                { internalType: 'address', name: 'spender', type: 'address' },
                { internalType: 'uint256', name: 'subtractedValue', type: 'uint256' },
              ],
              name: 'decreaseAllowance',
              outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
              stateMutability: 'nonpayable',
              type: 'function',
            },
            {
              inputs: [{ internalType: 'address', name: 'delegatee', type: 'address' }],
              name: 'delegate',
              outputs: [],
              stateMutability: 'nonpayable',
              type: 'function',
            },
            {
              inputs: [
                { internalType: 'address', name: 'delegatee', type: 'address' },
                { internalType: 'uint256', name: 'nonce', type: 'uint256' },
                { internalType: 'uint256', name: 'expiry', type: 'uint256' },
                { internalType: 'uint8', name: 'v', type: 'uint8' },
                { internalType: 'bytes32', name: 'r', type: 'bytes32' },
                { internalType: 'bytes32', name: 's', type: 'bytes32' },
              ],
              name: 'delegateBySig',
              outputs: [],
              stateMutability: 'nonpayable',
              type: 'function',
            },
            {
              inputs: [{ internalType: 'address', name: 'delegator', type: 'address' }],
              name: 'delegates',
              outputs: [{ internalType: 'address', name: '', type: 'address' }],
              stateMutability: 'view',
              type: 'function',
            },
            {
              inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
              name: 'getCurrentVotes',
              outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
              stateMutability: 'view',
              type: 'function',
            },
            {
              inputs: [
                { internalType: 'address', name: 'account', type: 'address' },
                { internalType: 'uint256', name: 'blockNumber', type: 'uint256' },
              ],
              name: 'getPriorVotes',
              outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
              stateMutability: 'view',
              type: 'function',
            },
            {
              inputs: [
                { internalType: 'address', name: 'spender', type: 'address' },
                { internalType: 'uint256', name: 'addedValue', type: 'uint256' },
              ],
              name: 'increaseAllowance',
              outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
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
              inputs: [{ internalType: 'address', name: '', type: 'address' }],
              name: 'numCheckpoints',
              outputs: [{ internalType: 'uint32', name: '', type: 'uint32' }],
              stateMutability: 'view',
              type: 'function',
            },
            {
              inputs: [],
              name: 'symbol',
              outputs: [{ internalType: 'string', name: '', type: 'string' }],
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
                { internalType: 'address', name: 'recipient', type: 'address' },
                { internalType: 'uint256', name: 'amount', type: 'uint256' },
              ],
              name: 'transfer',
              outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
              stateMutability: 'nonpayable',
              type: 'function',
            },
            {
              inputs: [
                { internalType: 'address', name: 'sender', type: 'address' },
                { internalType: 'address', name: 'recipient', type: 'address' },
                { internalType: 'uint256', name: 'amount', type: 'uint256' },
              ],
              name: 'transferFrom',
              outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
              stateMutability: 'nonpayable',
              type: 'function',
            },
          ]
          const contract = new web3.eth.Contract(abi as unknown as AbiItem, getAddress(stakingToken.address))
          const response = await contract.methods.allowance(account, getAddress(pool.contractAddress)).call()
          const currentAllowance = new BigNumber(response)

          setIsVaultApproved(currentAllowance.gt(0))
        } else {
          const abi = [
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
                { indexed: true, internalType: 'address', name: 'previousOwner', type: 'address' },
                { indexed: true, internalType: 'address', name: 'newOwner', type: 'address' },
              ],
              name: 'OwnershipTransferred',
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
              name: 'DOMAIN_TYPEHASH',
              outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
              stateMutability: 'view',
              type: 'function',
            },
            {
              inputs: [
                { internalType: 'address', name: 'owner', type: 'address' },
                { internalType: 'address', name: 'spender', type: 'address' },
              ],
              name: 'allowance',
              outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
              stateMutability: 'view',
              type: 'function',
            },
            {
              inputs: [
                { internalType: 'address', name: 'spender', type: 'address' },
                { internalType: 'uint256', name: 'amount', type: 'uint256' },
              ],
              name: 'approve',
              outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
              stateMutability: 'nonpayable',
              type: 'function',
            },
            {
              inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
              name: 'balanceOf',
              outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
              stateMutability: 'view',
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
              inputs: [
                { internalType: 'address', name: 'spender', type: 'address' },
                { internalType: 'uint256', name: 'subtractedValue', type: 'uint256' },
              ],
              name: 'decreaseAllowance',
              outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
              stateMutability: 'nonpayable',
              type: 'function',
            },
            {
              inputs: [],
              name: 'getOwner',
              outputs: [{ internalType: 'address', name: '', type: 'address' }],
              stateMutability: 'view',
              type: 'function',
            },
            {
              inputs: [
                { internalType: 'address', name: 'spender', type: 'address' },
                { internalType: 'uint256', name: 'addedValue', type: 'uint256' },
              ],
              name: 'increaseAllowance',
              outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
              stateMutability: 'nonpayable',
              type: 'function',
            },
            {
              inputs: [
                { internalType: 'address', name: '_to', type: 'address' },
                { internalType: 'uint256', name: '_amount', type: 'uint256' },
              ],
              name: 'mint',
              outputs: [],
              stateMutability: 'nonpayable',
              type: 'function',
            },
            {
              inputs: [{ internalType: 'uint256', name: 'amount', type: 'uint256' }],
              name: 'mint',
              outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
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
              inputs: [],
              name: 'owner',
              outputs: [{ internalType: 'address', name: '', type: 'address' }],
              stateMutability: 'view',
              type: 'function',
            },
            { inputs: [], name: 'renounceOwnership', outputs: [], stateMutability: 'nonpayable', type: 'function' },
            {
              inputs: [],
              name: 'symbol',
              outputs: [{ internalType: 'string', name: '', type: 'string' }],
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
                { internalType: 'address', name: 'recipient', type: 'address' },
                { internalType: 'uint256', name: 'amount', type: 'uint256' },
              ],
              name: 'transfer',
              outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
              stateMutability: 'nonpayable',
              type: 'function',
            },
            {
              inputs: [
                { internalType: 'address', name: 'sender', type: 'address' },
                { internalType: 'address', name: 'recipient', type: 'address' },
                { internalType: 'uint256', name: 'amount', type: 'uint256' },
              ],
              name: 'transferFrom',
              outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
              stateMutability: 'nonpayable',
              type: 'function',
            },
            {
              inputs: [{ internalType: 'address', name: 'newOwner', type: 'address' }],
              name: 'transferOwnership',
              outputs: [],
              stateMutability: 'nonpayable',
              type: 'function',
            },
          ]
          const contract = new web3.eth.Contract(abi as unknown as AbiItem, getAddress(stakingToken.address))
          const response = await contract.methods.allowance(account, getAddress(pool.contractAddress)).call()
          const currentAllowance = new BigNumber(response)
          setIsVaultApproved(currentAllowance.gt(0))
        }
      } catch (error) {
        setIsVaultApproved(false)
        // console.log(error, 'approval')
      }
    }

    checkApprovalStatus()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account])

  useEffect(() => {
    if (account) {
      try {
        const getBalance = async (address) => {
          // If SUTEKU
          if (stakingToken.address[56] === '0x198800af50914004a9e9d19ca18c0b24587a50cf') {
            const abi = [
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
                  { indexed: true, internalType: 'address', name: 'previousOwner', type: 'address' },
                  { indexed: true, internalType: 'address', name: 'newOwner', type: 'address' },
                ],
                name: 'OwnershipTransferred',
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
                name: 'DOMAIN_TYPEHASH',
                outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
                stateMutability: 'view',
                type: 'function',
              },
              {
                inputs: [
                  { internalType: 'address', name: 'owner', type: 'address' },
                  { internalType: 'address', name: 'spender', type: 'address' },
                ],
                name: 'allowance',
                outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
                stateMutability: 'view',
                type: 'function',
              },
              {
                inputs: [
                  { internalType: 'address', name: 'spender', type: 'address' },
                  { internalType: 'uint256', name: 'amount', type: 'uint256' },
                ],
                name: 'approve',
                outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
                stateMutability: 'nonpayable',
                type: 'function',
              },
              {
                inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
                name: 'balanceOf',
                outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
                stateMutability: 'view',
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
                inputs: [
                  { internalType: 'address', name: 'spender', type: 'address' },
                  { internalType: 'uint256', name: 'subtractedValue', type: 'uint256' },
                ],
                name: 'decreaseAllowance',
                outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
                stateMutability: 'nonpayable',
                type: 'function',
              },
              {
                inputs: [],
                name: 'getOwner',
                outputs: [{ internalType: 'address', name: '', type: 'address' }],
                stateMutability: 'view',
                type: 'function',
              },
              {
                inputs: [
                  { internalType: 'address', name: 'spender', type: 'address' },
                  { internalType: 'uint256', name: 'addedValue', type: 'uint256' },
                ],
                name: 'increaseAllowance',
                outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
                stateMutability: 'nonpayable',
                type: 'function',
              },
              {
                inputs: [
                  { internalType: 'address', name: '_to', type: 'address' },
                  { internalType: 'uint256', name: '_amount', type: 'uint256' },
                ],
                name: 'mint',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
              },
              {
                inputs: [{ internalType: 'uint256', name: 'amount', type: 'uint256' }],
                name: 'mint',
                outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
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
                inputs: [],
                name: 'owner',
                outputs: [{ internalType: 'address', name: '', type: 'address' }],
                stateMutability: 'view',
                type: 'function',
              },
              { inputs: [], name: 'renounceOwnership', outputs: [], stateMutability: 'nonpayable', type: 'function' },
              {
                inputs: [],
                name: 'symbol',
                outputs: [{ internalType: 'string', name: '', type: 'string' }],
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
                  { internalType: 'address', name: 'recipient', type: 'address' },
                  { internalType: 'uint256', name: 'amount', type: 'uint256' },
                ],
                name: 'transfer',
                outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
                stateMutability: 'nonpayable',
                type: 'function',
              },
              {
                inputs: [
                  { internalType: 'address', name: 'sender', type: 'address' },
                  { internalType: 'address', name: 'recipient', type: 'address' },
                  { internalType: 'uint256', name: 'amount', type: 'uint256' },
                ],
                name: 'transferFrom',
                outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
                stateMutability: 'nonpayable',
                type: 'function',
              },
              {
                inputs: [{ internalType: 'address', name: 'newOwner', type: 'address' }],
                name: 'transferOwnership',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
              },
            ]
            const contract = new web3.eth.Contract(abi as unknown as AbiItem, getAddress(stakingToken.address))
            const response = await contract.methods.balanceOf(address).call()
            const bal = new BigNumber(response)
            setStakingTokenBalance(bal)
          } else if (stakingToken.address[56] === '0x0e4b5ea0259eb3d66e6fcb7cc8785817f8490a53') {
            // If SOKU
            const abi = [
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
                  { indexed: true, internalType: 'address', name: 'delegator', type: 'address' },
                  { indexed: true, internalType: 'address', name: 'fromDelegate', type: 'address' },
                  { indexed: true, internalType: 'address', name: 'toDelegate', type: 'address' },
                ],
                name: 'DelegateChanged',
                type: 'event',
              },
              {
                anonymous: false,
                inputs: [
                  { indexed: true, internalType: 'address', name: 'delegate', type: 'address' },
                  { indexed: false, internalType: 'uint256', name: 'previousBalance', type: 'uint256' },
                  { indexed: false, internalType: 'uint256', name: 'newBalance', type: 'uint256' },
                ],
                name: 'DelegateVotesChanged',
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
                name: 'DELEGATION_TYPEHASH',
                outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
                stateMutability: 'view',
                type: 'function',
              },
              {
                inputs: [],
                name: 'DOMAIN_TYPEHASH',
                outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
                stateMutability: 'view',
                type: 'function',
              },
              {
                inputs: [
                  { internalType: 'address', name: 'owner', type: 'address' },
                  { internalType: 'address', name: 'spender', type: 'address' },
                ],
                name: 'allowance',
                outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
                stateMutability: 'view',
                type: 'function',
              },
              {
                inputs: [
                  { internalType: 'address', name: 'spender', type: 'address' },
                  { internalType: 'uint256', name: 'amount', type: 'uint256' },
                ],
                name: 'approve',
                outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
                stateMutability: 'nonpayable',
                type: 'function',
              },
              {
                inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
                name: 'balanceOf',
                outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
                stateMutability: 'view',
                type: 'function',
              },
              {
                inputs: [
                  { internalType: 'address', name: '', type: 'address' },
                  { internalType: 'uint32', name: '', type: 'uint32' },
                ],
                name: 'checkpoints',
                outputs: [
                  { internalType: 'uint32', name: 'fromBlock', type: 'uint32' },
                  { internalType: 'uint256', name: 'votes', type: 'uint256' },
                ],
                stateMutability: 'view',
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
                inputs: [
                  { internalType: 'address', name: 'spender', type: 'address' },
                  { internalType: 'uint256', name: 'subtractedValue', type: 'uint256' },
                ],
                name: 'decreaseAllowance',
                outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
                stateMutability: 'nonpayable',
                type: 'function',
              },
              {
                inputs: [{ internalType: 'address', name: 'delegatee', type: 'address' }],
                name: 'delegate',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
              },
              {
                inputs: [
                  { internalType: 'address', name: 'delegatee', type: 'address' },
                  { internalType: 'uint256', name: 'nonce', type: 'uint256' },
                  { internalType: 'uint256', name: 'expiry', type: 'uint256' },
                  { internalType: 'uint8', name: 'v', type: 'uint8' },
                  { internalType: 'bytes32', name: 'r', type: 'bytes32' },
                  { internalType: 'bytes32', name: 's', type: 'bytes32' },
                ],
                name: 'delegateBySig',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
              },
              {
                inputs: [{ internalType: 'address', name: 'delegator', type: 'address' }],
                name: 'delegates',
                outputs: [{ internalType: 'address', name: '', type: 'address' }],
                stateMutability: 'view',
                type: 'function',
              },
              {
                inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
                name: 'getCurrentVotes',
                outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
                stateMutability: 'view',
                type: 'function',
              },
              {
                inputs: [
                  { internalType: 'address', name: 'account', type: 'address' },
                  { internalType: 'uint256', name: 'blockNumber', type: 'uint256' },
                ],
                name: 'getPriorVotes',
                outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
                stateMutability: 'view',
                type: 'function',
              },
              {
                inputs: [
                  { internalType: 'address', name: 'spender', type: 'address' },
                  { internalType: 'uint256', name: 'addedValue', type: 'uint256' },
                ],
                name: 'increaseAllowance',
                outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
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
                inputs: [{ internalType: 'address', name: '', type: 'address' }],
                name: 'numCheckpoints',
                outputs: [{ internalType: 'uint32', name: '', type: 'uint32' }],
                stateMutability: 'view',
                type: 'function',
              },
              {
                inputs: [],
                name: 'symbol',
                outputs: [{ internalType: 'string', name: '', type: 'string' }],
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
                  { internalType: 'address', name: 'recipient', type: 'address' },
                  { internalType: 'uint256', name: 'amount', type: 'uint256' },
                ],
                name: 'transfer',
                outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
                stateMutability: 'nonpayable',
                type: 'function',
              },
              {
                inputs: [
                  { internalType: 'address', name: 'sender', type: 'address' },
                  { internalType: 'address', name: 'recipient', type: 'address' },
                  { internalType: 'uint256', name: 'amount', type: 'uint256' },
                ],
                name: 'transferFrom',
                outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
                stateMutability: 'nonpayable',
                type: 'function',
              },
            ]
            const contract = new web3.eth.Contract(abi as unknown as AbiItem, getAddress(stakingToken.address))
            const response = await contract.methods.balanceOf(address).call()
            const bal = new BigNumber(response)

            setStakingTokenBalance(bal)
          } else {
            const abi = [
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
                  { indexed: true, internalType: 'address', name: 'previousOwner', type: 'address' },
                  { indexed: true, internalType: 'address', name: 'newOwner', type: 'address' },
                ],
                name: 'OwnershipTransferred',
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
                name: 'DOMAIN_TYPEHASH',
                outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
                stateMutability: 'view',
                type: 'function',
              },
              {
                inputs: [
                  { internalType: 'address', name: 'owner', type: 'address' },
                  { internalType: 'address', name: 'spender', type: 'address' },
                ],
                name: 'allowance',
                outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
                stateMutability: 'view',
                type: 'function',
              },
              {
                inputs: [
                  { internalType: 'address', name: 'spender', type: 'address' },
                  { internalType: 'uint256', name: 'amount', type: 'uint256' },
                ],
                name: 'approve',
                outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
                stateMutability: 'nonpayable',
                type: 'function',
              },
              {
                inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
                name: 'balanceOf',
                outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
                stateMutability: 'view',
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
                inputs: [
                  { internalType: 'address', name: 'spender', type: 'address' },
                  { internalType: 'uint256', name: 'subtractedValue', type: 'uint256' },
                ],
                name: 'decreaseAllowance',
                outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
                stateMutability: 'nonpayable',
                type: 'function',
              },
              {
                inputs: [],
                name: 'getOwner',
                outputs: [{ internalType: 'address', name: '', type: 'address' }],
                stateMutability: 'view',
                type: 'function',
              },
              {
                inputs: [
                  { internalType: 'address', name: 'spender', type: 'address' },
                  { internalType: 'uint256', name: 'addedValue', type: 'uint256' },
                ],
                name: 'increaseAllowance',
                outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
                stateMutability: 'nonpayable',
                type: 'function',
              },
              {
                inputs: [
                  { internalType: 'address', name: '_to', type: 'address' },
                  { internalType: 'uint256', name: '_amount', type: 'uint256' },
                ],
                name: 'mint',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
              },
              {
                inputs: [{ internalType: 'uint256', name: 'amount', type: 'uint256' }],
                name: 'mint',
                outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
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
                inputs: [],
                name: 'owner',
                outputs: [{ internalType: 'address', name: '', type: 'address' }],
                stateMutability: 'view',
                type: 'function',
              },
              {
                inputs: [],
                name: 'renounceOwnership',
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
              {
                inputs: [],
                name: 'totalSupply',
                outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
                stateMutability: 'view',
                type: 'function',
              },
              {
                inputs: [
                  { internalType: 'address', name: 'recipient', type: 'address' },
                  { internalType: 'uint256', name: 'amount', type: 'uint256' },
                ],
                name: 'transfer',
                outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
                stateMutability: 'nonpayable',
                type: 'function',
              },
              {
                inputs: [
                  { internalType: 'address', name: 'sender', type: 'address' },
                  { internalType: 'address', name: 'recipient', type: 'address' },
                  { internalType: 'uint256', name: 'amount', type: 'uint256' },
                ],
                name: 'transferFrom',
                outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
                stateMutability: 'nonpayable',
                type: 'function',
              },
              {
                inputs: [{ internalType: 'address', name: 'newOwner', type: 'address' }],
                name: 'transferOwnership',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
              },
            ]
            const contract = new web3.eth.Contract(abi as unknown as AbiItem, getAddress(stakingToken.address))
            const response = await contract.methods.balanceOf(address).call()
            const bal = new BigNumber(response)
            setStakingTokenBalance(bal)
          }
        }

        getBalance(account)
      } catch (error) {
        // console.log(error, 'getBalance')
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account])

  const getStakingBalance = async (address) => {
    try {
      if (pool.poolCategory === '30DayLock' || pool.poolCategory === '60DayLock' || pool.poolCategory === '90DayLock') {
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
        const contract = new web3.eth.Contract(abi as unknown as AbiItem, getAddress(pool.contractAddress))
        const stakeAmount = await contract.methods.userInfo(address).call()
        const userStaked = await stakeAmount[0]
        const parsedBal = parseFloat(userStaked)

        // console.log(parsedBal, 'staked')
        setStakedAmount(parsedBal)
      } else if (pool.poolCategory === 'Core') {
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
            inputs: [{ indexed: false, internalType: 'uint256', name: 'blockNumber', type: 'uint256' }],
            name: 'RewardsStop',
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
            inputs: [],
            name: 'bonusEndBlock',
            outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
            stateMutability: 'view',
            type: 'function',
          },
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
        const contract = new web3.eth.Contract(abi as unknown as AbiItem, getAddress(pool.contractAddress))
        const stakeAmount = await contract.methods.userInfo(address).call()
        const userStaked = await stakeAmount[0]
        const parsedBal = parseFloat(userStaked)
        // console.log(parsedBal, 'staked')

        setStakedAmount(parsedBal)
      }
    } catch (error) {
      // console.log(error, 'get staking bal')
    }
  }

  const getPendingReward = async (address) => {
    try {
      if (pool.poolCategory === '30DayLock' || pool.poolCategory === '60DayLock' || pool.poolCategory === '90DayLock') {
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
        const contract = new web3.eth.Contract(abi as unknown as AbiItem, getAddress(pool.contractAddress))
        const penReward = await contract.methods.pendingReward(address).call()
        setReward(penReward)
      } else if (pool.poolCategory === 'Core') {
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
            inputs: [{ indexed: false, internalType: 'uint256', name: 'blockNumber', type: 'uint256' }],
            name: 'RewardsStop',
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
            inputs: [],
            name: 'bonusEndBlock',
            outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
            stateMutability: 'view',
            type: 'function',
          },
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
        const contract = new web3.eth.Contract(abi as unknown as AbiItem, getAddress(pool.contractAddress))
        const penReward = await contract.methods.pendingReward(address).call()
        setReward(penReward)
      }
    } catch (error) {
      // console.log(error, 'getPendingReward')
    }
  }

  const getRewardPerBlock = async () => {
    if (pool) {
      try {
        if (
          pool.poolCategory === '30DayLock' ||
          pool.poolCategory === '60DayLock' ||
          pool.poolCategory === '90DayLock'
        ) {
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
          const contract = new web3.eth.Contract(abi as unknown as AbiItem, getAddress(pool.contractAddress))
          // console.log('reward contract', contract)

          const rpb = await contract.methods.rewardPerBlock().call()
          setRewardPerBlock(web3.utils.fromWei(rpb))
        } else if (pool.poolCategory === 'Core') {
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
          const contract = new web3.eth.Contract(abi as unknown as AbiItem, getAddress(pool.contractAddress))
          // console.log('reward contract', contract)

          const rpb = await contract.methods.rewardPerBlock().call()
          setRewardPerBlock(web3.utils.fromWei(rpb))
        }
      } catch (error) {
        // console.log('stake action', error)
      }
    }
  }

  const getLockTime = async (address) => {
    try {
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
      if (pool.poolCategory === '30DayLock' || pool.poolCategory === '60DayLock' || pool.poolCategory === '90DayLock') {
        const contract = new web3.eth.Contract(abi as unknown as AbiItem, getAddress(pool.contractAddress))
        const remainingTime = await contract.methods.getRemainingLockTime(address).call()
        setLockTime(remainingTime)
      }
    } catch (error) {
      // console.log('lock time error', error)
    }
  }

  useEffect(() => {
    if (pool) {
      getPendingReward(account)
      getLockTime(account)
      getStakingBalance(account)
      getRewardPerBlock()
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pool, account])

  return (
    <StyledCard
      isFinished={isFinished && sousId !== 0}
      ribbon={isFinished && <CardRibbon variantColor="textDisabled" text={t('Finished')} className="finished_ribbon" />}
    >
      <StyledCardInner>
        <StyledCardHeader
          isStaking={accountHasStakedBalance}
          earningTokenSymbol={earningToken.symbol}
          stakingTokenSymbol={stakingToken.symbol}
          isFinished={isFinished && sousId !== 0}
          pool={pool}
        />
        <CardBody>
          <AprRow pool={pool} rewardPerBlock={rewardPerBlock} />
          <Flex mt="24px" flexDirection="column">
            {account ? (
              <CardActions
                pool={pool}
                stakedAmount={stakedAmount}
                reward={reward}
                stakingTokenBalance={stakingTokenBalance}
                lockTime={lockTime}
                isApproved={isApproved}
              />
            ) : (
              <>
                <Text mb="10px" textTransform="uppercase" fontSize="12px" color="textSubtle" bold>
                  {t('Start earning')}
                </Text>
                <UnlockButton />
              </>
            )}
          </Flex>
        </CardBody>
        <CardFooter pool={pool} account={account} lockTime={lockTime} stakedAmount={stakedAmount} />
      </StyledCardInner>
    </StyledCard>
  )
}

export default PoolCard
