import { Component, output } from '@angular/core';
import { OrderEntry } from '../interfaces/order-entry';

@Component({
  selector: 'app-fruit-entry',
  imports: [],
  templateUrl: './fruit-entry.html',
  styleUrl: './fruit-entry.css',
})
export class FruitEntry {

  title : string = "fruitTitle"
  quantity = "fruitQuantity"
  price = 10


  orderEntry : OrderEntry = {
    fruitName : this.title,
    desiredQuantity : 0,
    unitPrice : this.price
  }


  quantityChangedEvent = output<OrderEntry>();
  removeEvent = output<OrderEntry>();

  protected increase(){
    this.orderEntry.desiredQuantity += 1;
    this.quantityChangedEvent.emit(this.orderEntry);
  }

  protected decrease(){
    if ( this.orderEntry.desiredQuantity > 0) {
       this.orderEntry.desiredQuantity -= 1;

      if( this.orderEntry.desiredQuantity== 0){
        this.removeEvent.emit( this.orderEntry);
      }
      else{
        this.quantityChangedEvent.emit( this.orderEntry);
      }

    }

  }

}
