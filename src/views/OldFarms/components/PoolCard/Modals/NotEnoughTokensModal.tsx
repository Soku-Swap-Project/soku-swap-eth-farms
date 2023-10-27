import React from 'react'
import { useTranslation } from 'contexts/Localization'
import styled from 'styled-components'
import { Modal, Text, Button } from '@pancakeswap/uikit'
import { BASE_EXCHANGE_URL } from 'config'
// import useTheme from 'hooks/useTheme'

/* eslint-disable react/require-default-props */
interface NotEnoughTokensModalProps {
  tokenSymbol: string
  onDismiss?: () => void
}

const StyledText = styled(Text)`
  color: #e74c3c !important;
`

const NotEnoughTokensModal: React.FC<NotEnoughTokensModalProps> = ({ tokenSymbol, onDismiss }) => {
  const { t } = useTranslation()
  // const { theme } = useTheme()

  return (
    <Modal
      title={t('%symbol% required', { symbol: tokenSymbol })}
      onDismiss={onDismiss}
      headerBackground="#ecf1f8"
      className="emphasized_swap_layout hover_shadow"
    >
      <StyledText bold>{t('Insufficient %symbol% LP balance', { symbol: tokenSymbol })}</StyledText>
      <Text mt="24px">{t('You’ll need %symbol% LP to stake in this farm!', { symbol: tokenSymbol })}</Text>
      {/* <Text>
        {t('Get %symbol% LP, or make sure your %symbol% LP isn’t in another farm or LP.', {
          symbol: tokenSymbol,
        })}
      </Text> */}
      <Button
        className="hover_shadow emphasize_swap_button"
        mt="24px"
        as="a"
        style={{ background: '#05195a', boxShadow: 'none' }}
        external
        href={`${BASE_EXCHANGE_URL}/ethereum/#/pool`}
      >
        {t('Get')} {tokenSymbol} LP
      </Button>
      {/* <StyledLink href="https://yieldwatch.net" external>
        <Button variant="secondary" mt="8px" width="100%">
          {t('Locate Assets')}
          <OpenNewIcon color="primary" ml="4px" />
        </Button>
      </StyledLink> */}
      <Button className="hover_shadow_icon" variant="text" style={{ color: '#04bbfb' }} onClick={onDismiss}>
        {t('Close Window')}
      </Button>
    </Modal>
  )
}

export default NotEnoughTokensModal
