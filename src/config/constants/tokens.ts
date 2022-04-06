const tokens = {
  bnb: {
    symbol: 'BNB',
    projectLink: 'https://www.binance.com/',
  },
  soku: {
    symbol: 'SOKU',
    name: 'SOKU',
    address: {
      1: '0x4C3A8ECeB656Ec63eaE80a4ebD565E4887DB6160',
      4: '0x73621e8A89B6bA8CAD0cAB95ee1E1E0A3E61BAA1',
    },
    decimals: 18,
    projectLink: 'https://sokuswap.org/',
  },
  suteku: {
    symbol: 'SUTEKU',
    name: 'Suteku Rewards Token',
    address: {
      1: '0xc7230BADF274995F1933598c249c824fDE26F426',
      4: '0x5BaF25e000A9FB67e768C1E80B1bB81f4A6eBf76',
    },
    decimals: 18,
    projectLink: 'https://sokuswap.org/',
  },
  usdt: {
    symbol: 'USDT',
    name: 'Tether USD',
    address: {
      1: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
      4: '0x73621e8A89B6bA8CAD0cAB95ee1E1E0A3E61BAA1',
    },
    decimals: 6,
    projectLink: 'https://sokuswap.finance/',
  },
  test_suteku: {
    symbol: 'SUTEKU',
    name: 'Suteku Rewards Token',
    address: {
      1: '',
      4: '0x73621e8A89B6bA8CAD0cAB95ee1E1E0A3E61BAA1',
    },
    decimals: 18,
    projectLink: 'https://sokuswap.finance/',
  },
  boda: {
    symbol: 'BODAV2',
    name: 'BODAV2',
    address: {
      1: '0x6b3595068778dd592e39a122f4f5a5cf09c90fe2',
      4: '0x73621e8A89B6bA8CAD0cAB95ee1E1E0A3E61BAA1',
    },
    decimals: 18,
    projectLink: 'https://www.bodatoken.org/ ',
  },
  hodl: {
    symbol: 'HODL',
    name: 'HODL',
    address: {
      1: '0x6b3595068778dd592e39a122f4f5a5cf09c90fe2',
      4: '0x73621e8A89B6bA8CAD0cAB95ee1E1E0A3E61BAA1',
    },
    decimals: 9,
    projectLink: 'https://sokuswap.finance/',
  },
  moonlight: {
    symbol: 'MOONLIGHT',
    name: 'Moonlight Token',
    address: {
      1: '0x6b3595068778dd592e39a122f4f5a5cf09c90fe2',
      4: '0x73621e8A89B6bA8CAD0cAB95ee1E1E0A3E61BAA1',
    },
    decimals: 9,
    projectLink: 'https://sokuswap.finance/',
  },
  fcf: {
    symbol: 'French Connection Finance',
    name: 'FCF',
    address: {
      1: '0x6b3595068778dd592e39a122f4f5a5cf09c90fe2',
      4: '0x73621e8A89B6bA8CAD0cAB95ee1E1E0A3E61BAA1',
    },
    decimals: 18,
    projectLink: 'https://sokuswap.finance/',
  },
  suteku1: {
    symbol: 'SUTEKU',
    name: 'Suteku Rewards Token',
    address: {
      1: '0x6b3595068778dd592e39a122f4f5a5cf09c90fe2',
      4: '0x73621e8A89B6bA8CAD0cAB95ee1E1E0A3E61BAA1',
    },
    decimals: 9,
    projectLink: 'https://sokuswap.finance/',
  },
  earnable: {
    symbol: 'EARN',
    name: 'earnable',
    address: {
      1: '0x6b3595068778dd592e39a122f4f5a5cf09c90fe2',
      4: '0x73621e8A89B6bA8CAD0cAB95ee1E1E0A3E61BAA1',
    },
    decimals: 18,
    projectLink: 'https://earnable.one/',
  },
  yummy: {
    symbol: 'YUMMY',
    name: 'yummy',
    address: {
      1: '0x6b3595068778dd592e39a122f4f5a5cf09c90fe2',
      4: '0x73621e8A89B6bA8CAD0cAB95ee1E1E0A3E61BAA1',
    },
    decimals: 18,
    projectLink: 'https://yummy-crypto.com/',
  },
  syrup: {
    symbol: "SOKU 'Syrup'",
    address: {
      1: '0x6b3595068778dd592e39a122f4f5a5cf09c90fe2',
      4: '0xa35062141Fa33BCA92Ce69FeD37D0E8908868AAe',
    },
    decimals: 18,
    projectLink: 'https://sokuswap.finance/',
  },
  cake: {
    symbol: 'CAKE',
    address: {
      1: '0x6b3595068778dd592e39a122f4f5a5cf09c90fe2',
      4: '0x73621e8A89B6bA8CAD0cAB95ee1E1E0A3E61BAA1',
    },
    decimals: 18,
    projectLink: 'https://sokuswap.finance/',
  },
  wbnb: {
    symbol: 'wBNB',
    address: {
      1: '0x6b3595068778dd592e39a122f4f5a5cf09c90fe2',
      4: '0x73621e8A89B6bA8CAD0cAB95ee1E1E0A3E61BAA1',
    },
    decimals: 18,
    projectLink: 'https://sokuswap.finance/',
  },
  busd: {
    symbol: 'BUSD',
    address: {
      1: '0x6b3595068778dd592e39a122f4f5a5cf09c90fe2',
      4: '0x73621e8A89B6bA8CAD0cAB95ee1E1E0A3E61BAA1',
    },
    decimals: 18,
    projectLink: 'https://www.paxos.com/busd/',
  },
  eth: {
    symbol: 'ETH',
    name: 'Ethereum Token',
    address: {
      1: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
      4: '0x73621e8A89B6bA8CAD0cAB95ee1E1E0A3E61BAA1',
    },
    decimals: 18,
    projectLink: 'https://sokuswap.finance/',
  },
}

export default tokens
