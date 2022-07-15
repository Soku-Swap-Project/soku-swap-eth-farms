import React from 'react'
import styled from 'styled-components'
import { Button, useWalletModal } from '@pancakeswap/uikit'
import useAuth from 'hooks/useAuth'
import { useTranslation } from 'contexts/Localization'

const StyledButton = styled(Button)`
  border-radius: 14px;
  height: 52px;
`

const UnlockButton = (props) => {
  const { t } = useTranslation()
  const { login, logout } = useAuth()
  const { onPresentConnectModal } = useWalletModal(login, logout)

  return (
    <StyledButton
      className="hover_shadow emphasize_swap_button"
      style={{ background: '#05195a', fontWeight: 700 }}
      onClick={onPresentConnectModal}
      {...props}
    >
      {t('Connect Wallet')}
    </StyledButton>
  )
}

export default UnlockButton
