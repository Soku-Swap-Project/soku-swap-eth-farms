import React from 'react'
import Chip from '@mui/material/Chip'
import { Tag, VerifiedIcon, CommunityIcon, BinanceIcon, RefreshIcon, AutoRenewIcon } from '@pancakeswap/uikit'
import LockIcon from '@mui/icons-material/Lock'

const CoreTag = (props) => (
  <Tag variant="secondary" outline startIcon={<VerifiedIcon width="18px" color="secondary" mr="4px" />} {...props}>
    Core
  </Tag>
)

const CommunityTag = (props) => (
  <Tag variant="textSubtle" outline startIcon={<CommunityIcon width="18px" color="secondary" mr="4px" />} {...props}>
    Community
  </Tag>
)

const BinanceTag = (props) => (
  <Tag variant="binance" outline startIcon={<BinanceIcon width="18px" color="secondary" mr="4px" />} {...props}>
    Binance
  </Tag>
)

const ThirtyDayLockedTag = () => (
  <Chip label="30 Day" variant="outlined" icon={<LockIcon style={{ width: '18px', fill: '#04bbfb' }} />} />
)

const SixtyDayLockedTag = () => (
  <Chip label="60 Day" variant="outlined" icon={<LockIcon style={{ width: '18px', fill: '#04bbfb' }} />} />
)

const NinetyDayLockedTag = () => (
  <Chip label="90 Day" variant="outlined" icon={<LockIcon style={{ width: '18px', fill: '#04bbfb' }} />} />
)

const DualTag = (props) => (
  <Tag variant="textSubtle" outline {...props}>
    Dual
  </Tag>
)

const ManualPoolTag = () => (
  <Chip label="Manual" variant="outlined" icon={<RefreshIcon width="18px" color="#04bbfb" mr="4px" />} />
)

const CompoundingPoolTag = (props) => (
  <Tag variant="success" outline startIcon={<AutoRenewIcon width="18px" color="success" mr="4px" />} {...props}>
    Auto
  </Tag>
)

export {
  CoreTag,
  CommunityTag,
  BinanceTag,
  DualTag,
  ManualPoolTag,
  CompoundingPoolTag,
  ThirtyDayLockedTag,
  SixtyDayLockedTag,
  NinetyDayLockedTag,
}
