// import { ChainId } from '@pancakeswap-libs/sdk'

export declare enum ChainId {
  MAINNET = 1,
  TESTNET = 5,
}

const BSCSCAN_PREFIXES: { [chainId in ChainId]: string } = {
  1: '',
  5: 'testnet.',
}

export default function getEtherScanLink(
  chainId: ChainId,
  data: string,
  type: 'transaction' | 'token' | 'address',
): string {
  const prefix = `https://etherscan.io`

  switch (type) {
    case 'transaction': {
      return `${prefix}/tx/${data}`
    }
    case 'token': {
      return `${prefix}/token/${data}`
    }
    case 'address':
    default: {
      return `${prefix}/address/${data}`
    }
  }
}
