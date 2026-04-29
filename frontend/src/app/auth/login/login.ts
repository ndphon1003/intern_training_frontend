import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  username: string = '';
  password: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';

  private authService = inject(AuthService);
  private router = inject(Router);

  login(): void {
    // Reset error message
    this.errorMessage = '';

    // Validate inputs
    if (!this.username.trim() || !this.password.trim()) {
      this.errorMessage = 'Please enter both username and password';
      return;
    }

    this.isLoading = true;

    this.authService.login(this.username, this.password).subscribe({
      next: (response) => {
        this.isLoading = false;
        console.log('Login successful:', response);
        // Token is saved automatically in AuthService via tap()
        this.router.navigate(['/profile']);
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Login failed:', error);
        
        // Handle different error scenarios
        if (error.status === 401 || error.status === 400) {
          this.errorMessage = 'Invalid username or password';
        } else if (error.status === 0) {
          this.errorMessage = 'Network error. Please check your connection.';
        } else if (error.error?.message) {
          this.errorMessage = error.error.message;
        } else {
          this.errorMessage = 'Login failed. Please try again.';
        }
      },
    });
  }
}