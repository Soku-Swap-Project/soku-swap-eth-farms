import React from 'react'
import styled from 'styled-components'
// import { useHistory } from 'react-router-dom'
import { useTranslation } from 'contexts/Localization'
import { Text } from '@pancakeswap/uikit'
import { FarmWithStakedValue } from 'views/FarmsV2/components/FarmCard/FarmCard'
// import getLiquidityUrlPathParts from 'utils/getLiquidityUrlPathParts'
// import { CommunityTag, CoreTag, DualTag } from 'components/Tags'

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

// const expandAnimation = keyframes`
//   from {
//     max-height: 0px;
//   }
//   to {
//     max-height: 500px;
//   }
// `

// const collapseAnimation = keyframes`
//   from {
//     max-height: 500px;
//   }
//   to {
//     max-height: 0px;
//   }
// `

const Button = styled.button`
  // border: 1px solid red;
  min-width: 49.5%;
  // padding: 5px;
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

// const StyledLinkExternal = styled(LinkExternal)`
//   font-weight: 400;
// `

// const StakeContainer = styled.div`
//   color: ${({ theme }) => theme.colors.text};
//   align-items: center;
//   display: flex;
//   justify-content: space-between;

//   ${({ theme }) => theme.mediaQueries.sm} {
//     justify-content: flex-start;
//   }
// `

// const TagsContainer = styled.div`
//   display: flex;
//   align-items: center;
//   margin-top: 25px;

//   ${({ theme }) => theme.mediaQueries.sm} {
//     margin-top: 16px;
//   }

//   > div {
//     height: 24px;
//     padding: 0 6px;
//     font-size: 14px;
//     margin-right: 4px;

//     svg {
//       width: 14px;
//     }
//   }
// `

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

// const InfoContainer = styled.div`
//   min-width: 200px;
// `

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

const ActionPanel: React.FunctionComponent<ActionPanelProps> = ({
  details,
  apr,
  multiplier,
  liquidity,
  userDataReady,
  expanded,
}) => {
  const farm = details
  // const history = useHistory()
  const { t } = useTranslation()
  // const isActive = farm.multiplier !== '0X'
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
  const origin = window.location.origin

  // console.log(quoteToken)
  // console.log(token)

  // console.log(window.location)

  return (
    <Container
      expanded={expanded}
      style={{
        minHeight: 'auto',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderBottom: '1px solid #ebebeb',
        background: '#ecf1f8',
      }}
    >
      <div className="add_remove_liquidity">
        <Button
          onClick={() => {
            window.location.href = `${origin}/ethereum/#/add/${token.address[1]}/${quoteToken.address[1]}`
          }}
          style={{
            border: 'none',
            background: 'none',
            color: '#05195a',
            fontWeight: 700,
            fontSize: '16px',
            height: '52px',
          }}
          className="hover_transparent"
        >
          Add Liquidity
        </Button>
        <Button
          onClick={() => {
            window.location.href = `${origin}/ethereum/#/remove/${token.address[1]}/${quoteToken.address[1]}`
          }}
          style={{
            border: 'none',
            background: 'none',
            color: '#05195a',
            fontWeight: 700,
            fontSize: '16px',
            height: '52px',
          }}
          className="hover_transparent"
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
