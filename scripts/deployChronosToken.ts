import hre from "hardhat";

/**
 * Deploys ChronosToken and grants admin/minter roles to the deployer.
 *
 * Usage:
 *   npx hardhat run scripts/deployChronosToken.ts
 *   npx hardhat run scripts/deployChronosToken.ts --network localhost
 *   npx hardhat run scripts/deployChronosToken.ts --network amoy
 */
async function main(): Promise<void> {
  const [deployer] = await hre.ethers.getSigners();
  const network = await hre.ethers.provider.getNetwork();

  console.log("================================================");
  console.log(" Chronos — ChronosToken Deployment");
  console.log("================================================");
  console.log(` Network : ${hre.network.name} (chainId ${network.chainId})`);
  console.log(` Deployer: ${deployer.address}`);

  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log(` Balance : ${hre.ethers.formatEther(balance)} ETH/POL`);
  console.log("------------------------------------------------");

  // Pass the deployer as the constructor `admin` (DEFAULT_ADMIN_ROLE + MINTER_ROLE).
  const chronosToken = await hre.ethers.deployContract("ChronosToken", [
    deployer.address,
  ]);

  const deploymentTransaction = chronosToken.deploymentTransaction();
  if (!deploymentTransaction) {
    throw new Error("Deployment transaction was not created");
  }

  await chronosToken.waitForDeployment();
  const receipt = await deploymentTransaction.wait();
  if (!receipt) {
    throw new Error("Deployment transaction was not confirmed");
  }

  const address = await chronosToken.getAddress();
  const [name, symbol, totalSupply, deployerIsMinter] = await Promise.all([
    chronosToken.name(),
    chronosToken.symbol(),
    chronosToken.totalSupply(),
    chronosToken.hasMinterRole(deployer.address),
  ]);

  console.log(` Contract Address   : ${address}`);
  console.log(` Transaction Hash   : ${deploymentTransaction.hash}`);
  console.log(` Block Number       : ${receipt.blockNumber}`);
  console.log(` Network            : ${hre.network.name} (${network.chainId})`);
  console.log(` Deployer Address   : ${deployer.address}`);
  console.log(` Token Name         : ${name}`);
  console.log(` Token Symbol       : ${symbol}`);
  console.log(` Total Supply       : ${hre.ethers.formatUnits(totalSupply, 18)} ${symbol}`);
  console.log(` Admin Address      : ${deployer.address}`);
  console.log(` Deployer is Minter : ${deployerIsMinter}`);
  console.log("================================================");

  if (hre.network.name === "amoy") {
    console.log(` Explorer: https://amoy.polygonscan.com/address/${address}`);
  }
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
