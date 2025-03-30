import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { Fournisseur, Produit } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class AchatService {
  private apiUrl = 'http://localhost:8082/api/achats'; // 🔗 URL du backend

  constructor(private http: HttpClient) {}

  // 📌 Obtenir le token stocké (localStorage ou sessionStorage)
  private getToken(): string | null {
    return localStorage.getItem('token'); // 🔑 Change selon ton stockage
  }

  // 📌 Générer les headers avec le token
  private getHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : ''
    });
  }
  getProduits(): Observable<Produit[]> {
    return this.http.get<Produit[]>('http://localhost:8082/api/produits', { headers: this.getHeaders() });
  }
   getFournisseurs(): Observable<Fournisseur[]> {
      return this.http.get<Fournisseur[]>('http://localhost:8082/api/fournisseurs', { headers: this.getHeaders() });
    }
  // 📌 Obtenir la liste des achats
  getAchats(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  // 📌 Obtenir un achat par ID
  getAchatById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  // 📌 Ajouter un achat
  createAchat(achat: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, achat, { headers: this.getHeaders() })
      .pipe(
        // Log the response for debugging
        tap((response) => console.log('Server Response:', response)),
  
        // Handle potential errors in the response body
        map((response: any) => {
          if (response && response.status === 'error') {
            // If the response contains an error, throw an error
            throw new Error(response.message || 'Server returned an error.');
          }
          return response; // Return the response if it's successful
        }),
  
        // Handle HTTP errors (e.g., 4xx, 5xx)
        catchError((error: HttpErrorResponse) => {
          console.error('HTTP Error:', error);
  
          // Customize the error message based on the error status
          let errorMessage = 'An error occurred while creating the achat.';
          if (error.status === 400) {
            errorMessage = 'Invalid data provided.';
          } else if (error.status === 401) {
            errorMessage = 'Unauthorized: Please log in.';
          } else if (error.status === 500) {
            errorMessage = 'Server error: Please try again later.';
          }
  
          // Return a user-friendly error message
          return throwError(() => new Error(errorMessage));
        })
      );
  }

  // 📌 Supprimer un achat
  deleteAchat(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  getDetailsAchat(achatId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${achatId}/details`, { headers: this.getHeaders() });
  }

  // 🔥 Supprimer un détail d'achat
  supprimerDetail(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/detailAchats/${id}`, { headers: this.getHeaders() });
  }

  // 🔥 Modifier un détail d'achat (si besoin)
  modifierDetail(id: number, detail: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/detailAchats/${id}`, detail, { headers: this.getHeaders() });
  }
  getAchatsByFournisseur(fournisseurId: number) {
    return this.http.get<any[]>(`${this.apiUrl}/fournisseur/${fournisseurId}`, { headers: this.getHeaders() });
  }
}
