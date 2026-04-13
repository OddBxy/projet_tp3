import { http, createConfig } from '@wagmi/core';
import { mainnet, localhost, hardhat, sepolia } from '@wagmi/core/chains';
import { injected } from '@wagmi/connectors';

export const config = createConfig({
  chains: [sepolia, hardhat],
  connectors: [injected()], // Pour détecter MetaMask
  transports: {
    [sepolia.id]: http('https://eth-sepolia.g.alchemy.com/v2/7Jf1XsfHnLB8Ryv_o_3tD'),
    [hardhat.id]: http('http://127.0.0.1:8545'),
  },
});