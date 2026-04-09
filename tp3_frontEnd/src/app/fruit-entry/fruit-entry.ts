import { Component, output, input, effect } from '@angular/core';
import { OrderEntry } from '../interfaces/order-entry';
import { Fruit } from '../interfaces/fruit';

@Component({
  selector: 'app-fruit-entry',
  imports: [],
  templateUrl: './fruit-entry.html',
  styleUrl: './fruit-entry.css',
})
export class FruitEntry {

  fruitEntry = input.required<Fruit>();

  orderEntry : OrderEntry = {
    fruitName : "",
    desiredQuantity : 0,
    unitPrice : 0
  }
  
  quantityChangedEvent = output<OrderEntry>();


  constructor(){
    effect(() => {
      this.orderEntry.fruitName = this.fruitEntry().fruitName;
      this.orderEntry.unitPrice = this.fruitEntry().price;
    });
  }

  
  protected increase(){
    this.orderEntry.desiredQuantity += 1;
    this.quantityChangedEvent.emit(this.orderEntry);
  }

  protected decrease(){
    if ( this.orderEntry.desiredQuantity > 0) {
       this.orderEntry.desiredQuantity -= 1;

        this.quantityChangedEvent.emit( this.orderEntry);
    }

  }

}
