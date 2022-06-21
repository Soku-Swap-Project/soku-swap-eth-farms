import React, { useState, useEffect, useCallback } from 'react'
import Web3 from 'web3'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import { getBalanceNumber } from 'utils/formatBalance'
import { useTranslation } from 'contexts/Localization'
import {
  Flex,
  MetamaskIcon,
  Text,
  TooltipText,
  LinkExternal,
  TimerIcon,
  Skeleton,
  useTooltip,
  Button,
} from '@pancakeswap/uikit'
import LockClockIcon from '@mui/icons-material/LockClock'
import { BASE_ETHER_SCAN_URL, BASE_URL } from 'config'
import { useBlock, useCakeVault, useLpTokenPriceV2 } from 'state/hooks'
import { Pool } from 'state/types'
import { getAddress } from 'utils/addressHelpers'
import { registerToken } from 'utils/wallet'
import Balance from 'components/Balance'
import { getWeb3NoAccount } from 'utils/web3'
import { AbiItem } from 'web3-utils'
import { BIG_ZERO } from 'utils/bigNumber'
import useRefresh from 'hooks/useRefresh'

/* eslint-disable react/require-default-props */
interface ExpandedFooterProps {
  pool: Pool
  account: string
  isAutoVault?: boolean
  lockTime?: any
  stakedAmount?: number
}

const ExpandedWrapper = styled(Flex)`
  svg {
    height: 14px;
    width: 14px;
  }
`

