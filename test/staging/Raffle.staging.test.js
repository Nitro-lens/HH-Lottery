const { assert, expect } = require("chai")
const { network, ethers, deployments } = require("hardhat")
const { developmentChains, networkConfig } = require("../../helper-hardhat-config")

//Should only run a test network
developmentChains.includes(network.name)
    ? describe.skip
    : describe("Raffle Unit Tests", async function () {
          let raffle, raffleEntranceFee, deployer //interval
          //const chainId = network.config.chainId

          beforeEach(async function () {
              deployer = (await getNamedAccounts()).deployer
              //await deployments.fixture(["all"])
              //we won't deploy this because we already expect the contract to be deployed
              raffle = await ethers.getContract("Raffle", deployer)
              raffleEntranceFee = await raffle.getEntranceFee()
          })

          describe("fulfillRandomWords", function () {
              it("works with live Chainlink VRF, we get a random winner", async function () {
                  //enter the raffle
                  const startingTimeStamp = await raffle.getLatestTimeStamp()
                  const accounts = await ethers.getSigners()

                  await new Promise(async (resolve, reject) => {
                      raffle.once("WinnerPicked", async () => {
                          //we only need this signal once, not checking it always
                          console.log("WinnerPicked event fired!")
                          try {
                              //add our asserts here
                              const recentWinner = await raffle.getRecentWinner()
                              const raffleState = await raffle.getRaffleState()
                              const winnerEndingBalance = await accounts[0].getBalance()
                              const endingTimeStamp = await raffle.getLatestTimeStamp()

                              await expect(raffle.getPlayer(0)).to.be.reverted
                              assert.equal(recentWinner.toString(), accounts[0].address)
                              assert.equal(
                                  winnerEndingBalance.toString(),
                                  winnerStartingBalance.add(raffleEntranceFee).toString()
                              )
                              assert(endingTimeStamp > startingTimeStamp)
                              resolve()
                          } catch (error) {
                              console.log(error)
                              reject(e)
                          }
                      })
                      //then entering the raffle
                      await raffle.enterRaffle({ value: raffleEntranceFee })
                      const winnerStartingBalance = await accounts[0].getBalance()

                      //and this code WON'T complete until our listener has finished listening!
                  })

                  //setup listener before we enter the raffle
                  //judt in case the blockchain moves REALLY fast

                  //enter the lottery
                  //await raffle.enterLottery
              })
          })
      })
