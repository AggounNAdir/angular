import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ADDClient, Client } from '../models/models';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

   private apiUrl = 'http://localhost:8082/api/clients';
 
   constructor(private http: HttpClient) {}
 
   private getHeaders(): HttpHeaders {
     return new HttpHeaders({
       'Authorization': `Bearer ${localStorage.getItem('token')}`,
       'Content-Type': 'application/json'
     });
   }
   loadingClients(): Observable<ADDClient[]> {
    
     return this.http.get<ADDClient[]>(this.apiUrl, { headers: this.getHeaders() });
   }
 
   getClients(): Observable<Client[]> {
     return this.http.get<Client[]>(this.apiUrl, { headers: this.getHeaders() });
   }
 
   addClient(client: ADDClient): Observable<ADDClient> {
     return this.http.post<ADDClient>(this.apiUrl, client, { headers: this.getHeaders() });
   }
 
   updateClient(id: number, client: ADDClient): Observable<ADDClient> {
     return this.http.put<ADDClient>(`${this.apiUrl}/${id}`, client, { headers: this.getHeaders() });
   }
 
   deleteClient(id: number): Observable<void> {
     return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
   }
 
   ajouterVersementAuClient(versement: any): Observable<any> {
     return this.http.post(`${this.apiUrl}/versement`, versement, { headers: this.getHeaders() });
   }
 
   // Modifier un versement existant
   modifierVersementAuClient(id: number, versement: any,montant: number): Observable<any> {
     return this.http.put(`${this.apiUrl}/versement/${id}?montant=${montant}`,versement, { headers: this.getHeaders() });
   }
 
   deleteVersementAuClient(id: number): Observable<any> {
     return this.http.delete(`${this.apiUrl}/versement/${id}`,  { headers: this.getHeaders() ,responseType: 'text' });
   }
    getAllVersement(): Observable<any[]> {
     return this.http.get<any>(`${this.apiUrl}/versement`, { headers: this.getHeaders() });
 
    }
 
    getSituationClients(): Observable<any> {
     return this.http.get<any>(`${this.apiUrl}/situation`, { headers: this.getHeaders() });
   }
   getSituationFinanciere(clientId: number): Observable<any> {
     return this.http.get<any>(`${this.apiUrl}/situationclient/${clientId}`, { headers: this.getHeaders() });
   }
}
