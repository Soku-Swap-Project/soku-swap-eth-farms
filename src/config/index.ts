import BigNumber from 'bignumber.js/bignumber'
import { BIG_TEN } from 'utils/bigNumber'

BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
})

export const ETH_BLOCK_TIME = 13

export const SOKU_PER_BLOCK = new BigNumber(0.03)
export const SUTEKU_PER_BLOCK = new BigNumber(15)

export const BLOCKS_PER_YEAR = new BigNumber((60 / ETH_BLOCK_TIME) * 60 * 24 * 365) // 10512000
export const BASE_URL = 'https://sokuswap.finance'
export const BASE_EXCHANGE_URL = 'https://app.sokuswap.finance'
export const BASE_ADD_LIQUIDITY_URL = `${BASE_EXCHANGE_URL}/#/add`
export const BASE_LIQUIDITY_POOL_URL = `${BASE_EXCHANGE_URL}/#/pool`
export const BASE_ETHER_SCAN_URL = 'https://etherscan.com'
export const LOTTERY_MAX_NUMBER_OF_TICKETS = 50
export const LOTTERY_TICKET_PRICE = 1
export const DEFAULT_TOKEN_DECIMAL = BIG_TEN.pow(18)
export const DEFAULT_GAS = 200000
