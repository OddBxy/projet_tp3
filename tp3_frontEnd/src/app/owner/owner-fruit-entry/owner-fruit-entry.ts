import { Component, input, output } from '@angular/core';
import { Fruit } from '../../interfaces/fruit';

@Component({
  selector: 'app-owner-fruit-entry',
  imports: [],
  templateUrl: './owner-fruit-entry.html',
  styleUrl: './owner-fruit-entry.css',
})
export class OwnerFruitEntry {

  fruitEntry = input.required<Fruit>();


  modifyPressed = output<Fruit>();
  deletePressed = output<Fruit>();

  protected modify(){
    this.modifyPressed.emit(this.fruitEntry());
  }

  protected delete(){
    this.deletePressed.emit(this.fruitEntry())
  }
}
