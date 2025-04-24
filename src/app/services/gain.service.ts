import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GainDTO } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class GainService {

  private apiUrl = 'http://localhost:8082/api/gains/produit-fournisseur'; // L'URL de votre API Spring Boot

  constructor(private http: HttpClient) { }

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
  // Méthode pour récupérer les gains par produit et fournisseur
  getGainParProduitEtFournisseur(startDate: string, endDate: string): Observable<GainDTO[]> {
    // Créer les paramètres de la requête HTTP
    const params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);

    return this.http.get<GainDTO[]>(this.apiUrl, { params,headers: this.getHeaders()  });
  }
  getGainTotalParFournisseur(fournisseurId: number): Observable<number> {
    return this.http.get<number>(`http://localhost:8082/api/gains/fournisseur/${fournisseurId}`, { headers: this.getHeaders()  });
  }
}