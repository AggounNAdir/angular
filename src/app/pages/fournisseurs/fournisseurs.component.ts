import { ChangeDetectorRef, Component } from '@angular/core';
import { ADDFournisseur } from '../../models/models';
import { FournisseurService } from '../../services/fournisseur.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AchatService } from '../../services/achat.service';

export interface Versement {
  id: number;
  fournisseur: { id: number };
  montant: number;
  dateVersement: string;
  modeVersement: string;
}
@Component({
  selector: 'app-fournisseurs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './fournisseurs.component.html',
  styleUrl: './fournisseurs.component.scss'
})
export class FournisseursComponent {
  selectedFournisseur: any = null;
  messageAlerte: string = '';
  situationFournisseur: any = {};
  totalAchatsTTC1: number = 0; 
  totalPayement1: number = 0; 
  solde1: number = 0; 
  fournisseurSelectionne: any = null;

  situationFournisseurs: any[] = [];
  _activeTab: string = 'fournisseurs'; // Onglet par défaut
  versements: any[] = [];

  totalAchatsTTC: number = 0.00;
totalPaiements: number = 0.00;
solde: number = 0.00;

  fournisseurs: ADDFournisseur[] = [];
  fournisseur: ADDFournisseur = { nomFournisseur: '', contact: '', adresse: '', telephone: '', email: '', siteWeb: '', actif: true };
  selectedFournisseurId: number | null = null;
  achats: any[] = [];
  versement: Versement = {
    id: 0,
    fournisseur: { id: 0 },
    montant: 0.00,
    dateVersement: new Date().toISOString().split('T')[0],
    modeVersement: "espèces",
  };
  
  constructor(private fournisseurService: FournisseurService,private cd: ChangeDetectorRef,private achatService:AchatService) {}

  ngOnInit(): void {
    this.loadFournisseurs();
    this.allversement();
    this.chargerSituationFournisseurs();
  }
 
  trackById(_: number, versement: any): number {
    return versement.id;
  }
get activeTab(): string {
  return this._activeTab;
}
  set activeTab(value: string) {
    this._activeTab = value;
    if (value === 'situation') {
      this.chargerSituationFournisseurs();
    }else if(value=== 'versements'){
      this.allversement();
    }else if(value=== 'fournisseurs'){
      this.loadFournisseurs();
    }
  }
  loadFournisseurs(): void {
    this.fournisseurService.loadingFournisseurs().subscribe(fournisseurs => {
      this.fournisseurs = fournisseurs;
    });
  }
  onSelectFournisseur() {
    const fournisseurId = this.versement.fournisseur.id;
    console.log("Fournisseur sélectionné ID:", fournisseurId); // Vérifier si l'ID est bien récupéré

    // Chercher le fournisseur sélectionné
    this.fournisseurSelectionne = this.fournisseurs.find(f => f.id == fournisseurId);
  
    if (this.fournisseurSelectionne) {
      this.chargerSituationFinanciere(fournisseurId);
     
    }
  }
  chargerSituationFinanciere(fournisseurId: number) {
    this.fournisseurService.getSituationFinanciere(fournisseurId).subscribe(data => {
      console.log(data);
      this.totalAchatsTTC = data.totalAchatsTTC;
      this.totalPaiements = data.totalPaiements;
      this.solde = data.solde;
    }, error => {
      console.error("Erreur lors du chargement des données", error);
    });
  }
  addFournisseur(): void {
    if (this.fournisseur.nomFournisseur.trim()) {
      this.fournisseurService.addFournisseur(this.fournisseur).subscribe(() => {
        this.fournisseurService.loadingFournisseurs();
        this.resetForm();
        this.loadFournisseurs();
      });
    }
  }

