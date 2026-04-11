import { Component, output } from '@angular/core';

@Component({
  selector: 'app-panel',
  imports: [],
  templateUrl: './panel.html',
  styleUrl: './panel.css',
})
export class Panel {
  onClose = output();

  protected close(){
    this.onClose.emit();
  }
}
