import { ethers } from 'ethers'
import { FACTORY_ADDRESS, WETH } from '@uniswap/sdk'
import Exchange from '@uniswap/v2-core/build/UniswapV2Pair.json'
import Factory from '@uniswap/v2-core/build/UniswapV2Factory.json'

import Token from './Ethpins.json'
import UncheckedJsonRpcSigner from './signer'

const ERC20_ABI = Token.abi
const EXCHANGE_ABI = Exchange.abi
const FACTORY_ABI = Factory.abi

export const CHAIN_ID = parseInt(process.env.REACT_APP_CHAIN_ID)

export const FACTORY_ADDRESSES = {
  1: FACTORY_ADDRESS,
  3: FACTORY_ADDRESS,
  97: '0xB7926C0430Afb07AA7DEfDE6DA862aE0Bde767bc',
}

export const WETH_ADDRESSES = {
  1: WETH[1].address,
  3: WETH[3].address,
  97: '0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd',
}

export const DAI_ADDRESSES = {
  1: '0x6b175474e89094c44da98b954eedeac495271d0f',
  3: '0xad6d458402f60fd3bd25163575031acdce07538d',
  97: '0x0be6c9a1037cdfbb013a73ca361e84662278d551',
}

export const PINO_ADDRESSES = {
  1: '',
  3: '0xbdde47f4ded0fb048b73da0f8020d41e0aabb57a',
  97: '0x064b19b1CE07A63eB12fB2869Ff666f466008f03',
}

export const WETH_ADDRESS = WETH_ADDRESSES[CHAIN_ID]

export const TOKEN_ADDRESSES = {
  ETH: 'ETH',
  DAI: DAI_ADDRESSES[CHAIN_ID],
  PINO: PINO_ADDRESSES[CHAIN_ID],
}

export const TOKEN_SYMBOLS = Object.keys(TOKEN_ADDRESSES).reduce((o, k) => {
  o[k] = k
  return o
}, {})

export const ERROR_CODES = [
  'INVALID_AMOUNT',
  'INVALID_TRADE',
  'INSUFFICIENT_ETH_GAS',
  'INSUFFICIENT_SELECTED_TOKEN_BALANCE',
  'INSUFFICIENT_ALLOWANCE',
].reduce((o, k, i) => {
  o[k] = i
  return o
}, {})

export const TRADE_TYPES = ['BUY', 'SELL', 'UNLOCK', 'REDEEM'].reduce((o, k, i) => {
  o[k] = i
  return o
}, {})

export function isAddress(value) {
  try {
    ethers.utils.getAddress(value)
    return true
  } catch {
    return false
  }
}

// account is optional
export function getProviderOrSigner(library, account) {
  return account ? new UncheckedJsonRpcSigner(library.getSigner(account)) : library
}

// account is optional
export function getContract(address, ABI, library, account) {
  if (!isAddress(address) || address === ethers.constants.AddressZero) {
    throw Error(`Invalid 'address' parameter '${address}'.`)
  }

  return new ethers.Contract(address, ABI, getProviderOrSigner(library, account))
}

export function getTokenContract(tokenAddress, library, account) {
  return getContract(tokenAddress, ERC20_ABI, library, account)
}

export function getExchangeContract(exchangeAddress, library, account) {
  return getContract(exchangeAddress, EXCHANGE_ABI, library, account)
}

export async function getTokenExchangeAddressFromFactory(tokenAddress, library, account) {
  return getContract(FACTORY_ADDRESSES[CHAIN_ID], FACTORY_ABI, library, account).getPair(tokenAddress, WETH_ADDRESS)
}

// get the ether balance of an address
export async function getEtherBalance(address, library) {
  if (!isAddress(address)) {
    throw Error(`Invalid 'address' parameter '${address}'`)
  }

  return library.getBalance(address)
}

// get the token balance of an address
export async function getTokenBalance(tokenAddress, address, library) {
  if (!isAddress(tokenAddress) || !isAddress(address)) {
    throw Error(`Invalid 'tokenAddress' or 'address' parameter '${tokenAddress}' or '${address}'.`)
  }

  return getContract(tokenAddress, ERC20_ABI, library).balanceOf(address)
}

export async function getTokenAllowance(address, tokenAddress, spenderAddress, library) {
  if (!isAddress(address) || !isAddress(tokenAddress) || !isAddress(spenderAddress)) {
    throw Error(
      "Invalid 'address' or 'tokenAddress' or 'spenderAddress' parameter" +
        `'${address}' or '${tokenAddress}' or '${spenderAddress}'.`
    )
  }

  return getContract(tokenAddress, ERC20_ABI, library).allowance(address, spenderAddress)
}

export function amountFormatter(amount, baseDecimals = 18, displayDecimals = 3, useLessThan = true) {
  if (baseDecimals > 18 || displayDecimals > 18 || displayDecimals > baseDecimals) {
    throw Error(`Invalid combination of baseDecimals '${baseDecimals}' and displayDecimals '${displayDecimals}.`)
  }

  // if balance is falsy, return undefined
  if (!amount) {
    return undefined
  }
  // if amount is 0, return
  else if (amount.isZero()) {
    return '0'
  }
  // if amount is greater than 0
  else {
    // amount of 'wei' in 1 'ether'
    const baseAmount = ethers.BigNumber.from(10).pow(ethers.BigNumber.from(baseDecimals))

    const minimumDisplayAmount = baseAmount.div(ethers.BigNumber.from(10).pow(ethers.BigNumber.from(displayDecimals)))

    // if balance is less than the minimum display amount
    if (amount.lt(minimumDisplayAmount)) {
      return useLessThan
        ? `<${ethers.utils.formatUnits(minimumDisplayAmount, baseDecimals)}`
        : `${ethers.utils.formatUnits(amount, baseDecimals)}`
    }
    // if the balance is greater than the minimum display amount
    else {
      const stringAmount = ethers.utils.formatUnits(amount, baseDecimals)

      // if there isn't a decimal portion
      if (!stringAmount.match(/\./)) {
        return stringAmount
      }
      // if there is a decimal portion
      else {
        const [wholeComponent, decimalComponent] = stringAmount.split('.')
        const roundUpAmount = minimumDisplayAmount.div(ethers.constants.Two)
        const roundedDecimalComponent = ethers.BigNumber.from(decimalComponent.padEnd(baseDecimals, '0'))
          .add(roundUpAmount)
          .toString()
          .padStart(baseDecimals, '0')
          .substring(0, displayDecimals)

        // decimals are too small to show
        if (roundedDecimalComponent === '0'.repeat(displayDecimals)) {
          return wholeComponent
        }
        // decimals are not too small to show
        else {
          return `${wholeComponent}.${roundedDecimalComponent.toString().replace(/0*$/, '')}`
        }
      }
    }
  }
}
