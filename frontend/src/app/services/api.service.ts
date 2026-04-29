import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ApiService {

  private baseUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  getProducts() {
    const headers = new HttpHeaders({
      'X-Internal-Key': 'super-secret-key-123'
    });

    return this.http.get(`${this.baseUrl}/api/product/list`, {
      headers
    });
  }
}