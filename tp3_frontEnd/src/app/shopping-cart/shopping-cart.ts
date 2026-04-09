import { Component, output } from '@angular/core';
import { OrderEntry } from '../interfaces/order-entry';

@Component({
  selector: 'app-shopping-cart',
  imports: [],
  templateUrl: './shopping-cart.html',
  styleUrl: './shopping-cart.css',
})
export class ShoppingCart {

  cart = new Map<string, OrderEntry>();
  total = 0;
  buyEvent = output<Map<string, OrderEntry>>();

  public updateCart(entry : OrderEntry){
    if(entry.desiredQuantity == 0){
      this.cart.delete(entry.fruitName);
    }
    else {
      this.cart.set(entry.fruitName, entry);
    }

    this.total = 0;
    this.cart.forEach(element => {
      this.total += element.desiredQuantity * element.unitPrice
    });
  }

  protected buy(){
    this.buyEvent.emit(this.cart);
  }
}
