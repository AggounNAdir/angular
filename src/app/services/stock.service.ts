import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StockService {

  private apiUrl = 'http://localhost:8082/api/stocks';

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
   
}
