import { Component, signal, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';


import { FruitMarketAccessor } from './services/fruit-market-accessor';
import { FruitEntry } from './fruit-entry/fruit-entry';
import { Fruit } from './interfaces/fruit';
import { ShoppingCart } from './shopping-cart/shopping-cart';
import { OrderEntry } from './interfaces/order-entry';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet, 
    FruitEntry,
    ShoppingCart
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  @ViewChild('shoppingCart') shoppingCart !: ShoppingCart;
  availableFruits = signal<Fruit[]>([]);

  constructor(private fruitMarketAccessor:FruitMarketAccessor){}

  ngOnInit(){
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
