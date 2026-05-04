import { HttpClient } from "@angular/common/http";
import { inject, Injectable, PLATFORM_ID } from "@angular/core";
import { Observable } from "rxjs";
import { ProfileResponse } from "../models/user.model";
import { AuthService } from "./auth.service";

@Injectable({ providedIn: 'root' })
export class UserService {
    private readonly API_URL = 'http://localhost:8080/api/users';
    private readonly SECRET_KEY = 'super-secret-key-123'; // Replace with actual secret key
    private readonly TOKEN_KEY = 'token';
    private readonly ROLE = 'CUSTOMER';
    private platformId = inject(PLATFORM_ID);
    private http = inject(HttpClient);
    private authService = inject(AuthService);

    getProfile(): Observable<ProfileResponse> {
        const headers: any = {
            'Content-Type': 'application/json',
            'X-Internal-Key': this.SECRET_KEY,
        }; 
        let token: string | null= this.authService.getToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        return this.http.get<ProfileResponse>(
            `${this.API_URL}/profile`,
            { headers }
        );
    }
}