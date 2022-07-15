import React, { useState, useMemo } from 'react'
import { useTranslation } from 'contexts/Localization'
import { Input } from '@pancakeswap/uikit'
import styled from 'styled-components'
import debounce from 'lodash/debounce'

const StyledInput = styled(Input)`
  border-radius: 0.625rem;
  // margin-left: auto;
  background: #fff;
  padding: 1.5rem 0.75rem;
  color: rgb(5, 72, 156);
`

const InputWrapper = styled.div`
  position: relative;
  width: 77vw;
  // width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  ${({ theme }) => theme.mediaQueries.sm} {
    width: 24rem;
    padding: 0.75rem 0;
  }
`

const Container = styled.div<{ toggled: boolean }>``

interface Props {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const SearchInput: React.FC<Props> = ({ onChange: onChangeCallback }) => {
  const { t } = useTranslation()
  const [toggled, setToggled] = useState(false)
  const [searchText, setSearchText] = useState('')

  const debouncedOnChange = useMemo(
    () => debounce((e: React.ChangeEvent<HTMLInputElement>) => onChangeCallback(e), 500),
    [onChangeCallback],
  )

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value)
    debouncedOnChange(e)
  }

  return (
    <Container toggled={toggled}>
      <InputWrapper>
        <StyledInput
          className="hover_shadow"
          value={searchText}
          onChange={onChange}
          placeholder={t('Search by name, symbol, address')}
          onBlur={() => setToggled(false)}
        />
        <span
          style={{
            right: '0',
            padding: '0.65rem 1.5rem',
            position: 'absolute',
            fontSize: '20px',
            color: '#04bbfb',
            pointerEvents: 'none',
            background: '#fff',
            borderRadius: '0.625rem',
            borderTopLeftRadius: '0',
            borderBottomLeftRadius: '0',
          }}
          className="material-icons"
        >
          search
        </span>
      </InputWrapper>
    </Container>
  )
}

export default SearchInput
