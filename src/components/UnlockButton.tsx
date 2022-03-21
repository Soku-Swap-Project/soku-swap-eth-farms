import React from 'react'
import { Button, useWalletModal } from '@pancakeswap/uikit'
import useAuth from 'hooks/useAuth'
import { useTranslation } from 'contexts/Localization'

const UnlockButton = (props) => {
  const { t } = useTranslation()
  const { login, logout } = useAuth()
  const { onPresentConnectModal } = useWalletModal(login, logout)

  return (
    <Button
      style={{ background: '#04bbfb', fontWeight: '200', borderRadius: '24px' }}
      onClick={onPresentConnectModal}
      {...props}
    >
      {t('Connect Wallet')}
    </Button>
  )
}

export default UnlockButton
