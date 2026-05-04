import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { AuthResponse, LoginRequest, RegisterRequest } from '../models/auth.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API_URL = 'http://localhost:8080/api/auth';
  private readonly SECRET_KEY = 'super-secret-key-123'; // Replace with actual secret key
  private readonly TOKEN_KEY = 'token';
  private readonly ROLE = 'CUSTOMER';
  private platformId = inject(PLATFORM_ID);
  private http = inject(HttpClient);

  register(username: string, email: string, password: string): Observable<AuthResponse>{
    const registerRequest: RegisterRequest = {username, email, password, role: this.ROLE};
    const headers = {
      'Content-Type': 'application/json',
      'X-Internal-Key': this.SECRET_KEY,
    };
    
    return this.http.post<AuthResponse>(`${this.API_URL}/register`, registerRequest, { headers }).pipe(
      tap((response) => {
        if (response.code === 200 && response.data?.accessToken){
          this.saveToken(response.data.accessToken);
          console.log('Token saved successfully');
        }
      }),
      catchError((error) =>{
        console.error('Logout error', error);
        throw error;
      })
    );
  }

  login(username: string, password: string): Observable<AuthResponse> {
    const loginRequest: LoginRequest = { username, password };

    const headers = {
      'Content-Type': 'application/json',
      'X-Internal-Key': this.SECRET_KEY,
    };

    return this.http.post<AuthResponse>(`${this.API_URL}/login`, loginRequest, { headers }).pipe(
      tap((response) => {
        if (response.code === 200 && response.data?.accessToken) {
          this.saveToken(response.data.accessToken);
          console.log('Token saved successfully');
        }
      }),
      catchError((error) => {
        console.error('Login error:', error);
        // Clear token if login fails (especially for 400 errors)
        if (error.status === 400 || error.status === 401) {
          this.logout();
          console.log("longin fail in service");
        }
        console.log("login 2")
        return throwError(() => error);
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