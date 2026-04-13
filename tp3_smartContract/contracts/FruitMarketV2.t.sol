// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import { FruitMarket, Fruit } from "./FruitMarket.sol";
import { FruitMarketV2, FruitOrder} from "./FruitMarketV2.sol";
import { Test } from "forge-std/Test.sol";
import "hardhat/console.sol";

contract FruitMarketV2Test is Test {
    FruitMarketV2 market;

    string ANY_FRUITNAME = "apple";
    uint8 ANY_QUANTITY = 5;
    uint8 ANY_PRICE = 3;


    string ANY_OTHER_FRUITNAME = "pear";
    uint8 ANY_OTHER_QUANTITY = 10;
    uint8 ANY_OTHER_PRICE = 3;

    Fruit ANY_FRUIT = Fruit(ANY_FRUITNAME, ANY_PRICE,ANY_QUANTITY);

    address OWNER_ADDRESS  = address(0x123);
    address ANY_OTHER_ADDRESS  = address(0x456);


    function setUp() public {
        //on simule etre l'owner pour deployer le contrat et on revient a la normal apres
        vm.startPrank(OWNER_ADDRESS);
        market = new FruitMarketV2();
        market.initialize(OWNER_ADDRESS);   //le contrat doit etre initialiser car deploye par proxy
        market.updateCatalog(ANY_FRUITNAME, ANY_PRICE, ANY_QUANTITY);
        market.updateCatalog(ANY_OTHER_FRUITNAME, ANY_OTHER_PRICE, ANY_OTHER_QUANTITY);
        vm.stopPrank();
    }


    function test_whenBuyingEmptyFruitList_thenStateShoudBeReverted() public {
        FruitOrder[] memory list;

        vm.expectRevert("buyFruitList : list should not be empty");
        market.buyFruitList{value: ANY_PRICE}(list);
    }


    function test_whenBuyingFruitListWithInsufficientFunds_thenStateShouldBeReverted() public {
        uint8 insufficientFunds = 2;

        FruitOrder[] memory list = new FruitOrder[](1);
        list[0] = FruitOrder(ANY_OTHER_FRUITNAME, ANY_QUANTITY);

        vm.expectRevert("buyFruitList : Insufficient funds");
        market.buyFruitList{value: insufficientFunds}(list);
    }


    function test_whenBuyingFruit_thenCatalogShouldBeUpdated() public {
        uint8 requestedQuantity = 2;
        uint8 expectedCost = 12;
        FruitOrder[] memory list = new FruitOrder[](2);
        list[0] = FruitOrder(ANY_FRUITNAME, requestedQuantity);
        list[1] = FruitOrder(ANY_OTHER_FRUITNAME, requestedQuantity);

        vm.deal(ANY_OTHER_ADDRESS, 50);
        vm.startPrank(ANY_OTHER_ADDRESS);
        market.buyFruitList{value: expectedCost}(list);

        Fruit memory fruitRetrieved = market.getFruit(ANY_FRUITNAME);
        uint8 expectedQuantity = ANY_QUANTITY - requestedQuantity;
        Fruit memory otherFruitRetrieved = market.getFruit(ANY_OTHER_FRUITNAME);
        uint8 otherExpectedQuantity = ANY_OTHER_QUANTITY - requestedQuantity;


        require(fruitRetrieved.quantity == expectedQuantity, "when buying a 2 of the same fruit, its quantity should be decreaseed by that amount");
        require(otherFruitRetrieved.quantity == otherExpectedQuantity, "when buying a 2 of the same fruit, its quantity should be decreaseed by that amount");
        vm.stopPrank();
    }


    function test_whenBuyingFruitList_thenTransactionShouldBeRegistred() public{
        uint8 expectedCost = 30;
        FruitOrder[] memory list = new FruitOrder[](1);
        list[0] = FruitOrder(ANY_OTHER_FRUITNAME, ANY_OTHER_QUANTITY);

        vm.expectEmit();
        emit FruitMarketV2.fruitListBought(ANY_OTHER_ADDRESS, list);
        
        vm.deal(ANY_OTHER_ADDRESS, 50);
        vm.startPrank(ANY_OTHER_ADDRESS);
        market.buyFruitList{value: expectedCost}(list);
        vm.stopPrank();
    }



}