import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { ProductListResponse } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {

  private http = inject(HttpClient);

  private API_URL = 'http://localhost:8080/api/product';
  private SECRET_KEY = 'super-secret-key-123';

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Internal-Key': this.SECRET_KEY
    });
  }

  // =========================
  // GET LIST PRODUCT
  // =========================
  getProducts() {
    return this.http.get<ProductListResponse>(
      `${this.API_URL}/list`,
      { headers: this.getHeaders() }
    );
  }

  // =========================
  // GET PRODUCT DETAIL
  // =========================
  getProductDetail(productId: string) {

    const params = new HttpParams().set('Product-Id', productId);

    return this.http.get<any>(
      `${this.API_URL}/detail-public-product`,
      {
        headers: this.getHeaders(),
        params
      }
    );
  }
}