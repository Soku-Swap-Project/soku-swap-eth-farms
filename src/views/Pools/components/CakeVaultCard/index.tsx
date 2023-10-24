import React, { useState } from 'react'
import styled from 'styled-components'
import { Box, CardBody, Flex, Text, useMatchBreakpoints } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { useWeb3React } from '@web3-react/core'
import UnlockButton from 'components/UnlockButton'
import { useCakeVault } from 'state/hooks'
import { Pool } from 'state/types'
import { getWeb3NoAccount } from 'utils/web3'
import { getAddress } from 'utils/addressHelpers'
import { AbiItem } from 'web3-utils'
import AprRow from '../PoolCard/AprRow'
import { StyledCard, StyledCardInner } from '../PoolCard/StyledCard'
import CardFooter from '../PoolCard/CardFooter'
import StyledCardHeader from '../PoolCard/StyledCardHeader'
import VaultCardActions from './VaultCardActions'
import UnstakingFeeCountdownRow from './UnstakingFeeCountdownRow'
import RecentCakeProfitRow from './RecentCakeProfitRow'

const StyledCardBody = styled(CardBody)<{ isLoading: boolean }>`
  min-height: ${({ isLoading }) => (isLoading ? '0' : '254px')};
`

interface CakeVaultProps {
  pool: Pool
  showStakedOnly: boolean
}

const CakeVaultCard: React.FC<CakeVaultProps> = ({ pool, showStakedOnly }) => {
  // console.log('pool', pool)
  // const [loading, setLoading] = useState(false)
  // eslint-disable-next-line
  const [userDetails, setUserDetails] = useState()
  const web3 = getWeb3NoAccount()
  const { t } = useTranslation()
  const { isXl } = useMatchBreakpoints()
  const { account } = useWeb3React()
  const {
    userData: { userShares, isLoading: isVaultUserDataLoading },
    fees: { performanceFee },
  } = useCakeVault()

  // eslint-disable-next-line
  const getUserInfo = async (address) => {
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
        const userInfo = await contract.methods.userInfo(address).call()

        setUserDetails(userInfo)
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
        const userInfo = await contract.methods.userInfo(address).call()

        setUserDetails(userInfo)
      }
    } catch (error) {
      // eslint-disable-next-line
      console.log(error, 'getUserInfo')
    }
  }

  //   Estimate & manual for now. 288 = once every 5 mins. We can change once we have a better sense of this
  const timesCompoundedDaily = 288
  const accountHasSharesStaked = userShares && userShares.gt(0)
  // console.log(pool, 'pool')
  const isLoading = !pool.userData || isVaultUserDataLoading
  const isVault = true
  const performanceFeeAsDecimal = performanceFee && performanceFee / 100

  if (showStakedOnly && !accountHasSharesStaked) {
    return null
  }

  return (
    <StyledCard isPromoted={{ isDesktop: isXl }}>
      <StyledCardInner isPromotedPool>
        <StyledCardHeader
          isPromotedPool
          isStaking={accountHasSharesStaked}
          isAutoVault={isVault}
          earningTokenSymbol="SUTEKU"
          stakingTokenSymbol="SUTEKU"
          pool={pool}
        />
        <StyledCardBody isLoading={isLoading}>
          <AprRow
            pool={pool}
            isAutoVault={isVault}
            compoundFrequency={timesCompoundedDaily}
            performanceFee={performanceFeeAsDecimal}
          />
          <Box mt="24px">
            <RecentCakeProfitRow />
          </Box>
          <Box mt="8px">
            <UnstakingFeeCountdownRow />
          </Box>
          <Flex mt="32px" flexDirection="column">
            {account ? (
              <VaultCardActions pool={pool} accountHasSharesStaked={accountHasSharesStaked} isLoading={isLoading} />
            ) : (
              <>
                <Text mb="10px" textTransform="uppercase" fontSize="12px" color="textSubtle" bold>
                  {t('Start earning')}
                </Text>
                <UnlockButton />
              </>
            )}
          </Flex>
        </StyledCardBody>
        <CardFooter pool={pool} account={account} isAutoVault={isVault} />
      </StyledCardInner>
    </StyledCard>
  )
}

export default CakeVaultCard
