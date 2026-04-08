import hre from "hardhat";

import assert from "node:assert/strict";
import { describe, it } from "node:test";

import FruitMarketModule from "../ignition/modules/ProxyModule.js";

describe("fruit market Proxy", async function () {
  const { ignition, viem } = await hre.network.connect();

  describe("Proxy interaction", function () {
    it("Should be usable via proxy", async function () {
      const [, otherAccount] = await viem.getWalletClients();

      const { fruitMarket } = await ignition.deploy(FruitMarketModule);

      assert.deepStrictEqual(
        await fruitMarket.read.getAvailableFruitsList({ account: otherAccount.account.address }),
        [],
      );
    });
  });

});