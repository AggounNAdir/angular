import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ADDClient } from '../../models/models';
import { ClientService } from '../../services/client.service';
import { ProduitService } from '../../services/produit.service';
import { PrixService } from '../../services/prix.service';
import { LivraisonService } from '../../services/livraison.service';

export interface Versement {
  id: number;
  client: { id: number };
  montant: number;
  dateVersement: string;
  modeVersement: string;
}

export interface PrixVente {

  client: { id: number ,nomClient:string};
  produit: { id: number,nomProduit:string };
  prix: number;
  dateModification: string;
}


@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.scss'
})
export class ClientsComponent {
  messageAlerte: string = '';

  totalLivraisonsTTC1: number = 0; 
  totalPayement1: number = 0; 
  solde1: number = 0; 
  prixVentes: any[] = []; 
  selectedPrixVenteId: number | null = null;
  clientSelectionne: any = null;
  situationClients: any[] = [];
  situationClient: any = {};
  _activeTab: string = 'clients';
  versements: Versement[] = [];
  prixList: PrixVente[] = [];
  totalLivraisonsTTC: number = 0.00;
  totalPaiements: number = 0.00;
  solde: number = 0.00;
 
  selectedClient: any = null;
  livraisons: any[] = [];
  
  clients: any[] = [];
  client: ADDClient = { 
    id:0,
    typeClient:'',
    nomClient: '', 
    email: '', 
    telephone: '', 
    adresse: '', 
    nis: '', 
    nif: '', 
    nrc: '', 
    actif: true 
  };
  
  selectedClientId: number | null = null;
  produits: any[] = [];
  
  prixVente: PrixVente = {
    client: { id: 0 ,nomClient:''},
    produit: { id: 0 ,nomProduit:''},
    prix: 0,  
    dateModification: new Date().toISOString() // Génère la date actuelle en format ISO 8601
  };
  
  
  versement: Versement = {
    id: 0,
    client: { id: 0 },
    montant: 0.00,
    dateVersement: new Date().toISOString().split('T')[0],
    modeVersement: "espèces",
  };
  
  constructor(
    private clientService: ClientService,
    private cd: ChangeDetectorRef,
    private produitService: ProduitService,
    private prixService: PrixService,
    private livraisonService: LivraisonService,
  ) {}

  ngOnInit(): void {
    this.loadClients();
    this.allversement();
    this.chargerSituationClients();
 
    this.chargerProduits();
    this.chargerPrixVentes();
    this.chargerLivraisonsClient();
  }
  chargerSituationsClient() {
    if (!this.selectedClientId) {
      console.warn("Aucun client sélectionné.");
      return;
    }
  
    this.selectedClient = this.clients.find(client => client.id === this.selectedClientId);
  
    this.clientService.getSituationFinanciere(this.selectedClientId).subscribe(
      (data) => { 
        this.situationClient = data;
        this.totalLivraisonsTTC1 = data.totalLivraisonsTTC || 0.00;
        this.totalPayement1 = data.totalPaiements || 0.00;
        this.solde1 = data.solde || 0.00;
        this.messageAlerte = ''; 
      },
      (error) => {
        if (error.status === 404) {
          this.situationClient = null; 
          this.messageAlerte = "Ce client n'a pas de situation";
        } else {
          console.error('Erreur lors du chargement des livraisons', error);
          this.messageAlerte = "Une erreur est survenue, veuillez réessayer.";
        }
      }
    
    
    );
  }
  
  chargerLivraisonsClient() {
    if (!this.selectedClientId) return;

    this.selectedClient = this.clients.find(client => client.id === this.selectedClientId);

    this.livraisonService.getLivraisonsByClient(this.selectedClientId).subscribe(
      (data) => { this.livraisons = data; },
      (error) => { console.error('Erreur lors du chargement des livraisons', error); }
    );
  }
  chargerPrixVentes(): void {
    this.prixService.getAllPrix().subscribe({
      next: (data) => {
        this.prixList = data;
        this.prixVentes=data;
        console.log('Liste des prix chargée:', data);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des prix:', error);
      },
    });
  }
  
