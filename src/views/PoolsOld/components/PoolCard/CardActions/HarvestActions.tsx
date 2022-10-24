import React, { useState, useEffect, useCallback } from 'react'
import { Flex, Text, Button, Heading, useModal, Skeleton } from '@pancakeswap/uikit'
import Web3 from 'web3'
import BigNumber from 'bignumber.js'
import { Token } from 'config/constants/types'
import { Pool } from 'state/types'
import { getWeb3NoAccount } from 'utils/web3'
import { useWeb3React } from '@web3-react/core'
import { AbiItem } from 'web3-utils'
import { getAddress } from 'utils/addressHelpers'
import { useTranslation } from 'contexts/Localization'
import { getFullDisplayBalance, getBalanceNumber, formatNumber } from 'utils/formatBalance'
import { useBusdPriceFromToken, useTokenPrice, usePriceSutekuEth } from 'state/hooks'
import useToast from 'hooks/useToast'
import Balance from 'components/Balance'
import CollectModal from '../Modals/CollectModal'
import { BIG_TEN } from '../../../../../utils/bigNumber'

/* eslint-disable react/require-default-props */
interface HarvestActionsProps {
  pool: Pool
  earnings?: BigNumber
  earningToken: Token
  sousId: number
  isBnbPool: boolean
  isLoading?: boolean
  lockTime?: any
}

const HarvestActions: React.FC<HarvestActionsProps> = ({
  earnings,
  earningToken,
  sousId,
  isBnbPool,
  pool,
  isLoading = false,
  lockTime,
}) => {
  const { t } = useTranslation()
  // const [lockTime, setLockTime] = useState()
  const [loading, setLoading] = useState(false)
  const earningTokenBalance = getBalanceNumber(earnings, earningToken.decimals)
  const formattedBalance = formatNumber(earningTokenBalance, 3, 3)
  const { toastSuccess, toastError } = useToast()
  const web3 = getWeb3NoAccount()
  const newWeb3 = new Web3(Web3.givenProvider)
  const { account } = useWeb3React()
  const ethPrice = useTokenPrice('wbnb')
  const ethPriceBig = new BigNumber(ethPrice)
  const sokuPrice = useTokenPrice('sokuswap')
  const sutekuPrice = usePriceSutekuEth()

  const earningTokenPrice = earningToken.symbol === 'SOKU' ? sokuPrice : sutekuPrice.toNumber()

  const earningTokenPriceAsNumber = earningTokenPrice

  const earningTokenDollarBalance = new BigNumber(parseFloat(earnings.toString()) * earningTokenPrice).dividedBy(
    BIG_TEN.pow(earningToken.decimals),
  )

  // console.log(earningTokenDollarBalance.toNumber(), 'earningTokenDollarBalance')
  const earningsDollarValue = formatNumber(earningTokenDollarBalance.toNumber())
  const formattedEarnings = web3.utils.fromWei(earnings.toString())

  const fullBalance = getFullDisplayBalance(earnings, earningToken.decimals)
  const hasEarnings = parseFloat(earnings.toString()) > 0
  const isCompoundPool = sousId === 0

  // console.log(earningTokenBalance, 'earningTokenBalance')
  // console.log(hasEarnings, 'hasEarnings')

  const [onPresentCollect] = useModal(
    <CollectModal
      formattedBalance={formattedBalance}
      fullBalance={fullBalance}
      earningToken={earningToken}
      earningsDollarValue={earningsDollarValue}
      sousId={sousId}
      isBnbPool={isBnbPool}
      isCompoundPool={isCompoundPool}
      pool={pool}
    />,
  )

  return (
    <Flex flexDirection="column" mb="16px">
      <Flex justifyContent="space-between" alignItems="center">
        <Flex flexDirection="column">
          {isLoading ? (
            <Skeleton width="80px" height="48px" />
          ) : (
            <>
              {hasEarnings ? (
                <Balance bold fontSize="20px" decimals={3} value={parseFloat(formattedEarnings)} />
              ) : (
                <Heading color="textDisabled">0</Heading>
              )}
              {earningTokenPriceAsNumber && (
                <Text fontSize="12px" color={hasEarnings ? 'textSubtle' : 'textDisabled'}>
                  {hasEarnings ? (
                    <Balance
                      display="inline"
                      fontSize="12px"
                      color="rgb(4, 187, 251)"
                      decimals={2}
                      value={earningTokenDollarBalance.toNumber()}
                      unit=" USD"
                    />
                  ) : (
                    '0 USD'
                  )}
                </Text>
              )}
            </>
          )}
        </Flex>
        <Flex>
          <Button
            style={{ background: 'rgb(4, 187, 251)' }}
            disabled={!hasEarnings || pool.isFinished}
            onClick={() => {
              if (
                (pool.poolCategory === '30DayLock' && lockTime !== '0') ||
                (pool.poolCategory === '60DayLock' && lockTime !== '0') ||
                (pool.poolCategory === '90DayLock' && lockTime !== '0')
              ) {
                toastError(
                  t('Canceled'),
                  t(
                    'Your lock time has not yet expired. You can view your lock time for the current pool in the "Details" section.',
                  ),
                )
              } else {
                onPresentCollect()
              }
            }}
          >
            {isCompoundPool ? t('Collect') : t('Claim')}
          </Button>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default HarvestActions
