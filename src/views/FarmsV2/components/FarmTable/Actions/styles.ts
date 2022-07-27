import styled from 'styled-components'

export const ActionContainer = styled.div`
  padding: 16px 20px;
  border-bottom: 1px solid #ebebeb;
  border-top: 1px solid #ebebeb;

  border-radius: 7px;
  flex-grow: 1;
  flex-basis: 0;
  margin-bottom: 16px;
  margin-top: 16px;

  ${({ theme }) => theme.mediaQueries.sm} {
    // margin-left: 12px;
    margin-right: 12px;
    margin-bottom: 0;
    max-height: 100px;
  }

  ${({ theme }) => theme.mediaQueries.xl} {
    // margin-left: 48px;
    margin-right: 0;
    margin-bottom: 0;
    max-height: 100px;
  }
`

export const ActionTitles = styled.div`
  font-weight: 600;
  font-size: 12px;
  margin-bottom: 8px;
`

export const Title = styled.span`
  color: #04bbfb;
`

// TODO: Use `Text` instead
export const Subtle = styled.span`
  color: #05195a;
`

export const ActionContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

export const ActionContentNoAccount = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`

export const Earned = styled.div`
  font-weight: 600;
  font-size: 20px;
  color: #05195a;
`

export const Staked = styled.div`
  font-size: 12px;
  color: #04bbfb;
`
