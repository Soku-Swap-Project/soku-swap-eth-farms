import React, { useEffect, useMemo, useRef, useState } from 'react'
import ModalVideo from 'react-modal-video'

import { Route, useRouteMatch } from 'react-router-dom'

import { useWeb3React } from '@web3-react/core'
import { Heading, Flex } from '@pancakeswap/uikit'
// import { getAddress } from 'utils/addressHelpers'
// import { AbiItem } from 'web3-utils'
// import { getWeb3NoAccount } from 'utils/web3'
import { getUserPoolData } from 'state/pools'
import orderBy from 'lodash/orderBy'
import partition from 'lodash/partition'
import { useTranslation } from 'contexts/Localization'
import usePersistState from 'hooks/usePersistState'
import { usePools } from 'state/hooks'
import FlexLayout from 'components/layout/Flex'
import Page from 'components/layout/Page'
// import AlertDismissable from 'components/Alerts'
import PageHeader from 'components/PageHeader'
import PoolCard from './components/PoolCard'
// import CakeVaultCard from './components/CakeVaultCard'
import PoolTabButtons from './components/PoolTabButtons'
// import BountyCard from './components/BountyCard'

import 'react-modal-video/css/modal-video.css'

const NUMBER_OF_POOLS_VISIBLE = 12
// declare let window: any

const Pools: React.FC = () => {
  const { path } = useRouteMatch()
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const pools = usePools(account)

  // modal video
  const [isOpen, setOpen] = useState(false)

  // const web3 = getWeb3NoAccount()
  const [stakedOnly, setStakedOnly] = usePersistState(false, 'pancake_pool_staked')
  // const [staked, setStaked] = useState(0)
  // const [userDetails, setUserDetails] = useState({})
  const [userInfo, setUserInfo] = useState({})
  const [numberOfPoolsVisible, setNumberOfPoolsVisible] = useState(NUMBER_OF_POOLS_VISIBLE)
  const [observerIsSet, setObserverIsSet] = useState(false)
  const loadMoreRef = useRef<HTMLDivElement>(null)

  const [finishedPools, openPools] = useMemo(() => partition(pools, (pool) => pool.isFinished), [pools])

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const test = await getUserPoolData(account)
        setUserInfo(test)
      } catch (err) {
        // eslint-disable-next-line
        console.log(err, 'err')
      }
    }
    fetchUserData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account])

  const stakedOnlyFinishedPools = useMemo(
    () =>
      finishedPools.filter((pool) =>
        // eslint-disable-next-line dot-notation
        userInfo['stakedBalances'] ? userInfo['stakedBalances'][pool.sousId] !== '0' : null,
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [finishedPools],
  )
  const stakedOnlyOpenPools = useMemo(
    () =>
      // eslint-disable-next-line dot-notation
      openPools.filter((pool) => (userInfo['stakedBalances'] ? userInfo['stakedBalances'][pool.sousId] !== '0' : null)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [openPools],
  )

  const hasStakeInFinishedPools = stakedOnlyFinishedPools.length > 0

  // This pool is passed explicitly to the cake vault
  // eslint-disable-next-line
  const cakePoolData = useMemo(() => openPools.find((pool) => pool.sousId === 0), [openPools])

  useEffect(() => {
    const showMorePools = (entries) => {
      const [entry] = entries
      if (entry.isIntersecting) {
        setNumberOfPoolsVisible((poolsCurrentlyVisible) => poolsCurrentlyVisible + NUMBER_OF_POOLS_VISIBLE)
      }
    }

    if (!observerIsSet) {
      const loadMoreObserver = new IntersectionObserver(showMorePools, {
        rootMargin: '0px',
        threshold: 1,
      })
      loadMoreObserver.observe(loadMoreRef.current)
      setObserverIsSet(true)
    }
  }, [observerIsSet])

  return (
    <div style={{ paddingTop: '1.85rem' }} className="farm_heading">
      <PageHeader>
        <Flex justifyContent="space-between" flexDirection={['column', null, 'row']}>
          <Flex flexDirection="column" mr={['8px', 0]}>
            <Heading
              as="h1"
              color="#05195a"
              mb="20px"
              style={{ fontSize: '3.25rem', marginBottom: '12px', textAlign: 'center' }}
            >
              {t('Staking Pools')}
            </Heading>
            <Heading scale="lg" color="#05195a" style={{ opacity: '0.85', fontSize: '1.25rem', textAlign: 'center' }}>
              {t('Just stake some tokens to earn.')}
            </Heading>
            <Heading
              scale="lg"
              color="#05195a"
              style={{ opacity: '0.85', fontSize: '1.25rem', textAlign: 'center', marginBottom: '15px' }}
            >
              {t('High APR, low risk.')}
            </Heading>
            <div
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                paddingBottom: '16px',
                fontWeight: 'bolder',
              }}
            >
              {/* eslint-disable-next-line */}
              {/* <p style={{ color: '#04bbfb', fontSize: '16px', cursor: 'pointer' }} onClick={() => setOpen(true)}>
                How to stake?
              </p> */}
            </div>
          </Flex>
          {/* <Flex height="fit-content" justifyContent="center" alignItems="center" mt={['24px', null, '0']}>
            <BountyCard />
          </Flex> */}
        </Flex>
      </PageHeader>
      <Page>
        <PoolTabButtons
          stakedOnly={stakedOnly}
          setStakedOnly={setStakedOnly}
          hasStakeInFinishedPools={hasStakeInFinishedPools}
        />
        <div className="modal_video">
          <ModalVideo channel="youtube" autoplay isOpen={isOpen} videoId="iricuuB4KUo" onClose={() => setOpen(false)} />
        </div>
        <FlexLayout>
          <Route exact strict path={`${path}`}>
            <>
              {/* <CakeVaultCard pool={cakePoolData} showStakedOnly={stakedOnly} /> */}
              {stakedOnly
                ? orderBy(stakedOnlyOpenPools, ['sortOrder'])
                    .slice(0, numberOfPoolsVisible)
                    .map((pool) => <PoolCard key={pool.sousId} pool={pool} account={account} />)
                : orderBy(openPools, ['sortOrder'])
                    .slice(0, numberOfPoolsVisible)
                    .map((pool) => <PoolCard key={pool.sousId} pool={pool} account={account} />)}
            </>
          </Route>
          <Route exact strict path={`${path}history`}>
            {stakedOnly
              ? orderBy(stakedOnlyFinishedPools, ['sortOrder'])
                  .slice(0, numberOfPoolsVisible)
                  .map((pool) => <PoolCard key={pool.sousId} pool={pool} account={account} />)
              : orderBy(finishedPools, ['sortOrder'])
                  .slice(0, numberOfPoolsVisible)
                  .map((pool) => <PoolCard key={pool.sousId} pool={pool} account={account} />)}
          </Route>
        </FlexLayout>
        <div ref={loadMoreRef} />
        {/* <Image
          mx="auto"
          mt="12px"
          src="/images/3d-syrup-bunnies.png"
          alt="Pancake illustration"
          width={192}
          height={184.5}
        /> */}
      </Page>
    </div>
  )
}

export default Pools
