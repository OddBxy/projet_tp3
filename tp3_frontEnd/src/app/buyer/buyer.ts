import { Component, signal, ViewChild } from '@angular/core';
import { FruitMarketAccessor } from '../services/fruit-market-accessor';
import { ShoppingCart } from '../shopping-cart/shopping-cart';
import { Fruit } from '../interfaces/fruit';
import { OrderEntry } from '../interfaces/order-entry';
import { FruitEntry } from '../fruit-entry/fruit-entry';
import { Subscription } from 'rxjs';

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

  fruitSubscription : Subscription = new Subscription();
  availableFruits = signal<Fruit[]>([]);

  constructor(private fruitMarketAccessor:FruitMarketAccessor){}
  ngOnInit(){
    this.getCatalog();
  }


  protected getCatalog(){    
    this.fruitMarketAccessor.discoverCatalog().then( (resolvedPromise) => {
      
      this.fruitSubscription = resolvedPromise.subscribe( newFruitList => {
        this.availableFruits.set(newFruitList);
      })

    });
  }

  protected quantityChanged(event : OrderEntry){
    this.shoppingCart.updateCart(event);
  }

  protected async buy(event : Map<string, OrderEntry>){
    for (const [name, entry] of event) {
      try {
        const receipt = await this.fruitMarketAccessor.buy(entry);
        console.log(receipt);
      } catch (error) {
        console.error("Error couldnt buy :", name, "\n cause : ", error);
      }
    }

  }



  ngOnDestroy() {
    this.fruitSubscription?.unsubscribe();
  }

}
