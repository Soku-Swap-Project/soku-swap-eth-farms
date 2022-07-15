import React, { useState, useEffect } from 'react'
import {
  Modal,
  Text,
  Button,
  Heading,
  Flex,
  AutoRenewIcon,
  ButtonMenu,
  ButtonMenuItem,
  HelpIcon,
  useTooltip,
} from '@pancakeswap/uikit'
import { useWeb3React } from '@web3-react/core'
import { useTranslation } from 'contexts/Localization'
import useTheme from 'hooks/useTheme'
import { Pool } from 'state/types'
import { AbiItem } from 'web3-utils'
import { getAddress } from 'utils/addressHelpers'
import { getWeb3NoAccount } from 'utils/web3'
import { useSousHarvest } from 'hooks/useHarvest'
import { useSousStake } from 'hooks/useStake'
import useToast from 'hooks/useToast'
import { Token } from 'config/constants/types'
import useWeb3 from 'hooks/useWeb3'

/* eslint-disable react/require-default-props */
interface CollectModalProps {
  formattedBalance: string
  pool: Pool
  fullBalance: string
  earningToken: Token
  earningsDollarValue: string
  sousId: number
  isBnbPool: boolean
  isCompoundPool?: boolean
  onDismiss?: () => void
}

const CollectModal: React.FC<CollectModalProps> = ({
  formattedBalance,
  fullBalance,
  earningToken,
  earningsDollarValue,
  sousId,
  pool,
  isBnbPool,
  isCompoundPool = false,
  onDismiss,
}) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { toastSuccess, toastError } = useToast()
  const { onReward } = useSousHarvest(sousId, isBnbPool)
  const { account } = useWeb3React()
  const { onStake } = useSousStake(sousId, isBnbPool)
  const [pendingTx, setPendingTx] = useState(false)
  const [shouldCompound, setShouldCompound] = useState(isCompoundPool)
  const [userInfo, setUserInfo] = useState()
  const web3 = useWeb3()

  // console.log('pool', pool)

  const claimRewards = async () => {
    const abi = [
      { inputs: [], stateMutability: 'nonpayable', type: 'constructor' },
      {
        anonymous: false,
        inputs: [
          { indexed: false, internalType: 'address', name: 'tokenRecovered', type: 'address' },
          { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' },
        ],
        name: 'AdminTokenRecovery',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          { indexed: true, internalType: 'address', name: 'user', type: 'address' },
          { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' },
        ],
        name: 'ClaimReward',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          { indexed: true, internalType: 'address', name: 'user', type: 'address' },
          { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' },
        ],
        name: 'Deposit',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          { indexed: true, internalType: 'address', name: 'user', type: 'address' },
          { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' },
        ],
        name: 'EmergencyWithdraw',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [{ indexed: false, internalType: 'uint256', name: 'poolLimitPerUser', type: 'uint256' }],
        name: 'NewPoolLimit',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [{ indexed: false, internalType: 'uint256', name: 'rewardPerBlock', type: 'uint256' }],
        name: 'NewRewardPerBlock',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          { indexed: false, internalType: 'uint256', name: 'startBlock', type: 'uint256' },
          { indexed: false, internalType: 'uint256', name: 'endBlock', type: 'uint256' },
        ],
        name: 'NewStartAndEndBlocks',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          { indexed: true, internalType: 'address', name: 'previousOwner', type: 'address' },
          { indexed: true, internalType: 'address', name: 'newOwner', type: 'address' },
        ],
        name: 'OwnershipTransferred',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          { indexed: true, internalType: 'address', name: 'user', type: 'address' },
          { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' },
        ],
        name: 'Withdraw',
        type: 'event',
      },
      {
        inputs: [],
        name: 'PRECISION_FACTOR',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [],
        name: 'SMART_CHEF_FACTORY',
        outputs: [{ internalType: 'address', name: '', type: 'address' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [],
        name: 'accTokenPerShare',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [{ internalType: 'address', name: '', type: 'address' }],
        name: 'addressEndLockTime',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [],
        name: 'bonusEndBlock',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
      },
      { inputs: [], name: 'claimReward', outputs: [], stateMutability: 'nonpayable', type: 'function' },
      {
        inputs: [{ internalType: 'uint256', name: '_amount', type: 'uint256' }],
        name: 'deposit',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [{ internalType: 'uint256', name: '_amount', type: 'uint256' }],
        name: 'emergencyRewardWithdraw',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      { inputs: [], name: 'emergencyWithdraw', outputs: [], stateMutability: 'nonpayable', type: 'function' },
      {
        inputs: [],
        name: 'endLockTime',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [{ internalType: 'address', name: '_user', type: 'address' }],
        name: 'getRemainingLockTime',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [],
        name: 'hasAllRewardDistributedByAdmin',
        outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [],
        name: 'hasSavedPendingRewardUpdatedByAdmin',
        outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [],
        name: 'hasUserLimit',
        outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [
          { internalType: 'contract IBEP20', name: '_stakedToken', type: 'address' },
          { internalType: 'contract IBEP20', name: '_rewardToken', type: 'address' },
          { internalType: 'uint256', name: '_rewardPerBlock', type: 'uint256' },
          { internalType: 'uint256', name: '_startBlock', type: 'uint256' },
          { internalType: 'uint256', name: '_bonusEndBlock', type: 'uint256' },
          { internalType: 'uint256', name: '_lockTime', type: 'uint256' },
          { internalType: 'uint256', name: '_poolLimitPerUser', type: 'uint256' },
          { internalType: 'address', name: '_admin', type: 'address' },
        ],
        name: 'initialize',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [],
        name: 'isInitialized',
        outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [],
        name: 'lastRewardBlock',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [],
        name: 'lockTime',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [],
        name: 'numberOfClaimCurrentAndTotalPendingReward',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [],
        name: 'numberOfClaimSavedPendingReward',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [],
        name: 'owner',
        outputs: [{ internalType: 'address', name: '', type: 'address' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [{ internalType: 'address', name: '_user', type: 'address' }],
        name: 'pendingReward',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [],
        name: 'poolLimitPerUser',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [
          { internalType: 'address', name: '_tokenAddress', type: 'address' },
          { internalType: 'uint256', name: '_tokenAmount', type: 'uint256' },
        ],
        name: 'recoverWrongTokens',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      { inputs: [], name: 'renounceOwnership', outputs: [], stateMutability: 'nonpayable', type: 'function' },
      {
        inputs: [],
        name: 'rewardPerBlock',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [],
        name: 'rewardToken',
        outputs: [{ internalType: 'contract IBEP20', name: '', type: 'address' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [],
        name: 'stakedToken',
        outputs: [{ internalType: 'contract IBEP20', name: '', type: 'address' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [],
        name: 'startBlock',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
      },
      { inputs: [], name: 'stopReward', outputs: [], stateMutability: 'nonpayable', type: 'function' },
      {
        inputs: [{ internalType: 'address', name: '', type: 'address' }],
        name: 'temporaryPendingReward',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [{ internalType: 'address', name: 'newOwner', type: 'address' }],
        name: 'transferOwnership',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [
          { internalType: 'bool', name: '_hasUserLimit', type: 'bool' },
          { internalType: 'uint256', name: '_poolLimitPerUser', type: 'uint256' },
        ],
        name: 'updatePoolLimitPerUser',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [{ internalType: 'uint256', name: '_rewardPerBlock', type: 'uint256' }],
        name: 'updateRewardPerBlock',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [
          { internalType: 'uint256', name: '_startBlock', type: 'uint256' },
          { internalType: 'uint256', name: '_bonusEndBlock', type: 'uint256' },
        ],
        name: 'updateStartAndEndBlocks',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [{ internalType: 'address', name: '', type: 'address' }],
        name: 'userInfo',
        outputs: [
          { internalType: 'uint256', name: 'amount', type: 'uint256' },
          { internalType: 'uint256', name: 'rewardDebt', type: 'uint256' },
        ],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [{ internalType: 'uint256', name: '_amount', type: 'uint256' }],
        name: 'withdraw',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
    ]
    const contract = new web3.eth.Contract(abi as unknown as AbiItem, pool.contractAddress[56])
    // console.log('contract', contract)
    const claimTx = await contract.methods
      .claimReward()
      .send({ from: account })
      .then((receipt) => {
        console.log('receipt', receipt)
      })

    return claimTx
  }

  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    <>
      <Text mb="12px">{t('Compound: collect and restake SOKU into pool.')}</Text>
      <Text>{t('Claim: collect SOKU and send to wallet')}</Text>
    </>,
    { placement: 'bottom-end', tooltipOffset: [20, 10] },
  )

  const handleHarvestConfirm = async () => {
    setPendingTx(true)
    // compounding
    if (shouldCompound) {
      try {
        await onStake(fullBalance, earningToken.decimals)
        toastSuccess(
          `${t('Compounded')}!`,
          t('Your %symbol% earnings have been re-invested into the pool!', { symbol: earningToken.symbol }),
        )
        setPendingTx(false)
        onDismiss()
      } catch (e) {
        toastError(t('Canceled'), t('Please try again and confirm the transaction.'))
        setPendingTx(false)
      }
    } else {
      // harvesting
      try {
        if (
          pool.poolCategory === '30DayLock' ||
          pool.poolCategory === '60DayLock' ||
          pool.poolCategory === '90DayLock'
        ) {
          await claimRewards()
        } else {
          await onReward()
        }
        toastSuccess(
          `${t('Claimed')}!`,
          t('Your %symbol% earnings have been sent to your wallet!', { symbol: earningToken.symbol }),
        )
        setPendingTx(false)
        onDismiss()
      } catch (e) {
        console.log(e)
        toastError(t('Canceled'), t('Please try again and confirm the transaction.'))
        setPendingTx(false)
      }
    }
  }

  return (
    <Modal
      title={`${earningToken.symbol} ${isCompoundPool ? t('Collect') : t('Claim')}`}
      onDismiss={onDismiss}
      headerBackground="#ecf1f8"
      className="emphasized_swap_layout hover_shadow"
    >
      {isCompoundPool && (
        <Flex justifyContent="center" alignItems="center" mb="24px">
          <ButtonMenu
            activeIndex={shouldCompound ? 0 : 1}
            scale="sm"
            variant="subtle"
            onItemClick={(index) => setShouldCompound(!index)}
          >
            <ButtonMenuItem as="button">{t('Compound')}</ButtonMenuItem>
            <ButtonMenuItem as="button">{t('Claim')}</ButtonMenuItem>
          </ButtonMenu>
          <Flex ml="10px" ref={targetRef}>
            <HelpIcon color="textSubtle" />
          </Flex>
          {tooltipVisible && tooltip}
        </Flex>
      )}

      <Flex justifyContent="space-between" alignItems="center" mb="24px">
        <Text>{shouldCompound ? t('Compounding') : t('Claiming')}:</Text>
        <Flex flexDirection="column">
          <Heading>
            {formattedBalance} {earningToken.symbol}
          </Heading>
          <Text fontSize="12px" color="textSubtle">{`~${earningsDollarValue || 0} USD`}</Text>
        </Flex>
      </Flex>

      <Button
        className="hover_shadow emphasize_swap_button"
        mt="8px"
        style={{ backgroundColor: '#04bbfb' }}
        onClick={handleHarvestConfirm}
        isLoading={pendingTx}
        endIcon={pendingTx ? <AutoRenewIcon spin color="currentColor" /> : null}
      >
        {pendingTx ? t('Confirming') : t('Confirm')}
      </Button>
      <Button className="hover_shadow_icon" variant="text" style={{ color: '#04bbfb' }} onClick={onDismiss} pb="0px">
        {t('Close Window')}
      </Button>
    </Modal>
  )
}

export default CollectModal
