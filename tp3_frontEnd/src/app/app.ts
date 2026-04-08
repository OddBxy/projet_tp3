import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';


import { FruitMarketAccessor } from './services/fruit-market-accessor';
import { FruitEntry } from './fruit-entry/fruit-entry';
import { Fruit } from './interfaces/fruit';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet, 
    FruitEntry
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

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

  public remove(event : any){
    console.log(event)
  }

  public quantityChanged(event : any){
    console.log(event)
  }

}
