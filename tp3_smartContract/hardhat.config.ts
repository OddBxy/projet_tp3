import { defineConfig } from "hardhat/config";
import hardhatToolboxViemPlugin from "@nomicfoundation/hardhat-toolbox-viem";


import dotenv from 'dotenv';
import { verify } from "crypto";
dotenv.config();


module.exports = {
  plugins: [hardhatToolboxViemPlugin],
  solidity: {
    version: "0.8.28",
    npmFilesToBuild: [
      "@openzeppelin/contracts/proxy/transparent/ProxyAdmin.sol",
      "@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol",
    ],
  },
  networks: {
    hardhat: {
      type: "edr-simulated",
      url : "http://127.0.0.1:8545",
      chainId : 31337,
      accounts: {
        mnemonic: "seed",
        path: "m/44'/60'/0'/0",
        initialIndex: 0,
        count: 10,
        accountsBalance: "10000000000000000000000", // 10,000 ETH
      },
    },
    sepolia: {
      type: "http",
      url: process.env.SEPOLIA_RPC_URL!,
      accounts: [`0x${process.env.SEPOLIA_PRIVATE_KEY!}`],
    },    
  },
  verify : {
    etherscan : {
      apiKey : process.env.ETHERSCAN_API_KEY
    }
  }
};
