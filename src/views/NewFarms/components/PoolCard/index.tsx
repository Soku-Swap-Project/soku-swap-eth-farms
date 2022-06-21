import BigNumber from 'bignumber.js'
import React, { useState, useEffect } from 'react'
import { CardBody, Flex, Text, CardRibbon } from '@pancakeswap/uikit'
import UnlockButton from 'components/UnlockButton'
import LPTokenABI from 'config/abi/lpToken.json'
import SmartChefABI from 'config/abi/SmartChefInitializable.json'
import erc20ABI from 'config/abi/erc20.json'
import useRefresh from 'hooks/useRefresh'
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
  const { fastRefresh } = useRefresh()

  console.log(reward, rewardPerBlock, stakedAmount, lockTime)

  const { t } = useTranslation()
  // const stakedBalance = userData?.stakedBalance ? new BigNumber(userData.stakedBalance) : BIG_ZERO
  const accountHasStakedBalance = stakedAmount > 0

  useEffect(() => {
    if (account) {
      const checkApprovalStatus = async () => {
        try {
          const abi = erc20ABI
          const contract = new web3.eth.Contract(abi as unknown as AbiItem, getAddress(stakingToken.address))
          const response = await contract.methods.allowance(account, getAddress(pool.contractAddress)).call()
          const currentAllowance = new BigNumber(response)
          setIsVaultApproved(currentAllowance.gt(0))
        } catch (error) {
          setIsVaultApproved(false)
          // console.log(error, 'approval')
        }
      }

      const getStakingBalance = async (address) => {
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

          setStakedAmount(parsedBal)
        } catch (error) {
          // console.log(error, 'get staking bal')
        }
      }

      const getPendingReward = async (address) => {
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
        } catch (error) {
          // console.log(error, 'getPendingReward')
        }
      }

      const getRewardPerBlock = async () => {
        if (pool) {
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
            const contract = new web3.eth.Contract(abi as unknown as AbiItem, getAddress(pool.contractAddress))
            // console.log('reward contract', contract)

            const rpb = await contract.methods.rewardPerBlock().call()
            setRewardPerBlock(web3.utils.fromWei(rpb))
          } catch (error) {
            // console.log('stake action', error)
          }
        }
      }

      const getBalance = async (address) => {
        const abi = LPTokenABI
        const contract = new web3.eth.Contract(abi as unknown as AbiItem, getAddress(stakingToken.address))
        const response = await contract.methods.balanceOf(address).call()
        const bal = new BigNumber(response)
        setStakingTokenBalance(bal)
      }

      const getLockTime = async (address) => {
        try {
          const abi = SmartChefABI
          if (
            pool.poolCategory === '30DayLock' ||
            pool.poolCategory === '60DayLock' ||
            pool.poolCategory === '90DayLock'
          ) {
            const contract = new web3.eth.Contract(abi as unknown as AbiItem, getAddress(pool.contractAddress))
            const remainingTime = await contract.methods.getRemainingLockTime(address).call()
            setLockTime(remainingTime)
          }
        } catch (error) {
          // console.log('lock time error', error)
        }
      }

      checkApprovalStatus()
      getLockTime(account)
      getPendingReward(account)
      getStakingBalance(account)
      getBalance(account)
      getRewardPerBlock()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, fastRefresh, isApproved, setIsVaultApproved])

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
