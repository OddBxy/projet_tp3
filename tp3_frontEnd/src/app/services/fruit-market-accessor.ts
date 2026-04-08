import { Injectable } from '@angular/core';

import { createPublicClient, createWalletClient, http, parseEventLogs } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { hardhat } from "viem/chains";

import abi from '../../contractAbi/FruitMarket.json'; 

@Injectable({
  providedIn: 'root',
})


export class FruitMarketAccessor {

  //adresse de la chain où le contrat est deployé 
  //transport = http(process.env.SEPOLIA_RPC_URL);
  chainAddress = http("http://127.0.0.1:8545");

  //adresse du contrat du proxy récuperer après deploy
  contractAddress : `0x${string}` = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

  //client publique (ne peux pas faire de tx, mais peut lire ce qui est exposé par le contrat, c'est du readOnly)
  publicClient = createPublicClient({
      chain: hardhat,
      transport: this.chainAddress,
  });
  
  
  public async discoverCatalog(): Promise<string[]> {

    var availableFruitList : string[] = [];

    try {
      availableFruitList = await this.publicClient.readContract({
        address: this.contractAddress,
        abi: abi.abi,
        functionName: 'getAvailableFruitsList',
      }) as string[];

    } catch (error) {
      console.log(error)
    }


    return availableFruitList;
  }
}
