import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {CatalogExplorer} from './catalog-explorer/catalog-explorer';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet, 
    CatalogExplorer,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('tp3_frontEnd');
}
