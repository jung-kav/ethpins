require('dotenv').config()
require('@nomiclabs/hardhat-waffle')

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: '0.8.3',
  defaultNetwork: 'hardhat',
  networks: {
    hardhat: {
      forking: {
        url: process.env.ARCHIVE_NODE_ENDPOINT,
        blockNumber: 12456360,
      },
    },
    ropsten: {
      url: process.env.REACT_APP_ROPSTEN_ENDPOINT,
      accounts: [process.env.ROPSTEN_PRIVATE_KEY],
    },
    mainnet: {
      url: process.env.REACT_APP_MAINNET_ENDPOINT,
      accounts: [process.env.MAINNET_PRIVATE_KEY],
    },
    'binance-testnet': {
      url: process.env.REACT_APP_BINANCE_TESTNET_ENDPOINT,
      accounts: [process.env.BINANCE_TESTNET_PRIVATE_KEY],
    },
    binance: {
      url: process.env.REACT_APP_BINANCE_ENDPOINT,
      accounts: [process.env.BINANCE_PRIVATE_KEY],
    },
  },
}
