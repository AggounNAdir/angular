import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ADDFournisseur, Fournisseur } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class FournisseurService {
  private apiUrl = 'http://localhost:8082/api/fournisseurs';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json'
    });
  }
  loadingFournisseurs(): Observable<ADDFournisseur[]> {
   
    return this.http.get<ADDFournisseur[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  getFournisseurs(): Observable<Fournisseur[]> {
    return this.http.get<Fournisseur[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  addFournisseur(fournisseur: ADDFournisseur): Observable<ADDFournisseur> {
    return this.http.post<ADDFournisseur>(this.apiUrl, fournisseur, { headers: this.getHeaders() });
  }

  updateFournisseur(id: number, fournisseur: ADDFournisseur): Observable<ADDFournisseur> {
    return this.http.put<ADDFournisseur>(`${this.apiUrl}/${id}`, fournisseur, { headers: this.getHeaders() });
  }

  deleteFournisseur(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  ajouterVersementAuFournisseur(versement: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/versement`, versement, { headers: this.getHeaders() });
  }

  // Modifier un versement existant
  modifierVersementAuFournisseur(id: number, versement: any,montant: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/versement/${id}?montant=${montant}`,versement, { headers: this.getHeaders() });
  }

  deleteVersementAuFournisseur(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/versement/${id}`,  { headers: this.getHeaders() ,responseType: 'text' });
  }
   getAllVersement(): Observable<any[]> {
    return this.http.get<any>(`${this.apiUrl}/versement`, { headers: this.getHeaders() });

   }

   getSituationFournisseurs(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/situation`, { headers: this.getHeaders() });
  }
  getSituationFinanciere(fournisseurId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/situationfournisseur/${fournisseurId}`, { headers: this.getHeaders() });
  }
  
}
