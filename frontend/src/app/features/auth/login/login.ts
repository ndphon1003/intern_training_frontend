import { ChangeDetectorRef, Component, inject } from '@angular/core';
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
  private cdr = inject(ChangeDetectorRef);

  public getIsLoading() {
    return this.isLoading;
  }

  onInputChange() {
    this.errorMessage = '';
  }

  login(): void {
    this.errorMessage = '';

    if (!this.username.trim() || !this.password.trim()) {
      this.errorMessage = 'Please enter both username and password';
      return;
    }

    this.isLoading = true;
    this.cdr.markForCheck();

    this.authService.login(this.username, this.password)
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.cdr.markForCheck(); // đảm bảo UI update
        })
      )
      .subscribe({
        next: () => {
          // navigate trực tiếp, Angular HttpClient đã chạy trong zone
          this.router.navigate(['/profile']);
        },
        error: (error) => {
          this.errorMessage = this.mapError(error);

          if (error.status === 400) {
            this.clearFormForReLogin();
          }

          this.cdr.markForCheck(); // cập nhật UI ngay
        }
      });
  }

  private clearFormForReLogin(): void {
    this.username = '';
    this.password = '';
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