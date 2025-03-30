import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import {FormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common'; // Importez CommonModule


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit{
  
  email: string = '';
  password: string = '';
  rememberMe: boolean = false;
  errorMessage: string = '';
  constructor(private authService: AuthService, private router: Router) {

  }
  
  ngOnInit() {
    // Vérifiez si les informations de connexion sont stockées
    const savedEmail = localStorage.getItem('rememberedEmail');
    const savedPassword = localStorage.getItem('rememberedPassword');

    if (savedEmail && savedPassword) {
      this.email = savedEmail;
      this.password = savedPassword;
      this.rememberMe = true;
    }
  }

 onSubmit() {
    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (response) => {
        // Stockez le token dans le localStorage
        localStorage.setItem('token', response.token);
        console.log(response.token);

        // Si "Remember Me" est coché, stockez l'email dans le localStorage
        if (this.rememberMe) {
          localStorage.setItem('rememberedEmail', this.email);
        } else {
          // Sinon, supprimez l'email stocké
          localStorage.removeItem('rememberedEmail');
        }

        // Redirigez l'utilisateur vers le tableau de bord
        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.error('Erreur de connexion', err);
        this.errorMessage = 'Email ou mot de passe incorrect.';
      }
    });
  }
  goToRegister(event: Event) {
    event.preventDefault(); // Empêche le rechargement de la page
    this.router.navigate(['/register']);
  }
}