const ExpandedFooter: React.FC<ExpandedFooterProps> = ({
  pool,
  account,
  isAutoVault = false,
  lockTime,
  stakedAmount,
}) => {
  const { t } = useTranslation()
  const web3 = getWeb3NoAccount()
  // const newWeb3 = new Web3(Web3.givenProvider)
  const { currentBlock } = useBlock()
  const {
    totalCakeInVault,
    fees: { performanceFee },
  } = useCakeVault()

  const { stakingToken, earningToken, totalStaked, startBlock, endBlock, isFinished, contractAddress, sousId } = pool

  const farmLpToken = pool.stakingToken
  const stakingLpPrice = useLpTokenPriceV2(`${farmLpToken.symbol} LP`)

  const stakingLpPriceAsNumber = stakingLpPrice ? parseFloat(stakingLpPrice.toString()) : 0

  const formattedTotalStaked = totalStaked ? web3.utils.fromWei(totalStaked.toString(), 'ether') : BIG_ZERO

  const totalStakedAsNumber = parseFloat(formattedTotalStaked.toString())

  const liquidity = totalStakedAsNumber * stakingLpPriceAsNumber

  const tokenAddress = earningToken.address ? getAddress(earningToken.address) : ''
  const poolContractAddress = getAddress(contractAddress)
  const cakeVaultContractAddress = '0x0'
  const imageSrc = `${BASE_URL}/images/tokens/${earningToken.symbol.toLowerCase()}.png`
  const isMetaMaskInScope = !!(window as WindowChain).ethereum?.isMetaMask
  const isManualCakePool = sousId === 0
  const shouldShowBlockCountdown = Boolean(!isFinished && startBlock && endBlock)
  const blocksUntilStart = Math.max(startBlock - currentBlock, 0)
  const blocksRemaining = Math.max(endBlock - currentBlock, 0)

  const remainingLock = () => {
    let remaining
    if (lockTime) {
      remaining = parseInt(currentBlock?.toString()) + parseInt(lockTime?.toString())
    }

    return remaining
  }
  // console.log(currentBlock)

  const hasPoolStarted = blocksUntilStart === 0 && blocksRemaining > 0

  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    t('Subtracted automatically from each yield harvest and burned.'),
    { placement: 'bottom-start' },
  )

  const getTotalStakedBalance = () => {
    if (isAutoVault) {
      return getBalanceNumber(totalCakeInVault, stakingToken.decimals)
    }
    if (isManualCakePool) {
      const manualCakeTotalMinusAutoVault = new BigNumber(totalStaked).minus(totalCakeInVault)
      return getBalanceNumber(manualCakeTotalMinusAutoVault, stakingToken.decimals)
    }
    return getBalanceNumber(totalStaked, stakingToken.decimals)
  }

  return (
    <ExpandedWrapper flexDirection="column">
      <Flex mb="2px" justifyContent="space-between" alignItems="center">
        <Text small>{t('Total Liquidity')}:</Text>
        <Flex alignItems="flex-start">
          {liquidity ? (
            <Flex alignItems="center">
              <Text>$</Text>
              <Balance fontSize="14px" value={liquidity} />
            </Flex>
          ) : (
            <Skeleton width="90px" height="21px" />
          )}
        </Flex>
      </Flex>
      {/* <Flex mb="2px" justifyContent="space-between" alignItems="center">
        <Text small>{t('Total staked')}:</Text>
        <Flex alignItems="flex-start">
          {totalStaked ? (
            <>
              <Balance fontSize="14px" value={getTotalStakedBalance()} />
              <Text ml="4px" fontSize="14px">
                {stakingToken.symbol} LP
              </Text>
            </>
          ) : (
            <Skeleton width="90px" height="21px" />
          )}
        </Flex>
      </Flex> */}
      {shouldShowBlockCountdown && (
        <>
          <Flex mb="2px" justifyContent="space-between" alignItems="center">
            <Text small>{hasPoolStarted ? t('End') : t('Start')}:</Text>
            <Flex alignItems="center">
              {blocksRemaining || blocksUntilStart ? (
                <Balance
                  color="primary"
                  fontSize="14px"
                  value={hasPoolStarted ? blocksRemaining : blocksUntilStart}
                  decimals={0}
                />
              ) : (
                <Skeleton width="54px" height="21px" />
              )}
              {hasPoolStarted ? (
                <a
                  color="primary"
                  target="_blank"
                  rel="noreferrer"
                  href={`https://etherscan.com/block/countdown/${endBlock}`}
                  style={{ color: '#04bbfb', marginLeft: '4px', textTransform: 'lowercase' }}
                  className="start_and_endBlocks"
                >
                  {t('Blocks')}
                </a>
              ) : (
                <a
                  color="primary"
                  target="_blank"
                  rel="noreferrer"
                  href={`https://etherscan.com/block/countdown/${startBlock}`}
                  style={{ color: '#04bbfb', marginLeft: '4px', textTransform: 'lowercase' }}
                  className="start_and_endBlocks"
                >
                  {t('Blocks')}
                </a>
              )}

              <TimerIcon ml="4px" color="primary" />
            </Flex>
          </Flex>
        </>
      )}
      {(pool.poolCategory === '30DayLock' ||
        pool.poolCategory === '60DayLock' ||
        pool.poolCategory === '90DayLock') && (
        <>
          <Flex mb="2px" justifyContent="space-between" alignItems="center">
            <Text small>Lock Time:</Text>
            <Flex alignItems="center">
              {blocksRemaining || blocksUntilStart ? (
                <Balance color="primary" fontSize="14px" value={stakedAmount > 0 ? lockTime : 0} decimals={0} />
              ) : (
                <Skeleton width="54px" height="21px" />
              )}
              {lockTime > 0 && stakedAmount > 0 ? (
                <a
                  color="primary"
                  target="_blank"
                  rel="noreferrer"
                  href={`https://etherscan.com/block/countdown/${remainingLock()}`}
                  style={{ color: '#04bbfb', marginLeft: '4px', textTransform: 'lowercase' }}
                  className="start_and_endBlocks"
                >
                  {t('Blocks')}
                </a>
              ) : (
                <a
                  color="primary"
                  target="_blank"
                  rel="noreferrer"
                  href={`https://etherscan.com/block/countdown/${currentBlock}`}
                  style={{ color: '#04bbfb', marginLeft: '4px', textTransform: 'lowercase' }}
                  className="start_and_endBlocks"
                >
                  {t('Blocks')}
                </a>
              )}
              <LockClockIcon style={{ marginLeft: '4px', color: '#04bbfb' }} />
            </Flex>
          </Flex>
        </>
      )}

      {isAutoVault && (
        <Flex mb="2px" justifyContent="space-between" alignItems="center">
          {tooltipVisible && tooltip}
          <TooltipText ref={targetRef} small>
            {t('Performance Fee')}
          </TooltipText>
          <Flex alignItems="center">
            <Text ml="4px" small>
              {performanceFee / 100}%
            </Text>
          </Flex>
        </Flex>
      )}
      <Flex mb="2px" justifyContent="flex-end">
        <LinkExternal bold={false} small href={earningToken.projectLink}>
          {t('View Project Site')}
        </LinkExternal>
      </Flex>
      {poolContractAddress && (
        <Flex mb="2px" justifyContent="flex-end">
          <LinkExternal
            bold={false}
            small
            href={`${BASE_ETHER_SCAN_URL}/address/${isAutoVault ? cakeVaultContractAddress : poolContractAddress}`}
          >
            {t('View Contract')}
          </LinkExternal>
        </Flex>
      )}
      {account && isMetaMaskInScope && tokenAddress && (
        <Flex justifyContent="flex-end">
          <Button
            variant="text"
            p="0"
            height="auto"
            onClick={() => registerToken(tokenAddress, earningToken.symbol, earningToken.decimals, imageSrc)}
          >
            <Text color="#04bbfb" fontSize="14px">
              {t('Add to Metamask')}
            </Text>
            <MetamaskIcon ml="4px" />
          </Button>
        </Flex>
      )}
    </ExpandedWrapper>
  )
}

export default React.memo(ExpandedFooter)
