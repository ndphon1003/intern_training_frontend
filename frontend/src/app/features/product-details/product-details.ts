import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from '../services/cart.service';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductDetails {

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productService = inject(ProductService);
  private cdr = inject(ChangeDetectorRef);
  private cartService = inject(CartService);

  product: any = null;
  loading = false;
  quantity = 1;
  successMessage = '';
  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.router.navigate(['/']);
      return;
    }

    this.loadDetail(id);
  }

  loadDetail(id: string) {
    this.loading = true;
    this.cdr.markForCheck();

    this.productService.getProductDetail(id).subscribe({
      next: (res: any) => {
        this.product = res?.data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Load product detail error:', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  formatPrice(price: number) {
    return price.toLocaleString('vi-VN') + ' ₫';
  }

  goBack() {
    this.router.navigate(['/']);
  }
  addToCart() {
    if (!this.product) return;

    this.cartService.addToCart({
      productId: this.product.product_id,
      quantity: this.quantity
    }).subscribe({
      next: () => {
        this.successMessage = 'Added to cart successfully!';
        this.cdr.detectChanges();

        setTimeout(() => {
          this.successMessage = '';
          this.cdr.detectChanges();
        }, 2000);
      },
      error: (err) => {
        console.error('Add to cart failed', err);
      }
    });
  }
}