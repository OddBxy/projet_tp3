pragma solidity ^0.8.28;

import "./FruitMarket.sol";

struct FruitOrder {
    string name;
    uint8 quantity;
}

contract FruitMarketV2 is FruitMarket {


    event fruitListBought(address sender, FruitOrder[] fruitList);

    function buyFruitList(FruitOrder[] calldata fruitList) public payable noReentrancy {
        require(fruitList.length > 0, "buyFruitList : list should not be empty");

        uint256 totalCost = 0;

        // calcul du prix
        for (uint256 i = 0; i < fruitList.length; i++) {
            Fruit storage wantedFruit = fruitsCatalog[fruitList[i].name];

            require(wantedFruit.quantity != 0, "buyFruitList : Fruit not available");
            require(wantedFruit.quantity >= fruitList[i].quantity, "buyFruitList : Not enough stock");

            totalCost += fruitList[i].quantity * wantedFruit.price;
        }

        // paiement
        require(msg.value >= totalCost, "buyFruitList : Insufficient funds");
        pay(totalCost);

        // mise a jour du storage
        for (uint256 i = 0; i < fruitList.length; i++) {
            Fruit storage wantedFruit = fruitsCatalog[fruitList[i].name];
            wantedFruit.quantity -= fruitList[i].quantity;
        }

        // enregistre la transaction
        emit fruitListBought(msg.sender, fruitList);
    }
}