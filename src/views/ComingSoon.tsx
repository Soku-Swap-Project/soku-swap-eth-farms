import React from 'react'
import styled from 'styled-components'
import { Button, Heading, Text, LogoIcon } from '@pancakeswap/uikit'
import Page from 'components/layout/Page'
import { useTranslation } from 'contexts/Localization'

const StyledNotFound = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  height: calc(90vh - 64px);
  justify-content: center;
`

const NotFound = () => {
  const { t } = useTranslation()

  return (
    <Page>
      <StyledNotFound>
        <img
          src="https://i.ibb.co/Qfm7690/Soku-Swap-Web-Logo-White.png"
          className="sokuswap__logo"
          alt="Soku Swap Logo"
          style={{ height: '100px', objectFit: 'contain', width: '250px' }}
        />{' '}
        <Text fontSize="20px" color="white" mb="24px">
          {t('Coming Soon!')}
        </Text>
        <Button style={{ background: '#04bbfb' }} as="a" href="/" scale="sm">
          {t('Back Home')}
        </Button>
      </StyledNotFound>
    </Page>
  )
}

export default NotFound
