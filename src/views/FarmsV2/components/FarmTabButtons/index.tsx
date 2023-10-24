import React from 'react'
import styled from 'styled-components'
import { useLocation, Link, useRouteMatch } from 'react-router-dom'
import { ButtonMenu, ButtonMenuItem, NotificationDot } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'

interface FarmTabButtonsProps {
  hasStakeInFinishedFarms: boolean
}
const StyledButtonMenu = styled(ButtonMenu)`
  border: none;
  background: transparent;
`
const FarmTabButtons: React.FC<FarmTabButtonsProps> = ({ hasStakeInFinishedFarms }) => {
  // const { url } = useRouteMatch()
  const location = useLocation()
  const { t } = useTranslation()

  let activeIndex
  switch (location.pathname) {
    case '/ethereum/farms':
      activeIndex = 0
      break
    case '/ethereum/farms/history':
      activeIndex = 1
      break
    case '/farms/archived':
      activeIndex = 2
      break
    default:
      activeIndex = 0
      break
  }

  return (
    <Wrapper>
      <StyledButtonMenu activeIndex={activeIndex} scale="sm" variant="primary">
        <ButtonMenuItem
          className={activeIndex === 0 ? 'hover_shadow emphasized-selected' : 'hover_shadow'}
          style={{ color: '#05195a', opacity: '0.9', borderRadius: '7px', marginRight: '14px' }}
          as={Link}
          to="/ethereum/farms"
        >
          {t('Live')}
        </ButtonMenuItem>
        <NotificationDot show={hasStakeInFinishedFarms}>
          <ButtonMenuItem
            className={activeIndex === 1 ? 'hover_shadow emphasized-selected' : 'hover_shadow'}
            style={{ color: '#05195a', opacity: '0.9', borderRadius: '7px' }}
            as={Link}
            to="/ethereum/farms/history"
          >
            {t('Finished')}
          </ButtonMenuItem>
        </NotificationDot>
      </StyledButtonMenu>
    </Wrapper>
  )
}

export default FarmTabButtons

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px;

  a {
    padding-left: 12px;
    padding-right: 12px;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    margin-left: 16px;
  }
`
