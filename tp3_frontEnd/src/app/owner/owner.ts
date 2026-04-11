import { Component, signal, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { FruitMarketAccessor } from '../services/fruit-market-accessor';
import { Fruit } from '../interfaces/fruit';
import { FruitModifier } from './fruit-modifier/fruit-modifier';
import { OwnerFruitEntry } from './owner-fruit-entry/owner-fruit-entry';

@Component({
  selector: 'app-owner',
  imports: [FruitModifier, OwnerFruitEntry],
  templateUrl: './owner.html',
  styleUrl: './owner.css',
})
export class Owner {

  @ViewChild('fruitModifier') fruitModifier !: FruitModifier;

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

  protected addFruit(){
    this.fruitModifier.fruit.update( current => current = undefined);
  }

  protected modify(fruit : Fruit){
    this.fruitModifier.fruit.update( current => current = fruit)
  }

  protected delete(fruit : Fruit){
    this.fruitMarketAccessor.deleteFruit(fruit);
  }

  protected updateCatalog(fruit : Fruit){
    this.fruitMarketAccessor.updateCatalog(fruit);
  }

  ngOnDestroy() {
    this.fruitSubscription?.unsubscribe();
  }
}
