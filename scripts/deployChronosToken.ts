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
  await chronosToken.waitForDeployment();

  const address = await chronosToken.getAddress();

  console.log(` ChronosToken deployed to: ${address}`);
  console.log(` Name   : ${await chronosToken.name()}`);
  console.log(` Symbol : ${await chronosToken.symbol()}`);
  console.log("================================================");

  if (hre.network.name === "amoy") {
    console.log("\nVerify on Polygonscan (after a few confirmations):");
    console.log(
      `  npx hardhat verify --network amoy ${address} ${deployer.address}`
    );
  }
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
