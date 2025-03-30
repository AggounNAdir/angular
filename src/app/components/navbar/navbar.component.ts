import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  isLoggedIn = false;

  constructor(private router: Router) {
    this.router.events.subscribe(() => {
      this.isLoggedIn = this.router.url !== '/login'; // Cache la navbar sur la page de login
    });
  }

    // Déconnexion (optionnel)
    logout(): void {
      localStorage.removeItem('token');
      this.router.navigate(['/login']);
    }
}
