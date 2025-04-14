import { Component } from '@angular/core';
import { Client, Produit } from '../../models/models';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormatPrixPipe } from '../../format-prix.pipe';
import { LivraisonService } from '../../services/livraison.service';
import { ProduitService } from '../../services/produit.service';
import { ClientService } from '../../services/client.service';
import { PrixService } from '../../services/prix.service';

interface DetailLivraison {
  id:number
  produit: Produit;
  quantite:number,
  quantiteCarton: number;
  quantiteUnite: number;
  prixUnitaire: number;
  tva: number;
  unite: string;
  montantHt: number;
  montantTtc: number;
  quantiteUniteBase:number;
}
@Component({
  selector: 'app-ventes',
  standalone: true,
  imports: [CommonModule, FormsModule, FormatPrixPipe],
  templateUrl: './ventes.component.html',
  styleUrl: './ventes.component.scss'
})
export class VentesComponent {
  detailsLivraison: DetailLivraison[] = [];
    modalDetailsOuvert: boolean = false;
    facteur:number=0.00;
    filtreRecherche: string = '';
    livraison: any;
    livraisons: any[] = [];
    livraisonsFiltres: any[] = [];
    clients: Client[] = [];
    produits: Produit[] = [];
    modalAjoutOuvert = false;
    selectedLivraisonId: number | null = null;
    nouvelLivraison = {
      numBonLivraisonComplet:'',
      client: { id: 0 ,nomClient:''},
      dateLivraison: new Date().toISOString().split('T')[0],
      montantTotalHt:0,
      montantTotalTTC:0,
      details: [] as DetailLivraison[], // Typage explicite
    };
    nouveauDetailLivraison = {
      produit: {} as Produit, // Assure que produit est bien un objet `Produit`
      quantiteCarton: 1,
      quantiteUnite: 1,
      prixUnitaire: 0,
      tva: 0,
      unite: 'Pièce',
      montantHt: 0,
      montantTtc: 0,
      quantiteUniteBase:0.00,
    };
    quantiteuniteajouter:number=0;
    elementsParPage: number = 10;
    pageActuelle: number = 1;
    numBonLivraison:String = '';
    clientId:number=1;
    situationFinanciere: any;
    produitId!: number;
    prix!: number | null;
      constructor(
        private livraisonService: LivraisonService,
        private produitService: ProduitService,
        private clientService: ClientService,
        private prixService: PrixService
      ) {
        this.chargerLivraisons();
        this.chargerClients();
        this.chargerProduits();
       
      }
      getPrix() {
        if (this.clientId && this.produitId) {
          this.prixService.getPrixByClientAndProduit(this.clientId, this.produitId).subscribe({
            next: (data) => {
              this.prix = data;
            },
            error: () => {
              this.prix = null;
              console.error("Erreur lors de la récupération du prix.");
            }
          });
        }
      }
      chargerLivraisons() {
        this.livraisonService.getLivraisons().subscribe({
          next: (data) => {
            this.livraisons = data;
            this.livraisonsFiltres = data;
            console.log(this.livraisons);
            console.log(this.livraisonsFiltres);
          },
          error: (error) => {
            console.error('Erreur lors du chargement des achats:', error);
          },
        });
      }
      chargerClients() {
        this.clientService.getClients().subscribe({
          next: (data) => {
            this.clients = data;
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
        this.livraisonsFiltres = this.livraisons.filter((livraison) =>
          (livraison.client?.nomClient?.toLowerCase() || '').includes(filtre) ||
          livraison.numBonLivraison.toString().includes(filtre)
        );
      }
      
    
      ouvrirModalAjout() {
        this.modalAjoutOuvert = true;
      }
    
      fermerModalAjout(): void {
        this.modalAjoutOuvert = false;
        this.nouvelLivraison = {
          numBonLivraisonComplet:'',
          client: { id: 0,nomClient:'' },
          dateLivraison: new Date().toISOString().split('T')[0],
          montantTotalHt:0,
        montantTotalTTC:0,
          details: [],
        };
        this.nouveauDetailLivraison = {
          produit: {} as Produit, // Assure que produit est bien un objet `Produit`
          quantiteCarton: 1,
          quantiteUnite: 1,
          prixUnitaire: 0,
          tva: 0,
          unite: 'Pièce',
          montantHt: 0,
          montantTtc: 0,
          quantiteUniteBase:0.00,
        };
      }
      formatPrix(index: number) {
        if (this.detailsLivraison[index].prixUnitaire !== null && this.detailsLivraison[index].prixUnitaire !== undefined) {
          this.detailsLivraison[index].prixUnitaire = parseFloat(this.detailsLivraison[index].prixUnitaire.toFixed(2));
        }
      }
      
      
      getLivraison(id: number) {
        this.livraisonService.getLivraisonById(id).subscribe(
          (data) => {
            this.livraison = data; // Stocker l'achat récupéré
            console.log("Achat récupéré :", this.livraison);
          },
          (error) => {
            console.error("Erreur lors du chargement de l'achat :", error);
          }
        );
      }
      
      voirDetails(id: number) {
        this.selectedLivraisonId = id;
        this.modalDetailsOuvert = true;
        this.getLivraison(id); // Appelle getAchat pour récupérer les données

        // Attendre que les données soient chargées avant d'affecter numBonAchat
        this.livraisonService.getLivraisonById(id).subscribe(
          (data) => {
            this.numBonLivraison = data.numBonLivraison;
            console.log(this.numBonLivraison);
          },
          (error) => {
            console.error("Erreur lors du chargement de l'achat :", error);
          }
        );
      
        // Charger les détails de l'achat sélectionné
        this.chargerDetailsLivraison(id);
      }
      chargerDetailsLivraison(id: number) {
        // Simule une requête API pour récupérer les détails de l'achat
        this.livraisonService.getDetailsLivraison(id).subscribe({
          next: (details) => {
            this.detailsLivraison = details;  // Stocke les détails de l'achat
            console.log(details);
          },
          error: (error) => {
            console.error("Erreur lors du chargement des détails de l'achat :", error);
          }
        });
      }
      
      
      fermerModalDetails() {
        this.modalDetailsOuvert = false;
        this.chargerLivraisons();
      }
    
      // 🔥 Supprimer un détail d'achat
      supprimerDetail(id: number): void {
        if (confirm('Voulez-vous vraiment supprimer ce produit ?')) {
          this.livraisonService.supprimerDetail(id).subscribe(
           
            () => {
              this.detailsLivraison = this.detailsLivraison.filter(d => d.id !== id);
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
            this.livraisonService.modifierDetail(detail.id, updatedDetail).subscribe(
                (data) => {
                    this.detailsLivraison = this.detailsLivraison.map(d =>
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
      let totalHt = 0;
      let totalTtc = 0;
    
      this.nouvelLivraison.details.forEach((detail) => {
        totalHt += detail.montantHt;
        totalTtc += detail.montantTtc;
      });
    
      this.nouvelLivraison.montantTotalHt = totalHt; // Mettre à jour le montant total TTC
      this.nouvelLivraison.montantTotalTTC = totalTtc; // Mettre à jour le montant total TTC
  
    }
       
       supprimerLivraison(id: number) {
          this.livraisonService.deleteLivraison(id).subscribe({
            next: () => {
              this.chargerLivraisons();
              
            },
            error: (error) => {
              console.error('Erreur lors de la suppression de l\'achat:', error);
            },
          });
        }
      
        ajouterProduit(): void {
          // Vérifier d'abord si le produit est déjà dans la liste
          const produitDejaExistant = this.nouvelLivraison.details.find(
            detail => detail.produit.id === this.nouveauDetailLivraison.produit.id
          );
        
          if (produitDejaExistant) {
            // Option 1: Ne rien faire et sortir de la fonction
            alert('Ce produit a déjà été ajouté à la liste');
            return;
      
          }
        
          const produitSelectionne = this.produits.find(
            p => p.id === this.nouveauDetailLivraison.produit.id
          );
        
          if (produitSelectionne) {
            const detailLivraison: DetailLivraison= {
              id: 0,
              produit: produitSelectionne,
              quantite:this.nouveauDetailLivraison.quantiteCarton *this.facteur+this.quantiteuniteajouter,
              quantiteCarton: this.nouveauDetailLivraison.quantiteCarton,
              quantiteUnite: this.quantiteuniteajouter,
              prixUnitaire: this.nouveauDetailLivraison.prixUnitaire,
              tva: this.nouveauDetailLivraison.tva,
              unite: this.nouveauDetailLivraison.unite,
              quantiteUniteBase: (+this.facteur) * (+this.nouveauDetailLivraison.quantiteCarton) + (+this.quantiteuniteajouter),
              montantHt: (+this.nouveauDetailLivraison.quantiteCarton *this.facteur+this.quantiteuniteajouter)  * +this.nouveauDetailLivraison.prixUnitaire,
              montantTtc: (+this.nouveauDetailLivraison.quantiteCarton *this.facteur+this.quantiteuniteajouter) *( +this.nouveauDetailLivraison.prixUnitaire)* (1 + +this.nouveauDetailLivraison.tva / 100),
            };
        
            this.nouvelLivraison.details.push(detailLivraison);
            this.calculerTotaux();
        
            // Réinitialiser le formulaire
            this.nouveauDetailLivraison = {
              produit: {} as Produit,
              quantiteCarton: 1,
              quantiteUnite:1,
              prixUnitaire: 0,
              tva: 0,
              unite: 'Pièce',
              montantHt: 0,
              montantTtc: 0,
              quantiteUniteBase: 0.00,
            };
          }
        }
        supprimerProduitAjoute(detail: DetailLivraison): void {
          this.nouvelLivraison.details = this.nouvelLivraison.details.filter((d) => d !== detail);
          this.calculerTotaux(); // Recalculer les totaux après suppression
        }
        updateNumBonLivraison() {
          console.log(this.nouvelLivraison.client.nomClient);
          this.nouvelLivraison.numBonLivraisonComplet = 
            (this.nouvelLivraison.client?.nomClient || '').replace(/\s/g, '') + (this.numBonLivraison || '');
        }
        validerLivraisons(): void {
          const nouvelLivraison = {
            numBonLivraison: this.nouvelLivraison.numBonLivraisonComplet + this.numBonLivraison,
            client: this.nouvelLivraison.client,
            dateLivraison: this.nouvelLivraison.dateLivraison,
            totalHt: this.nouvelLivraison.montantTotalHt,
            totalTtc: this.nouvelLivraison.montantTotalTTC,
            details: this.nouvelLivraison.details,
          };
          console.log('lIVRAISON créé avec succès:', nouvelLivraison.details);
          console.log('Détails de la livraison envoyés:', JSON.stringify(nouvelLivraison.details, null, 2));

      
          this.livraisonService.createLivraison(nouvelLivraison).subscribe({
            next: (response) => {
              console.log('lIVRAISON créé avec succès:', response);
              this.chargerLivraisons();
              
              this.clientService.getSituationFinanciere(this.nouvelLivraison.client.id).subscribe({
                next: (data) => {
                  console.log("Situation financière :", data);
                  this.situationFinanciere = data;
                  // Call print only after we have the financial data
                  this.imprimerListeLivraisons(data);
                  this.fermerModalAjout();
                },
                error: (err) => {
                  console.error("Erreur lors de la récupération de la situation financière :", err);
                  this.fermerModalAjout();
                }
              });
            },
            error: (error) => {
              console.error("Erreur lors de la création de la livraison:", error);
            },
          });
        }
        
      
        mettreAJourPrixUnitaire() {
          if (this.nouvelLivraison.client?.id && this.nouveauDetailLivraison.produit?.id) {
            const clientId = this.nouvelLivraison.client.id;
            const produitId = this.nouveauDetailLivraison.produit.id;
        
            // Récupérer le produit sélectionné depuis la liste
            const produitSelectionne = this.produits.find(prod => prod.id === produitId);
            
            if (!produitSelectionne) {
              console.error("Produit non trouvé !");
              return;
            }
        
            this.prixService.getPrixByClientAndProduit(clientId, produitId).subscribe({
              next: (prixdata:any) => {
                console.log("Type de prix :", typeof prixdata, "Valeur :", prixdata);
              
                this.nouveauDetailLivraison.prixUnitaire = prixdata.prix;
                this.nouveauDetailLivraison.tva = produitSelectionne.tauxTva ?? 0; // Mise à jour de la TVA
                
                this.nouveauDetailLivraison.produit.nomProduit = produitSelectionne.nomProduit;                
                this.nouveauDetailLivraison.prixUnitaire = parseFloat(Number(prixdata.prix ?? 0).toFixed(2));
        
                this.facteur = produitSelectionne.facteurConversion;
              },
              error: () => {
                this.nouveauDetailLivraison.prixUnitaire = 0.00;
                console.error("Impossible de récupérer le prix.");
              }
            });
          }
        }
        
      
        imprimerListeLivraisons(situation: any) {
          const date = new Date().toLocaleDateString();
          const numeroLivraison = this.numBonLivraison || "Non spécifié";
          const client = this.nouvelLivraison?.client?.nomClient || "Non spécifié";
          const montantTotalTTC = this.nouvelLivraison?.montantTotalTTC?.toFixed(2) || "0.00";
          const montantTotalHT = this.nouvelLivraison?.montantTotalHt?.toFixed(2) || "0.00";
      
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
          const tableLivraison = tableElement?.outerHTML || "<p>Aucune donnée disponible</p>";
      
          // HTML content for printing
          const contenuImpression = `
            <html>
            <head>
              <title>Bon du livraison N° ${numeroLivraison}</title>
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
              <h2>Bon du livraison N° ${numeroLivraison}</h2>
              <div class="info">
                <p><strong>Date :</strong> ${date}</p>
                <p><strong>Client :</strong> ${client}</p>
              </div>
              ${tableLivraison}
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
        
        imprimerLivraison(id: number) {
          this.livraisonService.getLivraisonById(id).subscribe({
            next: (liv) => {
              if (!liv) {
                alert("Aucun livraison trouvé !");
                return;
              }
      
              console.log("Données livraison reçues :", liv);
              console.log("Produits :", liv.details); // Vérification dans la console
      
              const contenuImpression = `
                <html>
                <head>
                  <title>Bon de livraison</title>
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
                  <h2>Bon de livraison N° ${liv.numBonLivraison || 'N/A'}</h2>
                  <div class="info">
                    <p><strong>Date :</strong> ${liv.dateLivraison || 'Non spécifié'}</p>
                    <p><strong>Client :</strong> ${liv.client?.nomClient || 'Non spécifié'}</p>
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
                        liv.details && Array.isArray(liv.details) && liv.details.length > 0
                          ? liv.details.map((p: any) => `
                              <tr>
                                <td>${p.produit.nomProduit}</td>
                                <td>${p.produit.facteurConversion}</td>
                                <td>${p.quantiteCarton}</td>
                                 <td>${p.quantiteUnite}</td>
                                <td>${p.prixUnitaire?.toFixed(2) || '0.00'}</td>
                                <td>${p.montantHt?.toFixed(2) || '0.00' }</td>
                                <td>${p.tva || '0.00'}</td>
                                <td>${p.montantTtc?.toFixed(2) || '0.00' }</td>
                              </tr>`).join('')
                          : '<tr><td colspan="7" style="text-align:center;">Aucun produit trouvé</td></tr>'
                      }
                    </tbody>
                  </table>
                  <table class="vertical-header"  style="margin-top: 30px;">
                    <thead>
                      <tr>
                        <th>Montant Total HT</th>
                        <td>${liv.totalHt?.toFixed(2) || '0.00'} DA</td>
                       
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                         <th>Montant Total TTC</th>
                        <td>${liv.totalTtc?.toFixed(2) || '0.00'} DA</td>
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
              console.error("Erreur lors de la récupération de la livraison :", err);
              alert("Impossible de récupérer la livraison.");
            }
          });
      }
      
        
      
      trackByLivraisonId(index: number, livraison: any): number {
        return livraison.id; // Utilisez directement le paramètre livraison au lieu de this.livraison
      }
      
      trackByDetailId(index: number, detail: DetailLivraison): number {
        return detail.id || index; // Utilisez detail.id s'il existe, sinon retournez l'index
      }
}