  updateFournisseur(): void {
    if (this.selectedFournisseurId && this.fournisseur.nomFournisseur.trim()) {
      this.fournisseurService.updateFournisseur(this.selectedFournisseurId, this.fournisseur).subscribe(() => {
        this.fournisseurService.loadingFournisseurs();
        this.resetForm();
        this.loadFournisseurs();
      });
    }
  }

  deleteFournisseur(): void {
    if (this.selectedFournisseurId) {
      this.fournisseurService.deleteFournisseur(this.selectedFournisseurId).subscribe(() => {
        this.fournisseurService.loadingFournisseurs();
        this.resetForm();
        this.loadFournisseurs();
      });
    }
  }

  selectFournisseur(fournisseur: ADDFournisseur): void {
    this.selectedFournisseurId = fournisseur.id!;
    this.fournisseur = { ...fournisseur };
  }

  resetForm(): void {
    this.fournisseur = { nomFournisseur: '', contact: '', adresse: '', telephone: '', email: '', siteWeb: '', actif: true };
    this.selectedFournisseurId = null;
  }

  resetVersementForm() {
    this.versement = {
      id: 0,
      fournisseur: { id: 0 },
      montant: 0.00,
      dateVersement: new Date().toISOString().split('T')[0],
      modeVersement: "espèces",
    };
  }
  allversement() {
    this.fournisseurService.getAllVersement().subscribe(
      (data) => {
        this.versements = data;
        console.log("Liste des versements :", this.versements);
        
      },
      (error) => {
        console.error("Erreur lors de la récupération des versements", error);
      }
    );
  }
  
  addVersement() {
    console.log('Données envoyées :', JSON.stringify(this.versement, null, 2)); // Affiche le JSON formaté
    this.fournisseurService.ajouterVersementAuFournisseur(this.versement).subscribe(
      response => {
        this.allversement();
        this.chargerSituationFinanciere(this.versement.fournisseur.id);
        this.resetVersementForm(); // Reset the form

        console.log('Versement ajouté avec succès !', response,this.versement);
      },
      error => {
        console.error('Erreur lors de l\'ajout du versement', error);
      }
    );
  }

  // Modifier un versement
  modifierVersement(versementId: number) {
    console.log("Montant avant envoi :", this.versement.montant);
    console.log("Montant avant envoi :", this.versement);
  
    this.fournisseurService.modifierVersementAuFournisseur(versementId, this.versement, this.versement.montant).subscribe(
      response => {
        console.log('Versement modifié avec succès !', response);
        this.allversement();
        this.resetVersementForm(); // Reset the form
      },
      error => {
        console.error('Erreur lors de la modification du versement', error);
        alert('Erreur lors de la modification du versement. Veuillez réessayer.');
      }
    );
  }

  deleteVersement(versementId: number) {
    this.fournisseurService.deleteVersementAuFournisseur(versementId).subscribe(
      response => {
        console.log('Versement supprimé avec succès !', response);
        this.versements = this.versements.filter(v => v.id !== versementId);
        this.cd.detectChanges(); 


      },
      error => {
        console.error('Erreur lors de la suppression du versement', error);
      }
    );
  }
  editVersement(versement: Versement) {
    this.versement = { ...versement }; // Remplit le formulaire avec les données du versement sélectionné
    
  }
  chargerSituationFournisseurs() {
    this.fournisseurService.getSituationFournisseurs().subscribe(
      (data) => {
        this.situationFournisseurs = data;
        console.log(this.situationFournisseurs);
      },
      (error) => {
        console.error("Erreur lors de la récupération de la situation :", error);
      }
    );
  }

