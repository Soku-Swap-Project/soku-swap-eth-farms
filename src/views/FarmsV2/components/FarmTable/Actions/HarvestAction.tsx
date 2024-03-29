import React, { useState, useRef, useEffect } from 'react'
import { Button, Skeleton } from '@pancakeswap/uikit'
import BigNumber from 'bignumber.js'
import { FarmWithStakedValue } from 'views/FarmsV2/components/FarmCard/FarmCard'
import { getBalanceNumber } from 'utils/formatBalance'
import { useHarvestV2 } from 'hooks/useHarvest'
import { useTranslation } from 'contexts/Localization'
import { usePriceSutekuEth } from 'state/hooks'
import { useCountUp } from 'react-countup'
import { useWeb3React } from '@web3-react/core'
import { ethPrice } from 'state/prices'
import { ActionContainer, ActionTitles, Title, Subtle, ActionContent, Earned, Staked } from './styles'

interface HarvestActionProps extends FarmWithStakedValue {
  userDataReady: boolean
}

const HarvestAction: React.FunctionComponent<HarvestActionProps> = ({ pid, userData, userDataReady }) => {
  const earningsBigNumber = new BigNumber(userData.earnings)
  // console.log(earningsBigNumber.toString(), 'earnings')
  const sutekuPrice = usePriceSutekuEth()
  // const priceOfEth = ethPrice()
  // // const sutekuToString = sutekuPrice?.toString()
  // // const sutekuToNumber = parseFloat(sutekuToString)
  // // const sutekuUsd = sutekuToNumber * priceOfEth
  let earnings = 0
  let earningsBusd = 0
  let displayBalance = userDataReady ? earnings.toLocaleString() : <Skeleton width={60} />
  const { account } = useWeb3React()

  // If user didn't connect wallet default balance will be 0
  if (!earningsBigNumber.isZero()) {
    earnings = getBalanceNumber(earningsBigNumber)
    earningsBusd = new BigNumber(earnings).multipliedBy(sutekuPrice).toNumber()
    displayBalance = earnings.toLocaleString()
  }

  // console.log(sutekuUsd, 'sutekuUsd')

  const [pendingTx, setPendingTx] = useState(false)
  const { onReward } = useHarvestV2(pid)
  const { t } = useTranslation()

  const { countUp, update } = useCountUp({
    start: 0,
    end: earningsBusd,
    duration: 1,
    separator: ',',
    decimals: 3,
  })
  const updateValue = useRef(update)

  useEffect(() => {
    updateValue.current(earningsBusd)
  }, [earningsBusd, updateValue])

  return (
    <>
      {account ? (
        <ActionContainer>
          <ActionTitles>
            <Title>SUTEKU </Title>
            <Subtle>{t('Earned').toUpperCase()}</Subtle>
          </ActionTitles>
          <ActionContent>
            <div>
              <Earned>{displayBalance}</Earned>
              {countUp > 0 && <Staked>~ ${countUp} USD</Staked>}
            </div>
            <Button
              className="hover_shadow emphasize_swap_button"
              style={{ background: '#04bbfb' }}
              disabled={!earnings || pendingTx || !userDataReady}
              onClick={async () => {
                setPendingTx(true)
                await onReward()
                setPendingTx(false)
              }}
              ml="4px"
            >
              {t('Claim')}
            </Button>
          </ActionContent>
        </ActionContainer>
      ) : (
        ''
      )}
    </>
  )
}

export default HarvestAction
