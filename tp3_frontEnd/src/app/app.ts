import { Component, signal, ViewChild } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { HeaderBar } from "./header-bar/header-bar";

import { AppRoutingModule } from './app-routing-module';


@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    HeaderBar
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

}
