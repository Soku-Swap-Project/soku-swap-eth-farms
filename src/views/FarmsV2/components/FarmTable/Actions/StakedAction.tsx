import React, { useState, useCallback } from 'react'
import styled from 'styled-components'
import { Button, useModal, IconButton, AddIcon, MinusIcon, Skeleton } from '@pancakeswap/uikit'
import { useLocation } from 'react-router-dom'
import UnlockButton from 'components/UnlockButton'
import { useWeb3React } from '@web3-react/core'
import { useFarmUserV2 } from 'state/hooks'
import { FarmWithStakedValue } from 'views/FarmsV2/components/FarmCard/FarmCard'
import { useTranslation } from 'contexts/Localization'
import { useApproveV2 } from 'hooks/useApprove'
import { getBep20Contract, getLpContract } from 'utils/contractHelpers'
import { BASE_ADD_LIQUIDITY_URL } from 'config'
import getLiquidityUrlPathParts from 'utils/getLiquidityUrlPathParts'
import { getBalanceNumber, getFullDisplayBalance } from 'utils/formatBalance'
import { useStakeV2 } from 'hooks/useStake'
import { useUnstakeV2 } from 'hooks/useUnstake'
import useWeb3 from 'hooks/useWeb3'
import DepositModal from '../../DepositModal'
import WithdrawModal from '../../WithdrawModal'
import { ActionContainer, ActionTitles, ActionContent, Earned, Title, Subtle } from './styles'

const IconButtonWrapper = styled.div`
  display: flex;
`

interface StackedActionProps extends FarmWithStakedValue {
  userDataReady: boolean
}

const Staked: React.FunctionComponent<StackedActionProps> = ({
  pid,
  lpSymbol,
  lpAddresses,
  quoteToken,
  token,
  userDataReady,
}) => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const [requestedApproval, setRequestedApproval] = useState(false)
  const { allowance, tokenBalance, stakedBalance } = useFarmUserV2(pid)
  // modal video
  const [isOpen, setOpen] = useState(false)
  const { onStake } = useStakeV2(pid)
  const { onUnstake } = useUnstakeV2(pid)
  const web3 = useWeb3()
  const location = useLocation()

  const isApproved = account && allowance && allowance.isGreaterThan(0)

  const lpAddress = lpAddresses[process.env.NEXT_PUBLIC_CHAIN_ID]
  const liquidityUrlPathParts = getLiquidityUrlPathParts({
    quoteTokenAddress: quoteToken.address,
    tokenAddress: token.address,
  })
  const addLiquidityUrl = `${BASE_ADD_LIQUIDITY_URL}/${liquidityUrlPathParts}`

  const displayBalance = useCallback(() => {
    const stakedBalanceNumber = getBalanceNumber(stakedBalance)
    if (stakedBalanceNumber > 0 && stakedBalanceNumber < 0.0001) {
      return getFullDisplayBalance(stakedBalance).toLocaleString()
    }
    return stakedBalanceNumber.toLocaleString()
  }, [stakedBalance])

  const [onPresentDeposit] = useModal(
    <DepositModal max={tokenBalance} onConfirm={onStake} tokenName={lpSymbol} addLiquidityUrl={addLiquidityUrl} />,
  )
  const [onPresentWithdraw] = useModal(<WithdrawModal max={stakedBalance} onConfirm={onUnstake} tokenName={lpSymbol} />)

  const lpContract = getBep20Contract(lpAddress, web3)
  const testLp = getLpContract(lpAddress, web3)

  const { onApprove } = useApproveV2(lpContract)

  console.log(lpContract)
  console.log(lpAddress)
  console.log(testLp)

  const handleApprove = useCallback(async () => {
    try {
      setRequestedApproval(true)
      await onApprove()
      setRequestedApproval(false)
    } catch (e) {
      console.error(e)
    }
  }, [onApprove])

  if (!account) {
    return (
      <ActionContainer>
        {/* <ActionTitles>
          <Subtle>{t('Start Farming').toUpperCase()}</Subtle>
        </ActionTitles> */}
        <ActionContent>
          <UnlockButton width="100%" />
        </ActionContent>
      </ActionContainer>
    )
  }

  if (isApproved) {
    if (stakedBalance.gt(0)) {
      return (
        <ActionContainer>
          <ActionTitles>
            <Title>{lpSymbol} </Title>
            <Subtle>{t('Staked').toUpperCase()}</Subtle>
          </ActionTitles>
          <ActionContent>
            <div>
              <Earned>{displayBalance()}</Earned>
            </div>
            <IconButtonWrapper>
              <IconButton
                style={{ background: 'transparent', border: '2px solid #05195a' }}
                onClick={onPresentWithdraw}
                mr="6px"
              >
                <MinusIcon color="#05195a" width="14px" />
              </IconButton>
              <IconButton
                style={{ background: 'transparent', border: '2px solid #05195a' }}
                onClick={onPresentDeposit}
                disabled={['history', 'archived'].some((item) => location.pathname.includes(item))}
              >
                <AddIcon color="#05195a" width="14px" />
              </IconButton>
            </IconButtonWrapper>
          </ActionContent>
          {/* <div
            className="how_to_remove_liquidity"
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              paddingBottom: '16px',
              fontWeight: 'bolder',
            }}
          >
            <p
              style={{ color: '#04bbfb', fontSize: '14px', cursor: 'pointer', paddingBottom: '20px' }}
              onClick={() => setOpen(true)}
            >
              How to remove liquidity?
            </p>
          </div>{' '} */}
        </ActionContainer>
      )
    }

    return (
      <ActionContainer>
        <ActionTitles>
          <Subtle>{t('Stake').toUpperCase()} </Subtle>
          <Title>{lpSymbol}</Title>
        </ActionTitles>
        <ActionContent>
          <Button
            style={{ background: '#04bbfb', borderRadius: '24px' }}
            width="100%"
            onClick={onPresentDeposit}
            disabled={['history', 'archived'].some((item) => location.pathname.includes(item))}
          >
            {t('Stake LP')}
          </Button>
        </ActionContent>
      </ActionContainer>
    )
  }

  if (!userDataReady) {
    return (
      <ActionContainer>
        {/* <ActionTitles>
          <Subtle>{t('Start Farming').toUpperCase()}</Subtle>
        </ActionTitles> */}
        {/* <ActionContent>
          <Skeleton width={180} marginBottom={28} marginTop={14} />
        </ActionContent> */}
      </ActionContainer>
    )
  }

  return (
    <ActionContainer>
      {/* <ActionTitles>
        <Subtle>{t('Enable Farm').toUpperCase()}</Subtle>
      </ActionTitles> */}
      <ActionContent>
        <Button
          width="100%"
          disabled={requestedApproval}
          onClick={handleApprove}
          style={{ background: '#04bbfb', borderRadius: '24px', fontWeight: 'normal' }}
        >
          {t('Approve')}
        </Button>
      </ActionContent>
    </ActionContainer>
  )
}

export default Staked
