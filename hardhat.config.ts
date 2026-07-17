import { config as loadEnv } from "dotenv";
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

loadEnv();

/** Only use PRIVATE_KEY when it looks like a real 32-byte hex key. */
function amoyAccounts(): string[] {
  const key = process.env.PRIVATE_KEY?.trim();
  if (!key || key.includes("your_wallet")) {
    return [];
  }
  const normalized = key.startsWith("0x") ? key.slice(2) : key;
  if (!/^[0-9a-fA-F]{64}$/.test(normalized)) {
    return [];
  }
  return [`0x${normalized}`];
}

/**
 * Hardhat configuration for Chronos (TypeScript).
 *
 * Networks:
 *  - hardhat / localhost — local development & testing
 *  - amoy               — Polygon Amoy Testnet (chainId 80002)
 */
const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.28",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },

  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },

  defaultNetwork: "hardhat",

  networks: {
    hardhat: {
      chainId: 31337,
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
    },
    amoy: {
      url:
        process.env.RPC_URL ||
        process.env.AMOY_RPC_URL ||
        "https://rpc-amoy.polygon.technology",
      chainId: process.env.CHAIN_ID ? Number(process.env.CHAIN_ID) : 80002,
      accounts: amoyAccounts(),
    },
  },

  etherscan: {
    apiKey: {
      polygonAmoy: process.env.POLYGONSCAN_API_KEY || "",
    },
  },

  gasReporter: {
    enabled: process.env.REPORT_GAS === "true",
    currency: "USD",
  },

  mocha: {
    timeout: 120_000,
  },
};

export default config;
