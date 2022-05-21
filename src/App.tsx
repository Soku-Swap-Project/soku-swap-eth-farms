import React, { lazy, useEffect } from 'react'
import { ToastContainer } from 'react-toastify'
import { useWeb3React } from '@web3-react/core'
import { Router, Route, Switch } from 'react-router-dom'
import { ResetCSS, useWalletModal } from '@pancakeswap/uikit'
import TelegramIcon from '@mui/icons-material/Telegram'
import TwitterIcon from '@mui/icons-material/Twitter'
import GitHubIcon from '@mui/icons-material/GitHub'
import BigNumber from 'bignumber.js'
import useEagerConnect from 'hooks/useEagerConnect'
import { useFetchPriceList, useFetchPublicData } from 'state/hooks'
import useAuth from 'hooks/useAuth'
import detectEthereumProvider from '@metamask/detect-provider'
import GlobalStyle from './style/Global'
import Menu from './components/Menu'
import SuspenseWithChunkError from './components/SuspenseWithChunkError'
import ToastListener from './components/ToastListener'
import PageLoader from './components/PageLoader'
import EasterEgg from './components/EasterEgg'
import Pools from './views/Pools'
import history from './routerHistory'
import AccountModal from './components/AccountModal'
import ClaimSokuModal from './components/ClaimSokuModal'
import SlideOutMenu from './components/SlideOutMenu/SlideOutMenu'
import ComingSoon from './views/ComingSoon'
import NewVersionModal from "./components/NewVersionModal"

import 'bootstrap/dist/css/bootstrap.min.css'

import './MobileFooter.css'

// Route-based code splitting
// Only pool is included in the main bundle because of it's the most visited page
const Farms = lazy(() => import('./views/Farms'))
const FarmsV2 = lazy(() => import('./views/FarmsV2'))
const NotFound = lazy(() => import('./views/NotFound'))

interface Error {
  code?: any
}

// This config is required for number formatting
BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
})

const loadNetwork = async () => {
  const detectProvider = (await detectEthereumProvider()) as any
  const provider = window.ethereum as any
  try {
    await detectProvider.request({
      method: 'wallet_switchEthereumChain',
      params: [
        {
          chainId: '0x1',
        },
      ],
    })
  } catch (error) {
    /* eslint-disable dot-notation */
    if (error['code'] === 4902 || error['data']['originalError'].code === 4902) {
      await detectProvider.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: '0x1',
            chainName: 'Ethereum Network',
            rpcUrls: ['https://mainnet.infura.io/v3/'],
            nativeCurrency: {
              name: 'ETH',
              symbol: 'ETH',
              decimals: 18,
            },
            blockExplorerUrls: ['https://etherscan.io'],
          },
        ],
      })
    }
  }
}

const App: React.FC = () => {
  useEagerConnect()
  useFetchPublicData()
  // useFetchProfile()
  useFetchPriceList()

  useEffect(() => {
    loadNetwork()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const { account } = useWeb3React()
  const { login, logout } = useAuth()

  const { onPresentConnectModal } = useWalletModal(login, logout)

  const openHiddenLinks = () => {
    const hiddenLinks = document.getElementsByClassName('hidden_navLinksMobile')
    if (hiddenLinks[0]?.id === 'hidden_navLinks') {
      hiddenLinks[0].id = 'open'
    } else if (hiddenLinks[0]?.id === 'open') {
      hiddenLinks[0].id = 'hidden_navLinks'
    }
  }

  const isMobile = window.innerWidth <= 500

  return (
    <Router history={history}>
      <ResetCSS />
      <GlobalStyle />
      {isMobile ? <SlideOutMenu /> : <Menu />}
      {/* <Menu /> */}
      <SuspenseWithChunkError fallback={<PageLoader />}>
        <Switch>
          {/* <Route exact path="/bsc/farms">
            <Farms />
          </Route> */}
          <Route exact path="/ethereum/farms">
            <FarmsV2 />
          </Route>
          {/* <Route path="/eth/staking/">
            <Pools />
          </Route> */}
          {/* <Route path="/eth/bridge">
            <ComingSoon />
          </Route> */}
          <Route component={NotFound} />
        </Switch>
        <div className="connectWallet__options__MOBILE">
          <ul>
            {account ? (
              <li className="account__footer">
                <AccountModal />
              </li>
            ) : (
              <li className="connectWallet">
                <button type="button" onClick={onPresentConnectModal}>
                  Connect Wallet
                </button>
              </li>
            )}
            <li className="claimSoku">
              <ClaimSokuModal />
            </li>
            <li>
              <button type="submit" className="material-icons" onClick={openHiddenLinks}>
                more_horiz
              </button>
            </li>
          </ul>
          <ul className="hidden_navLinksMobile" id="hidden_navLinks">
            <li>
              <a href="/" rel="noreferrer noopener" target="_blank">
                <span className="material-icons">analytics</span>
                <p>Analytics</p>
              </a>
            </li>
            <li>
              <a href="https://sokuswap-2.gitbook.io/sokuswap-gitbook/" rel="noreferrer noopener" target="_blank">
                <span className="material-icons">school</span>
                <p>Docs</p>
              </a>
            </li>
            <li>
              <a href="https://github.com/Soku-Swap-Project" rel="noreferrer noopener" target="_blank">
                <GitHubIcon />
                <p>GitHub</p>
              </a>
            </li>
            <div
              className="social_icon_headerMobile"
              style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: '18px' }}
            >
              <p style={{ fontSize: '14px', marginLeft: '-5px' }}>Social Links</p>
            </div>
            <hr style={{ width: '65%', marginTop: '10px', paddingTop: '0' }} className="disabled_link" />

            <li>
              <a href="https://t.me/SokuSwap" rel="noreferrer noopener" target="_blank">
                <TelegramIcon />
                <p>Telegram</p>
              </a>
            </li>
            <li>
              <a href="https://twitter.com/sokuswap" rel="noreferrer noopener" target="_blank">
                <TwitterIcon />
                <p>Twitter</p>
              </a>
            </li>
          </ul>
        </div>
        <NewVersionModal />
      </SuspenseWithChunkError>
      <EasterEgg iterations={2} />
      <ToastContainer />
      <ToastListener />
    </Router>
  )
}

export default React.memo(App)
