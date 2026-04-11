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
    this.fruitMarketAccessor.connection().then( (walletAddresses) => {

      this.fruitMarketAccessor.isWalletContractOwner(walletAddresses).then( isOwner =>{
        if(isOwner){
          this.router.navigate(['/owner']);
        } 
        else{
          this.router.navigate(['/buyer']);
        }

      })

    }).catch(err => {
      console.error("Error happened during connection :", err);
    });
  }
}
