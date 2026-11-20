
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  email = '';
  password = '';
  showPassword = false;
  loading = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  readonly emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.(edu\.pe|com)$/i;

  login(): void {
    this.errorMessage = '';

    const email = this.email.trim();

    if (!email || !this.password) {
      this.errorMessage = 'Completa todos los campos.';
      return;
    }

    if (!this.emailPattern.test(email)) {
      this.errorMessage = 'Ingresa un correo terminado en .com o .edu.pe.';
      return;
    }

    if (this.password.length < 8) {
      this.errorMessage = 'La contraseña debe tener al menos 8 caracteres.';
      return;
    }

    this.loading = true;

    const success = this.authService.login(email, this.password);

    if (success) {
      this.router.navigate(['/inicio']);
    } else {
      this.loading = false;
      this.errorMessage = 'Correo o contraseña incorrectos.';
    }
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }
}
