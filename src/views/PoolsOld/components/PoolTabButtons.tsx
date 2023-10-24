import React from 'react'
// import styled from 'styled-components'
import { Link } from 'react-router-dom'
import {
  ButtonMenu,
  ButtonMenuItem,
  // Button,
  // HelpIcon,
  // Toggle,
  Text,
  Flex,
  NotificationDot,
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

const PoolTabButtons = ({ stakedOnly, setStakedOnly, hasStakeInFinishedPools }) => {
  // const { url, isExact } = useRouteMatch()
  const { t } = useTranslation()

  const pathname = window.location.pathname
  const newUrl = pathname.replace(/\/?$/, '/')

  // console.log(pathname)

  // console.log(newUrl === pathname)

  return (
    <Flex alignItems="center" justifyContent="center" mb="32px">
      <Flex alignItems="center" flexDirection={['column', null, 'row', null]}>
        <ButtonMenu activeIndex={pathname === newUrl ? 0 : 1} scale="sm" variant="primary">
          <ButtonMenuItem style={{ color: '#05195a', opacity: '0.9' }} as={Link} to="/bsc/staking/">
            {t('Live')}
          </ButtonMenuItem>
          <NotificationDot show={hasStakeInFinishedPools}>
            <ButtonMenuItem style={{ color: '#05195a', opacity: '0.9' }} as={Link} to="/bsc/staking/history">
              {t('Finished')}
            </ButtonMenuItem>
          </NotificationDot>
        </ButtonMenu>
        <Flex mt={['4px', null, 0, null]} ml={[0, null, '24px', null]} justifyContent="center" alignItems="center">
          <ToggleSwitch checked={stakedOnly} onChange={() => setStakedOnly((prev) => !prev)} />
          <Text color="white" ml="8px">
            {t('Staked only')}
          </Text>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default PoolTabButtons
