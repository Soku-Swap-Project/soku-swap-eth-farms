import BigNumber from 'bignumber.js'
import { BLOCKS_PER_YEAR, SUTEKU_PER_BLOCK } from 'config'
import { getPoolApr, getFarmApr } from 'utils/apr'
import { BIG_TEN, BIG_ZERO } from 'utils/bigNumber'

describe('getPoolApr', () => {
  it(`returns null when parameters are missing`, () => {
    const apr = getPoolApr(null, null, null, null)
    expect(apr).toBeNull()
  })
  it(`returns null when APR is infinite`, () => {
    const apr = getPoolApr(0, 0, 0, 0)
    expect(apr).toBeNull()
  })
  it(`get the correct pool APR`, () => {
    const apr = getPoolApr(10, 1, 100000, 1)
    const totalRewardPricePerYear = new BigNumber(1).times(1).times(BLOCKS_PER_YEAR)
    const totalStakingTokenInPool = new BigNumber(10).times(100000)
    const aprCalc = totalRewardPricePerYear.div(totalStakingTokenInPool).times(100)
    expect(apr).toEqual(aprCalc.toNumber())
  })
})

describe('getFarmApr', () => {
  it(`returns null when parameters are missing`, () => {
    const apr = getFarmApr(null, null, null)
    expect(apr).toBeNull()
  })
  it(`returns null when APR is infinite`, () => {
    const apr = getFarmApr(BIG_ZERO, BIG_ZERO, BIG_ZERO)
    expect(apr).toBeNull()
  })
  it(`get the correct pool APR`, () => {
    const apr = getFarmApr(BIG_TEN, new BigNumber(1), new BigNumber(100000))
    const yearlyCakeRewardAllocation = SUTEKU_PER_BLOCK.times(BLOCKS_PER_YEAR).times(BIG_TEN)
    const aprCalc = yearlyCakeRewardAllocation.times(new BigNumber(1)).div(new BigNumber(100000)).times(100)
    expect(apr).toEqual(aprCalc)
  })
})
