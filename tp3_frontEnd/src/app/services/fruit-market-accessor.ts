import { Injectable, signal } from '@angular/core';

import { createPublicClient, createWalletClient, http, parseEther, parseEventLogs } from "viem";
import { privateKeyToAccount } from "viem/accounts";
//import { hardhat } from "viem/chains";

import { connect, getConnection, getEnsName, injected, switchChain, waitForTransactionReceipt, writeContract } from '@wagmi/core'
import { config } from '../wagmi.config'
import { hardhat } from '@wagmi/core/chains';

import abi from '../../contractAbi/FruitMarket.json'; 
import { OrderEntry } from '../interfaces/order-entry';

@Injectable({
  providedIn: 'root',
})


export class FruitMarketAccessor {

  //adresse de la chain où le contrat est deployé 
  //chainAddress = http(process.env.SEPOLIA_RPC_URL);
  chainAddress = http("http://127.0.0.1:8545");

  //adresse du contrat du proxy récuperer après deploy
  contractAddress : `0x${string}` = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
  fruitMarketConfig = {
    address: this.contractAddress,
    abi: abi.abi,
  } as const;



  //client publique (ne peux pas faire de tx, mais peut lire ce qui est exposé par le contrat, c'est du readOnly)
  publicClient = createPublicClient({
      chain: hardhat,
      transport: this.chainAddress,
  });

  walletAddress = signal<any>(null);

  
  public async connection() : Promise<any>{
    const address = await connect(config, {connector : injected()});
    this.walletAddress.set(address);

    return this.walletAddress();
  }

  public isConnected() : boolean{
    const connection = getConnection(config)
    if (connection.status == 'connected') {
      return true;
    }

    return false;
  }

  // public async disconnect() {
  //   await this.disconnect();
  // }

  availableFruits = signal<string[]>([]);
  
  
  public async discoverCatalog(): Promise<string[]> {


    try {
      const newlist = await this.publicClient.readContract({
        address: this.contractAddress,
        abi: abi.abi,
        functionName: 'getAvailableFruitsList',
      }) as string[];

      this.availableFruits.set(newlist);
    } catch (error) {
      console.log(error)
    }


    return this.availableFruits();
  }


  public async getFruit(fruitName : string) : Promise<any> {

    var fruit

    try {
      fruit = await this.publicClient.readContract({
        address: this.contractAddress,
        abi: abi.abi,
        functionName: 'getFruit',
        args : [fruitName]
      }) as string[];

    } catch (error) {
      console.log(error)
    }

    return fruit;

  }


  public async buy(entry : OrderEntry) : Promise<any> {
    console.log(abi)
    if (!this.isConnected()) {
      console.log("error, no wallet connected !")
      return;
    }


    try {
      const price = (entry.desiredQuantity * entry.unitPrice).toString();

      await switchChain(config, { chainId: hardhat.id });
      //Envoyer la transaction
      const hash = await writeContract(config, {
        ...this.fruitMarketConfig,
        chainId: hardhat.id,
        functionName: 'buyFruit',
        args: [entry.fruitName, entry.desiredQuantity],
        value: parseEther(price),
      });

      console.log("Transaction envoyée, hash:", hash);

      //Attendre la confirmation
      const receipt = await waitForTransactionReceipt(config, { hash });
      console.log("Transaction confirmée !", receipt);

      return receipt;

    } catch (error) {
      console.error("Error happened during payment : ", error);
    }
  }
}
