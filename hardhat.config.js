require('dotenv').config()
require('@nomiclabs/hardhat-waffle')

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: '0.8.3',
  defaultNetwork: 'hardhat',
  networks: {
    mainnet: {
      url: process.env.ALCHEMY_MAINNET_API,
      accounts: [process.env.MAINNET_PRIVATE_KEY],
    },
    hardhat: {
      forking: {
        url: process.env.ALCHEMY_FORKED_MAINNET_API,
        blockNumber: 12456360,
      },
    },
    ropsten: {
      url: process.env.ALCHEMY_ROPSTEN_API,
      accounts: [process.env.ROPSTEN_PRIVATE_KEY],
    },
    bnbtest: {
      url: process.env.ANKR_BNB_TESTNET_API,
      accounts: [process.env.BNB_TESTNET_PRIVATE_KEY],
    },
  },
}
