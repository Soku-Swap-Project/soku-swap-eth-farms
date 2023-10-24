import React from 'react'
import styled from 'styled-components'
// import { useHistory } from 'react-router-dom'
import { useTranslation } from 'contexts/Localization'
import { Text } from '@pancakeswap/uikit'
import { FarmWithStakedValue } from 'views/Farms/components/FarmCard/FarmCard'
// import getLiquidityUrlPathParts from 'utils/getLiquidityUrlPathParts'

import HarvestAction from './HarvestAction'
import StakedAction from './StakedAction'
import { AprProps } from '../Apr'
import { MultiplierProps } from '../Multiplier'
import Liquidity, { LiquidityProps } from '../Liquidity'

export interface ActionPanelProps {
  apr: AprProps
  multiplier: MultiplierProps
  liquidity: LiquidityProps
  details: FarmWithStakedValue
  userDataReady: boolean
  expanded: boolean
}

const Button = styled.button`
  // border: 1px solid red;
  min-width: 49.5%;
  padding: 5px;
`

const Container = styled.div<{ expanded }>`
  overflow: hidden;

  background: ${({ theme }) => theme.colors.background};
  display: grid;
  width: 100%;
  // flex-direction: column-reverse;
  padding: 24px;

  ${({ theme }) => theme.mediaQueries.lg} {
    flex-direction: row;
    padding: 16px 32px;
    justify-content: space-between !important;
  }
`

const ActionContainer = styled.div`
  display: flex;
  flex-direction: column;

  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: row;
    align-items: center;
    flex-grow: 1;
    flex-basis: 0;
  }
`

const ValueContainer = styled.div`
  display: block;

  ${({ theme }) => theme.mediaQueries.lg} {
    display: none;
  }
`

const ValueWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 4px 0px;
`

const ActionPanel: React.FunctionComponent<ActionPanelProps> = ({ details, liquidity, userDataReady, expanded }) => {
  const farm = details
  const { t } = useTranslation()
  // eslint-disable-next-line
  const { quoteToken, token, dual } = farm
  // const lpLabel = farm.lpSymbol && farm.lpSymbol.toUpperCase().replace('PANCAKE', '')
  // const liquidityUrlPathParts = getLiquidityUrlPathParts({
  //   quoteTokenAddress: quoteToken.address,
  //   tokenAddress: token.address,
  // })
  // const lpAddress = farm.lpAddresses[1]
  // const bsc = `https://bscscan.com/address/${lpAddress}`
  // const info = `https://pancakeswap.info/pair/${lpAddress}`
  // eslint-disable-next-line
  const origin = window.location.origin

  return (
    <Container
      expanded={expanded}
      style={{
        minHeight: 'auto',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderBottom: '1px solid #ebebeb',
      }}
    >
      <div className="add_remove_liquidity">
        <Button
          onClick={() => {
            window.location.href = `${origin}/bsc/#/add/${token.address[56]}/${quoteToken.address[56]}`
          }}
          className="farm_liquidity_buttons add"
        >
          Add Liquidity
        </Button>
        <Button
          onClick={() => {
            window.location.href = `${origin}/bsc/#/remove/${token.address[56]}/${quoteToken.address[56]}`
          }}
          className="farm_liquidity_buttons remove"
        >
          Remove Liquidity
        </Button>
      </div>
      {/* <InfoContainer>
        {isActive && (
          <StakeContainer>
            <StyledLinkExternal href={`https://exchange.pancakeswap.finance/#/add/${liquidityUrlPathParts}`}>
              {t('Get %symbol%', { symbol: lpLabel })}
            </StyledLinkExternal>
          </StakeContainer>
        )}
        <StyledLinkExternal href={bsc}>{t('View Contract')}</StyledLinkExternal>
        <StyledLinkExternal href={info}>{t('See Pair Info')}</StyledLinkExternal>
        <TagsContainer>
          {farm.isCommunity ? <CommunityTag /> : <CoreTag />}
          {dual ? <DualTag /> : null}
        </TagsContainer>
      </InfoContainer> */}
      <ValueContainer>
        {/* <ValueWrapper>
          <Text>{t('APR')}</Text>
          <Apr {...apr} />
        </ValueWrapper>
        <ValueWrapper>
          <Text>{t('Multiplier')}</Text>
          <Multiplier {...multiplier} />
        </ValueWrapper> */}
        <ValueWrapper>
          <Text>{t('Liquidity')}</Text>
          <Liquidity {...liquidity} />
        </ValueWrapper>
      </ValueContainer>
      <ActionContainer>
        <HarvestAction {...farm} userDataReady={userDataReady} />
        <StakedAction {...farm} userDataReady={userDataReady} />
      </ActionContainer>
    </Container>
  )
}

export default ActionPanel
