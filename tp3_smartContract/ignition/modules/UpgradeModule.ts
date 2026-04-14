import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { proxyModule } from "./ProxyModule";

import dotenv from 'dotenv';
dotenv.config();

const upgradeModule = buildModule("UpgradeModule", (m) => {
    const { proxy, proxyAdmin } = m.useModule(proxyModule);

    const contractAddress = `${process.env.SEPOLIA_CONTRACT_ADDRESS}`
    //const contractAddress = `${process.env.LOCAL_CONTRACT_ADDRESS}`
    const fruitMarketV2 = m.contract("FruitMarketV2");



    m.call(proxyAdmin, "upgradeAndCall", [
        proxy,
        fruitMarketV2,
        "0x"
    ]);

    return { proxy };
});

export default upgradeModule;