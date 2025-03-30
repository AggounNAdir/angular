import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Categorie, Produit } from '../models/models';



@Injectable({
  providedIn: 'root'
})
export class ProduitService {
  private apiUrl = 'http://localhost:8082/api/produits';

  constructor(private http: HttpClient) {}

  private getToken(): string | null {
    return localStorage.getItem('token'); // Récupérer le token depuis localStorage
  }
  getStatistiques(): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`, // 🔥 Ajoute le token
      'Content-Type': 'application/json'
    });
    return this.http.get<any>('this.apiUrl/stock', { headers });
  }

  getCategories(): Observable<Categorie[]> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`, // 🔥 Ajoute le token
      'Content-Type': 'application/json'
    });
    return this.http.get<Categorie[]>('http://localhost:8082/api/categories', { headers });
  }
  
  // 📌 Fonction pour récupérer les produits
  getProduits(): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`, // 🔥 Ajoute le token
      'Content-Type': 'application/json'
    });

    return this.http.get(this.apiUrl, { headers });
  }

  ajouterProduit(produit: Produit): Observable<Produit> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`, // 🔥 Ajoute le token
      'Content-Type': 'application/json'
    });
    return this.http.post<Produit>(this.apiUrl, produit, { headers });
  }

  updateProduit(produit: Produit): Observable<Produit> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`, // 🔥 Ajoute le token
      'Content-Type': 'application/json'
    });
    return this.http.put<Produit>(`${this.apiUrl}/${produit.id}`, produit, { headers });
  }

  supprimerProduit(id: number): Observable<void> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`, // 🔥 Ajoute le token
      'Content-Type': 'application/json'
    });
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers });
  }
  getProductByBarcode(barcode: string): Observable<Produit> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`, // 🔥 Ajoute le token
      'Content-Type': 'application/json'
    });
    return this.http.get<Produit>(`${this.apiUrl}/${barcode}`, { headers });
  }
}