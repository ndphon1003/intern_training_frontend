import { HttpClient } from "@angular/common/http";
import { inject, Injectable, PLATFORM_ID } from "@angular/core";
import { Observable } from "rxjs";
import { CreateProductRequest, CreateProductResponse, GetOwnProductResponse, GetProductDetailResponse, UpdateProductRequest } from "../models/product.model";
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

    getProductDetail(productId: string): Observable<GetProductDetailResponse> {
        const headers: any = {
            'Content-Type': 'application/json',
            'X-Internal-Key': this.SECRET_KEY,
        };

        return this.http.get<GetProductDetailResponse>(
            `${this.API_URL}/detail-public-product`,
            {
            headers,
            params: {
                'Product-Id': productId,
            },
            }
    );
    }

    updateProduct(body: UpdateProductRequest): Observable<GetProductDetailResponse> {
        const headers: any = {
            'Content-Type': 'application/json',
            'X-Internal-Key': this.SECRET_KEY,
        };

        return this.http.patch<GetProductDetailResponse>(
            `${this.API_URL}/update-product`,
            body,
            { headers }
        );
    }
}