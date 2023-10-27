import React, { useState, useEffect } from 'react'
// import styled from 'styled-components'
// import { Modal, Text, Flex, Image, Button, BalanceInput, AutoRenewIcon, Link } from '@pancakeswap/uikit'
// import { useTranslation } from 'contexts/Localization'
// import { useWeb3React } from '@web3-react/core'
// import { BASE_EXCHANGE_URL } from 'config'
// import { AbiItem } from 'web3-utils'
// import { useAppDispatch } from 'state'
// import { BIG_TEN } from 'utils/bigNumber'
// import Slider from 'components/Slider'
// import { useCakeVault, usePriceCakeBusd, useBusdPriceFromToken, useTokenPrice, usePriceBnbSuteku } from 'state/hooks'
// import { getWeb3NoAccount } from 'utils/web3'
// import { getAddress } from 'utils/addressHelpers'
// import { useCakeVaultContract } from 'hooks/useContract'
// import useTheme from 'hooks/useTheme'
// import useWithdrawalFeeTimer from 'hooks/cakeVault/useWithdrawalFeeTimer'
// import BigNumber from 'bignumber.js'
// import { getFullDisplayBalance, formatNumber, getDecimalAmount } from 'utils/formatBalance'
// import useToast from 'hooks/useToast'
// import { fetchCakeVaultUserData } from 'state/pools'
// import { Pool } from 'state/types'
// import PercentageButton from './PercentageButton'
// import { convertCakeToShares } from '../../helpers'
// import FeeSummary from './FeeSummary'

// interface VaultStakeModalProps {
//   pool: Pool
//   stakingMax: BigNumber
//   // eslint-disable-next-line react/require-default-props
//   isRemovingStake?: boolean
//   // eslint-disable-next-line react/require-default-props
//   onDismiss?: () => void
// }

// const StyledButton = styled(Button)`
//   flex-grow: 1;
// `

// const StyledLink = styled(Link)`
//   width: 100%;
// `

// const VaultStakeModal: React.FC<VaultStakeModalProps> = ({ pool, stakingMax, isRemovingStake = false, onDismiss }) => {
//   const dispatch = useAppDispatch()
//   const [balance, setBalance] = useState(new BigNumber(0))
//   const { stakingToken } = pool
//   const sokuPrice = useTokenPrice('sokuswap')
//   const sutekuPrice = usePriceBnbSuteku()
//   const web3 = getWeb3NoAccount()
//   const { account } = useWeb3React()
//   const cakeVaultContract = useCakeVaultContract()
//   const {
//     userData: { lastDepositedTime, userShares },
//     pricePerFullShare,
//   } = useCakeVault()
//   const { t } = useTranslation()
//   const { theme } = useTheme()
//   const { toastSuccess, toastError } = useToast()
//   const [pendingTx, setPendingTx] = useState(false)
//   const [stakeAmount, setStakeAmount] = useState('')
//   const [staked, setStaked] = useState(0)
//   const [percent, setPercent] = useState(0)
//   const { hasUnstakingFee } = useWithdrawalFeeTimer(parseInt(lastDepositedTime, 10), userShares)
//   const cakePriceBusd = usePriceCakeBusd()
//   const stakingTokenPrice =
//     stakingToken.address[56] === '0x198800aF50914004A9E9D19cA18C0b24587a50cf' ? sutekuPrice : sokuPrice
//   const usdValueStaked = stakeAmount && formatNumber(new BigNumber(stakeAmount).times(stakingTokenPrice).toNumber())

//   const handleStakeInputChange = (input: string) => {
//     if (input) {
//       const convertedInput = new BigNumber(input).multipliedBy(BIG_TEN.pow(stakingToken.decimals))
//       const percentage = Math.floor(convertedInput.dividedBy(stakingMax).multipliedBy(100).toNumber())
//       setPercent(percentage > 100 ? 100 : percentage)
//     } else {
//       setPercent(0)
//     }
//     setStakeAmount(input)
//   }

//   const handleChangePercent = (sliderPercent: number) => {
//     if (sliderPercent > 0) {
//       const percentageOfStakingMax = stakingMax.dividedBy(100).multipliedBy(sliderPercent)
//       const amountToStake = getFullDisplayBalance(percentageOfStakingMax, stakingToken.decimals, stakingToken.decimals)
//       setStakeAmount(amountToStake)
//     } else {
//       setStakeAmount('')
//     }
//     setPercent(sliderPercent)
//   }

//   const handleWithdrawal = async (convertedStakeAmount: BigNumber) => {
//     setPendingTx(true)
//     const shareStakeToWithdraw = convertCakeToShares(convertedStakeAmount, pricePerFullShare)
//     // trigger withdrawAll function if the withdrawal will leave 0.000001 CAKE or less
//     const triggerWithdrawAllThreshold = new BigNumber(1000000000000)
//     const sharesRemaining = userShares.minus(shareStakeToWithdraw.sharesAsBigNumber)
//     const isWithdrawingAll = sharesRemaining.lte(triggerWithdrawAllThreshold)

