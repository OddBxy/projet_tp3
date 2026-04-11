import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { Buyer } from './buyer/buyer';
import { Login } from './login/login';
import { Owner } from './owner/owner';

export const routes : Routes = [
  { path: '', component: Login },
  { path : 'buyer', component : Buyer},
  { path : 'owner', component : Owner}

]


@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forRoot(routes)],
  exports: [RouterModule]
})


export class AppRoutingModule {}
