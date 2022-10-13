import React from 'react'
import styled from 'styled-components'
import { useRouteMatch, Link } from 'react-router-dom'
import { ButtonMenu, ButtonMenuItem } from '@pancakeswap/uikit'

/* eslint-disable */

const ToggleNew = () => {
  const { isExact } = useRouteMatch()

  return (
    <Wrapper>
      <ButtonMenu
        style={{ background: 'transparent', borderRadius: '7px', border: 'none' }}
        activeIndex={isExact ? 1 : 0}
        scale="sm"
        variant="primary"
      >
        <ButtonMenuItem style={{ color: '#05195a', borderRadius: '7px' }} as={Link} to={`${'/ethereum/farms'}`}>
          Farm V1
        </ButtonMenuItem>
        <ButtonMenuItem
          className="hover_transparent emphasized-selected"
          style={{ color: '#05195a', borderRadius: '7px' }}
          as={Link}
          to={`/ethereum/farms-v2/`}
        >
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
  padding-bottom: 20px;
`

export default ToggleNew
