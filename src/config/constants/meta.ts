import { ContextApi } from 'contexts/Localization/types'
import { PageMeta } from './types'

export const DEFAULT_META: PageMeta = {
  title: 'SokuSwap',
}

export const getCustomMeta = (path: string, t: ContextApi['t']): PageMeta => {
  switch (path) {
    case '/farms':
      return {
        title: `${t('SokuSwap')} | ${t('BSC')} | Farms`,
      }

    case '/staking':
      return {
        title: `${t('SokuSwap')} | ${t('BSC')} | Pools`,
      }
    // case '/competition':
    //   return {
    //     title: `${t('Trading Battle')} | ${t('PancakeSwap')}`,
    //   }
    // case '/prediction':
    //   return {
    //     title: `${t('Prediction')} | ${t('PancakeSwap')}`,
    //   }
    // case '/farms':
    //   return {
    //     title: `${t('Farms')} | ${t('PancakeSwap')}`,
    //   }
    // case '/pools':
    //   return {
    //     title: `${t('Pools')} | ${t('PancakeSwap')}`,
    //   }
    // case '/lottery':
    //   return {
    //     title: `${t('Lottery')} | ${t('PancakeSwap')}`,
    //   }
    // case '/collectibles':
    //   return {
    //     title: `${t('Collectibles')} | ${t('PancakeSwap')}`,
    //   }
    // case '/ifo':
    //   return {
    //     title: `${t('Initial Farm Offering')} | ${t('PancakeSwap')}`,
    //   }
    // case '/teams':
    //   return {
    //     title: `${t('Leaderboard')} | ${t('PancakeSwap')}`,
    //   }
    // case '/profile/tasks':
    //   return {
    //     title: `${t('Task Center')} | ${t('PancakeSwap')}`,
    //   }
    // case '/profile':
    //   return {
    //     title: `${t('Your Profile')} | ${t('PancakeSwap')}`,
    //   }
    default:
      return null
  }
}
