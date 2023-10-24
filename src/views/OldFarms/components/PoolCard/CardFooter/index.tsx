import React, { useState } from 'react'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import { Flex, CardFooter, ExpandableLabel, HelpIcon, useTooltip, Text } from '@pancakeswap/uikit'
import { Pool } from 'state/types'
import {
  CompoundingPoolTag,
  ManualPoolTag,
  ThirtyDayLockedTag,
  SixtyDayLockedTag,
  NinetyDayLockedTag,
} from 'components/Tags'
import ExpandedFooter from './ExpandedFooter'

/* eslint-disable react/require-default-props */
/* eslint-disable react/no-unused-prop-types */

interface FooterProps {
  pool: Pool
  account: string
  isAutoVault?: boolean
  totalCakeInVault?: BigNumber
  lockTime?: any
  stakedAmount?: number
}

const ExpandableButtonWrapper = styled(Flex)`
  align-items: center;
  justify-content: space-between;
  button {
    padding: 0;
  }
`

const Footer: React.FC<FooterProps> = ({ pool, account, isAutoVault = false, lockTime, stakedAmount }) => {
  const { t } = useTranslation()
  const [isExpanded, setIsExpanded] = useState(false)

  const manualTooltipText = t('You must claim and compound your earnings from this farm manually.')
  const lockedVaultToolTip = t(
    'Higher payouts than Manual farms, however your tokens will be locked for a certain amount of days from the time they were staked.',
  )
  const autoTooltipText = t(
    'Any funds you stake in this farm will be automagically claimed and restaked (compounded) for you.',
  )

  const poolTags = () => {
    let tag
    if (pool.poolCategory === '30DayLock') {
      tag = <ThirtyDayLockedTag />
    } else if (pool.poolCategory === '60DayLock') {
      tag = <SixtyDayLockedTag />
    } else if (pool.poolCategory === '90DayLock') {
      tag = <NinetyDayLockedTag />
    } else {
      tag = <ManualPoolTag />
    }
    return tag
  }

  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    pool.poolCategory === 'Core' ? manualTooltipText : lockedVaultToolTip,
    {
      placement: 'bottom',
    },
  )

  return (
    <CardFooter>
      <ExpandableButtonWrapper>
        <Flex alignItems="center">
          {poolTags()}
          {/* {isAutoVault ? <CompoundingPoolTag /> : <ManualPoolTag />} */}
          {tooltipVisible && tooltip}
          <Flex ref={targetRef}>
            <HelpIcon ml="4px" width="20px" height="20px" color="textSubtle" />
          </Flex>
        </Flex>
        <ExpandableLabel expanded={isExpanded} onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded ? <Text>Hide</Text> : <Text>Details</Text>}
        </ExpandableLabel>
      </ExpandableButtonWrapper>
      {isExpanded && (
        <ExpandedFooter
          pool={pool}
          account={account}
          isAutoVault={isAutoVault}
          lockTime={lockTime}
          stakedAmount={stakedAmount}
        />
      )}
    </CardFooter>
  )
}

export default Footer
