import axios from 'axios'
import React, { useCallback, useEffect, useState } from 'react'

export const useSutekuPrice = () => {
  const [price, setPrice] = useState<number>()
  const fetchPrice = useCallback(async () => {
    async function getPrice() {
      const res = await axios.get('https://api.coingecko.com/api/v3/coins/suteku')
      const marketData = res.data.market_data
      const currentPrice = marketData.current_price.usd
      return currentPrice
    }
    const sutekuPrice = await getPrice()
    setPrice(sutekuPrice)
  }, [])

  useEffect(() => {
    fetchPrice()
  }, [fetchPrice])

  return price
}

export default useSutekuPrice
