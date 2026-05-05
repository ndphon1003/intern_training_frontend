import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { Product } from '../models/product.model';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-product-management',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-management.html',
  styleUrl: './product-management.css',
})
export class ProductManagement implements OnInit {

  private productService = inject(ProductService);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);

  products: Product[] = [];
  totalProduct = 0;

  isLoading = false;
  errorMessage = '';

  async ngOnInit() {
    await this.loadProducts();
  }

  async loadProducts() {
    this.isLoading = true;
    this.errorMessage = '';
    this.cdr.markForCheck();

    try {
      const res = await firstValueFrom(
        this.productService.getOwnProducts()
      );

      if (res?.data) {
        this.products = res.data.listProduct;
        this.totalProduct = res.data.totalProduct;
      } else {
        this.errorMessage = 'Failed to load products';
      }

    } catch (error: any) {
      console.error('Load products error:', error);
      this.errorMessage =
        error?.error?.message ||
        error?.message ||
        'Something went wrong while loading products';
    } finally {
      this.isLoading = false;
      this.cdr.markForCheck();
    }
  }

  goBack() {
    this.router.navigate(['/profile']);
  }
  goToCreateProduct() {
    this.router.navigate(['/product-creation']);
  }
  goToProductDetail(productId: string) {
    this.router.navigate(['/product-edition', productId]);
  }
}