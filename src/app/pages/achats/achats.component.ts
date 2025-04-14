import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormatPrixPipe } from '../../format-prix.pipe';
import { AchatService } from '../../services/achat.service';
import { ProduitService } from '../../services/produit.service';
import { Fournisseur, Produit } from '../../models/models';
import { FournisseurService } from '../../services/fournisseur.service';


interface DetailAchat {
  id:number
  produit: Produit;
  quantite:number,
  quantiteCarton: number;
  quantiteUnite: number;
  prixUnitaire: number;
  tva: number;
  unite: string;
  montantHT: number;
  montantTTC: number;
  quantiteUniteBase:number;
}

@Component({
  selector: 'app-achats',
  standalone: true,
  imports: [CommonModule, FormsModule, FormatPrixPipe],
  templateUrl: './achats.component.html',
  styleUrl: './achats.component.scss',

})
export class AchatsComponent {
  produitsFiltres: Produit[] = [];
  quantiteuniteajouter:number=0;
  detailsAchat: DetailAchat[] = [];
  modalDetailsOuvert: boolean = false;
  facteur:number=0.00;
  filtreRecherche: string = '';
  achat: any;
  achats: any[] = [];
  achatsFiltres: any[] = [];
  fournisseurs: Fournisseur[] = [];
  produits: Produit[] = [];
  modalAjoutOuvert = false;
  modalCommandeOuvert = false;
  selectedAchatId: number | null = null;
  nouvelAchat = {
    numBonAchatComplet:'',
    fournisseur: { id: 0 ,nomFournisseur:''},
    dateAchat: new Date().toISOString().split('T')[0],
    montantTotalHt:0,
    montantTotalTTC:0,
    details: [] as DetailAchat[], // Typage explicite
  };
  nouveauDetailAchat = {
    produit: {} as Produit, // Assure que produit est bien un objet `Produit`
    quantiteCarton:0,
    quantiteUnite: 0,
    prixUnitaire: 0,
    tva: 0,
    unite: 'Pièce',
    montantHT: 0,
    montantTTC: 0,
    quantiteUniteBase:0.00,
  };
  elementsParPage: number = 10;
  pageActuelle: number = 1;
  numBonAchat:String = '';
  fournisseurId:number=1;
  situationFinanciere: any;
  constructor(
    private achatService: AchatService,
    private produitService: ProduitService,
    private fournisseurService: FournisseurService
  ) {
    this.chargerAchats();
    this.chargerFournisseurs();
    this.chargerProduits();
   
  }
// Méthode appelée lorsque le fournisseur change
filtrerProduits() {
  if (this.nouvelAchat.fournisseur) {
    this.produitsFiltres = this.produits.filter(
      (produit) => produit.fournisseur.id === this.nouvelAchat.fournisseur.id
    );
  } else {
    this.produitsFiltres = [];
  }
}
  chargerAchats() {
    this.achatService.getAchats().subscribe({
      next: (data) => {
        this.achats = data;
        this.achatsFiltres = data;
        console.log(this.achats);
        console.log(this.achatsFiltres);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des achats:', error);
      },
    });
  }

