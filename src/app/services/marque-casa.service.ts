import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CartonSummaryDTO } from '../pages/marquecasa/marquecasa.component';

@Injectable({
  providedIn: 'root'
})
export class MarqueCasaService {
  private baseUrl = 'http://localhost:8082/gestion/marque-casa';

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

    addMarque(marque: any): Observable<any> {
      return this.http.post<any>(`${this.baseUrl}/add`, marque, { headers: this.getHeaders() });
    }
    getCasas(): Observable<any[]> {
      return this.http.get<any[]>(this.baseUrl, { headers: this.getHeaders() });
    }
    getAllLivraisons(clientId: number): Observable<any[]> {
      return this.http.get<any[]>(`${this.baseUrl}/details-livraison/client/${clientId}`, { headers: this.getHeaders() });
    }
   getTotalCartonsPerProductPerClient() {
  return this.http.get<CartonSummaryDTO[]>(`${this.baseUrl}/cartons-par-client-produit`, { headers: this.getHeaders() });
}


}