//     if (isWithdrawingAll) {
//       cakeVaultContract.methods
//         .withdrawAll()
//         .send({ from: account })
//         .on('sending', () => {
//           setPendingTx(true)
//         })
//         .on('receipt', () => {
//           toastSuccess(t('Unstaked!'), t('Your earnings have also been harvested to your wallet'))
//           setPendingTx(false)
//           onDismiss()
//           dispatch(fetchCakeVaultUserData({ account }))
//         })
//         .on('error', (error) => {
//           console.error(error)
//           // Remove message from toast before prod
//           toastError(t('Error'), t('%error% - Please try again.', { error: error.message }))
//           setPendingTx(false)
//         })
//     } else {
//       cakeVaultContract.methods
//         .withdraw(shareStakeToWithdraw.sharesAsBigNumber.toString())
//         // .toString() being called to fix a BigNumber error in prod
//         // as suggested here https://github.com/ChainSafe/web3.js/issues/2077
//         .send({ from: account })
//         .on('sending', () => {
//           setPendingTx(true)
//         })
//         .on('receipt', () => {
//           toastSuccess(t('Unstaked!'), t('Your earnings have also been harvested to your wallet'))
//           setPendingTx(false)
//           onDismiss()
//           dispatch(fetchCakeVaultUserData({ account }))
//         })
//         .on('error', (error) => {
//           console.error(error)
//           // Remove message from toast before prod
//           toastError(t('Error'), t('%error% - Please try again.', { error: error.message }))
//           setPendingTx(false)
//         })
//     }
//   }

//   const handleDeposit = async (convertedStakeAmount: BigNumber) => {
//     cakeVaultContract.methods
//       .deposit(convertedStakeAmount.toString())
//       // .toString() being called to fix a BigNumber error in prod
//       // as suggested here https://github.com/ChainSafe/web3.js/issues/2077
//       .send({ from: account })
//       .on('sending', () => {
//         setPendingTx(true)
//       })
//       .on('receipt', () => {
//         toastSuccess(t('Staked!'), t('Your funds have been staked in the pool'))
//         setPendingTx(false)
//         onDismiss()
//         dispatch(fetchCakeVaultUserData({ account }))
//       })
//       .on('error', (error) => {
//         console.error(error)
//         // Remove message from toast before prod
//         toastError(t('Error'), t('%error% - Please try again.', { error: error.message }))
//         setPendingTx(false)
//       })
//   }

//   const handleConfirmClick = async () => {
//     const convertedStakeAmount = getDecimalAmount(new BigNumber(stakeAmount), stakingToken.decimals)
//     setPendingTx(true)
//     // unstaking
//     if (isRemovingStake) {
//       handleWithdrawal(convertedStakeAmount)
//       // staking
//     } else {
//       handleDeposit(convertedStakeAmount)
//     }
//   }

//   // console.log(stakingMax, 'stakingMax')

//   return (
//     <Modal title={isRemovingStake ? t('Unstake') : t('Stake in Pool')} onDismiss={onDismiss} headerBackground="#f9f9fa">
//       <Flex alignItems="center" justifyContent="space-between" mb="8px">
//         <Text bold>{isRemovingStake ? t('Unstake') : t('Stake')}:</Text>
//         <Flex alignItems="center" minWidth="70px">
//           {/* <Image src={`/images/tokens/${stakingToken.symbol}.png`} width={24} height={24} alt={stakingToken.symbol} /> */}
//           {stakingToken.symbol === 'SOKU' ? (
//             <img
//               src="https://i.ibb.co/sm60Zb7/Soku-Logo-400x400.png"
//               width={24}
//               height={24}
//               alt={stakingToken.symbol}
//               style={{ objectFit: 'contain' }}
//             />
//           ) : (
//             <img
//               src="https://i.ibb.co/ZfBZpjN/Suteku-Logo.png"
//               width={24}
//               height={24}
//               alt={stakingToken.symbol}
//               style={{ objectFit: 'contain' }}
//             />
//           )}

//           <Text ml="4px" bold>
//             {stakingToken.symbol}
//           </Text>
//         </Flex>
//       </Flex>
//       <BalanceInput
//         value={stakeAmount}
//         onUserInput={handleStakeInputChange}
//         currencyValue={stakingTokenPrice > 0 && `~${usdValueStaked || 0} USD`}
//         style={{ background: 'rgb(239 238 238 / 79%)', border: 'none' }}
//       />
//       <Text ml="auto" color="textSubtle" fontSize="12px" mb="8px">
//         {t('Balance: %balance%', {
//           balance: getFullDisplayBalance(isRemovingStake ? new BigNumber(staked) : stakingMax, stakingToken.decimals),
//         })}
//       </Text>
//       <Slider
//         min={0}
//         max={100}
//         value={percent}
//         onChange={handleChangePercent}
//         name="stake"
//         valueLabel={`${percent}%`}
//         step={1}
//       />
//       <Flex alignItems="center" justifyContent="space-between" mt="8px">
//         <PercentageButton onClick={() => handleChangePercent(25)}>25%</PercentageButton>
//         <PercentageButton onClick={() => handleChangePercent(50)}>50%</PercentageButton>
//         <PercentageButton onClick={() => handleChangePercent(75)}>75%</PercentageButton>
//         <PercentageButton onClick={() => handleChangePercent(isRemovingStake ? 100 : 99.99)}>MAX</PercentageButton>
//       </Flex>
//       {isRemovingStake && hasUnstakingFee && (
//         <FeeSummary stakingTokenSymbol={stakingToken.symbol} stakeAmount={stakeAmount} />
//       )}
//       <Button
//         style={{ background: '#05195a' }}
//         isLoading={pendingTx}
//         endIcon={pendingTx ? <AutoRenewIcon spin color="currentColor" /> : null}
//         onClick={handleConfirmClick}
//         disabled={!stakeAmount || parseFloat(stakeAmount) === 0}
//         mt="24px"
//       >
//         {pendingTx ? t('Confirming') : t('Confirm')}
//       </Button>
//       {!isRemovingStake && (
//         <StyledLink external href={BASE_EXCHANGE_URL}>
//           <Button style={{ background: '#05195a' }} width="100%" mt="8px" variant="primary">
//             <Text color="#fff" fontWeight="bolder">
//               {' '}
//               {t('Get %symbol%', { symbol: stakingToken.symbol })}
//             </Text>
//           </Button>
//         </StyledLink>
//       )}
//     </Modal>
//   )
// }

// export default VaultStakeModal
