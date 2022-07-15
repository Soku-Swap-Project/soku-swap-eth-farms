import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Modal, Text, Flex, Image, Button, BalanceInput, AutoRenewIcon, Link } from '@pancakeswap/uikit'
import Web3 from 'web3'
import { useTranslation } from 'contexts/Localization'
import { BASE_EXCHANGE_URL } from 'config'
import { useSousStakeFarms } from 'hooks/useStake'
import { useSousUnstakeFarms } from 'hooks/useUnstake'
import { AbiItem } from 'web3-utils'
import { getAddress } from 'utils/addressHelpers'
import { useWeb3React } from '@web3-react/core'
import { getWeb3NoAccount } from 'utils/web3'
import useTheme from 'hooks/useTheme'
import useToast from 'hooks/useToast'
import BigNumber from 'bignumber.js'
import { getFullDisplayBalance, formatNumber, getDecimalAmount } from 'utils/formatBalance'
import { Pool } from 'state/types'
import Slider from 'components/Slider'
import PercentageButton from './PercentageButton'

/* eslint-disable react/require-default-props */
interface StakeModalProps {
  isBnbPool: boolean
  pool: Pool
  stakingTokenBalance: BigNumber
  stakedBalance: BigNumber
  stakingTokenPrice: number
  isRemovingStake?: boolean
  onDismiss?: () => void
}

const StyledLink = styled(Link)`
  width: 100%;
`

