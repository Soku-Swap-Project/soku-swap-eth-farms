import React from 'react'
// import styled from 'styled-components'
// import ToggleButton from '@mui/material/ToggleButton'
// import { useRouteMatch } from 'react-router-dom'
import {
  // ButtonMenu,
  // ButtonMenuItem,
  // Button,
  // HelpIcon,
  // Toggle,
  Text,
  Flex,
  // NotificationDot,
  Link as UiKitLink,
} from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { ToggleSwitch } from 'components/ToggleSwitch'

// const ButtonText = styled(Text)`
//   display: none;
//   ${({ theme }) => theme.mediaQueries.lg} {
//     display: block;
//   }
// `

// const StyledLink = styled(UiKitLink)`
//   width: 100%;

//   &:hover {
//     text-decoration: none;
//   }
// `

// const StyledButtonMenu = styled(ButtonMenu)`
//   border: none;
//   background: transparent;
// `

const PoolTabButtons = ({ stakedOnly, setStakedOnly, hasStakeInFinishedPools }) => {
  // const { url, isExact } = useRouteMatch()
  const { t } = useTranslation()

  // const pathname = window.location.pathname
  // const newUrl = pathname.replace(/\/?$/, '/')

  // const isActive = pathname === newUrl

  return (
    <Flex alignItems="center" justifyContent="center" mb="32px">
      <Flex alignItems="center" flexDirection={['column', null, 'row', null]}>
        {/* <StyledButtonMenu activeIndex={pathname === newUrl ? 0 : 1} scale="sm" variant="primary">
          <ButtonMenuItem
            className={isActive ? 'hover_transparent emphasized-selected' : 'hover_transparent'}
            style={{ color: '#05195a', opacity: '0.9', borderRadius: '7px', marginRight: '14px' }}
            as={Link}
            to="/ethereum/farms-v2/"
          >
            {t('Live')}
          </ButtonMenuItem>
          <NotificationDot show={hasStakeInFinishedPools}>
            <ButtonMenuItem
              className={isActive ? 'hover_transparent' : 'hover_transparent emphasized-selected'}
              style={{ color: '#05195a', opacity: '0.9', borderRadius: '7px' }}
              as={Link}
              to="/ethereum/farms-v2/history"
            >
              {t('Finished')}
            </ButtonMenuItem>
          </NotificationDot>
        </StyledButtonMenu> */}
        <Flex mt={['4px', null, 0, null]} ml={[0, null, '24px', null]} justifyContent="center" alignItems="center">
          <ToggleSwitch checked={stakedOnly} onChange={() => setStakedOnly((prev) => !prev)} />
          <Text color="#05195a" ml="8px">
            {t('Staked only')}
          </Text>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default PoolTabButtons
