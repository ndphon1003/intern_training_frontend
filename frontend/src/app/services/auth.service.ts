import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { catchError, Observable, tap } from 'rxjs';
import { LoginRequest, LoginResponse } from '../models/auth.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API_URL = 'http://localhost:8080/api/auth';
  private readonly SECRET_KEY = 'super-secret-key-123'; // Replace with actual secret key
  private readonly TOKEN_KEY = 'token';
  private platformId = inject(PLATFORM_ID);
  private http = inject(HttpClient);

  login(username: string, password: string): Observable<LoginResponse> {
    const loginRequest: LoginRequest = { username, password };

    const headers = {
      'Content-Type': 'application/json',
      'X-Internal-Key': this.SECRET_KEY,
    };

    return this.http.post<LoginResponse>(`${this.API_URL}/login`, loginRequest, { headers }).pipe(
      tap((response) => {
        if (response.code === 200 && response.data?.accessToken) {
          this.saveToken(response.data.accessToken);
          console.log('Token saved successfully');
        }
      }),
      catchError((error) => {
        console.error('Login error:', error);
        throw error;
      })
    );
  }

  saveToken(token: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.TOKEN_KEY, token);
    }
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(this.TOKEN_KEY);
    }
    return null;
  }

  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.TOKEN_KEY);
    }
  }
}