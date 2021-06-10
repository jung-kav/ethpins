import React, { useState, useEffect } from 'react'
import { useWeb3Context } from 'web3-react'
import { ethers } from 'ethers'
import { WETH } from '@uniswap/sdk'

import { TOKEN_ADDRESSES } from '../../utils'
import {
  useTokenContract,
  useExchangeContract,
  useAddressBalance,
  useExchangeAllowance,
  useTotalSupply,
} from '../../hooks'
import Body from '../Body'
import Stats from '../Stats'
import Status from '../Status'

// denominated in bips
const GAS_MARGIN = ethers.BigNumber.from(1000)

export function calculateGasMargin(value, margin) {
  const offset = value.mul(margin).div(ethers.BigNumber.from(10000))
  return value.add(offset)
}

// get exchange rate for a token/ETH pair
function getExchangeRate(inputValue, outputValue, invert = false) {
  const inputDecimals = 18
  const outputDecimals = 18

  if (inputValue && inputDecimals && outputValue && outputDecimals) {
    const factor = ethers.BigNumber.from(10).pow(ethers.BigNumber.from(18))

    if (invert) {
      return inputValue
        .mul(factor)
        .div(outputValue)
        .mul(ethers.BigNumber.from(10).pow(ethers.BigNumber.from(outputDecimals)))
        .div(ethers.BigNumber.from(10).pow(ethers.BigNumber.from(inputDecimals)))
    } else {
      return outputValue
        .mul(factor)
        .div(inputValue)
        .mul(ethers.BigNumber.from(10).pow(ethers.BigNumber.from(inputDecimals)))
        .div(ethers.BigNumber.from(10).pow(ethers.BigNumber.from(outputDecimals)))
    }
  }
}

export default function Main({ stats, status }) {
  const { library, account } = useWeb3Context()

  // get exchange contracts
  const exchangeContractPINO = useExchangeContract(TOKEN_ADDRESSES.PINO)
  const exchangeContractDAI = useExchangeContract(TOKEN_ADDRESSES.DAI)

  // get token contracts
  const tokenContractPINO = useTokenContract(TOKEN_ADDRESSES.PINO)
  const tokenContractETH = useTokenContract(WETH[process.env.REACT_APP_CHAIN_ID].address)

  // get balances
  const balanceETH = useAddressBalance(account, TOKEN_ADDRESSES.ETH)
  const balancePINO = useAddressBalance(account, TOKEN_ADDRESSES.PINO)

  // totalsupply
  const totalSupply = useTotalSupply(tokenContractPINO)

  // get allowances
  const allowancePINO = useExchangeAllowance(account, TOKEN_ADDRESSES.PINO)
  const allowanceETH = useExchangeAllowance(account, WETH[process.env.REACT_APP_CHAIN_ID].address)

  // get reserves
  const reserveETH = useAddressBalance(
    exchangeContractPINO && exchangeContractPINO.address,
    WETH[process.env.REACT_APP_CHAIN_ID].address
  )
  const reservePINO = useAddressBalance(exchangeContractPINO && exchangeContractPINO.address, TOKEN_ADDRESSES.PINO)

  const reserveDAIETH = useAddressBalance(
    exchangeContractDAI && exchangeContractDAI.address,
    WETH[process.env.REACT_APP_CHAIN_ID].address
  )
  const reserveDAIToken = useAddressBalance(exchangeContractDAI && exchangeContractDAI.address, TOKEN_ADDRESSES.DAI)

  const [USDExchangeRateETH, setUSDExchangeRateETH] = useState()

  const ready = !!(
    (account === null || allowancePINO) &&
    (account === null || allowanceETH) &&
    (account === null || balanceETH) &&
    (account === null || balancePINO) &&
    reserveETH &&
    reservePINO &&
    USDExchangeRateETH
  )

  useEffect(() => {
    try {
      const exchangeRateDAI = getExchangeRate(reserveDAIETH, reserveDAIToken)
      setUSDExchangeRateETH(exchangeRateDAI)
    } catch {
      setUSDExchangeRateETH()
    }
  }, [reserveDAIETH, reserveDAIToken])

  function _dollarize(amount, exchangeRate) {
    return amount.mul(exchangeRate).div(ethers.BigNumber.from(10).pow(ethers.BigNumber.from(18)))
  }

  function dollarize(amount) {
    return _dollarize(amount, USDExchangeRateETH)
  }

  const [dollarPrice, setDollarPrice] = useState()
  useEffect(() => {
    try {
      const PINOExchangeRateETH = getExchangeRate(reservePINO, reserveETH)
      setDollarPrice(
        PINOExchangeRateETH.mul(USDExchangeRateETH).div(ethers.BigNumber.from(10).pow(ethers.BigNumber.from(18)))
      )
    } catch {
      setDollarPrice()
    }
  }, [USDExchangeRateETH, reserveETH, reservePINO])

  async function unlock(buyingPINO = true) {
    const contract = buyingPINO ? tokenContractETH : tokenContractPINO
    const spenderAddress = exchangeContractPINO.address

    const estimatedGasLimit = await contract.estimateGas.approve(spenderAddress, ethers.constants.MaxUint256)
    const estimatedGasPrice = await library
      .getGasPrice()
      .then(gasPrice => gasPrice.mul(ethers.BigNumber.from(150)).div(ethers.BigNumber.from(100)))

    return contract.approve(spenderAddress, ethers.constants.MaxUint256, {
      gasLimit: calculateGasMargin(estimatedGasLimit, GAS_MARGIN),
      gasPrice: estimatedGasPrice,
    })
  }

  async function burn(amount) {
    const parsedAmount = ethers.utils.parseUnits(amount, 18)

    const estimatedGasPrice = await library
      .getGasPrice()
      .then(gasPrice => gasPrice.mul(ethers.BigNumber.from(150)).div(ethers.BigNumber.from(100)))

    const estimatedGasLimit = await tokenContractPINO.estimateGas.burn(parsedAmount)

    return tokenContractPINO.burn(parsedAmount, {
      gasLimit: calculateGasMargin(estimatedGasLimit, GAS_MARGIN),
      gasPrice: estimatedGasPrice,
    })
  }

  return stats ? (
    <Stats reservePINOToken={reservePINO} totalSupply={totalSupply} ready={ready} balancePINO={balancePINO} />
  ) : status ? (
    <Status totalSupply={totalSupply} ready={ready} balancePINO={balancePINO} />
  ) : (
    <Body
      ready={ready}
      unlock={unlock}
      burn={burn}
      dollarize={dollarize}
      dollarPrice={dollarPrice}
      balancePINO={balancePINO}
      reservePINOToken={reservePINO}
      totalSupply={totalSupply}
    />
  )
}
