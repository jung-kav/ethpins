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
        url: process.env.FORKED_MAINNET_ENDPOINT,
        blockNumber: 12456360,
      },
    },
    ropsten: {
      url: process.env.ROPSTEN_ENDPOINT,
      accounts: [process.env.ROPSTEN_PRIVATE_KEY],
    },
    mainnet: {
      url: process.env.MAINNET_ENDPOINT,
      accounts: [process.env.MAINNET_PRIVATE_KEY],
    },
    bnbtest: {
      url: process.env.BINANCE_TESTNET_ENDPOINT,
      accounts: [process.env.BINANCE_TESTNET_PRIVATE_KEY],
    },
    binance: {
      url: process.env.BINANCE_ENDPOINT,
      accounts: [process.env.BINANCE_PRIVATE_KEY],
    },
  },
}
