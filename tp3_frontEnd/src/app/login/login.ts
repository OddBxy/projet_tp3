import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FruitMarketAccessor } from '../services/fruit-market-accessor';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  constructor(private router: Router, private fruitMarketAccessor : FruitMarketAccessor){

  }

  connect(){
    this.fruitMarketAccessor.connection().then( (account) => {
      console.log(account)
      if (account && account.accounts.length > 0) {
        this.router.navigate(['/buyer']);
      } else {
        console.warn("Connexion échouée");
      }

    }).catch(err => {
      console.error("Erreur lors de la connexion :", err);
    });
  }
}
