require('dotenv').config()
const { ethers } = require('ethers')

const UniswapFactoryAbi = require('../src/utils/factory.json')
const UNISWAP_FACTORY_ADDRESS = '0x1F98431c8aD98523631AE4a59f267346ea31F984'

const provider = new ethers.providers.InfuraProvider('ropsten', process.env.REACT_APP_INFURA_PROJECT_ID)
const signer = new ethers.Wallet(process.env.WALLET_PRIVATE_KEY, provider)
const factory = new ethers.Contract(UNISWAP_FACTORY_ADDRESS, UniswapFactoryAbi, signer)

factory
  .createExchange(process.env.REACT_APP_TOKEN_CONTRACT_ADDRESS)
  .then(res => {
    console.log(`Response: ${JSON.stringify(res)}`)
  })
  .catch(err => {
    console.log(`Error: ${err}`)
  })