const StakeModal: React.FC<StakeModalProps> = ({
  isBnbPool,
  pool,
  stakingTokenBalance,
  stakedBalance,
  stakingTokenPrice,
  isRemovingStake = false,
  onDismiss,
}) => {
  const { sousId, stakingToken, userData, stakingLimit, earningToken } = pool

  const { t } = useTranslation()
  const { theme } = useTheme()
  const { account } = useWeb3React()
  const web3 = getWeb3NoAccount()
  // const newWeb3 = new Web3(Web3.givenProvider)

  const { onStake, stakeInFarm } = useSousStakeFarms(sousId, isBnbPool)
  const { onUnstake, unStakeInFarm } = useSousUnstakeFarms(sousId, pool.enableEmergencyWithdraw)
  const { toastSuccess, toastError } = useToast()
  const [pendingTx, setPendingTx] = useState(false)
  const [stakeAmount, setStakeAmount] = useState('')
  const [hasReachedStakeLimit, setHasReachedStakedLimit] = useState(false)
  const [percent, setPercent] = useState(0)

  const getCalculatedStakingLimit = () => {
    if (isRemovingStake) {
      return stakedBalance
    }
    return stakingLimit.gt(0) && stakingTokenBalance.gt(stakingLimit) ? stakingLimit : stakingTokenBalance
  }

  const usdValueStaked = stakeAmount && formatNumber(new BigNumber(stakeAmount).times(stakingTokenPrice).toNumber())

  useEffect(() => {
    if (stakingLimit.gt(0) && !isRemovingStake) {
      const fullDecimalStakeAmount = getDecimalAmount(new BigNumber(stakeAmount), stakingToken.decimals)
      setHasReachedStakedLimit(fullDecimalStakeAmount.plus(stakedBalance).gt(stakingLimit))
    }
  }, [stakeAmount, stakingLimit, stakedBalance, stakingToken, isRemovingStake, setHasReachedStakedLimit])

  const handleStakeInputChange = (input: string) => {
    if (input) {
      const convertedInput = getDecimalAmount(new BigNumber(input), stakingToken.decimals)
      const percentage = Math.floor(convertedInput.dividedBy(getCalculatedStakingLimit()).multipliedBy(100).toNumber())
      setPercent(Math.min(percentage, 100))
    } else {
      setPercent(0)
    }
    setStakeAmount(parseInt(input).toString())
  }

  const handleChangePercent = (sliderPercent: number) => {
    if (sliderPercent > 0) {
      const percentageOfStakingMax = new BigNumber(getCalculatedStakingLimit()).div(100).multipliedBy(sliderPercent)
      const amountToStake = getFullDisplayBalance(percentageOfStakingMax, stakingToken.decimals)
      setStakeAmount(parseFloat(amountToStake).toString())
    } else {
      setStakeAmount('')
    }
    setPercent(sliderPercent)
  }

  const handleConfirmClick = async () => {
    setPendingTx(true)

    if (isRemovingStake) {
      // unstaking
      try {
        await unStakeInFarm(stakeAmount, stakingToken.decimals)
        toastSuccess(
          `${t('Unstaked')}!`,
          t('Your %symbol% earnings have been automatically sent to your wallet!', {
            symbol: earningToken.symbol,
          }),
        )
        setPendingTx(false)
        onDismiss()
      } catch (e) {
        toastError(t('Canceled'), t('Please try again and confirm the transaction.'))
        setPendingTx(false)
      }
    } else {
      try {
        // staking
        await stakeInFarm(stakeAmount, stakingToken.decimals)
        toastSuccess(
          `${t('Staked')}!`,
          t('Your %symbol% LP tokens have been staked in the pool!', {
            symbol: stakingToken.symbol,
          }),
        )
        setPendingTx(false)
        onDismiss()
      } catch (e) {
        toastError(t('Canceled'), t('Please try again and confirm the transaction.'))
        setPendingTx(false)
      }
    }
  }

  // console.log(stakeAmount, 'staking now')
  // console.log(web3.utils.fromWei(stakedBalance.toString()), 'staking balance')

  return (
    <Modal
      title={isRemovingStake ? t('Unstake') : t('Stake in Farm')}
      onDismiss={onDismiss}
      headerBackground="#ecf1f8"
      className="emphasized_swap_layout hover_shadow"
    >
      {stakingLimit.gt(0) && !isRemovingStake && (
        <Text color="#04bbfb" bold mb="24px" style={{ textAlign: 'center' }} fontSize="16px">
          {t('Max stake: %amount% %token% LP', {
            amount: getFullDisplayBalance(stakingLimit, stakingToken.decimals, 0),
            token: stakingToken.symbol,
          })}
        </Text>
      )}
      <Flex alignItems="center" justifyContent="space-between" mb="8px">
        <Text bold>{isRemovingStake ? t('Unstake') : t('Stake')}:</Text>
        <Flex alignItems="center" minWidth="70px">
          {/* <Image src={`/images/tokens/${stakingToken.symbol}.png`} width={24} height={24} alt={stakingToken.symbol} /> */}
          <img
            src={`/images/v2Farms/${stakingToken.symbol}.png`}
            width={24}
            height={24}
            alt={stakingToken.symbol}
            style={{ objectFit: 'contain' }}
          />

          <Text ml="4px" bold>
            {stakingToken.symbol} LP
          </Text>
        </Flex>
      </Flex>
      <BalanceInput
        value={stakeAmount}
        onUserInput={handleStakeInputChange}
        currencyValue={stakingTokenPrice !== 0 && `~${usdValueStaked || 0} USD`}
        isWarning={hasReachedStakeLimit}
        style={{ background: 'rgb(239 238 238 / 79%)', border: 'none' }}
      />
      {hasReachedStakeLimit && (
        <Text color="failure" fontSize="12px" style={{ textAlign: 'right' }} mt="4px">
          {t('Maximum total stake: %amount% %token%', {
            amount: getFullDisplayBalance(new BigNumber(stakingLimit), stakingToken.decimals, 0),
            token: stakingToken.symbol,
          })}
        </Text>
      )}
      <Text ml="auto" color="textSubtle" fontSize="12px" mb="8px">
        {t('Balance: %balance%', {
          balance: getFullDisplayBalance(new BigNumber(getCalculatedStakingLimit()), stakingToken.decimals),
        })}
      </Text>
      {pool.isFinished ? (
        <>
          {' '}
          <Flex alignItems="center" justifyContent="space-between" mt="8px">
            {/* <PercentageButton onClick={() => handleChangePercent(25)}>25%</PercentageButton>
            <PercentageButton onClick={() => handleChangePercent(50)}>50%</PercentageButton>
            <PercentageButton onClick={() => handleChangePercent(75)}>75%</PercentageButton> */}
            <PercentageButton onClick={() => handleChangePercent(99.9999)}>MAX</PercentageButton>
          </Flex>{' '}
        </>
      ) : (
        <>
          {' '}
          <Slider
            min={0}
            max={100}
            value={percent}
            onChange={handleChangePercent}
            name="stake"
            valueLabel={`${percent}%`}
            step={1}
          />
          <Flex alignItems="center" justifyContent="space-between" mt="8px">
            <PercentageButton onClick={() => handleChangePercent(25)}>25%</PercentageButton>
            <PercentageButton onClick={() => handleChangePercent(50)}>50%</PercentageButton>
            <PercentageButton onClick={() => handleChangePercent(75)}>75%</PercentageButton>
            <PercentageButton onClick={() => handleChangePercent(isRemovingStake ? 100 : 99.99)}>MAX</PercentageButton>
          </Flex>{' '}
        </>
      )}
      <Button
        className="hover_shadow emphasize_swap_button"
        style={{ background: '#05195a' }}
        isLoading={pendingTx}
        endIcon={pendingTx ? <AutoRenewIcon spin color="currentColor" /> : null}
        onClick={handleConfirmClick}
        disabled={!stakeAmount || parseFloat(stakeAmount) === 0 || hasReachedStakeLimit}
        mt="24px"
      >
        {pendingTx ? t('Confirming') : t('Confirm')}
      </Button>
      {!isRemovingStake && (
        <StyledLink external href={BASE_EXCHANGE_URL}>
          <Button
            className="hover_shadow emphasize_swap_button"
            style={{ background: '#05195a' }}
            width="100%"
            mt="8px"
            variant="primary"
          >
            <Text color="#fff" fontWeight="bolder">
              {' '}
              {t('Get %symbol%', { symbol: stakingToken.symbol })}
            </Text>
          </Button>
        </StyledLink>
      )}
    </Modal>
  )
}

export default StakeModal
