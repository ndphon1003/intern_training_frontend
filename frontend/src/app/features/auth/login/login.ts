import { ChangeDetectorRef, Component, inject, NgZone } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
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
  private ngZone = inject(NgZone);
  private cdr = inject(ChangeDetectorRef);

  public getIsLoading(){
    return this.isLoading;
  }
  onInputChange() {
    this.errorMessage = '';
  }

  login(): void {
    // Reset error message
    this.errorMessage = '';

    // Validate inputs
    if (!this.username.trim() || !this.password.trim()) {
      this.errorMessage = 'Please enter both username and password';
      return;
    }

    this.isLoading = true;
    this.cdr.markForCheck();

    this.authService.login(this.username, this.password).pipe(
      finalize(() => {
        // Always reset loading state - ensures UI is never stuck
        this.isLoading = false;
        this.cdr.markForCheck();
      })
    ).subscribe({
      next: () => {
        // Login succeeded - navigate to profile
        this.ngZone.run(() => {
          this.router.navigate(['/profile']);
        });
      },
      error: (error) => {
        this.ngZone.run(() => {
          this.errorMessage = this.mapError(error);
          
          // Handle 400 error - clear form and logout
          if (error.status === 400) {
            this.clearFormForReLogin();
          }
          
          this.cdr.markForCheck();
        });
      }
    });
  }

  private clearFormForReLogin(): void {
    // Clear sensitive form data
    this.username = '';
    this.password = '';
    // Logout to clear any invalid token
    this.authService.logout();
  }

  private mapError(error: any): string {
    if (error.status === 400) {
      return 'Invalid username or password. Please try again.';
    }

    if (error.status === 401) {
      return 'Your session has expired. Please login again.';
    }

    if (error.status === 0) {
      return 'Network error. Please check your connection.';
    }

    if (error.error?.message) {
      return error.error.message;
    }

    return 'Login failed. Please try again.';
  }

}