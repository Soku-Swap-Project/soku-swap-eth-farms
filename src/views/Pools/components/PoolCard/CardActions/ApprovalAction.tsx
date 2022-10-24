import React, { useState, useCallback } from 'react'
import styled from 'styled-components'
import { Button, AutoRenewIcon, Skeleton } from '@pancakeswap/uikit'
import { useSousApprove } from 'hooks/useApprove'
import { useTranslation } from 'contexts/Localization'
import { useERC20 } from 'hooks/useContract'
import useToast from 'hooks/useToast'
import { getAddress } from 'utils/addressHelpers'
import { Pool } from 'state/types'
import { ToastSuccess, ToastError } from 'style/Toasts'
import { toast } from 'react-toastify'

/* eslint-disable react/require-default-props */
interface ApprovalActionProps {
  pool: Pool
  isLoading?: boolean
  approved: boolean
}

const StyledButton = styled(Button)`
  border-radius: 14px;
  height: 52px;
`

const ApprovalAction: React.FC<ApprovalActionProps> = ({ pool, isLoading = false, approved }) => {
  const { sousId, stakingToken, earningToken } = pool
  const { t } = useTranslation()
  const stakingTokenContract = useERC20(stakingToken.address ? getAddress(stakingToken.address) : '')
  const [requestedApproval, setRequestedApproval] = useState(false)
  const { onApprove } = useSousApprove(stakingTokenContract, sousId)
  const { toastSuccess, toastError } = useToast()

  const handleApprove = useCallback(async () => {
    try {
      setRequestedApproval(true)
      const txHash = await onApprove()
      if (txHash) {
        toast.success(
          ToastSuccess(
            t('Contract Enabled'),
            t('You can now stake in the %symbol% pool!', { symbol: stakingToken.symbol }),
          ),
        )
        setRequestedApproval(false)
      } else {
        // user rejected tx or didn't go thru
        toast.error(
          ToastError(
            t('Error'),
            t('Please try again. Confirm the transaction and make sure you are paying enough gas!'),
          ),
        )
        setRequestedApproval(false)
      }
    } catch (e) {
      console.error(e)
      toast.error(ToastError(t('Error'), 'An error has occured'))
    }
  }, [onApprove, setRequestedApproval, t, stakingToken])

  return (
    <>
      {isLoading ? (
        <Skeleton width="100%" height="52px" />
      ) : (
        <StyledButton
          className="hover_shadow emphasize_swap_button"
          isLoading={requestedApproval}
          endIcon={requestedApproval ? <AutoRenewIcon spin color="currentColor" /> : null}
          disabled={requestedApproval}
          onClick={handleApprove}
          width="100%"
          style={{ background: '#04bbfb', marginTop: '12px' }}
        >
          {t('Enable')}
        </StyledButton>
      )}
    </>
  )
}

export default ApprovalAction
