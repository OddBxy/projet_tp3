import { Component, signal, ViewChild } from '@angular/core';
import { FruitMarketAccessor } from '../services/fruit-market-accessor';
import { ShoppingCart } from '../shopping-cart/shopping-cart';
import { Fruit } from '../interfaces/fruit';
import { OrderEntry } from '../interfaces/order-entry';
import { FruitEntry } from '../fruit-entry/fruit-entry';

@Component({
  selector: 'app-buyer',
  imports: [
    ShoppingCart,
    FruitEntry,
  ],
  templateUrl: './buyer.html',
  styleUrl: './buyer.css',
})
export class Buyer {
  
  @ViewChild('shoppingCart') shoppingCart !: ShoppingCart;
  availableFruits = signal<Fruit[]>([]);

  constructor(private fruitMarketAccessor:FruitMarketAccessor){}

  ngOnInit(){
    // this.fruitMarketAccessor.connection().then( (value) => {
    //   console.log(value)
    // });
    this.fruitMarketAccessor.discoverCatalog().then( (value) => {


      value.forEach(element => {
        this.fruitMarketAccessor.getFruit(element).then( (fruit) => {
          
          var newFruit : Fruit = {
            fruitName : fruit.name,
            price : fruit.price,
            quantity : fruit.quantity
          };

          this.availableFruits.update(list => {
            return [ ...list, newFruit]
          });

        })
      });

    });
  }

  protected quantityChanged(event : OrderEntry){
    this.shoppingCart.updateCart(event);
  }

  protected buy(event : Map<string, OrderEntry>){
    console.log(event);
  }



}
