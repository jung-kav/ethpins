const hre = require('hardhat')
const ethers = require('ethers')
const UniswapV2Router02 = require('@uniswap/v2-periphery/build/UniswapV2Router02.json')

const UNISWAP_ROUTER_ABI = UniswapV2Router02.abi

async function main() {
  const [signer] = await hre.ethers.getSigners()
  const uniswapV2Router02 = new ethers.Contract(
    '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
    UNISWAP_ROUTER_ABI,
    signer
  )

  const now = new Date()
  const oneMinute = new Date(now + 5 * 60000)
  const expireTimestamp = oneMinute.valueOf()

  const gas = await uniswapV2Router02.estimateGas.addLiquidityETH(
    '0xE6E340D132b5f46d1e472DebcD681B2aBc16e57E',
    ethers.BigNumber.from(1000).toString(),
    ethers.BigNumber.from(1000).toString(),
    ethers.BigNumber.from(1).toString(),
    signer.address,
    expireTimestamp
  )

  console.log(gas)

  const result = await uniswapV2Router02.addLiquidityETH(
    '0xE6E340D132b5f46d1e472DebcD681B2aBc16e57E',
    ethers.BigNumber.from(1000),
    ethers.BigNumber.from(1000),
    ethers.BigNumber.from(1),
    signer.address,
    oneMinute.valueOf()
  )

  console.log(result)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
