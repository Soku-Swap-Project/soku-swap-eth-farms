/* eslint-disable */
import React from 'react'
import { Menu as UikitMenu, useWalletModal } from '@pancakeswap/uikit'
import { NavLink } from 'react-router-dom'
import TelegramIcon from '@mui/icons-material/Telegram'
import TwitterIcon from '@mui/icons-material/Twitter'
import GitHubIcon from '@mui/icons-material/GitHub'
import { useWeb3React } from '@web3-react/core'
import { languageList } from 'config/localization/languages'
import { useTranslation } from 'contexts/Localization'
import useTheme from 'hooks/useTheme'
import useAuth from 'hooks/useAuth'
import useTransak from 'hooks/useTransak'
import { usePriceCakeBusd, useProfile } from 'state/hooks'
import config from './config'
import ClaimSokuModal from 'components/ClaimSokuModal'
import AccountModal from 'components/AccountModal'

import './Menu.css'

const Menu = (props) => {
  const { account } = useWeb3React()
  const { login, logout } = useAuth()
  const { launchTransak } = useTransak()

  const { currentLanguage, setLanguage, t } = useTranslation()

  const { onPresentConnectModal } = useWalletModal(login, logout)

  const truncatedFirstHalf = account?.substring(0, 5)
  const truncatedLastHalf = account?.substring(account.length - 5, account.length)
  const truncatedAddress = `${truncatedFirstHalf}...${truncatedLastHalf}`

  const openHiddenLinks = () => {
    const hiddenLinks = document.getElementsByClassName('hidden_navLinks')
    // console.log(hiddenLinks)
    if (hiddenLinks[0]?.id === 'hidden_navLinks') {
      hiddenLinks[0].id = 'open'
    } else if (hiddenLinks[0]?.id === 'open') {
      hiddenLinks[0].id = 'hidden_navLinks'
    }
  }

  const isMobile = window.innerWidth <= 500

  return (
    <>
      <div className="sokuswap__navbar">
        <nav>
          <ul className="navbar__items">
            <a className="nav_link" href="/bsc/#/swap">
              <img className="nav_logo" style={{ height: '50px' }} alt="Logo" src="images/Web-Corner-Logo.png" />
            </a>
            <div className="navbar__options">
              <a className="nav_link" href="/bsc/#/swap">
                <li>Swap</li>
              </a>
              {isMobile ? (
                <a className="nav_link" href="/bsc/#/limit-order">
                  <li>Limit</li>
                </a>
              ) : (
                <a className="nav_link" href="/bsc/#/limit-order">
                  <li>Limit Orders</li>
                </a>
              )}
              <a className="nav_link" href="/bsc/#/pool">
                <li>Pool</li>
              </a>
              <NavLink className="nav_link" activeClassName="active" to="/eth/bridge">
                <li>Bridge</li>
              </NavLink>
              <NavLink className="nav_link" activeClassName="active" to="/eth/farms">
                <li>Farms</li>
              </NavLink>
              <NavLink className="nav_link" activeClassName="active" to="/eth/staking/">
                <li>Staking</li>
              </NavLink>
              {/* <a className="nav_link" href="/bsc/#/deposit">
                <li>Deposit</li>
              </a> */}
              <a className="nav_link" onClick={() => launchTransak()}>
                <li>Deposit</li>
              </a>
            </div>
          </ul>
          <ul className="connectWallet__options__DESKTOP">
            {account ? (
              <AccountModal />
            ) : (
              <li className="connectWallet__nav">
                <button type="button" onClick={onPresentConnectModal}>
                  Connect Wallet
                </button>
              </li>
            )}

            <li className="claimSoku__nav">
              <ClaimSokuModal />
            </li>
            <li>
              <button type="button" className="material-icons" onClick={openHiddenLinks}>
                more_horiz
              </button>
            </li>
          </ul>
          <ul className="hidden_navLinks" id="hidden_navLinks">
            <li>
              <a href="/" rel="noreferrer noopener" className="disabled_link" target="_blank">
                <span className="material-icons">analytics</span>
                <p>Analytics</p>
              </a>
            </li>

            <li className="hidden_navLink">
              <a href="https://sokuswap-2.gitbook.io/sokuswap-gitbook/" rel="noreferrer noopener" target="_blank">
                <span className="material-icons">school</span>
                <p>Docs</p>
              </a>
            </li>
            <li className="hidden_navLink">
              <a href="https://github.com/Soku-Swap-Project" rel="noreferrer noopener" target="_blank">
                <GitHubIcon />
                <p>GitHub</p>
              </a>
            </li>
            <div
              className="social_icon_header"
              style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: '18px' }}
            >
              <p style={{ fontSize: '14px', marginLeft: '-5px' }} className="hidden_navLink">
                Social Links
              </p>
            </div>
            <hr style={{ width: '65%', marginTop: '10px', paddingTop: '0' }} className="disabled_link" />

            <li className="hidden_navLink" style={{ paddingTop: '16px' }}>
              <a href="https://t.me/SokuSwap" rel="noreferrer noopener" target="_blank">
                <TelegramIcon />
                <p>Telegram</p>
              </a>
            </li>
            <li className="hidden_navLink">
              <a href="https://twitter.com/sokuswap" rel="noreferrer noopener" target="_blank">
                <TwitterIcon />
                <p>Twitter</p>
              </a>
            </li>
          </ul>
        </nav>
      </div>

      {/* <UikitMenu
        account={null}
        login={null}
        logout={null}
        isDark={null}
        toggleTheme={null}
        currentLang={currentLanguage.code}
        langs={languageList}
        setLang={setLanguage}
        cakePriceUsd={cakePriceUsd.toNumber()}
        links={}
        profile={{
          username: profile?.username,
          image: profile?.nft ? `/images/nfts/${profile.nft?.images.sm}` : undefined,
          profileLink: '/profile',
          noProfileLink: '/profile',
          showPip: !profile?.username,
        }}
        {...props}
      /> */}
    </>
  )
}

export default Menu
