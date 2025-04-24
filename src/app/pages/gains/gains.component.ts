import { Component, OnInit } from '@angular/core';
import { GainDTO } from '../../models/models';
import { GainService } from '../../services/gain.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-gains',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gains.component.html',
  styleUrl: './gains.component.scss'
})
export class GainsComponent  {
  
  gains: GainDTO[] = [];
  startDate!: string;
  endDate!: string;


  constructor(private gainService: GainService) { }

  
  filtrer() {
    if (this.startDate && this.endDate) {
      this.gainService.getGainParProduitEtFournisseur(this.startDate, this.endDate).subscribe(data => {
        this.gains = data;
      });
    }
  }

  // Méthode pour charger les gains
  loadGains(): void {
    this.gainService.getGainParProduitEtFournisseur(this.startDate, this.endDate)
      .subscribe(
        (data: GainDTO[]) => {
          this.gains = data; // Assigner les données de la réponse à la variable `gains`
        },
        error => {
          console.error('Erreur lors du chargement des gains:', error);
        }
      );
  }
}
