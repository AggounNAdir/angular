import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategorieService {

  private apiUrl = 'http://localhost:8082/api/categories'; // Remplace avec ton URL backend
  private getToken(): string | null {
    return localStorage.getItem('token'); // Récupérer le token depuis localStorage
  }

  constructor(private http: HttpClient) {}

  // Obtenir toutes les catégories
  getCategories(): Observable<any[]> {
       const headers = new HttpHeaders({
            'Authorization': `Bearer ${this.getToken()}`, // 🔥 Ajoute le token
            'Content-Type': 'application/json'
          });
    return this.http.get<any[]>(`${this.apiUrl}`, { headers });
  }

  // Ajouter une nouvelle catégorie
  addCategory(category: any): Observable<any> {
       const headers = new HttpHeaders({
            'Authorization': `Bearer ${this.getToken()}`, // 🔥 Ajoute le token
            'Content-Type': 'application/json'
          });
    return this.http.post<any>(`${this.apiUrl}`, category, { headers });
  }

  // Modifier une catégorie existante
  updateCategory(id: number, category: any): Observable<any> {
       const headers = new HttpHeaders({
            'Authorization': `Bearer ${this.getToken()}`, // 🔥 Ajoute le token
            'Content-Type': 'application/json'
          });
    return this.http.put<any>(`${this.apiUrl}/${id}`, category, { headers });
  }

  // Supprimer une catégorie
  deleteCategory(id: number): Observable<void> {
       const headers = new HttpHeaders({
            'Authorization': `Bearer ${this.getToken()}`, // 🔥 Ajoute le token
            'Content-Type': 'application/json'
          });
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers });
  }
}
