import { http, createConfig } from '@wagmi/core';
import { mainnet, localhost } from '@wagmi/core/chains';
import { injected } from '@wagmi/connectors';

export const config = createConfig({
  chains: [mainnet, localhost],
  connectors: [injected()], // Pour détecter MetaMask
  transports: {
    [mainnet.id]: http(),
    [localhost.id]: http('http://127.0.0.1:8545'),
  },
});