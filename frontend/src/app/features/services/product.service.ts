import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  ProductListResponse,
  GetOwnProductResponse,
  GetProductDetailResponse,
  CreateProductRequest,
  CreateProductResponse,
  UpdateProductRequest
} from '../models/product.model';

import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class ProductService {

  private http = inject(HttpClient);
  private authService = inject(AuthService);

  private readonly API_URL = 'http://localhost:8080/api/product';
  private readonly SECRET_KEY = 'super-secret-key-123';

  // =========================
  // COMMON HEADERS
  // =========================
  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Internal-Key': this.SECRET_KEY,
      // nếu cần token thì mở ra:
      // Authorization: `Bearer ${this.authService.getToken()}`
    });
  }

  // =========================
  // PUBLIC APIs
  // =========================

  // GET LIST PRODUCT
  getProducts(): Observable<ProductListResponse> {
    return this.http.get<ProductListResponse>(
      `${this.API_URL}/list`,
      { headers: this.getHeaders() }
    );
  }

  // GET PRODUCT DETAIL (PUBLIC)
  getProductDetail(productId: string): Observable<GetProductDetailResponse> {
    const params = new HttpParams().set('Product-Id', productId);

    return this.http.get<GetProductDetailResponse>(
      `${this.API_URL}/detail-public-product`,
      {
        headers: this.getHeaders(),
        params
      }
    );
  }

  // =========================
  // PRIVATE APIs (AUTH)
  // =========================

  // GET OWN PRODUCTS
  getOwnProducts(): Observable<GetOwnProductResponse> {
    return this.http.get<GetOwnProductResponse>(
      `${this.API_URL}/get-own`,
      { headers: this.getHeaders() }
    );
  }

  // CREATE PRODUCT
  createProduct(body: CreateProductRequest): Observable<CreateProductResponse> {
    return this.http.post<CreateProductResponse>(
      `${this.API_URL}/create`,
      body,
      { headers: this.getHeaders() }
    );
  }

  // UPDATE PRODUCT
  updateProduct(body: UpdateProductRequest): Observable<GetProductDetailResponse> {
    return this.http.patch<GetProductDetailResponse>(
      `${this.API_URL}/update-product`,
      body,
      { headers: this.getHeaders() }
    );
  }
}