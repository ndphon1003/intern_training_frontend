import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { ProductListResponse } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {

  private http = inject(HttpClient);

  private API_URL = 'http://localhost:8080/api/product';
  private SECRET_KEY = 'super-secret-key-123';

  getProducts() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Internal-Key': this.SECRET_KEY
    });

    return this.http.get<ProductListResponse>(
      `${this.API_URL}/list`,
      { headers }
    );
  }
}