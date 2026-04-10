// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";

struct Fruit {
    string name;
    uint8 price;
    uint8 quantity;
}

contract FruitMarket is Initializable {

    mapping (string => Fruit) fruitsCatalog;    //catalogue des fruits
    string[] fruitsAvailableIndices;            //on ne peut pas return de mapping, donc on va utiliser aussi un tableau

    event update(Fruit fruit);
    event fruitBought(address sender, string fruitName, uint8 quantity);    //sert a enregistrer les tx

    // constructor() payable {
    //     owner = payable(msg.sender);
    // }

    // les contrat deploye par proxy doivent etre initializable
    function initialize(address _owner) public initializer {
        owner = payable(_owner);
    }


    // -------- mechanismes de securite -------- //
    address payable public owner;
    bool public locked;

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


    //fonction pour mettre a jour le catalogue
    //utiliser pour ajouter ou modifier des informations sur un fruit
    function updateCatalog(string calldata name, uint8 price, uint8 quantity) public onlyOwner {
        require(!compareStrings(name, ""), "updateCatalog: fruits must have names");
        require(quantity > 0, "updateCatalog: cannot add 0 fruit");


        // lorsqu'un element inexistant d'une mapp est indexe, il est initialise avec des valeurs 0 ou "" par defaut
        if(fruitsCatalog[name].quantity == 0){
            //si c'est le cas, il faut aussi l'ajouter a la liste des references de fruit
            fruitsAvailableIndices.push(name);
        }

        //Enrigistre les modifications dans le catalogue
        Fruit memory fruit = Fruit(name, price, quantity);
        fruitsCatalog[name] = fruit;

        //Enregistre la transaction
        emit update(fruit);
    }

    //foncton pour supprimer un fruit du catalogue
    function removeFruit(string calldata name) public onlyOwner {
        Fruit storage fruit = fruitsCatalog[name];
        require(fruit.quantity > 0, "removeFruit : fruit not in catalog");

        fruit.quantity = 0;
    }


    //fonction pour recuperer un fruit et ses informations
    function getFruit(string calldata fruitName) public view returns (Fruit memory){
        return fruitsCatalog[fruitName];
    }


    //fonction permettant au Dapps de decouvrir les fruits du catalogue
    function getAvailableFruitsList() public view returns (string[] memory) {
        return fruitsAvailableIndices;
    }

    //fonction pour acheter un fruit
    function buyFruit(string calldata fruitName, uint8 quantity) public payable {
        //reference directement les elements du catalogue avec storage et pas memory
        Fruit storage wantedFruit = fruitsCatalog[fruitName];   

        require(wantedFruit.quantity != 0, "buyFruit : fruit requested not available");
        require(wantedFruit.quantity >= quantity, "buyFruit : There is not enough fruit, cannot give you as many as requested");

        //paiement des fruits
        uint cost = quantity * wantedFruit.price;
        require(msg.value >= cost, "buyFruit : insufficient funds to buy this quantity");
        pay(cost);

        //mise à jours du catalogue
        wantedFruit.quantity -= quantity;

        //enregistre la transaction
        emit fruitBought(msg.sender, fruitName, quantity);
    }


    //fonction de transfer d'ether vers le proprietaire du contrat
    function pay(uint256 _amount) public {
        (bool success,) = owner.call{value: _amount}("");
        require(success, "Failed to send Ether");
    }


    //fonction utilitaire pour verifier l'egalite de string
    function compareStrings(string memory a, string memory b) private pure returns (bool) {
        return (keccak256(abi.encodePacked((a))) == keccak256(abi.encodePacked((b))));
    }

}
