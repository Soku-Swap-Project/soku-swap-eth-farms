import Web3 from 'web3'
import { AbiItem } from 'web3-utils'
import web3NoAccount from 'utils/web3'
import poolsConfig from 'config/constants/pools'
import farmsWithSmartChefConfig from 'config/constants/farmsWithSmartChef'
import { PoolCategory } from 'config/constants/types'

// Addresses
import {
  getAddress,
  getCakeAddress,
  getSutekuAddress,
  getSokuAddress,
  getMasterChefAddress,
  getMasterChefV2Address,
} from 'utils/addressHelpers'

// ABI
import bep20Abi from 'config/abi/erc20.json'
import erc721Abi from 'config/abi/erc721.json'
import lpTokenAbi from 'config/abi/lpToken.json'
import cakeAbi from 'config/abi/cake.json'
import sokuAbi from 'config/abi/soku.json'
import sutekuAbi from 'config/abi/suteku.json'
import ifoV1Abi from 'config/abi/ifoV1.json'
import ifoV2Abi from 'config/abi/ifoV2.json'
import masterChef from 'config/abi/masterchef.json'
import masterChefV2 from 'config/abi/masterchefV2.json'
import sousChef from 'config/abi/sousChef.json'
import sousChefV2 from 'config/abi/sousChefV2.json'
import sousChefV2Farms from 'config/abi/sousChefV2Farms.json'
import sousChefBnb from 'config/abi/sousChefBnb.json'

const getContract = (abi: any, address: string, web3?: Web3) => {
  const _web3 = web3 ?? web3NoAccount
  return new _web3.eth.Contract(abi as unknown as AbiItem, address)
}

export const getBep20Contract = (address: string, web3?: Web3) => {
  return getContract(bep20Abi, address, web3)
}
export const getErc721Contract = (address: string, web3?: Web3) => {
  return getContract(erc721Abi, address, web3)
}
export const getLpContract = (address: string, web3?: Web3) => {
  return getContract(lpTokenAbi, address, web3)
}
export const getIfoV1Contract = (address: string, web3?: Web3) => {
  return getContract(ifoV1Abi, address, web3)
}
export const getIfoV2Contract = (address: string, web3?: Web3) => {
  // console.log('v2 config', config)
  return getContract(ifoV2Abi, address, web3)
}
export const getSouschefContract = (id: number, web3?: Web3) => {
  const config = poolsConfig.find((pool) => pool.sousId === id)
  // const abi = config.poolCategory === PoolCategory.BINANCE ? sousChefBnb : sousChef
  const abi = sousChef
  return getContract(abi, getAddress(config.contractAddress), web3)
}
export const getSouschefV2Contract = (id: number, web3?: Web3) => {
  const config = poolsConfig.find((pool) => pool.sousId === id)
  return getContract(sousChefV2, getAddress(config.contractAddress), web3)
}
// export const getPointCenterIfoContract = (web3?: Web3) => {
//   return getContract(pointCenterIfo, getPointCenterIfoAddress(), web3)
// }
export const getCakeContract = (web3?: Web3) => {
  return getContract(cakeAbi, getCakeAddress(), web3)
}

export const getSokuContract = (web3?: Web3) => {
  return getContract(sokuAbi, getSokuAddress(), web3)
}

export const getSutekuContract = (web3?: Web3) => {
  return getContract(sutekuAbi, getSutekuAddress(), web3)
}

export const getMasterchefContract = (web3?: Web3) => {
  return getContract(masterChef, getMasterChefAddress(), web3)
}
export const getMasterchefV2Contract = (web3?: Web3) => {
  return getContract(masterChefV2, getMasterChefV2Address(), web3)
}

export const getSouschefContractFarms = (id: number, web3?: Web3) => {
  const config = farmsWithSmartChefConfig.find((pool) => pool.sousId === id)
  return getContract(sousChefV2Farms, getAddress(config.contractAddress), web3)
}
