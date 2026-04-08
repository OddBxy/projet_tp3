// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import { FruitMarket, Fruit } from "./FruitMarket.sol";
import { Test } from "forge-std/Test.sol";
import "hardhat/console.sol";

contract FruitMarketTest is Test {
    FruitMarket market;

    string ANY_FRUITNAME = "apple";
    uint8 ANY_QUANTITY = 5;
    uint8 ANY_PRICE = 3;

    Fruit ANY_FRUIT = Fruit(ANY_FRUITNAME, ANY_PRICE,ANY_QUANTITY);

    address OWNER_ADDRESS  = address(0x123);
    address ANY_OTHER_ADDRESS  = address(0x456);


    function setUp() public {
        //on simule etre l'owner pour deployer le contrat et on revient a la normal apres
        vm.startPrank(OWNER_ADDRESS);
        market = new FruitMarket();
        vm.stopPrank();
    }


    function test_whenAddingFruit_thenFruitInfoShouldBeRetreivable() public {
        vm.startPrank(OWNER_ADDRESS);
        market.updateCatalog(ANY_FRUITNAME, ANY_PRICE, ANY_QUANTITY);

        Fruit memory fruit = market.getFruit(ANY_FRUITNAME);

        require(compareFruit(fruit, ANY_FRUIT), "given fruits infos, when adding fruit, then the market should posses the given fruit info");
        vm.stopPrank();
    }


    function test_whenUpdatingFruit_thenCatalogShouldGiveNewFruitInfo() public {
        vm.startPrank(OWNER_ADDRESS);
        Fruit memory fruitNewInfo = Fruit(ANY_FRUITNAME, 10, 10);
        market.updateCatalog(ANY_FRUITNAME, ANY_PRICE, ANY_QUANTITY);
        market.updateCatalog(fruitNewInfo.name, fruitNewInfo.price, fruitNewInfo.quantity);

        Fruit memory fruit = market.getFruit(ANY_FRUITNAME);
        string[] memory availableFruitsList = market.getAvailableFruitsList();

        require(compareFruit(fruit, fruitNewInfo), "given a fruit, when updating this fruit, then the market should posses the new given fruit info");
        require(availableFruitsList.length == 1, "given a fruit, when update this fruit, then list of available fruit should not be updated");
        vm.stopPrank();
    }


    function test_whenAddingFruitWithNoName_thenStateShouldBeReverted() public {
        vm.startPrank(OWNER_ADDRESS);
        vm.expectRevert("updateCatalog: fruits must have names");

        market.updateCatalog("", ANY_PRICE, ANY_QUANTITY);
        vm.stopPrank();
    }

    function test_whenAddingFruitWithNoQuantity_thenStateShouldBeReverted() public {
        vm.startPrank(OWNER_ADDRESS);
        vm.expectRevert("updateCatalog: cannot add 0 fruit");

        market.updateCatalog(ANY_FRUITNAME, ANY_PRICE, 0);
        vm.stopPrank();
    }


    function test_whenUpdating_shouldEmitsEvent() public {
        vm.startPrank(OWNER_ADDRESS);
        vm.expectEmit();
        emit FruitMarket.update(ANY_FRUIT);

        market.updateCatalog(ANY_FRUITNAME, ANY_PRICE, ANY_QUANTITY);
        vm.stopPrank();
    }

    function test_whenNonOwnerTriesToUpdateCatalog_thenStateShouldBeReverted() public {
        vm.startPrank(ANY_OTHER_ADDRESS);
        vm.expectRevert("Only owner can access this function");

        market.updateCatalog(ANY_FRUITNAME, ANY_PRICE, ANY_QUANTITY);

        vm.stopPrank();
    }



    function test_whenDeletingUnavailableFruit_thenStateShouldBeReverted() public {
        vm.startPrank(OWNER_ADDRESS);
        vm.expectRevert("removeFruit : fruit not in catalog");

        market.removeFruit(ANY_FRUITNAME);
        vm.stopPrank();
    }

    
    function test_whenNonOwnerTriesToRemoveFruit_thenStateShouldBeReverted() public {
        vm.startPrank(ANY_OTHER_ADDRESS);
        vm.expectRevert("Only owner can access this function");

        market.removeFruit(ANY_FRUITNAME);
        vm.stopPrank();
    }


    function test_whenOwnerRemovesFruit_thenFruitShouldNotBeAvailable() public {
        vm.startPrank(OWNER_ADDRESS);
        market.updateCatalog(ANY_FRUITNAME, ANY_PRICE, ANY_QUANTITY);
        market.removeFruit(ANY_FRUITNAME);
        vm.stopPrank();

        Fruit memory fruit = market.getFruit(ANY_FRUITNAME);
        require(fruit.quantity == 0, "when removing fruit, fruit shouldn't be available anymore");
    }



    function test_whenBuyingFruit_thenCatalogShouldBeUpdated() public {
        vm.startPrank(OWNER_ADDRESS);
        market.updateCatalog(ANY_FRUITNAME, ANY_PRICE, ANY_QUANTITY);
        vm.stopPrank();
        

        uint8 requestedQuantity = 2;
        uint8 expectedCost = 6;

        vm.deal(ANY_OTHER_ADDRESS, 50);
        vm.startPrank(ANY_OTHER_ADDRESS);
        market.buyFruit{value: expectedCost}(ANY_FRUITNAME, requestedQuantity);

        Fruit memory fruit = market.getFruit(ANY_FRUITNAME);
        uint8 expectedQuantity = ANY_QUANTITY - requestedQuantity;


        require(fruit.quantity == expectedQuantity, "when buying a 2 of the same fruit, its quantity should be decreaseed by that amount");
        vm.stopPrank();
    }


    function test_whenBuyingUnavailableFruit_thenStateShouldBeReverted() public {
        uint8 requestedQuantity = 2;
        uint8 anyCost = 6;

        vm.expectRevert("buyFruit : fruit requested not available");
        market.buyFruit{value: anyCost}(ANY_FRUITNAME, requestedQuantity);
    }


    function test_whenBuyingMoreThanAvailable_thenStateShouldBeReverted() public {
        vm.startPrank(OWNER_ADDRESS);
        market.updateCatalog(ANY_FRUITNAME, ANY_PRICE, ANY_QUANTITY);
        vm.stopPrank();
        uint8 requestedQuantity = 20;
        uint8 anyCost = 6;

        vm.expectRevert("buyFruit : There is not enough fruit, cannot give you as many as requested");
        market.buyFruit{value: anyCost}(ANY_FRUITNAME, requestedQuantity);
    }


    function test_whenBuyingFruitWithInsufficientFunds_thenStateShouldBeReverted() public {
        vm.startPrank(OWNER_ADDRESS);
        market.updateCatalog(ANY_FRUITNAME, ANY_PRICE, ANY_QUANTITY);
        vm.stopPrank();
        uint8 requestedQuantity = 2;
        uint8 insufficientFunds = 2;

        vm.expectRevert("buyFruit : insufficient funds to buy this quantity");
        market.buyFruit{value: insufficientFunds}(ANY_FRUITNAME, requestedQuantity);
    }


    function test_whenBuyingFruit_thenTransactionShouldBeRegistred() public{
        vm.startPrank(OWNER_ADDRESS);
        market.updateCatalog(ANY_FRUITNAME, ANY_PRICE, ANY_QUANTITY);
        vm.stopPrank();
        uint8 requestedQuantity = 2;
        uint8 expectedCost = 6;

        vm.expectEmit();
        emit FruitMarket.fruitBought(ANY_OTHER_ADDRESS, ANY_FRUITNAME, requestedQuantity);
        
        vm.deal(ANY_OTHER_ADDRESS, 50);
        vm.startPrank(ANY_OTHER_ADDRESS);
        market.buyFruit{value: expectedCost}(ANY_FRUITNAME, requestedQuantity);
        vm.stopPrank();
    }


    function test_whenBuyingFruit_thenEtherShouldBeTransfered() public {
        vm.startPrank(OWNER_ADDRESS);
        market.updateCatalog(ANY_FRUITNAME, ANY_PRICE, ANY_QUANTITY);
        vm.stopPrank();
        
        uint8 requestedQuantity = 2;
        uint8 expectedCost = 6;
        uint8 initialBalance = 50;
        uint8 expectedUpdatedBalance = 50-6;
        vm.deal(ANY_OTHER_ADDRESS, initialBalance);
        vm.startPrank(ANY_OTHER_ADDRESS);
        market.buyFruit{value: expectedCost}(ANY_FRUITNAME, requestedQuantity);
        vm.stopPrank();


        require(OWNER_ADDRESS.balance == expectedCost, "Owner should receive spent Ethers");
        require(ANY_OTHER_ADDRESS.balance == expectedUpdatedBalance, "Owner should lose spent Ethers");
    }



    function compareFruit(Fruit memory a, Fruit memory b) private pure returns (bool) {
        if ( !compareStrings(a.name, b.name) ){
            return false;
        } 

        if( a.quantity != b.quantity){
            return false;
        }

        if( a.price != b.price ){
            return false;
        } 

        return true;
    }

    function compareStrings(string memory a, string memory b) private pure returns (bool) {
        return (keccak256(abi.encodePacked((a))) == keccak256(abi.encodePacked((b))));
    }


}