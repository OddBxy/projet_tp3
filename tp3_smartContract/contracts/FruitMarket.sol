// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

struct Fruit {
    string name;
    uint8 price;
    uint8 quantity;
}

contract FruitMarket {

    mapping (string => Fruit) fruitsCatalog;
    string[] fruitsAvailableIndices;

    event update(Fruit fruit);
    event fruitBought(address sender, string fruitName, uint8 quantity);

    address payable public owner;
    bool public locked;

    constructor() payable {
        owner = payable(msg.sender);
    }

    // -------- mechanismes de securite -------- //
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can access this function");
        _;
    }

    modifier noReentrancy() {
        require(!locked, "No reentrancy");

        locked = true;
        _;
        locked = false;
    }
    // ----------------------------------------- //


    function updateCatalog(string calldata name, uint8 price, uint8 quantity) public onlyOwner {
        require(!compareStrings(name, ""), "updateCatalog: fruits must have names");
        require(quantity > 0, "updateCatalog: cannot add 0 fruit");


        // lorsqu'un element inexistant d'une mapp est indexe, il est initialise avec des valeurs 0 ou "" par defaut
        if(fruitsCatalog[name].quantity == 0){
            fruitsAvailableIndices.push(name);
        }

        //Enrigistre les modifications dans le catalogue
        Fruit memory fruit = Fruit(name, price, quantity);
        fruitsCatalog[name] = fruit;

        //Enregistre la transaction
        emit update(fruit);
    }

    function removeFruit(string calldata name) public onlyOwner {
        Fruit storage fruit = fruitsCatalog[name];
        require(fruit.quantity > 0, "removeFruit : fruit not in catalog");

        fruit.quantity = 0;
    }


    function getFruit(string memory fruitName) public view returns (Fruit memory){
        return fruitsCatalog[fruitName];
    }

    function getAvailableFruitsList() public view returns (string[] memory) {
        return fruitsAvailableIndices;
    }


    function buyFruit(string calldata fruitName, uint8 quantity) external payable {
        Fruit storage wantedFruit = fruitsCatalog[fruitName];

        require(wantedFruit.quantity != 0, "buyFruit : fruit requested not available");
        require(wantedFruit.quantity >= quantity, "buyFruit : There is not enough fruit, cannot give you as many as requested");

        //paie les fruits
        uint cost = quantity * wantedFruit.price;
        require(msg.value >= cost, "buyFruit : insufficient funds to buy this quantity");
        pay(cost);

        //mise à jours du catalogue
        wantedFruit.quantity -= quantity;

        //enregistre la transaction
        emit fruitBought(msg.sender, fruitName, quantity);
    }


    function pay(uint256 _amount) public {
        (bool success,) = owner.call{value: _amount}("");
        require(success, "Failed to send Ether");
    }


    function compareStrings(string memory a, string memory b) private pure returns (bool) {
        return (keccak256(abi.encodePacked((a))) == keccak256(abi.encodePacked((b))));
    }

}
