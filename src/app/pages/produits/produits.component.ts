import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProduitService } from '../../services/produit.service';
import { Categorie, Produit, Fournisseur } from '../../models/models';
import { FournisseurService } from '../../services/fournisseur.service';
import { Router } from '@angular/router';
import { StockService } from '../../services/stock.service';

@Component({
  selector: 'app-produits',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './produits.component.html',
  styleUrl: './produits.component.scss',
})
export class ProduitsComponent implements OnInit {
  @ViewChild('codeBarreInput') codeBarreInput!: ElementRef;


  // Gestion des erreurs de validation
  prixAchatError: boolean = false;
  prixVenteError: boolean = false;
  stockActuelError: boolean = false;
  stockMinError: boolean = false;

  // Gestion du scan de code-barres
  lastScannedBarcode: string = '';
  lastScanTime: number = 0;
  scannedBarcode: string = '';

  // Données et listes
  produits: Produit[] = [];
  categories: Categorie[] = [];
  fournisseurs: Fournisseur[] = [];
  afficherFormulaire = false;
  modeEdition = false;

  unitesMesure: string[] = [
    "Kilogramme (kg)", "Gramme (g)", "Tonne (t)",
    "Litre (L)", "Millilitre (mL)", "Centilitre (cL)",
    "Mètre (m)", "Centimètre (cm)", "Millimètre (mm)",
    "Pièce (pce)", "Carton (ctn)", "Palette (plt)", 
    "Bouteille (btl)", "Bidon (bdn)", "Sachet (sach)", 
    "Boîte (bte)", "Rouleau (rl)", "Tube (tb)", 
    "Unité (U)"
  ];
  

  produitForm: Produit = {

    nomProduit: '',
    description: '',
    prixAchat: 0.00,
    stockActuel: 0.00,
    stockMin: 0.00,
    uniteMesure: '',
    tauxTva: 0,
    categorie: { id: 0, name: '' },
    fournisseur: { id: 0, nomFournisseur: '' },
    facteurConversion:1,
    marque:'',
  };

  constructor(
    private produitService: ProduitService,
    private fournisseurService: FournisseurService,
    private router: Router
  ) {}

  ngOnInit() {
    this.chargerProduits();
    this.chargerCategories();
    this.chargerFournisseurs();
  }
 
  // Chargement des données
  chargerProduits() {
    this.produitService.getProduits().subscribe(
      (data) => (this.produits = data),
      (error) => console.error('Erreur lors du chargement des produits', error)
    );
  }

  chargerCategories() {
    this.produitService.getCategories().subscribe(
      (data) => (this.categories = data),
      (error) => console.error('Erreur lors du chargement des catégories', error)
    );
  }

  chargerFournisseurs() {
    this.fournisseurService.getFournisseurs().subscribe(
      (data) => {
        this.fournisseurs = data;
        console.log('Fournisseurs chargés:', this.fournisseurs);  // Vérifier que les données sont chargées
      },
      (error) => console.error('Erreur lors du chargement des fournisseurs', error)
    );
  }
  

  // Ouvrir le formulaire d'ajout/modification
  ouvrirFormulaire() {
    this.produitForm = {
      nomProduit: '',
      description: '',
      prixAchat: 0.00,
      stockActuel: 0.00,
      stockMin: 0.00,
      uniteMesure: '',
      tauxTva: 0,
      categorie: { id: 0, name: '' },
      fournisseur: { id: 0, nomFournisseur: '' },
      facteurConversion: 1,
      marque: '',
    };
    this.afficherFormulaire = true;
    this.modeEdition = false;
    
  }
  

  modifierProduit(produit: Produit) {
    this.produitForm = { ...produit };
    this.afficherFormulaire = true;
    this.modeEdition = true;
  }

  enregistrerProduit() {
    if (this.modeEdition && this.produitForm.id !== undefined) {
      this.produitService.updateProduit(this.produitForm).subscribe(() => {
        this.chargerProduits();
        this.afficherFormulaire = false;
      });
    } else {
      this.produitService.ajouterProduit(this.produitForm).subscribe(() => {
        this.chargerProduits();
        this.afficherFormulaire = false;
        console.log(this.produitForm);
      });
    }
  }
  mettreAJourMarque() {
    // Convertir l'ID en nombre avant de faire la recherche
    const fournisseurId = +this.produitForm.fournisseur.id;  // Force la conversion en nombre
    console.log('ID du fournisseur sélectionné:', fournisseurId);  // Vérifier l'ID converti
    
    const fournisseur = this.fournisseurs.find(f => f.id === fournisseurId);
    console.log('Fournisseur trouvé:', fournisseur);  // Affiche le fournisseur trouvé
    
    if (fournisseur) {
      this.produitForm.marque = fournisseur.nomFournisseur;
    } else {
      this.produitForm.marque = ''; // Si aucun fournisseur trouvé
    }
  }
  
  
  supprimerProduit(id: number | undefined) {
    if (id !== undefined) {
      this.produitService.supprimerProduit(id).subscribe(() => this.chargerProduits());
    }
  }

  ouvrirModalAjoutFournisseur() {
    this.router.navigate(['/fournisseurs']);
  }


  fermerFormulaire() {
    this.afficherFormulaire = false;
  }
  validerChampsNumeriques(valeur: string): number | null {
    const nombre = parseFloat(valeur.replace(/,/g, '.'));
    return isNaN(nombre) ? null : nombre;
  }
  
  onBlurChampNumerique(champ: 'prixAchat' | 'stockActuel' | 'stockMin', valeur: string) {
    const nombre = this.validerChampsNumeriques(valeur);
  
    if (nombre !== null) {
      this.produitForm[champ] = nombre;
      this[`${champ}Error`] = false;
    } else {
      this.produitForm[champ] = 0.00; // Remplace par 0.00 si invalide
      this[`${champ}Error`] = true;
    }
  }
  limiterDecimales(event: any, champ: 'prixAchat'  | 'stockActuel' | 'stockMin') {
    let valeur = event.target.value;
  
    // Autorise uniquement les chiffres, un seul point ou virgule
    valeur = valeur.replace(/[^0-9.,]/g, '').replace(/,/g, '.');
  
    // Vérifie s'il y a plus d'un point décimal et le corrige
    const parties = valeur.split('.');
    if (parties.length > 2) {
      valeur = `${parties[0]}.${parties[1]}`; // Supprime les points supplémentaires
    }
  
    // Appliquer la limitation à 2 chiffres après la virgule
    if (parties.length === 2 && parties[1].length > 2) {
      valeur = `${parties[0]}.${parties[1].substring(0, 2)}`;
    }
  
    // Mise à jour de l'input visuellement
    event.target.value = valeur;
  
    // Convertir en nombre uniquement si valide
    const nombre = parseFloat(valeur);
    this.produitForm[champ] = isNaN(nombre) ? 0.00 : nombre;
  }
  

}
