const hre = require('hardhat')
const UniswapV2Router02 = require('@uniswap/v2-periphery/build/UniswapV2Router02.json')

const UNISWAP_ROUTER_ABI = UniswapV2Router02.abi

async function main() {
  const [signer] = await hre.ethers.getSigners()
  const uniswapV2Router02 = new hre.ethers.Contract(
    '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
    UNISWAP_ROUTER_ABI,
    signer
  )

  const now = new Date().getTime()
  const oneMinute = new Date(now.getTime() + 60000)

  uniswapV2Router02.addLiquidityETH(
    '0xE6E340D132b5f46d1e472DebcD681B2aBc16e57E',
    hre.ethers.BigNumber.from(1000),
    hre.ethers.BigNumber.from(1),
    hre.ether.BigNumber.from(1000),
    hre.ethers.BigNumber.from(0.9),
    signer.address,
    oneMinute.valueOf()
  )
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
