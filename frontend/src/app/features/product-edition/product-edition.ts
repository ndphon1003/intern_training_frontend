import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { Product } from '../models/product.model';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-product-edition',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-edition.html',
  styleUrl: './product-edition.css',
})
export class ProductEdition implements OnInit {

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productService = inject(ProductService);
  private cdr = inject(ChangeDetectorRef);

  productId!: string;

  product: Product | null = null;

  isLoading = false;
  errorMessage = '';

  async ngOnInit() {
    this.productId = this.route.snapshot.paramMap.get('id') || '';

    if (!this.productId) {
      this.errorMessage = 'Missing product id';
      this.cdr.detectChanges();
      return;
    }

    await this.loadDetail();
  }

  async loadDetail() {
    this.isLoading = true;
    this.errorMessage = '';
    this.cdr.detectChanges();

    try {
      const res = await firstValueFrom(
        this.productService.getProductDetail(this.productId)
      );

      this.product = res?.data || null;

    } catch (err: any) {
      this.errorMessage =
        err?.error?.message || 'Failed to load product detail';
    } finally {
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  }

  goBack() {
    this.router.navigate(['/product-management']);
  }
}