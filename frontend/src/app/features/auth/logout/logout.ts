import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-logout',
  standalone: true,
  templateUrl: './logout.html',
  styleUrl: './logout.css',
})
export class Logout {
  isLoading: boolean = false;
  errorMessage: string = '';

  private authService = inject(AuthService);
  private router = inject(Router);

  logout(): void {
    this.errorMessage = '';
    this.isLoading = true;

    try {
      this.authService.logout();

      setTimeout(() => {
        this.isLoading = false;
        this.router.navigate(['/auth/login']);
      }, 500);
    } catch (error) {
      this.isLoading = false;
      this.errorMessage = 'Logout failed. Please try again.';
      console.error(error);
    }
  }
}