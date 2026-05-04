import { ChangeDetectorRef, Component, inject, NgZone } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  username: string = '';
  email: string = '';
  password: string = '';
  isLoading = false;
  errorMessage: string = '';

  private authService = inject(AuthService);
  private router = inject(Router);
  private ngZone = inject(NgZone);
  private cdr = inject(ChangeDetectorRef);

  register(): void {
    this.errorMessage = '';

    // Validate inputs
    if (
      !this.username.trim() ||
      !this.password.trim() ||
      !this.email.trim()
    ) {
      this.errorMessage = 'Please enter all required fields';
      return;
    }

    this.isLoading = true;
    this.cdr.markForCheck();

    this.authService.register(this.username, this.email, this.password)
      .pipe(
        finalize(() => {
          // Always reset loading state
          this.isLoading = false;
          this.cdr.markForCheck();
        })
      )
      .subscribe({
        next: (response) => {
          this.ngZone.run(() => {
            console.log('Register successful:', response);

            this.router.navigate(['/profile']);
          });
        },

        error: (error) => {
          this.ngZone.run(() => {
            console.error('Register failed:', error);

            this.errorMessage = this.mapRegisterError(error);

            this.cdr.markForCheck();
          });
        }
      });
  }

  private mapRegisterError(error: any): string {
    if (error.status === 400) {
      return 'Invalid input. Please check your information.';
    }

    if (error.status === 409) {
      return 'Username or email already exists.';
    }

    if (error.status === 0) {
      return 'Network error. Please check your connection.';
    }

    if (error.error?.message) {
      return error.error.message;
    }

    return 'Register failed. Please try again.';
  }
}