  chargerProduits(): void {
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
  
  addPrixVente(): void {
    if (this.prixVente.client?.id && this.prixVente.produit?.id && this.prixVente.prix) {
      const prixData = {
        client: { id: this.prixVente.client.id, nomClient: this.prixVente.client.nomClient || '' },
        produit: { 
          id: this.prixVente.produit.id, 
          nomProduit: this.prixVente.produit.nomProduit?.trim() ? this.prixVente.produit.nomProduit : 'Produit inconnu' 
        },
        prix: this.prixVente.prix.toString()
      };
  
      console.log("Données envoyées :", prixData);
  
      this.prixService.ajouterOuModifierPrix(prixData).subscribe({
        next: (response) => {
          console.log("Prix ajouté avec succès :", response);
          this.chargerPrixVentes(); // Rafraîchir la liste après ajout

          if (!response.client?.id || !response.produit?.id) {
            console.error("Erreur : ID client ou produit manquant dans la réponse :", response);
            alert("Une erreur est survenue, veuillez réessayer !");
            return;
          }
  
          const client = this.clients.find(c => c.id === response.client.id);
          const produit = this.produits.find(p => p.id === response.produit.id);
  
          if (!client || !produit) {
            console.warn("Le client ou le produit correspondant n'a pas été trouvé !");
          }
  
          this.prixVentes.push({
            id: response.id,
            clientId: response.client.id,
            produitId: response.produit.id,
            clientNom: client?.nomClient || 'Client inconnu',
            produitNom: produit?.nomProduit || 'Produit inconnu',
            prix: response.prix
          });
  
          this.prixVentes = [...this.prixVentes]; // ✅ Force Angular à rafraîchir l'affichage
          this.resetPrixVenteForm();
        },
        error: (err) => {
          console.error("Erreur lors de l'ajout du prix :", err);
          alert("Une erreur est survenue, veuillez réessayer !");
        }
      });
    } else {
      alert("Veuillez remplir tous les champs !");
    }
  }
  
  
  updatePrixVente(): void {
    if (this.selectedPrixVenteId) {
      const prix = this.prixVentes.find(p => p.id === this.selectedPrixVenteId);
      if (prix) {
        const prixData = {
          id: this.selectedPrixVenteId,  // Ajout de l'ID manquant
          client: { id: this.prixVente.client.id },  // Objet attendu par le backend
          produit: { id: this.prixVente.produit.id },  // Objet attendu par le backend
          prix: this.prixVente.prix  // Garder le type Number
        };

        console.log("Prix mis à jour avec succès :", prixData);

        this.prixService.ajouterOuModifierPrix(prixData).subscribe({
          next: (response) => {
            console.log("Prix mis à jour avec succès :", response);
            
            // Mettre à jour l'affichage dans la liste `prixVentes`
            prix.clientId = response.client.id;
            prix.produitId = response.produit.id;
            prix.clientNom = this.clients.find(c => c.id === response.client.id)?.nomClient;
            prix.produitNom = this.produits.find(p => p.id === response.produit.id)?.nomProduit;
            prix.prix = response.prix;

            this.resetPrixVenteForm();
          },
          error: (err) => {
            console.error("Erreur lors de la mise à jour du prix :", err);
            alert("Une erreur est survenue, veuillez réessayer !");
          }
        });
      }
    }
  }

  
  deletePrixVente(prix: PrixVente) {
    if (prix.client.id && prix.produit.id) {
      this.prixService.supprimerPrix(prix.client.id, prix.produit.id).subscribe(() => {
        console.log('Prix supprimé avec succès');
        this.prixVentes = this.prixVentes.filter(p => !(p.client.id === prix.client.id && p.produit.id === prix.produit.id));
      }, error => {
        console.error('Erreur lors de la suppression du prix', error);
      });
    }
  }
  
  selectPrixVente(prix: any): void {
    console.log("Prix sélectionné :", prix);
    this.selectedPrixVenteId = prix.id;
  
    // Recherche du client et du produit
    const clientTrouve = this.clients.find(c => c.id === prix.client?.id);
    const produitTrouve = this.produits.find(p => p.id === prix.produit?.id);
    console.log("Prix sélectionné :", clientTrouve);
    console.log("Prix sélectionné :", produitTrouve);
    // Construction de l'objet avec un id assuré
    this.prixVente = { 
      client: clientTrouve 
        ? { id: clientTrouve.id ?? 0, nomClient: clientTrouve.nomClient } 
        : { id: 0, nomClient: '' },
      
      produit: produitTrouve 
        ? { id: produitTrouve.id ?? 0, nomProduit: produitTrouve.nomProduit } 
        : { id: 0, nomProduit: '' },
  
      prix: prix.prix,
      dateModification: new Date().toISOString()
    };
  }
  
  
  
  resetPrixVenteForm(): void {
    this.prixVente = {
      client: { id: 0 ,nomClient:''},
      produit: { id: 0 ,nomProduit:''},
      prix: 0,  
      dateModification: new Date().toISOString() // Génère la date actuelle en format ISO 8601
    };
    this.selectedPrixVenteId = null;
  }

  trackById(_: number, versement: Versement): number {
    return versement.id;
  }

  get activeTab(): string {
    return this._activeTab;
  }

  set activeTab(value: string) {
    this._activeTab = value;
    if (value === 'situation') {
      this.chargerSituationClients();
    } else if (value === 'versements') {
      this.allversement();
    } else if (value === 'clients') {
      this.loadClients();
    }
  }

  loadClients(): void {
    this.clientService.loadingClients().subscribe({
      next: (clients) => {
        this.clients = clients;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des clients:', error);
      }
    });
  }

  onSelectClient(): void {
    const clientId = this.versement.client.id;
    console.log("Client sélectionné ID:", clientId);

    this.clientSelectionne = this.clients.find(f => f.id == clientId);
  
    if (this.clientSelectionne) {
      this.chargerSituationFinanciere(clientId);
    }
  }

  chargerSituationFinanciere(clientId: number): void {
    this.clientService.getSituationFinanciere(clientId).subscribe({
      next: (data) => {
        console.log(data);
        this.totalLivraisonsTTC = data.totalLivraisonsTTC;
        this.totalPaiements = data.totalPaiements;
        this.solde = data.solde;
      }, 
      error: (error) => {
        console.error("Erreur lors du chargement des données", error);
      }
    });
  }

  addClient(): void {
    if (this.client.nomClient.trim()) {
      console.log(this.client);
      this.clientService.addClient(this.client).subscribe({
        next: () => {
          
          this.loadClients();
          this.resetForm();
        },
        error: (error) => {
          console.error('Erreur lors de l\'ajout du client:', error);
        }
      });
    }
  }

  updateClient(): void {
    if (this.selectedClientId && this.client.nomClient.trim()) {
      this.clientService.updateClient(this.selectedClientId, this.client).subscribe({
        next: () => {
          this.loadClients();
          this.resetForm();
        },
        error: (error) => {
          console.error('Erreur lors de la mise à jour du client:', error);
        }
      });
    }
  }

  deleteClient(): void {
    if (this.selectedClientId) {
      this.clientService.deleteClient(this.selectedClientId).subscribe({
        next: () => {
          this.loadClients();
          this.resetForm();
        },
        error: (error) => {
          console.error('Erreur lors de la suppression du client:', error);
        }
      });
    }
  }

  selectClient(client: ADDClient): void {
    this.selectedClientId = client.id!;
    this.client = { ...client };
  }

  resetForm(): void {
    this.client = { 
      id:0,
      typeClient:'',
      nomClient: '', 
      email: '', 
      telephone: '', 
      adresse: '', 
      nis: '', 
      nif: '', 
      nrc: '', 
      actif: true 
    };
    this.selectedClientId = null;
  }

  resetVersementForm(): void {
    this.versement = {
      id: 0,
      client: { id: 0 },
      montant: 0.00,
      dateVersement: new Date().toISOString().split('T')[0],
      modeVersement: "espèces",
    };
  }

  allversement(): void {
    this.clientService.getAllVersement().subscribe({
      next: (data) => {
        this.versements = data;
        console.log("Liste des versements :", this.versements);
      },
      error: (error) => {
        console.error("Erreur lors de la récupération des versements", error);
      }
    });
  }
  
  addVersement(): void {
    console.log('Données envoyées :', JSON.stringify(this.versement, null, 2));
    this.clientService.ajouterVersementAuClient(this.versement).subscribe({
      next: (response) => {
        this.allversement();
        this.chargerSituationFinanciere(this.versement.client.id);
        this.resetVersementForm();
        console.log('Versement ajouté avec succès !', response, this.versement);
      },
      error: (error) => {
        console.error('Erreur lors de l\'ajout du versement', error);
      }
    });
  }

  modifierVersement(versementId: number): void {
    console.log("Montant avant envoi :", this.versement.montant);
    console.log("Montant avant envoi :", this.versement);
  
    this.clientService.modifierVersementAuClient(versementId, this.versement, this.versement.montant).subscribe({
      next: (response) => {
        console.log('Versement modifié avec succès !', response);
        this.allversement();
        this.resetVersementForm();
      },
      error: (error) => {
        console.error('Erreur lors de la modification du versement', error);
        alert('Erreur lors de la modification du versement. Veuillez réessayer.');
      }
    });
  }

  deleteVersement(versementId: number): void {
    this.clientService.deleteVersementAuClient(versementId).subscribe({
      next: (response) => {
        console.log('Versement supprimé avec succès !', response);
        this.versements = this.versements.filter(v => v.id !== versementId);
        this.cd.detectChanges();
      },
      error: (error) => {
        console.error('Erreur lors de la suppression du versement', error);
      }
    });
  }

  editVersement(versement: Versement): void {
    this.versement = { ...versement };
  }
  onClientChange() {
    this.chargerLivraisonsClient();
    this.chargerSituationsClient();
   
  }
  
  chargerSituationClients(): void {
    this.clientService.getSituationClients().subscribe({
      next: (data) => {
        this.situationClients = data;
       
        console.log(this.situationClients);
      },
      error: (error) => {
        console.error("Erreur lors de la récupération de la situation :", error);
      }
    });
  }
  imprimerSituationClient() {
    if (this.selectedClientId === null || !this.livraisons.length) return;
  
    console.log("Selected Client ID (before conversion):", this.selectedClientId);
  
    const clientId = Number(this.selectedClientId); // Conversion sécurisée
    console.log("Selected Client ID (after conversion):", clientId);
  
    const client = this.clients.find(c => c.id === clientId);
    console.log("Client trouvé:", client);
  
    if (!client) {
      console.error('Client introuvable');
      return;
    }
    if (!this.situationClient) {
      console.error('⚠️ Aucune situation client chargée.');
      return;
  }
  
  
        // ✅ Génération du contenu HTML avec tableau récapitulatif
        const printContent = `
          <html>
            <head>
              <title>Situation Client</title>
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
              <h2>Situation du Client: ${client.nomClient || 'Non spécifié'}</h2>
              
              <div class="info">
                <p><strong>Nom :</strong> ${client.nomClient || 'Non spécifié'}</p>
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
                  ${this.livraisons.map(l => `
                    <tr>
                      <td>${l.dateLivraison || 'N/A'}</td>
                      <td>${l.numBonLivraison || 'N/A'}</td>
                      <td>${l.totalHt || '0'} DA</td>
                      <td>${l.totalTtc || '0'} DA</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
  
              <!-- ✅ Tableau récapitulatif -->
              <table class="summary-table">
                <thead>
                  <tr>
                    <th>Total Livraisons</th>
                    <th>Montant Payé</th>
                    <th>Solde Restant</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>${this.totalLivraisonsTTC1.toFixed(2)}</td>
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