  onFournisseurChange() {
    this.chargerAchatsFournisseur();
    this.chargerSituationsFournisseur();
   
  }
  chargerAchatsFournisseur() {
    if (!this.selectedFournisseurId) return;

    this.selectedFournisseur = this.fournisseurs.find(fournisseur => fournisseur.id === this.selectedFournisseur);

    this.achatService.getAchatsByFournisseur(this.selectedFournisseurId).subscribe(
      (data) => { this.achats = data; },
      (error) => { console.error('Erreur lors du chargement des achats', error); }
    );
  }
  chargerSituationsFournisseur() {
    if (!this.selectedFournisseurId) {
      console.warn("Aucun fournisseur sélectionné.");
      return;
    }
  
    this.selectedFournisseur = this.fournisseurs.find(fourni => fourni.id === this.selectedFournisseurId);
  
    this.fournisseurService.getSituationFinanciere(this.selectedFournisseurId).subscribe(
      (data) => { 
        this.situationFournisseur = data;
        this.totalAchatsTTC1 = data.totalAchatsTTC || 0.00;
        this.totalPayement1 = data.totalPaiements || 0.00;
        this.solde1 = data.solde || 0.00;
        this.messageAlerte = ''; 
      },
      (error) => {
        if (error.status === 404) {
          this.situationFournisseur = null; 
          this.messageAlerte = "Ce fournisseur n'a pas de situation";
        } else {
          console.error('Erreur lors du chargement des achats', error);
          this.messageAlerte = "Une erreur est survenue, veuillez réessayer.";
        }
      }
    
    
    );
  }

  imprimerSituationFournisseur() {
    if (this.selectedFournisseurId === null || !this.achats.length) return;
  
    console.log("Selected Client ID (before conversion):", this.selectedFournisseurId);
  
    const fourniId = Number(this.selectedFournisseurId); // Conversion sécurisée
    console.log("Selected fournisseur ID (after conversion):", fourniId);
  
    const fourni = this.fournisseurs.find(c => c.id === fourniId);
    console.log("Fournisseur trouvé:", fourni);
  
    if (!fourni) {
      console.error('Fournisseurintrouvable');
      return;
    }
    if (!this.situationFournisseur) {
      console.error('⚠️ Aucune situation fournisseur chargée.');
      return;
  }
  
  
        // ✅ Génération du contenu HTML avec tableau récapitulatif
        const printContent = `
          <html>
            <head>
              <title>Situation fournisseur</title>
              <style>
                body { font-family: Arial, sans-serif; padding: 5px; }
                h2 { text-align: center; }
                .info { margin-bottom: 20px; }
                table { width: 100%; border-collapse: collapse; border: 1px solid black; }
                th, td { padding: 10px; text-align: left; border: 1px solid black; }
                .summary-table { margin-top: 20px; width: 50%; border: 1px solid black; }
                .summary-table th, .summary-table td { padding: 10px; text-align: left; border: 1px solid black; }
              </style>
            </head>
            <body>
              <h2>Situation du fournisseur: ${fourni.nomFournisseur || 'Non spécifié'}</h2>
              
              <div class="info">
                <p><strong>Nom :</strong> ${fourni.nomFournisseur || 'Non spécifié'}</p>
              </div>
  
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Num/Livraison</th>
                    <th>Total HT</th>
                    <th>Total TTC</th>
                  </tr>
                </thead>
                <tbody>
                  ${this.achats.map(l => `
                    <tr>
                      <td>${l.dateAchat || 'N/A'}</td>
                      <td>${l.numBonAchat || 'N/A'}</td>
                      <td>${l.totalHT || '0'} DA</td>
                      <td>${l.totalTTC || '0'} DA</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
  
              <!-- ✅ Tableau récapitulatif -->
              <table class="summary-table">
                <thead>
                  <tr>
                    <th>Total Achats</th>
                    <th>Montant Payé</th>
                    <th>Solde Restant</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>${this.totalAchatsTTC1.toFixed(2)}</td>
                    <td>${this.totalPayement1.toFixed(2)}</td>
                    <td>${this.solde1.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </body>
          </html>
        `;
  
        const printWindow = window.open('', '', 'width=1000,height=600');
        if (printWindow) {
          printWindow.document.write(printContent);
          printWindow.document.close();
          printWindow.print();
        }
      
  
  }
}


