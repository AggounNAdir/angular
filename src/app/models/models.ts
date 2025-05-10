// src/app/models/models.ts

export interface Categorie {
    id: number;
    name: string;
  }
  // src/app/models/models.ts

export interface Fournisseur {
  id: number; // Correspond à `id` dans l'entité Java
  nomFournisseur: string; // Correspond à `nomFournisseur` dans l'entité Java

}
export interface Client {
  id: number; // Correspond à `id` dans l'entité Java
  nomClient: string; // Correspond à `nomFournisseur` dans l'entité Java

}
  export interface Produit {
    id?: number; 
    nomProduit: string; 
    description?: string; 

    prixAchat: number; 

    stockActuel: number; 
    stockMin: number; 
    uniteMesure: string; 
    tauxTva?: number; 
    categorie: Categorie; 
    fournisseur: Fournisseur; 
    facteurConversion: number,
    marque:string,
  }
  export interface GainDTO{
     produitId: number,
     nomProduit: string,
     fournisseurId: number,
     nomFournisseur: string,
     gain: number

  }
  export interface GainDTOc{
    produitId: number,
    nomProduit: string,
    clientId: number,
    nomCclient: string,
    typeClient:string,
    gain: number

 }
  export interface ADDFournisseur {
    id?: number;
    nomFournisseur: string;
    contact?: string;
    adresse?: string;
    telephone?: string;
    email?: string;
    siteWeb?: string;
    actif: boolean;
  }
  export interface ADDClient {
    id: number;
    typeClient: string;
    nomClient: string;
    email?: string;
    telephone?: string;
    adresse?: string;
    nis?:string;
    nif?: string;
    nrc?: string;
    actif: boolean;
  }
  export interface Achat {
    idAchat: number;
    dateAchat: string;
  }
  
  export interface Livraison {
    idLivraison: number;
    dateLivraison: string;
  }