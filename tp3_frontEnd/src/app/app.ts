import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';


import { FruitMarketAccessor } from './services/fruit-market-accessor';
import { FruitEntry } from './fruit-entry/fruit-entry';


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

  availableFruits = signal<string[]>([]);

  constructor(private fruitMarketAccessor:FruitMarketAccessor){}

  ngOnInit(){
    this.fruitMarketAccessor.discoverCatalog().then( (value) => {
      this.availableFruits.set(value);
      console.log(value)
    });
  }

  public remove(event : any){
    console.log(event)
  }

  public quantityChanged(event : any){
    console.log(event)
  }

}
