import React from 'react'
import styled from 'styled-components'
import { Box } from '@pancakeswap/uikit'
import Container from '../layout/Container'

const Outer = styled(Box)<{ background?: string }>`
  background: transparent;
`

const Inner = styled(Container)`
  // padding-top: 32px;
  // padding-bottom: 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

/* eslint-disable react/require-default-props */

const PageHeader: React.FC<{ background?: string }> = ({ background, children, ...props }) => (
  <Outer background={background} {...props}>
    <Inner>{children}</Inner>
  </Outer>
)

export default PageHeader
