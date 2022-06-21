import React from 'react'
import { CardHeader, Heading, Text, Flex, Image } from '@pancakeswap/uikit'
import { Pool } from 'state/types'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'

const Wrapper = styled(CardHeader)<{ isFinished?: boolean; background?: string; isPromotedPool?: boolean }>`
  background: ${({ isFinished, background, theme }) => (isFinished ? theme.colors.backgroundDisabled : '#f9f9fa')};
  border-radius: ${({ theme, isPromotedPool }) =>
    isPromotedPool ? '31px 31px 0 0' : `${theme.radii.card} ${theme.radii.card} 0 0`};
`

/* eslint-disable react/require-default-props */
const StyledCardHeader: React.FC<{
  earningTokenSymbol: string
  stakingTokenSymbol: string
  isAutoVault?: boolean
  isFinished?: boolean
  isStaking?: boolean
  isPromotedPool?: boolean
  pool: Pool
}> = ({
  earningTokenSymbol,
  stakingTokenSymbol,
  pool,
  isFinished = false,
  isAutoVault = false,
  isStaking = false,
  isPromotedPool = false,
}) => {
  const { t } = useTranslation()
  const poolImageSrc = isAutoVault
    ? `cake-cakevault.svg`
    : `${earningTokenSymbol}-${stakingTokenSymbol}.svg`.toLocaleLowerCase()
  const isSokuPool = earningTokenSymbol === 'SOKU' && stakingTokenSymbol === 'SOKU'
  const background = isStaking ? 'bubblegum' : 'cardHeader'
  const farmImage = `${stakingTokenSymbol}.png`.toLocaleLowerCase()

  const getHeadingPrefix = () => {
    if (isAutoVault) {
      // vault
      return t('Auto')
    }
    if (isSokuPool) {
      // manual soku
      return t('Manual')
    }
    // all other pools
    return t('Earn')
  }

  const getSubHeading = () => {
    if (isAutoVault) {
      return t('Automatic restaking')
    }
    if (isSokuPool) {
      return t('Earn SOKU, stake SOKU')
    }
    return t('%symbol%', { symbol: stakingTokenSymbol })
  }

  return (
    <Wrapper
      isPromotedPool={isPromotedPool}
      isFinished={isFinished}
      background={background}
      style={{ borderBottom: '1px solid #d8d8d8' }}
    >
      <Flex alignItems="center" justifyContent="space-between">
        <Flex flexDirection="column">
          <Heading color={isFinished ? 'textDisabled' : '#05195a'} scale="lg">
            {getSubHeading()}
          </Heading>
          <Text color={isFinished ? 'textDisabled' : '#04bbfb'}>{`${getHeadingPrefix()} ${earningTokenSymbol}`}</Text>
        </Flex>
        <img src={`/images/v2Farms/${farmImage}`} alt={earningTokenSymbol} width={75} height={75} />
      </Flex>
    </Wrapper>
  )
}

export default StyledCardHeader
