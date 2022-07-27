import React, { useState, useEffect } from 'react'
// import styled from 'styled-components'
// import { Box, CardBody, Flex, Text, useMatchBreakpoints } from '@pancakeswap/uikit'
// import { useTranslation } from 'contexts/Localization'
// import { useWeb3React } from '@web3-react/core'
// import UnlockButton from 'components/UnlockButton'
// import { useCakeVault } from 'state/hooks'
// import { Pool } from 'state/types'
// import { getWeb3NoAccount } from 'utils/web3'
// import { getAddress } from 'utils/addressHelpers'
// import { AbiItem } from 'web3-utils'
// import AprRow from '../PoolCard/AprRow'
// import { StyledCard, StyledCardInner } from '../PoolCard/StyledCard'
// import CardFooter from '../PoolCard/CardFooter'
// import StyledCardHeader from '../PoolCard/StyledCardHeader'
// import VaultCardActions from './VaultCardActions'
// import UnstakingFeeCountdownRow from './UnstakingFeeCountdownRow'
// import RecentCakeProfitRow from './RecentCakeProfitRow'

// const StyledCardBody = styled(CardBody)<{ isLoading: boolean }>`
//   min-height: ${({ isLoading }) => (isLoading ? '0' : '254px')};
// `

// interface CakeVaultProps {
//   pool: Pool
//   showStakedOnly: boolean
// }

// const CakeVaultCard: React.FC<CakeVaultProps> = ({ pool, showStakedOnly }) => {
//   // console.log('pool', pool)
//   const [loading, setLoading] = useState(false)
//   const [userDetails, setUserDetails] = useState()
//   const web3 = getWeb3NoAccount()
//   const { t } = useTranslation()
//   const { isXl } = useMatchBreakpoints()
//   const { account } = useWeb3React()
//   const {
//     userData: { userShares, isLoading: isVaultUserDataLoading },
//     fees: { performanceFee },
//   } = useCakeVault()

//   //   Estimate & manual for now. 288 = once every 5 mins. We can change once we have a better sense of this
//   const timesCompoundedDaily = 288
//   const accountHasSharesStaked = userShares && userShares.gt(0)
//   // console.log(pool, 'pool')
//   const isLoading = !pool.userData || isVaultUserDataLoading
//   const isVault = true
//   const performanceFeeAsDecimal = performanceFee && performanceFee / 100

//   if (showStakedOnly && !accountHasSharesStaked) {
//     return null
//   }

//   return (
//     <StyledCard isPromoted={{ isDesktop: isXl }}>
//       <StyledCardInner isPromotedPool>
//         <StyledCardHeader
//           isPromotedPool
//           isStaking={accountHasSharesStaked}
//           isAutoVault={isVault}
//           earningTokenSymbol="SUTEKU"
//           stakingTokenSymbol="SUTEKU"
//           pool={pool}
//         />
//         <StyledCardBody isLoading={isLoading}>
//           <AprRow
//             pool={pool}
//             isAutoVault={isVault}
//             compoundFrequency={timesCompoundedDaily}
//             performanceFee={performanceFeeAsDecimal}
//           />
//           <Box mt="24px">
//             <RecentCakeProfitRow />
//           </Box>
//           <Box mt="8px">
//             <UnstakingFeeCountdownRow />
//           </Box>
//           <Flex mt="32px" flexDirection="column">
//             {account ? (
//               <VaultCardActions pool={pool} accountHasSharesStaked={accountHasSharesStaked} isLoading={isLoading} />
//             ) : (
//               <>
//                 <Text mb="10px" textTransform="uppercase" fontSize="12px" color="textSubtle" bold>
//                   {t('Start earning')}
//                 </Text>
//                 <UnlockButton />
//               </>
//             )}
//           </Flex>
//         </StyledCardBody>
//         <CardFooter pool={pool} account={account} isAutoVault={isVault} />
//       </StyledCardInner>
//     </StyledCard>
//   )
// }

// export default CakeVaultCard
