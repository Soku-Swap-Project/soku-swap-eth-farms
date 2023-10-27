import React from 'react'
import styled from 'styled-components'
import { Button } from '@pancakeswap/uikit'

interface PercentageButtonProps {
  onClick: () => void
}

const StyledButton = styled(Button)`
  flex-grow: 1;
  background: #04bbfb;
  color: #fff;
`

const PercentageButton: React.FC<PercentageButtonProps> = ({ children, onClick }) => {
  return (
    <StyledButton
      className="hover_shadow emphasize_swap_button"
      scale="xs"
      mx="2px"
      p="4px 16px"
      variant="tertiary"
      onClick={onClick}
    >
      {children}
    </StyledButton>
  )
}

export default PercentageButton
