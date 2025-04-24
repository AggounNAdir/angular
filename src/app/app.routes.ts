import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { HomeComponent } from './components/home/home.component';
import { RegisterComponent } from './components/register/register.component';
import { ProduitsComponent } from './pages/produits/produits.component';
import { AchatsComponent } from './pages/achats/achats.component';
import { ClientsComponent } from './pages/clients/clients.component';
import { FournisseursComponent } from './pages/fournisseurs/fournisseurs.component';
import { ParametresComponent } from './pages/parametres/parametres.component';
import { VentesComponent } from './pages/ventes/ventes.component';
import { GainsComponent } from './pages/gains/gains.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent }, // Doit être AVANT le wildcard (**)
    { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'produits', component:ProduitsComponent , canActivate: [AuthGuard]},
    { path: 'achats', component:AchatsComponent , canActivate: [AuthGuard]},
    { path: 'clients', component:ClientsComponent , canActivate: [AuthGuard]},
    { path: 'fournisseurs', component:FournisseursComponent , canActivate: [AuthGuard]},
    { path: 'gains', component:GainsComponent , canActivate: [AuthGuard]},
    { path: 'parametres', component:ParametresComponent , canActivate: [AuthGuard]},
    { path: 'ventes', component:VentesComponent , canActivate: [AuthGuard]},
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: '**', redirectTo: 'login' }  // À la fin pour gérer les erreurs
];

