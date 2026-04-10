import { Component, signal, ViewChild } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';

import { AppRoutingModule } from './app-routing-module';


@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

}
