import { Component } from '@angular/core';
import { CardListComponent } from './components/card-list/card-list';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CardListComponent],
  template: '<app-card-list></app-card-list>'
})
export class AppComponent {}
