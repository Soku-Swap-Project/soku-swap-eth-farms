import { InjectedConnector } from '@web3-react/injected-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { BscConnector } from '@binance-chain/bsc-connector'
import { ConnectorNames } from '@pancakeswap/uikit'
import Web3 from 'web3'
import getNodeUrl from './getRpcUrl'

// const POLLING_INTERVAL = 12000
// Mainnet
const rpcUrl = getNodeUrl()
const ethMain = '1'
const chainId = parseInt(ethMain, 10)

// Testnet
// const chainId = 97
// const rpcUrl = 'https://data-seed-prebsc-1-s1.binance.org:8545/'

// console.log(rpcUrl)
// console.log(chainId)

const injected = new InjectedConnector({ supportedChainIds: [chainId] })

const walletconnect = new WalletConnectConnector({
  rpc: { [chainId]: rpcUrl },
  bridge: 'https://pancakeswap.bridge.walletconnect.org/',
  qrcode: true,
  // pollingInterval: POLLING_INTERVAL,
})

const bscConnector = new BscConnector({ supportedChainIds: [chainId] })

export const connectorsByName: { [connectorName in ConnectorNames]: any } = {
  [ConnectorNames.Injected]: injected,
  [ConnectorNames.WalletConnect]: walletconnect,
  [ConnectorNames.BSC]: bscConnector,
}

export const getLibrary = (provider): Web3 => {
  return provider
}
