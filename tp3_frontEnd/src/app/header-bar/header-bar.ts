import { Component } from '@angular/core';
import { FruitMarketAccessor } from '../services/fruit-market-accessor';

@Component({
  selector: 'app-header-bar',
  imports: [],
  templateUrl: './header-bar.html',
  styleUrl: './header-bar.css',
})
export class HeaderBar {

  constructor(protected fruitMarketAccessor : FruitMarketAccessor){}

  protected async disconnect(){
    await this.fruitMarketAccessor.disconnect();
  }

}
