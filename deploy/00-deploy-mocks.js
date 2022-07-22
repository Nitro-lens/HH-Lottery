const { developmentChains } = require("../helper-hardhat-config")
const { network } = require("hardhat")

const BASE_FEE = ethers.utils.parseEther("0.25") //0.25 is the premium. It costs 0.25 LINK/request
const GAS_PRICE_LINK = 1e9 //1000000000 //nice
//link per gas. calculated value based on the gas price on the chain
//So the price of the request changes based on the price of gas on the native blockchain
//Chainlink Nodes are the ones who pay the ETH gas price for computations
//And we give them LINK to balance for their expenses
//nice


module.exports = async function ({ getNamedAccounts, deployments }) {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const args = [BASE_FEE, GAS_PRICE_LINK]

    if (developmentChains.includes(network.name)) {
        log("Local network detected! Deploying mocks...")
        //deploy a mock vrfCoordinator
        await deploy("VRFCoordinatorV2Mock", {
            from: deployer,
            log: true,
            args: args,
        })
        log("Mocks deployed!")
        log("--------------------------------")
    }
}


module.exports.tags = ["all", "mocks"]