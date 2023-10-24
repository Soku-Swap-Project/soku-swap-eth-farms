import React from 'react'
import { Flex, TooltipText, useModal, Skeleton, useTooltip } from '@pancakeswap/uikit'
// import Web3 from 'web3'
import { useTranslation } from 'contexts/Localization'
import { getBalanceNumber } from 'utils/formatBalance'
import { getPoolApr } from 'utils/apr'
// import { AbiItem } from 'web3-utils'
import { tokenEarnedPerThousandDollarsCompounding, getRoi } from 'utils/compoundApyHelpers'
import { usePriceSokuEth, usePriceSodatsuEth } from 'state/hooks'
import Balance from 'components/Balance'
import ApyCalculatorModal from 'components/ApyCalculatorModal'
import AprCalculatorModal from 'components/AprCalculatorModal'
import { Pool } from 'state/types'
import { BASE_EXCHANGE_URL } from 'config'
// import BigNumber from 'bignumber.js'
// import { getWeb3NoAccount } from 'utils/web3'
// import { getAddress } from 'utils/addressHelpers'
// import { BIG_ZERO } from 'utils/bigNumber'

/* eslint-disable react/require-default-props */
interface AprRowProps {
  pool: Pool
  isAutoVault?: boolean
  compoundFrequency?: number
  performanceFee?: number
  rewardPerBlock?: string
}

const AprRow: React.FC<AprRowProps> = ({
  pool,
  isAutoVault = false,
  compoundFrequency = 1,
  performanceFee = 0,
  rewardPerBlock,
}) => {
  const { t } = useTranslation()
  // eslint-disable-next-line
  const { stakingToken, earningToken, totalStaked, isFinished, tokenPerBlock } = pool
  // const web3 = getWeb3NoAccount()
  // const newWeb3 = new Web3(Web3.givenProvider)

  const tooltipContent = isAutoVault
    ? t('APY includes compounding, APR doesn’t. This pool’s SOKU is compounded automatically, so we show APY.')
    : t('This pool’s rewards aren’t compounded automatically, so we show APR')

  const { targetRef, tooltip, tooltipVisible } = useTooltip(tooltipContent, { placement: 'bottom-start' })
  const sokuPrice = usePriceSokuEth()
  const sodatsuPrice = usePriceSodatsuEth()
  // const sutekuPrice = BIG_ZERO
  const earningTokenPrice = earningToken.symbol === 'SOKU' ? sokuPrice.toString() : sodatsuPrice.toString()
  const earningTokenPriceAsNumber = Number(earningTokenPrice)

  const stakingTokenPrice = stakingToken.symbol === 'SOKU' ? sokuPrice.toString() : sodatsuPrice.toString()
  const stakingTokenPriceAsNumber = Number(stakingTokenPrice)

  const apr = getPoolApr(
    stakingTokenPriceAsNumber,
    earningTokenPriceAsNumber,
    getBalanceNumber(totalStaked, stakingToken.decimals),
    parseFloat(rewardPerBlock),
  )

  // special handling for tokens like tBTC or BIFI where the daily token rewards for $1000 dollars will be less than 0.001 of that token
  const isHighValueToken = Math.round(earningTokenPriceAsNumber / 1000) > 0
  const roundingDecimals = isHighValueToken ? 4 : 2

  const earningsPercentageToDisplay = () => {
    if (isAutoVault) {
      const oneThousandDollarsWorthOfToken = 1000 / earningTokenPriceAsNumber
      const tokenEarnedPerThousand365D = tokenEarnedPerThousandDollarsCompounding({
        numberOfDays: 365,
        farmApr: apr,
        tokenPrice: earningTokenPriceAsNumber,
        roundingDecimals,
        compoundFrequency,
        performanceFee,
      })
      return getRoi({
        amountEarned: tokenEarnedPerThousand365D,
        amountInvested: oneThousandDollarsWorthOfToken,
      })
    }
    return apr
  }

  const apyModalLink = stakingToken.address && `${BASE_EXCHANGE_URL}/#/swap?outputCurrency=${stakingToken.address[56]}`

  // eslint-disable-next-line
  const [onPresentApyModal] = useModal(
    <ApyCalculatorModal
      tokenPrice={earningTokenPriceAsNumber}
      apr={apr}
      linkLabel={t('Get %symbol%', { symbol: stakingToken.symbol })}
      linkHref={apyModalLink || BASE_EXCHANGE_URL}
      earningTokenSymbol={earningToken.symbol}
      roundingDecimals={isHighValueToken ? 4 : 2}
      compoundFrequency={compoundFrequency}
      performanceFee={performanceFee}
    />,
  )

  const [onPresentAprModal] = useModal(
    <AprCalculatorModal
      tokenPrice={earningTokenPriceAsNumber}
      apr={apr}
      linkLabel={t('Get %symbol%', { symbol: stakingToken.symbol })}
      linkHref={apyModalLink || BASE_EXCHANGE_URL}
      earningTokenSymbol={earningToken.symbol}
      roundingDecimals={isHighValueToken ? 4 : 2}
      performanceFee={performanceFee}
    />,
  )

  return (
    <Flex alignItems="center" justifyContent="space-between">
      {tooltipVisible && tooltip}
      <TooltipText ref={targetRef}>{isAutoVault ? `${t('APY')}:` : `${t('APR')}:`}</TooltipText>
      {isFinished || !apr ? (
        <Skeleton width="82px" height="32px" />
      ) : (
        <Flex alignItems="center">
          <Balance
            fontSize="16px"
            isDisabled={isFinished}
            value={earningsPercentageToDisplay()}
            decimals={2}
            unit="%"
            bold
          />
          {/* <IconButton
            onClick={
              pool.poolCategory === '30DayLock' ||
              pool.poolCategory === '60DayLock' ||
              pool.poolCategory === '90DayLock'
                ? onPresentAprModal
                : onPresentApyModal
            }
            variant="text"
            scale="sm"
          >
            <CalculateIcon className="hover_shadow_icon" color="textSubtle" width="18px" />
          </IconButton> */}
        </Flex>
      )}
    </Flex>
  )
}

export default AprRow
