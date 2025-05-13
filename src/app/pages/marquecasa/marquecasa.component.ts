import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MarqueCasaService } from '../../services/marque-casa.service';
import { ProduitService } from '../../services/produit.service';
import { ClientService } from '../../services/client.service';

export interface CartonSummaryDTO {
  clientId: number;
  produit: string;
  totalCartons: number;
}

@Component({
  selector: 'app-marquecasa',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './marquecasa.component.html',
  styleUrl: './marquecasa.component.scss'
})
export class MarquecasaComponent implements OnInit {
  produits: any[] = [];
  clients: any[] = [];
  marquesCasa: any[] = [];
  nouveauxProduits: any[] = [];
  selectedClientId: number | null = null;
  allLivraisons: any[] = [];
  totalTtc:number =0.00;
  cartonSummaries: CartonSummaryDTO[] = [];
filteredCartons: CartonSummaryDTO[] = [];
  newCasa = {
    clientId: 1,
    produit: null, // <- ici
    unite: '',
    prixVente: 0,
    quantite: 0,
    montant: 0
  };


  constructor(private marqueService: MarqueCasaService,private produitService: ProduitService,private clientService: ClientService) {}

  ngOnInit(): void {
    this.chargerProduits();
    this.chargerClients();
    this.loadAllLivraisons();
    this.marqueService.getTotalCartonsPerProductPerClient().subscribe(data => {
    this.cartonSummaries = data;
    this.onClientChange(); // applique filtre initial si client déjà sélectionné
  });
  }
  calculerTotalMontant(): number {
    return this.marquesCasa.reduce((total, item) => total + (item.montant || 0), 0);
  }
  

  onClientChange(): void {
    //this.filtrerParClientEtMarque();
    this.loadAllLivraisons();
    this.totalTtc = this.calculerTotalTTC();
    console.log(this.totalTtc);
    this.filteredCartons = this.cartonSummaries.filter(c => c.clientId === +this.selectedClientId!);
  
  }
  

  chargerProduits() {
    this.produitService.getProduits().subscribe({
      next: (data) => {
        this.produits = data;
        console.log('Produits chargés:', data);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des produits:', error);
      },
    });
  }

  calculerTotalTTC(): number {
    return this.allLivraisons.reduce((somme, detail) => somme + (detail.montantTtc || 0), 0);
  }
  

  chargerClients() {
    this.clientService.getClients().subscribe({
      next: (data) => {
        this.clients = data;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des clients:', error);
      },
    });
  }
  loadAllLivraisons(): void {
    if (this.selectedClientId !== null) {
      this.marqueService.getAllLivraisons(this.selectedClientId).subscribe(data => {
        this.allLivraisons = data;
        console.log(data);
  
        this.totalTtc = this.calculerTotalTTC(); // 👈 déplacer ici !
        console.log('Total TTC:', this.totalTtc);
      });
    }
  }
  

  
  
  
  

}
