import React from 'react'
import styled from 'styled-components'
import { Text, Button, Input, InputProps, Flex, Link } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'

/* eslint-disable react/no-unused-prop-types */
/* eslint-disable react/require-default-props */

interface ModalInputProps {
  max: string
  symbol: string
  onSelectMax?: () => void
  onChange: (e: React.FormEvent<HTMLInputElement>) => void
  placeholder?: string
  value: string
  addLiquidityUrl?: string
  inputTitle?: string
}

const getBoxShadow = ({ isWarning = false, theme }) => {
  if (isWarning) {
    return theme.shadows.warning
  }

  return theme.shadows.inset
}

const StyledTokenInput = styled.div<InputProps>`
  display: flex;
  border: 1px solid #ebebeb;
  flex-direction: column;
  background-color: #fff;
  border-radius: 16px;
  box-shadow: ${getBoxShadow};
  color: ${({ theme }) => theme.colors.text};
  padding: 8px 16px 8px 0;
  width: 100%;
`

const StyledInput = styled(Input)`
  box-shadow: none;
  width: 60px;
  margin: 0 8px;
  padding: 0 8px;
  background: #d8d8d8;
  ${({ theme }) => theme.mediaQueries.xs} {
    width: 80px;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    width: auto;
  }
`

const StyledErrorMessage = styled(Text)`
  position: absolute;
  bottom: -22px;
  a {
    display: inline;
  }
`

const ModalInput: React.FC<ModalInputProps> = ({
  max,
  symbol,
  onChange,
  onSelectMax,
  value,
  addLiquidityUrl,
  inputTitle,
}) => {
  const { t } = useTranslation()
  const isBalanceZero = max === '0' || !max

  const displayBalance = (balance: string) => {
    if (isBalanceZero) {
      return '0'
    }
    const balanceNumber = Number(balance)
    if (balanceNumber > 0 && balanceNumber < 0.0001) {
      return balanceNumber.toLocaleString(undefined, { maximumFractionDigits: 20 })
    }
    return balanceNumber.toLocaleString()
  }

  return (
    <div style={{ position: 'relative', background: '#ecf1f8' }}>
      <StyledTokenInput className="hover_shadow" isWarning={isBalanceZero}>
        <Flex justifyContent="space-between" pl="16px">
          <Text fontSize="14px">{inputTitle}</Text>
          <Text fontSize="14px">{t('Balance: %balance%', { balance: displayBalance(max) })}</Text>
        </Flex>
        <Flex alignItems="flex-end" justifyContent="space-around">
          <StyledInput
            className="hover_shadow"
            pattern="^[0-9]*[.,]?[0-9]*$"
            inputMode="decimal"
            step="any"
            min="0"
            onChange={onChange}
            placeholder="0"
            value={value}
          />
          <Button
            className="hover_shadow emphasize_swap_button"
            style={{ background: '#04bbfb' }}
            scale="sm"
            onClick={onSelectMax}
            mr="8px"
          >
            {t('Max')}
          </Button>
          <Text fontSize="16px">{symbol}</Text>
        </Flex>
      </StyledTokenInput>
      {isBalanceZero && (
        <StyledErrorMessage fontSize="14px" color="failure">
          {t('No tokens to stake')}:{' '}
          <Link fontSize="14px" bold={false} href={addLiquidityUrl} external color="failure">
            {t('Get %symbol%', { symbol })}
          </Link>
        </StyledErrorMessage>
      )}
    </div>
  )
}

export default ModalInput
