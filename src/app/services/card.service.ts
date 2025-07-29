import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CardService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getCards() {
    return this.http.get(`${this.baseUrl}`);
  }

  addCard(card: any) {
    return this.http.post(`${this.baseUrl}`, card);
  }

  updateCard(id: string, card: any) {
    return this.http.put(`${this.baseUrl}${id}/`, card);  //
  }

  deleteCard(id: string) {
    return this.http.delete(`${this.baseUrl}${id}/`);
  }
}
