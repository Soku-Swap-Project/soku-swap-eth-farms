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

  // console.log(pool, 'pool')

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
    return t('Stake %symbol%', { symbol: stakingTokenSymbol })
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
          {/* {pool.poolCategory === 'Lock' && (
            <h1 style={{ color: 'red', paddingBottom: '10px' }}>TESTING (DO NOT STAKE)</h1>
          )} */}
          <Heading color={isFinished ? 'textDisabled' : '#05195a'} scale="lg">
            {`${getHeadingPrefix()} ${earningTokenSymbol}`}
          </Heading>
          <Text color={isFinished ? 'textDisabled' : '#04bbfb'}>{getSubHeading()}</Text>
        </Flex>
        {earningTokenSymbol === 'SUTEKU' ? (
          <img src="https://i.ibb.co/qp3JZv7/SOKU-SUTEKU.png" alt={earningTokenSymbol} width={75} height={75} />
        ) : (
          <img src="https://i.ibb.co/pLMpbtZ/suteku-soku.png" alt={earningTokenSymbol} width={75} height={75} />
        )}
      </Flex>
    </Wrapper>
  )
}

export default StyledCardHeader
