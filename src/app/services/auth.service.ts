
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly SESSION_KEY = 'tinky_hotel_session';

  private readonly DEMO_EMAIL = 'admin@tinkyhotel.com';
  private readonly DEMO_PASSWORD = 'Tinky2026*';

  login(email: string, password: string): boolean {
    const validEmail = email.trim().toLowerCase() === this.DEMO_EMAIL;
    const validPassword = password === this.DEMO_PASSWORD;

    if (validEmail && validPassword) {
      localStorage.setItem(this.SESSION_KEY, 'authenticated');
      return true;
    }

    return false;
  }

  isAuthenticated(): boolean {
    return localStorage.getItem(this.SESSION_KEY) === 'authenticated';
  }

  logout(): void {
    localStorage.removeItem(this.SESSION_KEY);
  }
}
