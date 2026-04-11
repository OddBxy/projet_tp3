import { Injectable, signal } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { createPublicClient, createWalletClient, http, parseEther, parseEventLogs, TransactionReceipt } from "viem";
import { privateKeyToAccount } from "viem/accounts";
//import { hardhat } from "viem/chains";

import { connect, getConnection, getEnsName, injected, readContract, switchChain, waitForTransactionReceipt, writeContract } from '@wagmi/core'
import { config } from '../wagmi.config'
import { hardhat } from '@wagmi/core/chains';

import abi from '../../contractAbi/FruitMarket.json'; 
import { OrderEntry } from '../interfaces/order-entry';
import { Fruit } from '../interfaces/fruit';

@Injectable({
  providedIn: 'root',
})


export class FruitMarketAccessor {

  availableFruits : BehaviorSubject<Fruit[]> = new BehaviorSubject<Fruit[]>([]);

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

  walletAddresses = signal<Readonly<string[]>>([]);

  
  public async connection() : Promise<any>{
    try{
      const wallet = await connect(config, {connector : injected()});

      // const owner = await readContract(config, {
      //   address: this.contractAddress,
      //   abi: abi.abi,
      //   functionName: 'owner',
      // })
      // console.log("owner : ", owner)
      // console.log("wallet : ", wallet)

      if (wallet.accounts && wallet.accounts.length > 0) {
        this.walletAddresses.set(wallet.accounts);
        return this.walletAddresses();
      } else {
        throw "connection failed !";
      }

    } catch(error) {
      throw error;
    }  
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


  unwatch = this.publicClient.watchEvent({
    onLogs: logs => {
      console.log(logs);
      this.discoverCatalog();
    }
  });
  
  
  public async discoverCatalog(): Promise<BehaviorSubject<Fruit[]>> {

    try {
      var newFruitList : Fruit[] = []
      const fruitNameList = await this.publicClient.readContract({
        address: this.contractAddress,
        abi: abi.abi,
        functionName: 'getAvailableFruitsList',
      }) as string[];


      const promises = fruitNameList.map(async (element) => {
        const fruit = await this.getFruit(element);
        return {
          fruitName: fruit.name,
          price: fruit.price,
          quantity: fruit.quantity
        } as Fruit;
      });

      const resolvedFruits = await Promise.all(promises);
      this.availableFruits.next(resolvedFruits);

    } catch (error) {
      throw error;
    }

    return this.availableFruits;
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
      throw error;
    }

    return fruit;

  }


  public async buy(entry : OrderEntry) : Promise<TransactionReceipt> {
    console.log(abi)
    if (!this.isConnected()) {
      throw "error, no wallet connected !";
    }


    try {
      const price = (entry.desiredQuantity * entry.unitPrice).toString();

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
      const detailedError = "Error happened during payment : " + error;
      throw detailedError;
    }
  }
}
