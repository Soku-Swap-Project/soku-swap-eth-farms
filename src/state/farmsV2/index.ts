/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit'
import farmsConfig from 'config/constants/farmsV2'
import isArchivedPid from 'utils/farmHelpers'
import fetchFarms from './fetchFarms'
import {
  fetchFarmUserEarnings,
  fetchFarmUserAllowances,
  fetchFarmUserTokenBalances,
  fetchFarmUserStakedBalances,
} from './fetchFarmUser'
import { FarmV2, FarmsStateV2 } from '../types'

const nonArchivedFarms = farmsConfig.filter(({ pid }) => !isArchivedPid(pid))

const noAccountFarmConfig = farmsConfig.map((farm) => ({
  ...farm,
  userData: {
    allowance: '0',
    tokenBalance: '0',
    stakedBalance: '0',
    earnings: '0',
  },
}))

const initialState: FarmsStateV2 = { data: noAccountFarmConfig, loadArchivedFarmsData: false, userDataLoaded: false }

export const farmsSliceV2 = createSlice({
  name: 'FarmsV2',
  initialState,
  reducers: {
    setFarmsPublicDataV2: (state, action) => {
      const liveFarmsData: FarmV2[] = action.payload
      state.data = state.data.map((farm) => {
        const liveFarmData = liveFarmsData.find((f) => f.pid === farm.pid)
        return { ...farm, ...liveFarmData }
      })
    },
    setFarmUserDataV2: (state, action) => {
      const { arrayOfUserDataObjects } = action.payload
      arrayOfUserDataObjects.forEach((userDataEl) => {
        const { pid } = userDataEl
        const index = state.data.findIndex((farm) => farm.pid === pid)
        state.data[index] = { ...state.data[index], userData: userDataEl }
      })
      state.userDataLoaded = true
    },
    setLoadArchivedFarmsDataV2: (state, action) => {
      const loadArchivedFarmsData = action.payload
      state.loadArchivedFarmsData = loadArchivedFarmsData
    },
  },
})

export const { setFarmsPublicDataV2, setFarmUserDataV2, setLoadArchivedFarmsDataV2 } = farmsSliceV2.actions

export const fetchFarmsPublicDataAsyncV2 = () => async (dispatch, getState) => {
  const fetchArchived = getState().farms.loadArchivedFarmsData
  const farmsToFetch = fetchArchived ? farmsConfig : nonArchivedFarms
  const farms = await fetchFarms(farmsToFetch)
  dispatch(setFarmsPublicDataV2(farms))
}
export const fetchFarmUserDataAsyncV2 = (account: string) => async (dispatch, getState) => {

  const fetchArchived = getState().farms.loadArchivedFarmsData
  const farmsToFetch = fetchArchived ? farmsConfig : nonArchivedFarms
  const userFarmAllowances = await fetchFarmUserAllowances(account, farmsToFetch)
  const userFarmTokenBalances = await fetchFarmUserTokenBalances(account, farmsToFetch)
  const userStakedBalances = await fetchFarmUserStakedBalances(account, farmsToFetch)
  const userFarmEarnings = await fetchFarmUserEarnings(account, farmsToFetch)

  const arrayOfUserDataObjects = userFarmAllowances.map((farmAllowance, index) => {
    return {
      pid: farmsToFetch[index].pid,
      allowance: userFarmAllowances[index],
      tokenBalance: userFarmTokenBalances[index],
      stakedBalance: userStakedBalances[index],
      earnings: userFarmEarnings[index],
    }
  })

  dispatch(setFarmUserDataV2({ arrayOfUserDataObjects }))
}

export default farmsSliceV2.reducer
