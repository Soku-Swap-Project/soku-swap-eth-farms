import { configureStore } from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux'
import farmsReducer from './farms'
import farmsV2Reducer from './farmsV2'
import farmsWithSmartChefReducer from './farmsWithSmartChef'

import poolsReducer from './pools'
import pricesReducer from './prices'
import blockReducer from './block'
import collectiblesReducer from './collectibles'

const store = configureStore({
  devTools: process.env.NODE_ENV !== 'production',
  reducer: {
    block: blockReducer,
    farms: farmsReducer,
    farmsV2: farmsV2Reducer,
    farmsWithSmartChef: farmsWithSmartChefReducer,
    pools: poolsReducer,
    prices: pricesReducer,
    collectibles: collectiblesReducer,
  },
})

/**
 * @see https://redux-toolkit.js.org/usage/usage-with-typescript#getting-the-dispatch-type
 */
export type AppDispatch = typeof store.dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>()

export default store