  chargerFournisseurs() {
    this.fournisseurService.getFournisseurs().subscribe({
      next: (data) => {
        this.fournisseurs = data;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des fournisseurs:', error);
      },
    });
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

  appliquerFiltres() {
    const filtre = this.filtreRecherche.trim().toLowerCase();
    this.achatsFiltres = this.achats.filter((achat) =>
      (achat.fournisseur?.nomFournisseur?.toLowerCase() || '').includes(filtre) ||
      achat.numBonAchat.toString().includes(filtre)
    );
  }
  

  ouvrirModalAjout() {
    this.modalAjoutOuvert = true;
  }

  fermerModalAjout(): void {
    this.modalAjoutOuvert = false;
    this.nouvelAchat = {
      numBonAchatComplet:'',
      fournisseur: { id: 0,nomFournisseur:'' },
      dateAchat: new Date().toISOString().split('T')[0],
      montantTotalHt:0,
    montantTotalTTC:0,
      details: [],
    };
    this.nouveauDetailAchat = {
      produit: {} as Produit, // Assure que produit est bien un objet `Produit`
      quantiteCarton: 1,
      quantiteUnite: 1,
      prixUnitaire: 0,
      tva: 0,
      unite: 'Pièce',
      montantHT: 0,
      montantTTC: 0,
      quantiteUniteBase:0.00,
    };
  }

  ouvrirModalCommande() {
    this.modalCommandeOuvert = true;
  }
  getAchat(id: number) {
    this.achatService.getAchatById(id).subscribe(
      (data) => {
        this.achat = data; // Stocker l'achat récupéré
        console.log("Achat récupéré :", this.achat);
      },
      (error) => {
        console.error("Erreur lors du chargement de l'achat :", error);
      }
    );
  }
  voirDetails(id: number) {
    this.selectedAchatId = id;
    this.modalDetailsOuvert = true;
    this.getAchat(id); // Appelle getAchat pour récupérer les données

    // Attendre que les données soient chargées avant d'affecter numBonAchat
    this.achatService.getAchatById(id).subscribe(
      (data) => {
        this.numBonAchat = data.numBonAchat;
        console.log(this.numBonAchat);
      },
      (error) => {
        console.error("Erreur lors du chargement de l'achat :", error);
      }
    );
  
    // Charger les détails de l'achat sélectionné
    this.chargerDetailsAchat(id);
  }
  chargerDetailsAchat(id: number) {
    // Simule une requête API pour récupérer les détails de l'achat
    this.achatService.getDetailsAchat(id).subscribe({
      next: (details) => {
        this.detailsAchat = details;  // Stocke les détails de l'achat
      },
      error: (error) => {
        console.error("Erreur lors du chargement des détails de l'achat :", error);
      }
    });
  }
  
  
  fermerModalDetails() {
    this.modalDetailsOuvert = false;
    this.chargerAchats();
  }

  // 🔥 Supprimer un détail d'achat
  supprimerDetail(id: number): void {
    if (confirm('Voulez-vous vraiment supprimer ce produit ?')) {
      this.achatService.supprimerDetail(id).subscribe(
       
        () => {
          this.detailsAchat = this.detailsAchat.filter(d => d.id !== id);
        },
        (error) => {
          console.error('Erreur lors de la suppression du détail', error);
        }
      );
    }
  }
  setFacteur(produit: Produit): number {
    this.facteur = produit.facteurConversion || 1;
    console.log('Facteur mis à jour:', this.facteur);
    return this.facteur; // ✅ Retourne la valeur
  }
  
  
  modifierDetail(detail: any): void {
    const nouvelleQuantite = prompt('Nouvelle quantité:', detail.quantite);
    const nouveauPrixU = prompt('Nouveau prix unitaire:', detail.prixUnitaire);
    const facteur1 = this.setFacteur(detail.produit);
    if (nouvelleQuantite !== null && nouveauPrixU !== null) {
        const quantiteNumber = Number(nouvelleQuantite);
        const prixUNumber = Number(nouveauPrixU);
        console.log(this.facteur);
        // 🔥 Recalcul du montant HT et TTC avec le facteur de conversion
        const quantiteUniteBase = quantiteNumber * facteur1;
        const montantHT = quantiteUniteBase * prixUNumber;
        const montantTTC = montantHT * (1 + detail.tva / 100);
       
         
        // Mise à jour de l'objet
        const updatedDetail = { 
            ...detail, 
            quantite: quantiteNumber,
            prixUnitaire: prixUNumber,
            quantiteUniteBase: quantiteUniteBase,
            montantHT: montantHT,
            montantTTC: montantTTC
        };

        // Envoi au backend
        this.achatService.modifierDetail(detail.id, updatedDetail).subscribe(
            (data) => {
                this.detailsAchat = this.detailsAchat.map(d =>
                    d.id === detail.id ? data : d
                );
            },
            (error) => {
                console.error('Erreur lors de la modification du détail', error);
            }
        );
    }
}


  
  calculerTotaux(): void {
    let totalHT = 0;
    let totalTTC = 0;
  
    this.nouvelAchat.details.forEach((detail) => {
      totalHT += detail.montantHT;
      totalTTC += detail.montantTTC;
    });
  
    this.nouvelAchat.montantTotalHt = totalHT; // Mettre à jour le montant total TTC
    this.nouvelAchat.montantTotalTTC = totalTTC; // Mettre à jour le montant total TTC

  }
  
  supprimerAchat(id: number) {
    this.achatService.deleteAchat(id).subscribe({
      next: () => {
        this.chargerAchats();
        
      },
      error: (error) => {
        console.error('Erreur lors de la suppression de l\'achat:', error);
      },
    });
  }

  ajouterProduit(): void {
    // Vérifier d'abord si le produit est déjà dans la liste
    const produitDejaExistant = this.nouvelAchat.details.find(
      detail => detail.produit.id === this.nouveauDetailAchat.produit.id
    );
  
    if (produitDejaExistant) {
      // Option 1: Ne rien faire et sortir de la fonction
      alert('Ce produit a déjà été ajouté à la liste');
      return;
    }
  
    const produitSelectionne = this.produits.find(
      p => p.id === this.nouveauDetailAchat.produit.id
    );
  
    if (produitSelectionne) {
      const detailAchat: DetailAchat = {
        id: 0,
        produit: produitSelectionne,
        quantite: this.nouveauDetailAchat.quantiteCarton *this.facteur+this.quantiteuniteajouter,
        quantiteCarton: this.nouveauDetailAchat.quantiteCarton,
        quantiteUnite: this.quantiteuniteajouter,
        prixUnitaire: this.nouveauDetailAchat.prixUnitaire,
        tva: this.nouveauDetailAchat.tva,
        unite: this.nouveauDetailAchat.unite,
        quantiteUniteBase: (+this.facteur) * (+this.nouveauDetailAchat.quantiteCarton) + (+this.quantiteuniteajouter),
        montantHT: (+this.nouveauDetailAchat.quantiteCarton *this.facteur+this.quantiteuniteajouter)  * +this.nouveauDetailAchat.prixUnitaire,
        montantTTC: (+this.nouveauDetailAchat.quantiteCarton *this.facteur+this.quantiteuniteajouter) *( +this.nouveauDetailAchat.prixUnitaire)* (1 + +this.nouveauDetailAchat.tva / 100),
      };
  
      this.nouvelAchat.details.push(detailAchat);
      this.calculerTotaux();
  
      // Réinitialiser le formulaire
      this.nouveauDetailAchat = {
        produit: {} as Produit,
        quantiteCarton: 1,
        quantiteUnite:1,
        prixUnitaire: 0,
        tva: 0,
        unite: 'Pièce',
        montantHT: 0,
        montantTTC: 0,
        quantiteUniteBase: 0.00,
      };
    }
  }
  supprimerProduitAjoute(detail: DetailAchat): void {
    this.nouvelAchat.details = this.nouvelAchat.details.filter((d) => d !== detail);
    this.calculerTotaux(); // Recalculer les totaux après suppression
  }
  updateNumBonAchat() {
    console.log(this.nouvelAchat.fournisseur.nomFournisseur);
    this.nouvelAchat.numBonAchatComplet = 
      (this.nouvelAchat.fournisseur?.nomFournisseur || '').replace(/\s/g, '') + (this.numBonAchat || '');
  }
  validerAchats(): void {
    const nouvelAchat = {
      numBonAchat: this.nouvelAchat.numBonAchatComplet + this.numBonAchat,
      fournisseur: this.nouvelAchat.fournisseur,
      dateAchat: this.nouvelAchat.dateAchat,
      totalHT: this.nouvelAchat.montantTotalHt,
      totalTTC: this.nouvelAchat.montantTotalTTC,
      details: this.nouvelAchat.details,
    };
    


    this.achatService.createAchat(nouvelAchat).subscribe({
      next: (response) => {
        console.log('Achat créé avec succès:', response);
        this.chargerAchats();
        
        this.fournisseurService.getSituationFinanciere(nouvelAchat.fournisseur.id).subscribe({
          next: (data) => {
            console.log("Situation financière :", data);
            this.situationFinanciere = data;
            // Call print only after we have the financial data
            this.imprimerListeAchats(data);
            this.fermerModalAjout();
          },
          error: (err) => {
            console.error("Erreur lors de la récupération de la situation financière :", err);
            this.fermerModalAjout();
          }
        });
      },
      error: (error) => {
        console.error("Erreur lors de la création de l'achat:", error);
      },
    });
  }
  

  mettreAJourPrixUnitaire(): void {
    const produitSelectionne = this.produits.find(
      (p) => p.id === Number(this.nouveauDetailAchat.produit.id)
    );

    if (produitSelectionne && produitSelectionne.prixAchat !== undefined) {
      this.nouveauDetailAchat.tva = produitSelectionne.tauxTva ?? 0; // Mise à jour de la TVA

      this.nouveauDetailAchat.produit.nomProduit = produitSelectionne.nomProduit;
      this.nouveauDetailAchat.prixUnitaire = parseFloat(produitSelectionne.prixAchat.toFixed(2));
    
      this.facteur=produitSelectionne.facteurConversion ;             

    } else {
      this.nouveauDetailAchat.prixUnitaire = 0.0;
    }
  }

  imprimerListeAchats(situation: any) {
    const date = new Date().toLocaleDateString();
    const numeroAchat = this.numBonAchat || "Non spécifié";
    const fournisseur = this.nouvelAchat?.fournisseur?.nomFournisseur || "Non spécifié";
    const montantTotalTTC = this.nouvelAchat?.montantTotalTTC?.toFixed(2) || "0.00";
    const montantTotalHT = this.nouvelAchat?.montantTotalHt?.toFixed(2) || "0.00";

    // Clone the table and remove action buttons if they exist
    const tableElement = document.querySelector('.produits-ajoutes-table')?.cloneNode(true) as HTMLElement;
    if (tableElement) {
      tableElement.querySelectorAll('tr').forEach(row => {
        const actionCell = row.querySelector('td:last-child, th:last-child');
        if (actionCell && (actionCell.textContent?.includes('Action') || actionCell.querySelector('button'))) {
          row.removeChild(actionCell);
        }
      });
    }
    const tableAchat = tableElement?.outerHTML || "<p>Aucune donnée disponible</p>";

    // HTML content for printing
    const contenuImpression = `
      <html>
      <head>
        <title>Bon d'Achat N° ${numeroAchat}</title>
        <style>
           .vertical-header {
           width:400px
           }
          .vertical-header th, .vertical-header td {
            border: 1px solid #000;
            padding: 8px;
            text-align: left;
          }
          .vertical-header th {
            text-align: right;
            width: 60%; /* Largeur de la première colonne */
          }
          .vertical-header td {
            width: 40%; /* Largeur de la deuxième colonne */
          }
             .produits-ajoutes-table {
            width: 100%;
            border-collapse: collapse;
          }
          .produits-ajoutes-table th,
          .produits-ajoutes-table td {
            border-left: 1px solid #000;
            border-right: 1px solid #000;
            border-top: none;
            border-bottom: none;
            padding: 8px;
          }
          /* Option : Bordures en haut et en bas pour l'en-tête */
          .produits-ajoutes-table thead th {
            border-top: 1px solid #000;
            border-bottom: 1px solid #000;
          }
          /* Option : Bordure en bas pour la dernière ligne */
          .produits-ajoutes-table tr:last-child td {
            border-bottom: 1px solid #000;
          }

          body { font-family: Arial, sans-serif; padding: 20px; }
          h2 { text-align: center; margin-bottom: 20px; }
          .info { margin-bottom: 20px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          th, td { border: 1px solid #000; padding: 8px; text-align: left; }
          .vertical-header th { text-align: right; width: 30%; }
          .total-section { margin-top: 30px; }
          @media print {
            body { padding: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <h2>Bon d'Achat N° ${numeroAchat}</h2>
        <div class="info">
          <p><strong>Date :</strong> ${date}</p>
          <p><strong>Fournisseur :</strong> ${fournisseur}</p>
        </div>
        ${tableAchat}
        <div class="total-section">
          <table class="vertical-header">
            <tr>
              <th>Montant Total HT</th>
              <td>${montantTotalHT} DA</td>
            </tr>
            <tr>
              <th>Montant Total TTC</th>
              <td>${montantTotalTTC} DA</td>
            </tr>
         
            <tr>
              <th>Solde</th>
              <td>${situation?.solde?.toFixed(2) || "0.00"} DA</td>
            </tr>
          </table>
        </div>
        <script>
          setTimeout(() => {
            window.print();
            window.close();
          }, 200);
        </script>
      </body>
      </html>
    `;

    const fenetre = window.open('', '_blank', 'width=794,height=1123');
    if (fenetre) {
      fenetre.document.write(contenuImpression);
      fenetre.document.close();
    } else {
      alert("La fenêtre d'impression a été bloquée par le navigateur. Veuillez autoriser les popups pour ce site.");
    }
  }
  
  imprimerAchat(id: number) {
    this.achatService.getAchatById(id).subscribe({
      next: (ach) => {
        if (!ach) {
          alert("Aucun achat trouvé !");
          return;
        }

        console.log("Données achat reçues :", ach);
        console.log("Produits :", ach.details); // Vérification dans la console

        const contenuImpression = `
          <html>
          <head>
            <title>Bon d'Achat</title>
            <style>
             .vertical-header {
                width: 400px;
               }        
            .vertical-header th {

              border: 1px solid black; /* Garde les bordures */
              padding: 10px;
            }

            .vertical-header td {
           
              border: 1px solid black; /* Garde les bordures */
              padding: 10px;
            }

              body { font-family: Arial, sans-serif; padding: 5px; }
              h2 { text-align: center; }
              .info { margin-bottom: 20px; }
              table { width: 100%; border: 1px solid black; border-collapse: collapse; }
              th, td { padding: 10px; text-align: left; }
              
              /* Appliquer uniquement les bordures externes */
              .no-inner-border {
                border: 1px solid black;
                border-collapse: collapse;
              }

              .no-inner-border thead th {
                border: 1px solid black;
              }

              .no-inner-border tbody td {
                border-left: 1px solid black;
                border-right: 1px solid black;
                border-top: none;
                border-bottom: none;
              }
            </style>
          </head>
          <body>
            <h2>Bon d'Achat N° ${ach.numBonAchat || 'N/A'}</h2>
            <div class="info">
              <p><strong>Date :</strong> ${ach.dateAchat || 'Non spécifié'}</p>
              <p><strong>Fournisseur :</strong> ${ach.fournisseur?.nomFournisseur || 'Non spécifié'}</p>
            </div>
            <table class="no-inner-border">
              <thead>
                <tr>
                  <th>Désignation</th>
                  <th>Unité</th>
                  <th>Qté/carton</th>
                  <th>Qté/unite</th>
                  <th>Prix/U</th>
                  <th>Total HT</th>
                  <th>TVA</th>
                  <th>Total TTC</th>
                </tr>
              </thead>
              <tbody>
                ${
                  ach.details && Array.isArray(ach.details) && ach.details.length > 0
                    ? ach.details.map((p: any) => `
                        <tr>
                          <td>${p.produit.nomProduit}</td>
                          <td>${p.produit.facteurConversion}</td>
                          <td>${p.quantiteCarton}</td>
                          <td>${p.quantiteUnite}</td>
                          <td>${p.prixUnitaire?.toFixed(2) || '0.00'}</td>
                          <td>${p.montantHT?.toFixed(2) || '0.00' }</td>
                          <td>${p.tva || '0.00'}</td>
                          <td>${p.montantTTC?.toFixed(2) || '0.00' }</td>
                        </tr>`).join('')
                    : '<tr><td colspan="7" style="text-align:center;">Aucun produit trouvé</td></tr>'
                }
              </tbody>
            </table>
            <table class="vertical-header"  style="margin-top: 30px;">
              <thead>
                <tr>
                  <th>Montant Total HT</th>
                  <td>${ach.totalHT?.toFixed(2) || '0.00'} DA</td>
                 
                </tr>
              </thead>
              <tbody>
                <tr>
                   <th>Montant Total TTC</th>
                  <td>${ach.totalTTC?.toFixed(2) || '0.00'} DA</td>
                </tr>
              </tbody>
            </table>

            <script>
              window.print();
            </script>
          </body>
          </html>
        `;

        const fenetre = window.open('', '', 'width=794,height=1123');
        if (fenetre) {
          fenetre.document.write(contenuImpression);
          fenetre.document.close();
        } else {
          alert("La fenêtre d'impression a été bloquée.");
        }
      },
      error: (err) => {
        console.error("Erreur lors de la récupération de l'achat :", err);
        alert("Impossible de récupérer l'achat.");
      }
    });
}

  

  trackByAchatId(index: number, achat: any): number {
    return achat.id;
  }

  trackByDetailId(index: number, detail: DetailAchat): number {
    return detail.produit?.id || 0;
  }
}