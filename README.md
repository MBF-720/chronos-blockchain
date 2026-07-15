# Chronos Blockchain

Blockchain module for **Chronos: Autonomous Campus Asset & Resource Sharing Platform**.

Hardhat + Solidity + TypeScript workspace targeting **Polygon Amoy Testnet**.

> Current contract: `ChronosToken.sol` — ERC-20 campus token with OpenZeppelin `AccessControl` minting.

---

## Tech Stack

| Tool | Purpose |
|------|---------|
| Hardhat 2.28 | Ethereum development environment |
| Solidity 0.8.28 | Smart contract language |
| TypeScript | Deployment scripts & tests |
| OpenZeppelin Contracts | ERC-20 + AccessControl |
| Ethers.js v6 | Blockchain interaction library |
| Hardhat Toolbox | ethers, chai, verify, network helpers |
| dotenv | Environment variable management |

---

## Project Structure

```
chronos-blockchain/
├── contracts/
│   └── ChronosToken.sol
├── scripts/
│   └── deployChronosToken.ts
├── test/
├── hardhat.config.ts
├── tsconfig.json
├── package.json
├── .env.example
├── .env
└── README.md
```

---

## Install

```bash
npm install
cp .env.example .env   # then set PRIVATE_KEY for Amoy deploys
```

---

## Compile

```bash
npx hardhat compile
# or
npm run compile
```

---

## Test

```bash
npx hardhat test
# or
npm test
```

---

## Deploy locally

```bash
# Terminal 1
npx hardhat node

# Terminal 2
npx hardhat run scripts/deployChronosToken.ts --network localhost
# or
npm run deploy:local
```

Ephemeral in-process network:

```bash
npx hardhat run scripts/deployChronosToken.ts
```

---

## Deploy to Polygon Amoy

1. Fund `PRIVATE_KEY` with Amoy POL ([faucet](https://faucet.polygon.technology/)).
2. Deploy:

```bash
npx hardhat run scripts/deployChronosToken.ts --network amoy
# or
npm run deploy:amoy
```

3. Verify (optional):

```bash
npx hardhat verify --network amoy <CONTRACT_ADDRESS> <ADMIN_ADDRESS>
```

- Chain ID: **80002**
- Explorer: [amoy.polygonscan.com](https://amoy.polygonscan.com/)

---

## ChronosToken (quick reference)

| Item | Value |
|------|--------|
| Name | Chronos Token |
| Symbol | CHRONOS |
| Decimals | 18 |
| Roles | `DEFAULT_ADMIN_ROLE`, `MINTER_ROLE` |
| Mint | `mintStudent(address)` → 100 CHRONOS |

---

## License

MIT
