import React, { useState } from 'react'
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
// import { useWeb3React } from '@web3-react/core'
import { useTranslation } from 'contexts/Localization'
// import useTheme from 'hooks/useTheme'
import { Pool } from 'state/types'
// import { AbiItem } from 'web3-utils'
// import { getAddress } from 'utils/addressHelpers'
// import { getWeb3NoAccount } from 'utils/web3'
// import { useSousHarvestFarms } from 'hooks/useHarvest'
import { useSousStakeFarms } from 'hooks/useStake'
// import useToast from 'hooks/useToast'
import { Token } from 'config/constants/types'
// import useWeb3 from 'hooks/useWeb3'
// import { useSousChefV2Farms } from 'hooks/useContract'
import { useSousUnstakeFarms } from 'hooks/useUnstake'
import { ToastError, ToastSuccess } from 'style/Toasts'
import { toast } from 'react-toastify'
// import { SmartChefABI } from '../../../helpers'

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
  // eslint-disable-next-line
  earningsDollarValue,
  sousId,
  pool,
  isBnbPool,
  isCompoundPool = false,
  onDismiss,
}) => {
  const { t } = useTranslation()
  // const { theme } = useTheme()
  // const { toastSuccess, toastError } = useToast()
  // const { onReward, claimRewards } = useSousHarvestFarms(sousId, isBnbPool)
  // eslint-disable-next-line
  const { onUnstake, unStakeInFarm } = useSousUnstakeFarms(sousId, pool.enableEmergencyWithdraw)
  // const { account } = useWeb3React()
  const { onStake } = useSousStakeFarms(sousId, isBnbPool)
  const [pendingTx, setPendingTx] = useState(false)
  const [shouldCompound, setShouldCompound] = useState(isCompoundPool)
  // const web3 = useWeb3()

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
        toast.success(
          ToastSuccess(
            `${t('Compounded')}!`,
            t('Your %symbol% earnings have been re-invested into the pool!', { symbol: earningToken.symbol }),
          ),
        )
        setPendingTx(false)
        onDismiss()
      } catch (e) {
        toast.error(ToastError(t('Canceled'), t('Please try again and confirm the transaction.')))
        setPendingTx(false)
      }
    } else {
      // harvesting
      try {
        await unStakeInFarm('0', earningToken.decimals)

        toast.success(
          ToastSuccess(
            `${t('Claimed')}!`,
            t('Your %symbol% earnings have been sent to your wallet!', { symbol: earningToken.symbol }),
          ),
        )
        setPendingTx(false)
        onDismiss()
      } catch (e) {
        // eslint-disable-next-line
        console.log(e)
        toast.error(ToastError(t('Canceled'), t('Please try again and confirm the transaction.')))
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
          {/* <Text fontSize="12px" color="textSubtle">{`~${earningsDollarValue || 0} USD`}</Text> */}
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
