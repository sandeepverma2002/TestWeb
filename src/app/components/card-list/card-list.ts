// card-list.component.ts
import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog'; // Ensure this is imported
import { HttpClient } from '@angular/common/http';
import { EditDialogComponent } from '../edit-dialog/edit-dialog';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-card-list',
  standalone: true,
  templateUrl: './card-list.html',
  styleUrls: ['./card-list.css'],
  imports: [CommonModule, MatCardModule, MatButtonModule]
})
export class CardListComponent {
  staticCards = [
    { id: 1, title: 'Card 1', description: 'This is the description for card 1.' },
    { id: 2, title: 'Card 2', description: 'This is the description for card 2.' },
    { id: 3, title: 'Card 3', description: 'This is the description for card 3.' }
  ];

  backendCards: any[] = [];

  private http = inject(HttpClient);
  private dialog = inject(MatDialog); // MatDialog is already correctly injected here
  private apiUrl = environment.apiUrl;


  constructor() {
    this.getBackendCards();
  }

  getBackendCards() {
    this.http.get<any[]>(this.apiUrl).subscribe(data => this.backendCards = data);
  }

  openAddDialog() {
    const dialogRef = this.dialog.open(EditDialogComponent, {
      data: { title: '', description: '' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.http.post(this.apiUrl, result).subscribe(() => {
          this.getBackendCards();
        });
      }
    });
  }

  editBackendCard(card: any) {
    const dialogRef = this.dialog.open(EditDialogComponent, {
      data: { title: card.title, description: card.description }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        const updatedCard = { ...card, ...result };
        this.http.put(this.apiUrl + card._id + '/', updatedCard).subscribe(() => {
          this.getBackendCards();
        });
      }
    });
  }

  deleteBackendCard(id: string) {
    this.http.delete(this.apiUrl + id + '/').subscribe(() => {
      this.getBackendCards();
    });
  }

  // MODIFIED: Correctly update the static card properties
  editStaticCard(card: any) {
    const dialogRef = this.dialog.open(EditDialogComponent, {
      data: { title: card.title, description: card.description }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) { // Check if result is not null or undefined (i.e., "Save" was clicked)
        card.title = result.title;
        card.description = result.description;
      }
    });
  }
}
