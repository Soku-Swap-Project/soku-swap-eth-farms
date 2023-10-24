import BigNumber from 'bignumber.js'
import React from 'react'
// import Web3 from 'web3'

import styled from 'styled-components'
import { BIG_ZERO } from 'utils/bigNumber'
import { Flex, Text, Box } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { PoolCategory } from 'config/constants/types'
// import { AbiItem } from 'web3-utils'
// import { getWeb3NoAccount } from 'utils/web3'
import { useWeb3React } from '@web3-react/core'
// import { getAddress } from 'utils/addressHelpers'
import { Pool } from 'state/types'
import ApprovalAction from './ApprovalAction'
import StakeActions from './StakeActions'
import HarvestActions from './HarvestActions'

const InlineText = styled(Text)`
  display: inline;
`

interface CardActionsProps {
  pool: Pool
  stakedAmount: number
  reward: BigNumber
  stakingTokenBalance: BigNumber
  lockTime: any
  isApproved: boolean
}

const CardActions: React.FC<CardActionsProps> = ({
  pool,
  stakedAmount,
  reward,
  stakingTokenBalance,
  lockTime,
  isApproved,
}) => {
  const { sousId, stakingToken, earningToken, harvest, poolCategory, userData } = pool
  const { account } = useWeb3React()
  // Pools using native BNB behave differently than pools using a token
  const isBnbPool = poolCategory === PoolCategory.BINANCE
  const { t } = useTranslation()
  const allowance = userData?.allowance ? new BigNumber(userData.allowance) : BIG_ZERO
  // const stakingTokenBalance = userData?.stakingTokenBalance ? new BigNumber(userData.stakingTokenBalance) : BIG_ZERO
  // const earnings = userData?.pendingReward ? new BigNumber(userData.pendingReward) : BIG_ZERO
  const needsApproval = !isApproved && !isBnbPool && !(stakedAmount > 0)
  const isStaked = stakedAmount > 0
  const isLoading = !userData

  return (
    <Flex flexDirection="column">
      <Flex flexDirection="column">
        {harvest && (
          <>
            <Box display="inline">
              <InlineText color="#04bbfb" textTransform="uppercase" bold fontSize="12px">
                {`${earningToken.symbol} `}
              </InlineText>
              <InlineText color="textSubtle" textTransform="uppercase" bold fontSize="12px">
                {t('Earned')}
              </InlineText>
            </Box>
            <HarvestActions
              earnings={reward}
              earningToken={earningToken}
              sousId={sousId}
              isBnbPool={isBnbPool}
              isLoading={isLoading}
              pool={pool}
              lockTime={lockTime}
            />
          </>
        )}
        <Box display="inline">
          <InlineText color={isStaked ? '#04bbfb' : 'textSubtle'} textTransform="uppercase" bold fontSize="12px">
            {isStaked ? stakingToken.symbol : t('Stake')}{' '}
          </InlineText>
          <InlineText color={isStaked ? 'textSubtle' : '#04bbfb'} textTransform="uppercase" bold fontSize="12px">
            {isStaked ? t('Staked') : `${stakingToken.symbol}`}
          </InlineText>
        </Box>
        {needsApproval ? (
          <ApprovalAction pool={pool} isLoading={isLoading} approved={isApproved} />
        ) : (
          <StakeActions
            isLoading={isLoading}
            pool={pool}
            stakingTokenBalance={stakingTokenBalance}
            stakedBalance={new BigNumber(stakedAmount.toString())}
            isBnbPool={isBnbPool}
            isStaked={isStaked}
            lockTime={lockTime}
          />
        )}
      </Flex>
    </Flex>
  )
}

export default CardActions
