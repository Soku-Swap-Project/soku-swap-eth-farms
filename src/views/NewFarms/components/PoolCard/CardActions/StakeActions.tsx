import React from 'react'
import { Flex, Button, IconButton, AddIcon, MinusIcon, useModal, Skeleton, useTooltip } from '@pancakeswap/uikit'
// import { useWeb3React } from '@web3-react/core'
// import Web3 from 'web3'
// import { AbiItem } from 'web3-utils'
// import { getAddress } from 'utils/addressHelpers'
// import { getWeb3NoAccount } from 'utils/web3'
import BigNumber from 'bignumber.js'
import { useTranslation } from 'contexts/Localization'
import { getBalanceNumber } from 'utils/formatBalance'
import { Pool } from 'state/types'
import { useLpTokenPriceV2 } from 'state/hooks'
// import { getUserPoolData } from 'state/pools'
// import useRefresh from 'hooks/useRefresh'
import Balance from 'components/Balance'
import NotEnoughTokensModal from '../Modals/NotEnoughTokensModal'
import StakeModal from '../Modals/StakeModal'
// import { BIG_TEN, BIG_ZERO } from '../../../../../utils/bigNumber'

/* eslint-disable react/require-default-props */
interface StakeActionsProps {
  pool: Pool
  stakingTokenBalance: BigNumber
  stakedBalance: BigNumber
  isBnbPool: boolean
  isStaked: ConstrainBoolean
  isLoading?: boolean
  lockTime?: any
}

const StakeAction: React.FC<StakeActionsProps> = ({
  pool,
  stakingTokenBalance,
  stakedBalance,
  isBnbPool,
  isStaked,
  isLoading = false,
  lockTime,
}) => {
  // eslint-disable-next-line
  const { stakingToken, stakingLimit, isFinished, userData, contractAddress } = pool
  // const [lockTime, setLockTime] = useState()
  // const [userInfo, setUserInfo] = useState({})
  // const { account } = useWeb3React()
  const { t } = useTranslation()
  // const web3 = getWeb3NoAccount()

  const stakedTokenBalance = getBalanceNumber(stakedBalance, stakingToken.decimals)

  const farmLpToken = pool.stakingToken
  const stakingLpPrice = useLpTokenPriceV2(`${farmLpToken.symbol} LP`)
  const stakingLpPriceAsNumber = stakingLpPrice ? Number(stakingLpPrice) : 0

  const [onPresentTokenRequired] = useModal(<NotEnoughTokensModal tokenSymbol={stakingToken.symbol} />)

  const [onPresentStake] = useModal(
    <StakeModal
      isBnbPool={isBnbPool}
      pool={pool}
      stakingTokenBalance={stakingTokenBalance}
      stakedBalance={stakedBalance}
      stakingTokenPrice={stakingLpPriceAsNumber}
    />,
  )

  const [onPresentUnstake] = useModal(
    <StakeModal
      stakingTokenBalance={stakingTokenBalance}
      isBnbPool={isBnbPool}
      pool={pool}
      stakedBalance={stakedBalance}
      stakingTokenPrice={stakingLpPriceAsNumber}
      isRemovingStake
    />,
  )

  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    t('You’ve already staked the maximum amount you can stake in this farm!'),
    { placement: 'bottom' },
  )

  // console.log(tempStakingDollarBalance, 'tempStakingDollarBalance')

  const reachStakingLimit = stakingLimit.gt(0) && userData.stakedBalance.gte(stakingLimit)

  const renderStakeAction = () => {
    return isStaked ? (
      <Flex justifyContent="space-between" alignItems="center">
        <Flex flexDirection="column">
          <>
            <Balance bold fontSize="20px" decimals={4} value={stakedTokenBalance} />
            {/* {stakingLpPriceAsNumber !== 0 && (
              <Text fontSize="12px" color="textSubtle">
                <Balance
                  fontSize="12px"
                  color="textSubtle"
                  decimals={2}
                  value={tempStakingDollarBalance}
                  // prefix="~"
                  unit=" USD"
                />
              </Text>
            )} */}
          </>
        </Flex>
        <Flex>
          {/* Disable withdraw/unstake if there is still lock time */}
          {(pool.poolCategory === '30DayLock' && lockTime !== '0' && !pool.isFinished) ||
          (pool.poolCategory === '60DayLock' && lockTime !== '0' && !pool.isFinished) ||
          (pool.poolCategory === '90DayLock' && lockTime !== '0' && !pool.isFinished) ? (
            <IconButton
              className="hover_shadow emphasize_swap_button"
              variant="secondary"
              disabled={pool.isFinished ? false : !false}
              onClick={onPresentUnstake}
              mr="6px"
            >
              <MinusIcon color="gray" width="14px" />
            </IconButton>
          ) : (
            <IconButton
              className="hover_shadow emphasize_swap_button"
              style={{ border: '2px solid #05195a' }}
              variant="secondary"
              onClick={onPresentUnstake}
              mr="6px"
            >
              <MinusIcon color="#05195a" width="14px" />
            </IconButton>
          )}

          {reachStakingLimit ? (
            <span ref={targetRef}>
              <IconButton
                className="hover_shadow emphasize_swap_button"
                style={{ border: '2px solid #05195a' }}
                variant="secondary"
                disabled
              >
                <AddIcon color="#05195a" width="14px" height="24px" />
              </IconButton>
            </span>
          ) : (
            <IconButton
              className="hover_shadow emphasize_swap_button"
              variant="secondary"
              style={isFinished ? { border: '0' } : { border: '2px solid #05195a' }}
              onClick={stakingTokenBalance.gt(0) ? onPresentStake : onPresentTokenRequired}
              disabled={isFinished}
            >
              <AddIcon color={isFinished ? 'gray' : '#05195a'} width="24px" height="24px" />
            </IconButton>
          )}
        </Flex>
        {tooltipVisible && tooltip}
      </Flex>
    ) : (
      <Button
        className="hover_shadow emphasize_swap_button"
        style={{ backgroundColor: '#04bbfb' }}
        disabled={isFinished}
        onClick={stakingTokenBalance.gt(0) ? onPresentStake : onPresentTokenRequired}
      >
        {t('Stake')}
      </Button>
    )
  }

  return <Flex flexDirection="column">{isLoading ? <Skeleton width="100%" height="52px" /> : renderStakeAction()}</Flex>
}

export default StakeAction
