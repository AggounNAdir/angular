import { Component, OnInit } from '@angular/core';
import { GainDTO, GainDTOc } from '../../models/models';
import { GainService } from '../../services/gain.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FournisseurService } from '../../services/fournisseur.service';
import { ClientService } from '../../services/client.service';


@Component({
  selector: 'app-gains',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gains.component.html',
  styleUrl: './gains.component.scss'
})

export class GainsComponent {
  contributeurs: any[] = [];
contributeurSelectionneId: string | number | null = null;
gainTotalContributeur: number | null = null;
clients: any[] = [];

  gainsf: GainDTO[] = [];
  gainsc: GainDTOc[] = [];
  startDate!: string;
  endDate!: string;
  
  fournisseurs: any[] = [];
fournisseurSelectionneId: number | null = null;
gainTotalFournisseur: number | null = null;

  constructor(private clientService: ClientService,private gainService: GainService,private fournisseurService :FournisseurService) { }
 
  ngOnInit(): void {
    this.loadFournisseurs();
    this.loadClients();
  }
  loadClients(): void {
    // Tu peux ajouter ici une méthode qui charge les clients depuis un service
    this.clientService.getClients().subscribe(clients => {
      this.clients = clients;
      this.contributeurs = this.clients.filter(c => c.type === 'CONTRIBUTEUR');
    });
  }
  onContributeurChange() {
    if (!this.contributeurSelectionneId) {
      this.gainTotalContributeur = null;
      return;
    }
  
    this.gainTotalContributeur = this.gainsc
      .filter(g => g.clientId === this.contributeurSelectionneId)
      .reduce((total, g) => total + g.gain, 0);
  }
  
  onFournisseurChange() {
    if (this.fournisseurSelectionneId) {
      this.gainService.getGainTotalParFournisseur(this.fournisseurSelectionneId).subscribe(data => {
        this.gainTotalFournisseur = data;
      });
    }
  }
  
  filtrer() {
    if (this.startDate && this.endDate) {
      this.gainService.getGainParProduitEtFournisseur(this.startDate, this.endDate).subscribe(data => {
        this.gainsf = data;
      });
    }
  }
  loadFournisseurs(): void {
    this.fournisseurService.loadingFournisseurs().subscribe(fournisseurs => {
      this.fournisseurs = fournisseurs;
    });
  }
  // Méthode pour charger les gains
  loadGains(): void {
    this.gainService.getGainParProduitEtFournisseur(this.startDate, this.endDate)
      .subscribe(
        (data: GainDTO[]) => {
          this.gainsf = data; // Assigner les données de la réponse à la variable `gains`
        },
        error => {
          console.error('Erreur lors du chargement des gains:', error);
        }
      );
  }
}
