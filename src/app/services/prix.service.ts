import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PrixService {

  private apiUrl = 'http://localhost:8082/api/client-prix'; // Assure-toi que c'est la bonne URL

  constructor(private http: HttpClient) {}

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
  getPrixByClientAndProduit(clientId: number, produitId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/${clientId}/${produitId}`, { headers: this.getHeaders() });
  }

  // 🔹 Récupérer tous les prix pour un client
  getPrixByClient(clientId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/client/${clientId}`, { headers: this.getHeaders() });
  }

  // 🔹 Récupérer tous les prix pour un produit
  getPrixByProduit(produitId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/produit/${produitId}`, { headers: this.getHeaders() });
  }

  // 🔹 Ajouter ou modifier un prix
  ajouterOuModifierPrix(prixData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, prixData, { headers: this.getHeaders() });
  }

  // 🔹 Supprimer un prix spécifique
  supprimerPrix(clientId: number, produitId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${clientId}/${produitId}`, { headers: this.getHeaders() });
  }

  // 🔹 Récupérer tous les prix enregistrés
  getAllPrix(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/all`, { headers: this.getHeaders() });
  }
}
