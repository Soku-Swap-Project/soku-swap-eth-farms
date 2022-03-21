/* eslint-disable */
// @ts-nocheck
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { PriceApiResponse, PriceApiThunk, PriceState } from 'state/types'
import BigNumber from 'bignumber.js'
import { useTokenPrice } from '../hooks'
import axios from 'axios'

const initialState: PriceState = {
  isLoading: false,
  lastUpdated: null,
  data: null,
}

const CoinGecko = require('coingecko-api')

//2. Initiate the CoinGecko API Client
const CoinGeckoClient = new CoinGecko()

let suteku_price
let soku_price
let yummy_price
let hodl_price

//3. Make calls
const getSUKTEUPrice = async () => {
  try {
    const { data } = await axios.get(
      `https://api.pancakeswap.info/api/v2/tokens/0x198800aF50914004A9E9D19cA18C0b24587a50cf`,
    )
    suteku_price = data.data.price
  } catch (error) {}
}

const getYummyPrice = async () => {
  try {
    const { data } = await axios.get(
      `https://api.pancakeswap.info/api/v2/tokens/0xB003C68917BaB76812797d1b8056822f48E2e4fe`,
    )
    yummy_price = data.data.price
  } catch (error) {}
}

const getHODLPrice = async () => {
  try {
    const { data } = await axios.get(
      `https://api.pancakeswap.info/api/v2/tokens/0x0e9766df73973abcfedde700497c57110ee5c301`,
    )
    hodl_price = data.data.price
  } catch (error) {}
}

const getSokuPrice = async () => {
  try {
    const { data } = await axios.get(
      `https://api.pancakeswap.info/api/v2/tokens/0x0e4b5ea0259eb3d66e6fcb7cc8785817f8490a53`,
    )

    // console.log(data, 'data')
    soku_price = data.data.price
  } catch (error) {}
}

getSUKTEUPrice()
getYummyPrice()
getSokuPrice()
getHODLPrice()

export const bnbPrice = () => {
  const price = useTokenPrice('binance-coin')
  return price
}

export const sokuPrice = () => {
  const price = useTokenPrice('sokuswap')
  return price
}

export const getPrices = async () => {
  const res = await CoinGeckoClient.coins.markets({ ids: ['bitcoin', 'sokuswap', 'binancecoin', 'tether'] })
  const resArray = JSON.stringify(res.data)
  // console.log('test', resArray)
}

// Thunks
export const fetchPrices = createAsyncThunk<PriceApiThunk>('prices/fetch', async () => {
  const response = await fetch('https://api.pancakeswap.info/api/v2/tokens')
  const data = (await response.json()) as PriceApiResponse

  const suteku = {
    '0x198800aF50914004A9E9D19cA18C0b24587a50cf': {
      name: 'SUTEKU Soku Rewards Token',
      symbol: 'SUTEKU',
      price: suteku_price || 0,
      price_BNB: suteku_price || 0,
    },
  }

  const soku = {
    '0x0e4b5ea0259eb3d66e6fcb7cc8785817f8490a53': {
      name: 'Soku',
      symbol: 'SOKU',
      price: soku_price || 0,
      price_BNB: soku_price || 0,
    },
  }

  const yummy = {
    '0xB003C68917BaB76812797d1b8056822f48E2e4fe': {
      name: 'YUMMY',
      symbol: 'YUMMY',
      price: yummy_price || 0,
      price_BNB: yummy_price || 0,
    },
  }
  const hodl = {
    '0x0e9766df73973abcfedde700497c57110ee5c301': {
      name: 'HODL',
      symbol: 'HODL',
      price: hodl_price || 0,
      price_BNB: hodl_price || 0,
    },
  }

  Object.assign(data.data, suteku)
  Object.assign(data.data, soku)
  Object.assign(data.data, yummy)
  Object.assign(data.data, hodl)

  // console.log(data.data)

  // Return normalized token names
  return {
    updated_at: data.updated_at,
    data: Object.keys(data.data).reduce((accum, token) => {
      // console.log(token, 'token')
      return {
        ...accum,
        [token.toLowerCase()]: parseFloat(data.data[token].price),
      }
    }, {}),
  }
})

export const pricesSlice = createSlice({
  name: 'prices',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchPrices.pending, (state) => {
      state.isLoading = true
    })
    builder.addCase(fetchPrices.fulfilled, (state, action: PayloadAction<PriceApiThunk>) => {
      state.isLoading = false
      state.lastUpdated = action.payload.updated_at
      state.data = action.payload.data
    })
  },
})

export default pricesSlice.reducer
