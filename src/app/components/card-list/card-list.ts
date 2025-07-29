import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EditDialogComponent } from '../edit-dialog/edit-dialog';
import { environment } from '../../environments/environment';

import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-card-list',
  standalone: true,
  templateUrl: './card-list.html',
  styleUrls: ['./card-list.css'],
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ]
})
export class CardListComponent {
  staticCards = [
    { id: 1, title: 'Card 1', description: 'This is the description for card 1.' },
    { id: 2, title: 'Card 2', description: 'This is the description for card 2.' },
    { id: 3, title: 'Card 3', description: 'This is the description for card 3.' }
  ];

  backendCards: any[] = [];
  isLoading = false;

  private http = inject(HttpClient);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  private apiUrl = environment.apiUrl;

  constructor() {
    this.getBackendCards();
  }

  showError(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 4000,
      panelClass: ['snackbar-error'],
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }

  getBackendCards() {
    this.isLoading = true;
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: data => this.backendCards = data,
      error: err => {
        console.error('Fetch error:', err);
        this.showError('Failed to load backend cards.');
        this.isLoading = false;
      },
      complete: () => this.isLoading = false
    });
  }

  openAddDialog() {
    const dialogRef = this.dialog.open(EditDialogComponent, {
      data: { title: '', description: '' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.isLoading = true;
        this.http.post(this.apiUrl, result).subscribe({
          next: () => this.getBackendCards(),
          error: err => {
            console.error('Add error:', err);
            this.showError('Failed to add card.');
            this.isLoading = false;
          },
          complete: () => this.isLoading = false
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

        if (!card.id) {
          console.error('Card id is missing:', card);
          this.showError('Card ID is missing.');
          return;
        }

        this.isLoading = true;
        this.http.put(`${this.apiUrl}${card.id}/`, updatedCard).subscribe({
          next: () => this.getBackendCards(),
          error: err => {
            console.error('Update error:', err);
            this.showError('Failed to update card.');
            this.isLoading = false;
          },
          complete: () => this.isLoading = false
        });
      }
    });
  }

  deleteBackendCard(id: string) {
    this.isLoading = true;
    this.http.delete(`${this.apiUrl}${id}/`).subscribe({
      next: () => this.getBackendCards(),
      error: err => {
        console.error('Delete error:', err);
        this.showError('Failed to delete card.');
        this.isLoading = false;
      },
      complete: () => this.isLoading = false
    });
  }

  editStaticCard(card: any) {
    const dialogRef = this.dialog.open(EditDialogComponent, {
      data: { title: card.title, description: card.description }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        card.title = result.title;
        card.description = result.description;
      }
    });
  }
}
