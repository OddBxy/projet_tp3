import { Component, model, output } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Fruit } from '../../interfaces/fruit';

@Component({
  selector: 'app-fruit-modifier',
  imports: [ReactiveFormsModule ],
  templateUrl: './fruit-modifier.html',
  styleUrl: './fruit-modifier.css',
})
export class FruitModifier {

  fruit = model<Fruit>();
  newFruitInfo = output<Fruit>();

  formGroup = new FormGroup({
    fruitName: new FormControl(""),
    quantity: new FormControl(0),
    price: new FormControl(0),
  });

  protected modify(){
    this.newFruitInfo.emit(this.formGroup.value as Fruit);
  }
}
