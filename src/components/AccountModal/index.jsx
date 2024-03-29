/* eslint-disable */
import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import CloseIcon from '@mui/icons-material/Close'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import LogoutIcon from '@mui/icons-material/Logout'
import { useWeb3React } from '@web3-react/core'

import Modal from '@material-ui/core/Modal'
import getBscScanLink from '../../utils'

import './AccountModal.css'

/* eslint-disable */

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[10],
    padding: theme.spacing(2, 4, 3),
  },
}))

export default function AccountModal() {
  const classes = useStyles()
  const [open, setOpen] = React.useState(false)
  const { account, chainId, deactivate, connector } = useWeb3React()

  const truncatedFirstHalf = account?.substring(0, 5)
  const truncatedLastHalf = account?.substring(account.length - 5, account.length)
  const truncatedAddress = `${truncatedFirstHalf}...${truncatedLastHalf}`

  const isMobile = window.innerWidth <= 1200

  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const body = (
    <div className="flex flex-col gap-6 network_modal">
      <div className="modal_header">
        <h1 className="text-blue font-bold" style={{ fontWeight: 700 }}>
          Account Details
        </h1>
        <CloseIcon
          className="hover_shadow_icon"
          style={{ color: '#05195a', cursor: 'pointer' }}
          onClick={handleClose}
        />
      </div>
      <hr />
      <div className="account__modal_details">
        <div className="wallet_info">
          <p style={{ fontSize: '16px', fontWeight: 'bold' }}>Wallet: {truncatedAddress}</p>
          <img
            className="nav_logo"
            alt="Logo"
            src="https://bscscan.com/token/images/sokuv2_32.png"
            style={{ height: '20px', marginLeft: '5px' }}
          />
        </div>

        <a
          target="_blank"
          className="view_on_scan hover_shadow"
          style={{
            color: 'rgb(255, 255, 255)',
            background: 'rgb(5, 25, 90)',
            padding: ' 12px 24px',
            borderRadius: '7px',
            fontSize: '14px',
          }}
          href={getBscScanLink(chainId, account, 'address')}
        >
          <h2 style={{ paddingRight: '8px' }}>View on Explorer</h2>
          <OpenInNewIcon />
        </a>
        {((isMobile && connector?.constructor?.name !== 'InjectedConnector' && connector?.constructor?.name !== 't') ||
          !isMobile) && (
          <button
            style={{
              color: 'rgb(255, 255, 255)',
              background: 'rgb(5, 25, 90)',
              padding: ' 9px 18px',
              borderRadius: '7px',
              fontSize: '14px',
            }}
            className="account_logout view_on_scan hover_shadow"
            onClick={deactivate}
          >
            <h2 style={{ paddingRight: '8px' }}>Sign Out</h2>
            <LogoutIcon />
          </button>
        )}
      </div>
    </div>
  )

  return (
    <>
      <li
        type="button"
        className={isMobile ? 'account_modal_mobile' : 'account_modal' + ' hover_transparent p-3'}
        style={{ padding: '14px' }}
        onClick={handleOpen}
      >
        <span>Account:</span>
        {truncatedAddress}
      </li>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        className="network_modal_container"
        role="none"
      >
        {body}
      </Modal>
    </>
  )
}
