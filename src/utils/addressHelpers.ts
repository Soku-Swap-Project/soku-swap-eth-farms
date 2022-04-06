import addresses from 'config/constants/contracts'
import tokens from 'config/constants/tokens'
import { Address } from 'config/constants/types'

export const getAddress = (address: Address): string => {
  const mainNetChainId = 1
  const chainId = process.env.NEXT_PUBLIC_CHAIN_ID
  return address[chainId] ? address[chainId] : address[mainNetChainId]
}

export const getCakeAddress = () => {
  return getAddress(tokens.cake.address)
}

export const getSutekuAddress = () => {
  return getAddress(tokens.suteku.address)
}

export const getSokuAddress = () => {
  return getAddress(tokens.soku.address)
}

export const getMasterChefAddress = () => {
  return getAddress(addresses.masterChef)
}
export const getMasterChefV2Address = () => {
  return getAddress(addresses.masterChefV2)
}
export const getMulticallAddress = () => {
  return getAddress(addresses.multiCall)
}
export const getWbnbAddress = () => {
  return getAddress(tokens.wbnb.address)
}
// export const getLotteryAddress = () => {
//   return getAddress(addresses.lottery)
// }
// export const getLotteryTicketAddress = () => {
//   return getAddress(addresses.lotteryNFT)
// }
// export const getPancakeProfileAddress = () => {
//   return getAddress(addresses.pancakeProfile)
// }
// export const getPancakeRabbitsAddress = () => {
//   return getAddress(addresses.pancakeRabbits)
// }
// export const getBunnyFactoryAddress = () => {
//   return getAddress(addresses.bunnyFactory)
// }
// export const getClaimRefundAddress = () => {
//   return getAddress(addresses.claimRefund)
// }
// export const getPointCenterIfoAddress = () => {
//   return getAddress(addresses.pointCenterIfo)
// }
// export const getBunnySpecialAddress = () => {
//   return getAddress(addresses.bunnySpecial)
// }
// export const getTradingCompetitionAddress = () => {
//   return getAddress(addresses.tradingCompetition)
// }
// export const getEasterNftAddress = () => {
//   return getAddress(addresses.easterNft)
// }
// export const getCakeVaultAddress = () => {
//   return getAddress(addresses.cakeVault)
// }
// export const getPredictionsAddress = () => {
//   return getAddress(addresses.predictions)
// }
// export const getChainlinkOracleAddress = () => {
//   return getAddress(addresses.chainlinkOracle)
// }
