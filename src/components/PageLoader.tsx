/* eslint-disable */
import React from 'react'
import styled from 'styled-components'
import { Spin } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import Page from './layout/Page'

const Wrapper = styled(Page)`
  display: flex;
  justify-content: center;
  align-items: center;
`

const antIcon = <LoadingOutlined style={{ fontSize: 50, color: '#04bbfb' }} spin />

const PageLoader: React.FC = () => {
  return (
    <Wrapper>
      <Spin indicator={antIcon} />{' '}
    </Wrapper>
  )
}

export default PageLoader
