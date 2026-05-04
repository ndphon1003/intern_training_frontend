import { HttpClient } from "@angular/common/http";
import { inject, Injectable, PLATFORM_ID } from "@angular/core";
import { Observable } from "rxjs";
import { CreateProductRequest, CreateProductResponse, GetOwnProductResponse } from "../models/product.model";
import { AuthService } from "./auth.service";

@Injectable({ providedIn: 'root' })
export class ProductService {
    private readonly API_URL = 'http://localhost:8080/api/product';
    private readonly SECRET_KEY = 'super-secret-key-123';

    private platformId = inject(PLATFORM_ID);
    private http = inject(HttpClient);
    private authService = inject(AuthService);

    /**
     * GET - Get the list of my own products 
     */
    getOwnProducts(): Observable<GetOwnProductResponse> {
        const headers: any = {
            'Content-Type': 'application/json',
            'X-Internal-Key': this.SECRET_KEY,
        };


        return this.http.get<GetOwnProductResponse>(
            `${this.API_URL}/get-own`,
            { headers }
        );
    }

    createProduct(body: CreateProductRequest): Observable<CreateProductResponse> {
        const headers: any = {
            'Content-Type': 'application/json',
            'X-Internal-Key': this.SECRET_KEY,
        };

        return this.http.post<CreateProductResponse>(
            `${this.API_URL}/create`,
            body,
            { headers }
        );
    }
}