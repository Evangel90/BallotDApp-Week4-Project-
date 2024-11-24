import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract, ethers } from "ethers";
import { toHex } from "viem";

/**
 * Deploys a contract named "YourContract" using the deployer account and
 * constructor arguments set to the deployer address
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployContracts: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  /*
    On localhost, the deployer account is the one that comes with Hardhat, which is already funded.

    When deploying to live networks (e.g `yarn deploy --network sepolia`), the deployer account
    should have sufficient balance to pay for the gas fees for contract creation.

    You can generate a random account with `yarn generate` which will fill DEPLOYER_PRIVATE_KEY
    with a random private key in the .env file (then used on hardhat.config.ts)
    You can run the `yarn account` command to check your balance in every network.
  */
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  await deploy("BallotDappToken", {
    from: deployer,
    // Contract constructor arguments
    // args: [deployer],
    log: true,
    // autoMine: can be passed to the deploy function to make the deployment process faster on local networks by
    // automatically mining the contract deployment transaction. There is no effect on live networks.
    autoMine: true,
  });

  // Get the deployed contract to interact with it after deploying.
  const tokenContract = await hre.ethers.getContract<Contract>("BallotDappToken", deployer);
  const tokenAddress = await tokenContract.getAddress();
  // console.log("👋 Initial greeting:", await yourContract.greeting());
  console.log(`Token has been deployed to ${tokenAddress}`)

  const provider = hre.ethers.provider;
  const targetBlockNumber = await provider.getBlockNumber()
  const proposals = ["proposal1", "proposal2", "proposal3"];
  const proposalsBytes32 = proposals.map((prop) => toHex(prop, { size: 32 }));

  await deploy("Ballot", {
    from: deployer,
    // Contract constructor arguments
    args: [
      proposalsBytes32,
      tokenAddress,
      targetBlockNumber
    ],
    log: true,
    // autoMine: can be passed to the deploy function to make the deployment process faster on local networks by
    // automatically mining the contract deployment transaction. There is no effect on live networks.
    autoMine: true,
  });

  const ballotContract = await hre.ethers.getContract<Contract>("Ballot", deployer);
  const ballotAddress = await ballotContract.getAddress();
  console.log(`Ballot contract has been deployed to ${ballotAddress}`)
};

export default deployContracts;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags YourContract
deployContracts.tags = ["BallotDappToken"];
