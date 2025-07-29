import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { EditDialogComponent } from '../edit-dialog/edit-dialog';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-card-list',
  standalone: true,
  templateUrl: './card-list.html',
  styleUrls: ['./card-list.css'],
  imports: [CommonModule, MatCardModule, MatButtonModule, EditDialogComponent]
})
export class CardListComponent {
  staticCards = [
    { id: 1, title: 'Card 1', description: 'This is the description for card 1.' },
    { id: 2, title: 'Card 2', description: 'This is the description for card 2.' },
    { id: 3, title: 'Card 3', description: 'This is the description for card 3.' }
  ];

  backendCards: any[] = [];

  private http = inject(HttpClient);
  private dialog = inject(MatDialog);
  private apiUrl = 'http://localhost:8000/api/cards/';

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

  editStaticCard(card: any) {
  const dialogRef = this.dialog.open(EditDialogComponent, {
    data: { title: card.title, description: card.description }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result !== undefined) {
      card.title = result.title;
      card.description = result.description;
    }
  });
}

}
