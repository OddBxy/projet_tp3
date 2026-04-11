import { Component, signal, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { FruitMarketAccessor } from '../services/fruit-market-accessor';
import { Fruit } from '../interfaces/fruit';
import { FruitModifier } from './fruit-modifier/fruit-modifier';
import { OwnerFruitEntry } from './owner-fruit-entry/owner-fruit-entry';
import { Panel } from '../panel/panel';

@Component({
  selector: 'app-owner',
  imports: [FruitModifier, OwnerFruitEntry, Panel],
  templateUrl: './owner.html',
  styleUrl: './owner.css',
})
export class Owner {

  @ViewChild('fruitModifier') fruitModifier !: FruitModifier;

  fruitSubscription : Subscription = new Subscription();
  availableFruits = signal<Fruit[]>([]);

  showError = signal(false);
  protected errorLogs : string = "";

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

  protected addFruitPressed(){
    this.fruitModifier.fruit.update( current => current = undefined);
  }

  protected modify(fruit : Fruit){
    this.fruitModifier.fruit.update( current => current = fruit)
  }

  protected async delete(fruit : Fruit){
    try{
      await this.fruitMarketAccessor.deleteFruit(fruit);
    }catch(error){
      this.errorLogs = error as string;
      this.toggleErrorDialog();
    }
  }

  protected async updateCatalog(fruit : Fruit){
    try{
      await this.fruitMarketAccessor.updateCatalog(fruit);
    }catch(error){
      this.errorLogs = error as string;
      this.toggleErrorDialog();
    }
  }






  protected toggleErrorDialog() {
    const dialog = document.getElementById("errorLogDialog") as HTMLDialogElement;
    
    if (!this.showError()) {
      this.showError.set(true);
      setTimeout(() => dialog.showModal(), 0); 
    } else {
      dialog.close();
      this.showError.set(false);
    }
  }





  ngOnDestroy() {
    this.fruitSubscription?.unsubscribe();
  }
}
