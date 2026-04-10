import { http, createConfig } from '@wagmi/core';
import { mainnet, localhost, hardhat } from '@wagmi/core/chains';
import { injected } from '@wagmi/connectors';

export const config = createConfig({
  chains: [hardhat],
  connectors: [injected()], // Pour détecter MetaMask
  transports: {
    [hardhat.id]: http('http://127.0.0.1:8545'),
  },
});