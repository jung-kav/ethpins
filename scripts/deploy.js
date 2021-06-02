const hre = require('hardhat')

async function main() {
  const Ethpins = await hre.ethers.getContractFactory('Ethpins')
  const ethpins = await Ethpins.deploy()

  await ethpins.deployed()

  console.log('Ethpins deployed to:', ethpins.address)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
