import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CategorieService } from '../../services/categorie.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {  Produit } from '../../models/models';
import { ProduitService } from '../../services/produit.service';




@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit{
  categories: any[] = [];
  categoryName: string = '';
  selectedCategoryId: number | null = null;
  categoryDescription: string = '';
  activeTab: string = 'categories'; // Onglet actif par défaut
  saveFolderPath: string = ''; // Chemin du dossier sélectionné
  stock: any[] = [];
  produits: Produit[] = [];
  constructor(private categorieService: CategorieService, private router: Router,private http: HttpClient,private produitService: ProduitService) {}
  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
  chargeStock(){
    this.produitService.getStatistiques().subscribe((data) => {
      this.stock = data;
    });
   }
  async selectFolder(): Promise<void> {
    if ('showDirectoryPicker' in window) {
      try {
        const directoryHandle = await (window as any).showDirectoryPicker();
        this.saveFolderPath = directoryHandle.name; // Nom du dossier sélectionné
      } catch (error) {
        console.error("Erreur lors de la sélection du dossier :", error);
      }
    } else {
      alert("Votre navigateur ne prend pas en charge la sélection de dossiers.");
    }
  }
  private getHeaders(): HttpHeaders {
      return new HttpHeaders({
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      });
    }
  resetDatabase() {
    if (confirm("⚠️ Êtes-vous sûr de vouloir vider toutes les tables et réinitialiser les identifiants ? Cette action est irréversible !")) {
      this.http.post('http://localhost:8082/api/reset-db', {}, { headers: this.getHeaders() }).subscribe({
        next: () => {
          alert("✔️ Toutes les tables ont été vidées et les identifiants réinitialisés !");
        },
        error: (error) => {
          console.error("Erreur lors de la réinitialisation de la base :", error);
          alert("❌ Erreur lors de la réinitialisation !");
        }
      });
    }
  }
  navigateTo(path: string) {
    this.router.navigate([path]);
  }

  ngOnInit() {
    this.loadCategories();
    this.chargerProduits();
  }
  loadCategories() {
    this.categorieService.getCategories().subscribe(data => {
      this.categories = data;
    });
  }

  addCategory() {
    if (this.categoryName.trim() !== '' && this.categoryDescription.trim() !== '') {
      this.categorieService.addCategory({ 
        name: this.categoryName, 
        description: this.categoryDescription 
      }).subscribe(() => {
        this.loadCategories();
        this.categoryName = '';
        this.categoryDescription = '';
      });
    }
  }
  

  // Sélectionner une catégorie pour modification/suppression
  selectCategory(category: any) {
    this.categoryName = category.name;
    this.categoryDescription = category.description; // Ajout de la description
    this.selectedCategoryId = category.id;
  }
  
// Modifier une catégorie
updateCategory() {
  if (this.selectedCategoryId && this.categoryName.trim() !== '' && this.categoryDescription.trim() !== '') {
    this.categorieService.updateCategory(this.selectedCategoryId, { 
      name: this.categoryName, 
      description: this.categoryDescription 
    }).subscribe(() => {
      this.loadCategories();
      this.categoryName = '';
      this.categoryDescription = '';
      this.selectedCategoryId = null;
    });
  }
}

chargerProduits() {
  this.produitService.getProduits().subscribe(
    (data) => (this.produits = data),
    (error) => console.error('Erreur lors du chargement des produits', error)
  );
}
  // Supprimer une catégorie
  deleteCategory() {
    if (this.selectedCategoryId) {
      this.categorieService.deleteCategory(this.selectedCategoryId).subscribe(() => {
        this.loadCategories();
        this.categoryName = '';
        this.selectedCategoryId = null;
        this.categoryDescription = '';
      });
    }
  }
}
