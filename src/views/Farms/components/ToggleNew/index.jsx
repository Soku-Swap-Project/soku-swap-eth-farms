import React from 'react'
import styled from 'styled-components'
import { useRouteMatch, Link } from 'react-router-dom'
import { ButtonMenu, ButtonMenuItem } from '@pancakeswap/uikit'

/* eslint-disable */

const ToggleNew = () => {
  const { isExact } = useRouteMatch()

  return (
    <Wrapper>
      <ButtonMenu activeIndex={isExact ? 0 : 1} scale="sm" variant="primary">
        <ButtonMenuItem style={{ color: '#05195a' }} as={Link} to={`${'/bsc/farms'}`}>
          Farm V1
        </ButtonMenuItem>
        <ButtonMenuItem style={{ color: '#05195a' }} as={Link} to={`/bsc/farms/v2`}>
          Farm V2
        </ButtonMenuItem>
      </ButtonMenu>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 12px;
`

export default ToggleNew
