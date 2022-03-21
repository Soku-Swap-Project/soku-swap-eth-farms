import tokens from './tokens'
import { FarmConfig } from './types'

const farmsV2: FarmConfig[] = [
  {
    pid: 1,
    lpSymbol: 'SOKU-ETH LP',
    lpAddresses: {
      4: '0x6812108E96f2d53680446aF1dE8C6d474bD5b610',
      1: '',
    },
    token: tokens.weth,
    quoteToken: tokens.soku,
  },
  // {
  //   pid: 0,
  //   lpSymbol: 'SUTEKU',
  //   lpAddresses: {
  //     4: '0x9C21123D94b93361a29B2C2EFB3d5CD8B17e0A9e',
  //     1: '0x198800aF50914004A9E9D19cA18C0b24587a50cf',
  //   },
  //   token: tokens.suteku,
  //   quoteToken: tokens.wbnb,
  // },
  // {
  //   pid: 2,
  //   lpSymbol: 'SOKU-BNB LP',
  //   lpAddresses: {
  //     4: '0x3ed8936cAFDF85cfDBa29Fbe5940A5b0524824F4',
  //     1: '0x78EA31475cB284Dc9Bd70f06db457Fdba19C9Ad7',
  //   },
  //   token: tokens.soku,
  //   quoteToken: tokens.wbnb,
  // },
  // {
  //   pid: 3,
  //   lpSymbol: 'SOKU-BUSD LP',
  //   lpAddresses: {
  //     4: '',
  //     1: '0x66C2E8A1f02997C3B4A86334D8D31cd31e3a75Af',
  //   },
  //   token: tokens.soku,
  //   quoteToken: tokens.busd,
  // },
  // {
  //   pid: 11,
  //   lpSymbol: 'BNB-BUSD LP',
  //   lpAddresses: {
  //     4: '',
  //     1: '0x58F876857a02D6762E0101bb5C46A8c1ED44Dc16',
  //   },
  //   token: tokens.wbnb,
  //   quoteToken: tokens.busd,
  // },
  // {
  //   pid: 12,
  //   lpSymbol: 'BNB-ETH LP',
  //   lpAddresses: {
  //     4: '',
  //     1: '0x74E4716E431f45807DCF19f284c7aA99F18a4fbc',
  //   },
  //   token: tokens.wbnb,
  //   quoteToken: tokens.eth,
  // },
  // {
  //   pid: 14,
  //   lpSymbol: 'SOKU-ETH LP',
  //   lpAddresses: {
  //     4: '',
  //     1: '0x526262914184Ca4fa32CaE4e4Bc5FFF7AeAD3CEe',
  //   },
  //   token: tokens.soku,
  //   quoteToken: tokens.eth,
  // },
  // {
  //   pid: 13,
  //   lpSymbol: 'BNB-USDT LP',
  //   lpAddresses: {
  //     4: '',
  //     1: '0x16b9a82891338f9bA80E2D6970FddA79D1eb0daE',
  //   },
  //   token: tokens.wbnb,
  //   quoteToken: tokens.usdt,
  // },
  // {
  //   pid: 1,
  //   lpSymbol: 'SOKU-SUTEKU LP',
  //   lpAddresses: {
  //     4: '',
  //     1: '0x9Cd57015Bc8656a5B80e802335A5Ce464a6569B0',
  //   },
  //   token: tokens.suteku,
  //   quoteToken: tokens.soku,
  // },
  // {
  //   pid: 5,
  //   lpSymbol: 'SUTEKU-BNB LP',
  //   lpAddresses: {
  //     4: '',
  //     1: '0x1BcD5AA4EeCbfc6D048D553E8F385683D9DF6E15',
  //   },
  //   token: tokens.suteku,
  //   quoteToken: tokens.wbnb,
  // },
  // {
  //   pid: 6,
  //   lpSymbol: 'SUTEKU-BUSD LP',
  //   lpAddresses: {
  //     4: '',
  //     1: '0x8568eb12B54128070AdA50b0909d990FecbBc03f',
  //   },
  //   token: tokens.suteku,
  //   quoteToken: tokens.busd,
  // },
  // // {
  // //   pid: 4,
  // //   lpSymbol: 'SOKU-YUMMY LP',
  // //   lpAddresses: {
  // //     4: '',
  // //     56: '0x860b771eC2D0e8ecf3e2315aAD7a24Ba3228D968',
  // //   },
  // //   token: tokens.yummy,
  // //   quoteToken: tokens.soku,
  // // },
  // {
  //   pid: 7,
  //   lpSymbol: 'SOKU-HODL LP',
  //   lpAddresses: {
  //     4: '',
  //     1: '0xdeb9A4F69774a55f36ff448927CAd0355a93b86c',
  //   },
  //   token: tokens.hodl,
  //   quoteToken: tokens.soku,
  // },
  // // {
  // //   pid: 8,
  // //   lpSymbol: 'SOKU-FCF LP',
  // //   lpAddresses: {
  // //     97: '',
  // //     56: '0xf91BD6136D0e6Da3D09e128B2DaE7576540e1072',
  // //   },
  // //   token: tokens.fcf,
  // //   quoteToken: tokens.soku,
  // // },
  // {
  //   pid: 10,
  //   lpSymbol: 'SOKU-MOONLIGHT LP',
  //   lpAddresses: {
  //     4: '',
  //     1: '0xF1300278975B91DB794F5E950679f29f236269BE',
  //   },
  //   token: tokens.moonlight,
  //   quoteToken: tokens.soku,
  // },
  // // {
  // //   pid: 9,
  // //   lpSymbol: 'SUTEKU-EARN LP',
  // //   lpAddresses: {
  // //     97: '',
  // //     56: '0xC3711E723904886e66996a7A6C71C927446Da758',
  // //   },
  // //   token: tokens.earnable,
  // //   quoteToken: tokens.suteku,
  // // },
  // {
  //   pid: 16,
  //   lpSymbol: 'SOKU-BODA LP',
  //   lpAddresses: {
  //     4: '',
  //     1: '0x2633E5B3A48f67A082C52b5E294783bC3cb1c834',
  //   },
  //   token: tokens.boda,
  //   quoteToken: tokens.soku,
  // },
]

export default farmsV2
