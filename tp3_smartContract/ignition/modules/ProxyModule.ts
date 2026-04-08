import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";


//MODULE DE DEPLOIMENT DU PROXY
const proxyModule = buildModule("ProxyModule", (m) => {
    //on definit l'addresse de l'administrateur du proxy
    //const proxyAdminOwner = `0x${env.SEPOLIA_WALLET_ADDRESS}`;
    const proxyAdminOwner = m.getAccount(0);

    //on recupere l'abi contrat avec lequel on souhaite interagir au travers du proxy
    const fruitMarket = m.contract("FruitMarket");


    //encode un appel fonction initialiser le contrat au deploiement
    const encodedFunctionCall = m.encodeFunctionCall(
        fruitMarket, 
        "initialize", 
        [proxyAdminOwner,]
    );



    //on creer un contrat pour notre proxy
    const proxy = m.contract("TransparentUpgradeableProxy", [
        fruitMarket,                    //contrat
        proxyAdminOwner,                //address du proprietaire du proxy
        encodedFunctionCall,            //code de deploiement
    ]);


    //lecture des evenement pour recuperer l'adresse du proxy deploye
    const proxyAdminAddress = m.readEventArgument(
        proxy,
        "AdminChanged",
        "newAdmin",
    );

    //return le proxy
    const proxyAdmin = m.contractAt("ProxyAdmin", proxyAdminAddress);
    return { proxyAdmin, proxy };
});


//MODULE D'INTERACTION AVEC LE PROXY (et donc le contrat)
const fruitMarketModule = buildModule("FruitMarketModule", (m) => {
    //recupere le contrat du proxy
    const { proxy, proxyAdmin } = m.useModule(proxyModule);

    //recupere l'abi du contrat fruitMarket
    const fruitMarket = m.contractAt("FruitMarket", proxy);

    //return le contrat fruitMarket pour utilisation
    return { fruitMarket, proxy, proxyAdmin };
});

export default fruitMarketModule