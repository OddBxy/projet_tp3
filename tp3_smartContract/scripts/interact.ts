import { createPublicClient, createWalletClient, http, parseEventLogs } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { hardhat } from "viem/chains";
import { parseAbiItem } from 'viem'


import dotenv from 'dotenv';
dotenv.config();


// Importe l'ABI (definition du contrat générée après la compilation par Hardhat qui sera exposé par les blockchain explorer)
import abi from '../artifacts/contracts/FruitMarket.sol/FruitMarket.json'; 



//script pour interagir avec le contrat sur la chaine
async function main() {

    //adresse de la chain où le contrat est deployé (locale dans ce cas)
    const transport = http("http://127.0.0.1:8545");

    //adresse du contrat récuperer après npx hardhat ignition deploy
    const contractAddress = `${process.env.LOCAL_CONTRACT_ADDRESS}`;

    //adresse du compte wallet (fausse adresse donne par npx hardhat node )
    const account = privateKeyToAccount(`${process.env.LOCAL_PRIVATE_KEY}`);
 

    //handle du compte wallet
    const walletClient = createWalletClient({
        account,
        chain: hardhat,
        transport,
    });


    //client publique (ne peux pas faire de tx, mais peut lire ce qui est exposé par le contrat, c'est du readOnly)
    const publicClient = createPublicClient({
        chain: hardhat,
        transport,
    });


    try {

        // const x = await publicClient.readContract({
        //     address: contractAddress,
        //     abi: abi.abi,
        //     functionName: 'getAvailableFruitsList',
        // });

        // compte wallet fait une tx à l'aide du contrat
        var hash = await walletClient.writeContract({
            address: contractAddress,
            abi: abi.abi,
            functionName: 'updateCatalog',
            args: ["apple", 10, 10],
        });

        var hash = await walletClient.writeContract({
            address: contractAddress,
            abi: abi.abi,
            functionName: 'updateCatalog',
            args: ["pear", 5, 10],
        });

        var hash = await walletClient.writeContract({
            address: contractAddress,
            abi: abi.abi,
            functionName: 'updateCatalog',
            args: ["banana", 10, 8],
        });

        var hash = await walletClient.writeContract({
            address: contractAddress,
            abi: abi.abi,
            functionName: 'updateCatalog',
            args: ["coconut", 6, 2],
        });

    } catch (error) {
        console.error("Erreur lors de l'interaction :", error);
    }
}

main();