import { Component } from '@angular/core';
import { FruitMarketAccessor } from '../services/fruit-market-accessor';

@Component({
  selector: 'app-catalog-explorer',
  imports: [],
  templateUrl: './catalog-explorer.html',
  styleUrl: './catalog-explorer.css',
})
export class CatalogExplorer {

  constructor(private fruitMarketAccessor:FruitMarketAccessor){
    this.fruitMarketAccessor.discoverCatalog().then( (value) => {
      console.log(value);
    } );
  }


}
