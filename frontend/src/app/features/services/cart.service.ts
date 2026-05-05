import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { AddCartRequest, Cart, ResponseFormat } from '../models/cart.model';

@Injectable({ providedIn: 'root' })
export class CartService {

  private http = inject(HttpClient);

  private readonly API_URL = 'http://localhost:8080/api/cart';
  private readonly SECRET_KEY = 'super-secret-key-123';

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Internal-Key': this.SECRET_KEY,
    });
  }

  getCarts(): Observable<{ code: number; message: string; data: Cart[] }> {
    return this.http.get<{ code: number; message: string; data: Cart[] }>(
      `${this.API_URL}/list`,
      { headers: this.getHeaders() }
    );
  }

  addToCart(body: AddCartRequest): Observable<ResponseFormat> {
    console.log(body.productId);
    return this.http.post<ResponseFormat>(
      `${this.API_URL}/add`,
      body,
      { headers: this.getHeaders() }
    );
  }
  removeFromCart(cartId: string): Observable<ResponseFormat> {
    return this.http.delete<ResponseFormat>(
      `${this.API_URL}/delete`,
      {
        params: { cartId },
        headers: new HttpHeaders({
          'X-Internal-Key': this.SECRET_KEY
        })
      }
    );
  }
}